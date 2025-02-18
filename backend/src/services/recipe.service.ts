import Redis from 'ioredis';
import { IRecipe, RecipeResponse } from '../interfaces/recipe.interface';
import Recipe from '../models/recipe.model';
import { RedisService } from './redis.service';
import { randomUUID } from 'node:crypto';
import { s3 } from '../config/s3.config';

export class RecipeService {
  private redisService: RedisService;

  constructor(redisService: RedisService) {
    this.redisService = redisService;
  }
  
  async createRecipe(recipeData: IRecipe) {
    try {
      const recipeId = randomUUID();
      recipeData.id = recipeId;
      recipeData.images = await this.processMedia(recipeData.images, recipeId, 'images') as { id?: string; link?: string }[];
      const video = await this.processMedia(recipeData.video, recipeId, 'videos') as { id: string; link: string };
      if (Array.isArray(video)) {
        throw new Error('Expected a single video object, but got an array');
      }
      recipeData.video = video;

      const recipe = new Recipe(recipeData);
      return await recipe.save();
    } catch (error) {
      throw new Error('Error creating recipe');
    }
  }

  async processMedia(mediaData: any, recipeId: string, mediaType: 'images' | 'videos'): Promise<{ id: string; link: string }[] | { id: string; link: string }> {
    if (!mediaData) return mediaType === 'images' ? [] : { id: '', link: '' };
  
    // Handle single media item for videos
    if (mediaType === 'videos') {
      const mediaId = randomUUID();
      const mediaLink = await this.uploadFileToS3(mediaData.data, recipeId, mediaId, mediaType);
      return { id: mediaId, link: mediaLink }; // Return single video object
    }
  
    // Handle images as an array (since multiple images can exist)
    const mediaArray = Array.isArray(mediaData) ? mediaData : [mediaData];
    return await Promise.all(
      mediaArray.map(async (media) => {
        const mediaId = randomUUID();
        const mediaLink = await this.uploadFileToS3(media.data, recipeId, mediaId, mediaType);
        return { id: mediaId, link: mediaLink };
      })
    );
  }

  async uploadFileToS3(base64Image: string, recipeId: string, fileId: string, fileType: 'images' | 'videos'): Promise<string> {
    try {
      const matches = base64Image.match(/^data:image\/(\w+);base64,(.+)$/);
      if (!matches) throw new Error('Invalid Base64 format');
  
      const mimeType = matches[1];  // Extract file type (png, jpg, etc.)
      const fileBuffer = Buffer.from(matches[2], 'base64'); // Convert base64 to buffer
      // const extension = mimeType.split('/')[1]; // Extract file extension

      // Define S3 bucket key
      const key = `${recipeId}/${fileType}/${fileId}.${mimeType}`;
  
      // Upload params
      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: key,
        Body: fileBuffer,
        ContentType: mimeType,
      };
  
      // Upload to S3
      await s3.upload(uploadParams).promise();
  
      // Return the object URL
      return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    } catch (error) {
      console.error(`Error uploading ${fileType.slice(0, -1)} to S3:`, error);
      throw new Error(`Failed to upload ${fileType.slice(0, -1)}`);
    }
  }

  async getAllRecipes(page: number = 1, limit: number = 15): Promise<RecipeResponse> {
    try {
      const skip = (page - 1) * limit;
      
      const [results] = await Recipe.aggregate([
        {
          $facet: {
            recipes: [
              { $sort: { createdAt: -1 } },
              { $skip: skip },
              { $limit: limit },
              { $project: { name: 1, images: 1, prepTime: 1, cookTime: 1, servings: 1, createdAt: 1 } }
            ],
            totalCount: [
              { $count: 'count' }
            ]
          }
        }
      ]).exec();
      
      const recipes = results.recipes;
      const total = results.totalCount[0]?.count || 0;
  
      return {
        recipes,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalRecipes: total,
          hasMore: page * limit < total
        }
      };
    } catch (error) {
      throw new Error('Error fetching recipes');
    }
  }

  async getRecentRecipes() {
      try {
          const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
          return await Recipe.find({
          createdAt: { $gte: twoDaysAgo }
          }).sort({ createdAt: -1 });
      } catch (error) {
          throw new Error('Error fetching recent recipes');
      }
  }

  async getRecipeById(id: string) {
    try {
        const cacheKey = `recipe:${id}`;

        const start = Date.now();
        const cachedRecipe = await this.redisService.get(cacheKey);
        console.log(`Redis GET time: ${Date.now() - start}ms`);

        if (cachedRecipe) {
          return cachedRecipe;
        }

        // If not in cache, get from DB
        const recipe = await Recipe.findById(id);

        if (!recipe) {
          throw new Error('Recipe not found');
        }

        await this.redisService.set(cacheKey, recipe);
        return recipe;
    } catch (error) {
        throw new Error('Error fetching recipe');
    }
  }

  async updateRecipe(id: string, recipeData: IRecipe) {
    try {
      const formattedData = {
        ...recipeData,
        ingredientGroups: recipeData.ingredientGroups.map(group => ({
          title: group.title,
          ingredients: group.ingredients.map(ing => ({
            ...ing,
            amount: ing.amount.toString()
          }))
        })),
        instructionGroups: recipeData.instructionGroups.map(group => ({
          title: group.title,
          instructions: group.instructions.map(inst => ({ 
            content: inst.content 
          }))
        })),
        updatedAt: new Date()
      };
      
      const recipe = await Recipe.findByIdAndUpdate(
        id,
        { $set: formattedData },
        { 
          new: true,
          runValidators: true
        }
      );
      
      if (!recipe) {
        throw new Error('Recipe not found');
      }

      await this.redisService.del(`recipe:${id}`);

      return recipe;
    } catch (error) {
      console.error('Update error:', error);
      throw new Error('Error updating recipe');
    }
  }

  async deleteRecipe(id: string) {
    try {
      const recipe = await Recipe.findByIdAndDelete(id);
      if (!recipe) {
        throw new Error('Recipe not found');
      }
      await this.redisService.del(`recipe:${id}`);

      return recipe;
    } catch (error) {
      throw new Error('Error deleting recipe');
    }
  }

  async checkSimilarRecipes(ingredients: string[]) {
    try {
      const allRecipes = await Recipe.find({});
      const similarRecipes = allRecipes.filter(recipe => {
        const recipeIngredients = recipe.ingredientGroups
          .flatMap(group => group.ingredients)
          .map(ing => ing.name.toLowerCase().trim());

        const matchingIngredients = ingredients.filter(ing => 
          recipeIngredients.includes(ing.toLowerCase().trim())
        );

        const similarity = (matchingIngredients.length / ingredients.length) * 100;
        return similarity >= 80;
      });

      return similarRecipes;
    } catch (error) {
      console.error('Error checking similar recipes:', error);
      throw error;
    }
  }
}