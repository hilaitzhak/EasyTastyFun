import { Request, Response } from "express";
import { RecipeService } from "../services/recipe.service";

export class RecipeController {
    private recipeService = new RecipeService();

    constructor() {
        this.recipeService = new RecipeService();
    }
    
    async createRecipe(req: Request, res: Response): Promise<void> {
        try {
            const recipe = await this.recipeService.createRecipe(req.body);
            res.status(201).json(recipe);
        } catch (error) {
          res.status(500).json({ 
            message: "Error creating recipe", error });
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

    public async getRecentRecipes(req: Request, res: Response) {
        try {
            const recipes = await this.recipeService.getRecentRecipes();
            res.status(200).json(recipes);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Failed to fetch recent recipes" });
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
            const { id } = req.params;
            const recipeData = req.body;
            const updatedRecipe = await this.recipeService.updateRecipe(id, recipeData);
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

    async checkSimilarRecipes(req: Request, res: Response) {
        try {
        const ingredients = req.body;
        const similarRecipes = await this.recipeService.checkSimilarRecipes(ingredients);
        res.json(similarRecipes);
        } catch (error) {
        res.status(500).json({ error: 'Error checking similar recipes' });
        }
    }
}