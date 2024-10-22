import { Request, Response } from "express";
import { RecipeService } from "../services/recipe.service";

export class RecipeController {
    private recipeService = new RecipeService();

    public async createRecipe(req: Request, res: Response): Promise<void> {
        try {
            const recipeData = req.body;
            if (req.file) {
                recipeData.image = `/uploads/${req.file.filename}`;
            } else {
            console.error('No file uploaded'); // Log if no file was uploaded
            }
            const newRecipe = await this.recipeService.createRecipe(recipeData);
            res.status(201).json(newRecipe);
        } catch (error) {
            console.error('Error creating recipe:', error); // Log any errors
            res.status(500).json({ message: "Error creating recipe", error });
        }
    }

    public async getAllRecipes(req: Request, res: Response): Promise<void> {
        try {
            const allRecipes = await this.recipeService.getAllRecipes();
            res.status(200).json(allRecipes);
        } catch (error) {
            res.status(500).json({ message: "Error fetching recipes", error });
        }
    }

    public async getLatestRecipes(req: Request, res: Response) {
        try {
            const recipes = await this.recipeService.getLatestRecipes();
            res.status(200).json(recipes);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Failed to fetch latest recipes" });
        }
    }

    public async getRecipeById(req: Request, res: Response): Promise<void> {
        try {
            const recipe = await this.recipeService.getRecipeById(req.params.id);
            if (recipe) {
                res.status(200).json(recipe);
            } else {
                res.status(404).json({ message: "Recipe not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error fetching recipe", error });
        }
    }

    public async updateRecipe(req: Request, res: Response): Promise<void> {
        try {
            const updatedRecipe = await this.recipeService.updateRecipe(req.params.id, req.body);
            if (updatedRecipe) {
                res.status(200).json(updatedRecipe);
            } else {
                res.status(404).json({ message: "Recipe not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error updating recipe", error });
        }
    }

    public async deleteRecipe(req: Request, res: Response): Promise<void> {
        try {
            const deletedRecipe = await this.recipeService.deleteRecipe(req.params.id);
            if (deletedRecipe) {
                res.status(200).json(deletedRecipe);
            } else {
                res.status(404).json({ message: "Recipe not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error deleting recipe", error });
        }
    }
}
