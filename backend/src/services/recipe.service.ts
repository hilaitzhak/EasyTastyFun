import { IRecipe } from '../interfaces/recipe.interface';
import Recipe from '../models/recipe.model';

export class RecipeService {

  async createRecipe(recipeData: IRecipe) {
    try {
      const recipe = new Recipe(recipeData);
      return await recipe.save();
    } catch (error) {
      throw new Error('Error creating recipe');
    }
  }

  async getAllRecipes() {
    try {
      return await Recipe.find().sort({ createdAt: -1 });
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
          const recipe = await Recipe.findById(id);
          if (!recipe) {
          throw new Error('Recipe not found');
          }
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