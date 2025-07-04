import { IRecipe, RecipeResponse } from '../interfaces/recipe.interface';
import Recipe from '../models/recipe.model';
import { RedisService } from './redis.service';
import { randomUUID } from 'node:crypto';
import { s3 } from '../config/s3.config';
import mongoose, { PipelineStage } from 'mongoose';

export class RecipeService {
  private redisService: RedisService;

  constructor(redisService: RedisService) {
    this.redisService = redisService;
  }

  async createRecipe(recipeData: IRecipe) {
    try {
      const recipeId = randomUUID();
      recipeData.recipeId = recipeId;
      if (recipeData.images) {
        const images = await this.processMedia(recipeData.images, recipeId, 'images');
        if (Array.isArray(images)) {
          recipeData.images = images;
        } else {
          throw new Error('Expected an array of images');
        }
      }
      if (recipeData.video) {
        const video = await this.processMedia(recipeData.video, recipeId, 'videos') as { id: string; link: string };
        if (Array.isArray(video)) {
          throw new Error('Expected a single video object, but got an array');
        }
        recipeData.video = video;
      }

      const recipe = new Recipe(recipeData);
      return await recipe.save();
    } catch (error) {
      throw new Error('Error creating recipe');
    }
  }

  async processMedia(mediaData: any, recipeId: string, mediaType: 'images' | 'videos'): Promise<{ id: string; link: string }[] | { id: string; link: string }> {
    if (!mediaData) return mediaType === 'images' ? [] : { id: '', link: '' };

    if (mediaType === 'videos') {
      const mediaId = randomUUID();
      const mediaLink = await this.uploadFileToS3(mediaData.link, recipeId, mediaId, mediaType);
      return { id: mediaId, link: mediaLink }; // Return single video object
    }

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
      const matches = base64Image.match(/^data:(image|video)\/([a-zA-Z0-9]+);base64,(.+)$/);
      if (!matches) throw new Error('Invalid Base64 format');

      const mediaType = matches[1];
      const extension = matches[2];
      const fileBuffer = Buffer.from(matches[3], 'base64');
      const key = `${recipeId}/${fileType}/${fileId}.${extension}`;

      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: key,
        Body: fileBuffer,
        ContentType: `${mediaType}/${extension}`,
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


  async getAllRecipes(
    page: number = 1,
    limit: number = 15,
    category?: string,
    search?: string
  ): Promise<RecipeResponse> {
    try {
      const skip = (page - 1) * limit;
      const matchStage: Record<string, any> = {};

      if (category) {
        matchStage.category = new mongoose.Types.ObjectId(category);
      }

      if (search && search.trim()) {
        matchStage.name = { $regex: search.trim(), $options: 'i' };
      }
      const pipeline: PipelineStage[] = [];

      if (Object.keys(matchStage).length > 0) {
        pipeline.push({ $match: matchStage });
      }

      pipeline.push({
        $facet: {
          recipes: [
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                recipeId: 1,
                name: 1,
                images: 1,
                prepTime: 1,
                cookTime: 1,
                servings: 1,
                createdAt: 1,
                category: 1
              }
            }
          ],
          totalCount: [{ $count: 'count' }]
        }
      });

      const [results] = await Recipe.aggregate(pipeline).exec();
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

      const start2 = Date.now();

      // If not in cache, get from DB
      const recipe = await Recipe.findOne({ recipeId: id });
      console.log(`GET RECIPE TIME: ${Date.now() - start2}ms`);

      if (!recipe) {
        throw new Error('Recipe not found');
      }

      await this.redisService.set(cacheKey, recipe);
      return recipe;
    } catch (error) {
      throw new Error('Error fetching recipe');
    }
  }

  async deleteMediaFromS3(recipeId: string): Promise<void> {
    try {
      console.log(`Attempting to delete media for recipe ID: ${recipeId}`);

      if (!recipeId || recipeId.trim() === '') {
        console.error('Invalid recipe ID provided for S3 deletion');
        return;
      }

      const folderPrefix = `${recipeId}/`;
      console.log(`Looking for files with prefix: ${folderPrefix} in bucket: ${process.env.AWS_S3_BUCKET_NAME}`);

      const listParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Prefix: folderPrefix,
      };

      const listedObjects = await s3.listObjectsV2(listParams).promise();

      if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
        return;
      }

      listedObjects.Contents.forEach(file => {
        console.log(`- ${file.Key}`);
      });

      // S3 can only delete up to 1000 objects in a single call
      // Split into batches if necessary
      const chunks = [];
      for (let i = 0; i < listedObjects.Contents.length; i += 1000) {
        chunks.push(listedObjects.Contents.slice(i, i + 1000));
      }

      let deletedCount = 0;

      // Delete files in batches
      for (const chunk of chunks) {
        const deleteParams = {
          Bucket: process.env.AWS_S3_BUCKET_NAME!,
          Delete: { Objects: chunk.map((file) => ({ Key: file.Key! })) },
        };

        const deleteResult = await s3.deleteObjects(deleteParams).promise();
        deletedCount += deleteResult.Deleted?.length || 0;

        if (deleteResult.Errors && deleteResult.Errors.length > 0) {
          console.error('Some files could not be deleted:', deleteResult.Errors);
        }
      }

      console.log(`Successfully deleted ${deletedCount} files from S3 for recipe ${recipeId}`);
    } catch (error) {
      console.error(`Error deleting files in S3 folder for recipe ${recipeId}:`, error);
      // We'll log the error but not throw, as this is typically called during cleanup
    }
  }


  async updateRecipe(recipeId: string, recipeData: IRecipe) {
    try {
      const existingRecipe = await Recipe.findOne({ recipeId: recipeId });

      if (!existingRecipe) {
        throw new Error('Recipe not found');
      }

      let updatedRecipeData = { ...recipeData };

      // MEDIA HANDLING LOGIC

      // 1. Check for new uploads
      const hasNewImages = recipeData.images && recipeData.images.some(img =>
        typeof img.data === 'string' && img.data.startsWith('data:image')
      );

      const hasNewVideo = recipeData.video &&
        typeof recipeData.video.link === 'string' &&
        recipeData.video.link.startsWith('data:video');

      // 2. Check if media was deleted
      const imagesWereDeleted = recipeData.images &&
        existingRecipe.images &&
        recipeData.images.length < existingRecipe.images.length;

      const videoWasDeleted = existingRecipe.video && recipeData.video === null;

      // 3. Process media changes
      if (hasNewImages || hasNewVideo) {
        // If we have new media, we need to handle both the new uploads and existing media

        // For new images, delete only the images folder if we're not uploading a new video
        if (hasNewImages && !hasNewVideo) {
          await this.deleteMediaFromS3Folder(recipeId, 'images');
        }
        // For new video, delete only the videos folder if we're not uploading new images
        else if (hasNewVideo && !hasNewImages) {
          await this.deleteMediaFromS3Folder(recipeId, 'videos');
        }
        // If both are new, delete everything
        else {
          await this.deleteMediaFromS3(recipeId);
        }

        // Process new images if there are any
        if (hasNewImages) {
          // Filter out only the images that need processing (base64 ones)
          const newImages = recipeData.images.filter(img =>
            typeof img.data === 'string' && img.data.startsWith('data:image')
          );

          // Keep images that are already processed (have URLs)
          const existingImages = recipeData.images.filter(img =>
            typeof img.link === 'string' && img.link.includes('amazonaws.com')
          );

          if (newImages.length > 0) {
            const processedNewImages = await this.processMedia(newImages, recipeId, 'images');
            if (Array.isArray(processedNewImages)) {
              // Combine processed new images with existing ones that weren't modified
              updatedRecipeData.images = [...processedNewImages, ...existingImages];
            } else {
              throw new Error('Expected an array of images');
            }
          } else {
            // If no new images, just keep the existing ones
            updatedRecipeData.images = existingImages;
          }
        }

        // Process new video if there is one
        if (hasNewVideo) {
          const processedVideo = await this.processMedia(recipeData.video, recipeId, 'videos') as { id: string; link: string };
          if (Array.isArray(processedVideo)) {
            throw new Error('Expected a single video object, but got an array');
          }
          updatedRecipeData.video = processedVideo;
        }
      } else if (imagesWereDeleted || videoWasDeleted) {
        // If no new media, but media was deleted, handle that

        // For images, keep what was sent from the frontend
        if (imagesWereDeleted) {
          // Delete S3 objects for removed images
          const existingImageLinks = existingRecipe.images.map(img => img.link);
          const remainingImageLinks = recipeData.images.map(img => img.link);

          const deletedImageLinks = existingImageLinks.filter(link =>
            !remainingImageLinks.includes(link)
          );

          // Delete each removed image individually from S3
          for (const imageLink of deletedImageLinks) {
            const key = this.getS3KeyFromUrl(imageLink);
            if (key) {
              await this.deleteMediaFromS3ByKey(key);
            }
          }

          // Keep only the images that were not deleted
          updatedRecipeData.images = recipeData.images;
        } else {
          // Keep existing images if they weren't deleted
          updatedRecipeData.images = existingRecipe.images;
        }

        // For video, set to null if it was deleted
        if (videoWasDeleted) {
          // Delete the video file from S3
          if (existingRecipe.video && existingRecipe.video.link) {
            const key = this.getS3KeyFromUrl(existingRecipe.video.link);
            if (key) {
              await this.deleteMediaFromS3ByKey(key);
            }
          }

          updatedRecipeData.video = null;
        } else {
          // Keep existing video if it wasn't deleted
          updatedRecipeData.video = existingRecipe.video;
        }
      } else {
        // No changes to media, keep existing
        updatedRecipeData.images = existingRecipe.images;
        updatedRecipeData.video = existingRecipe.video;
      }

      // Update recipe in database
      const updatedRecipe = await Recipe.findOneAndUpdate(
        { recipeId: recipeId },
        {
          ...updatedRecipeData,
          updatedAt: new Date()
        },
        { new: true } // Return the updated document
      );

      if (!updatedRecipe) {
        throw new Error('Failed to update recipe');
      }

      // Clear cache
      await this.redisService.del(`recipe:${recipeId}`);

      return updatedRecipe;
    } catch (error: any) {
      console.error('Update error:', error);
      throw new Error(`Error updating recipe: ${error.message}`);
    }
  }

  // Helper function to extract S3 key from a URL
  private getS3KeyFromUrl(url: string): string | null {
    try {
      // Extract the key from an S3 URL
      // Format: https://bucket-name.s3.region.amazonaws.com/key
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('amazonaws.com')) {
        // The pathname starts with a leading slash, so remove it
        return urlObj.pathname.substring(1);
      }
      return null;
    } catch (error) {
      console.error('Error parsing S3 URL:', error);
      return null;
    }
  }

  // Delete a specific file from S3 by key
  async deleteMediaFromS3ByKey(key: string): Promise<void> {
    try {
      console.log(`Deleting S3 object with key: ${key}`);

      const deleteParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: key
      };

      await s3.deleteObject(deleteParams).promise();
      console.log(`Successfully deleted S3 object: ${key}`);
    } catch (error) {
      console.error(`Error deleting S3 object: ${key}`, error);
    }
  }

  // Delete only a specific subfolder
  async deleteMediaFromS3Folder(recipeId: string, folderType: 'images' | 'videos'): Promise<void> {
    try {
      const folderPrefix = `${recipeId}/${folderType}/`;
      console.log(`Deleting S3 folder: ${folderPrefix}`);

      const listParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Prefix: folderPrefix
      };

      const listedObjects = await s3.listObjectsV2(listParams).promise();

      if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
        console.log(`No files found in S3 folder: ${folderPrefix}`);
        return;
      }

      const deleteParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Delete: {
          Objects: listedObjects.Contents.map(obj => ({ Key: obj.Key! }))
        }
      };

      const deleteResult = await s3.deleteObjects(deleteParams).promise();
      console.log(`Deleted ${deleteResult.Deleted?.length || 0} files from S3 folder: ${folderPrefix}`);
    } catch (error) {
      console.error(`Error deleting S3 folder: ${recipeId}/${folderType}`, error);
    }
  }

  async deleteRecipe(id: string) {
    try {
      const recipe = await Recipe.findOneAndDelete({ recipeId: id });
      if (!recipe) {
        throw new Error('Recipe not found');
      }
      await this.redisService.del(`recipe:${id}`);

      return recipe;
    } catch (error) {
      console.error('Error deleting recipe:', error);
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