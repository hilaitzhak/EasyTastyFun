import { IRecipe, Recipe } from "../models/recipe.model";


export class RecipeService {
    public async createRecipe(recipeData: any) {
        const newRecipe = new Recipe(recipeData);
        return await newRecipe.save();
    }

    public async getAllRecipes() {
        return await Recipe.find();
    }

    public async getLatestRecipes() {
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2); // Get date 2 days ago

        return await Recipe.find({
            createdAt: { $gte: twoDaysAgo }
        });
    }

    public async getRecipeById(id: string) {
        return await Recipe.findById(id);
    }

    public async updateRecipe(id: string, data: any) {
        return await Recipe.findByIdAndUpdate(id, data, { new: true });
    }

    public async deleteRecipe(id: string) {
        return await Recipe.findByIdAndDelete(id);
    }
}
