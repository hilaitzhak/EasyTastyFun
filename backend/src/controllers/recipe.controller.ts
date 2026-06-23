import { Request, Response } from "express";
import { RecipeService } from "../services/recipe.service";
import { RedisService } from "../services/redis.service";

export class RecipeController {
    private recipeService: RecipeService;

    constructor(redisService: RedisService) {
        this.recipeService = new RecipeService(redisService);
    }

    async createRecipe(req: Request, res: Response): Promise<void> {
        try {
            const recipe = await this.recipeService.createRecipe(req.body);
            res.status(201).json(recipe);
        } catch (error) {
            res.status(500).json({
                message: "Error creating recipe", error
            });
        }
    }

    public async getAllRecipes(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 15;
            const category = req.query.category as string | undefined;
            const search = req.query.search as string | undefined;
            const allRecipes = await this.recipeService.getAllRecipes(page, limit, category, search);
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

    async extractFromImage(req: Request, res: Response): Promise<void> {
        try {
            const { image, categories } = req.body;
            if (!image) {
                res.status(400).json({ message: 'No image provided' });
                return;
            }
            const recipeData = await this.recipeService.extractRecipeFromImage(image, categories || []);
            res.status(200).json(recipeData);
        } catch (error) {
            console.error('Error extracting recipe from image:', error);
            res.status(500).json({ message: 'Failed to extract recipe from image' });
        }
    }

    async getSubstitutions(req: Request, res: Response): Promise<void> {
        try {
            const { ingredient, recipeName, language } = req.body;
            if (!ingredient) {
                res.status(400).json({ message: 'No ingredient provided' });
                return;
            }
            const result = await this.recipeService.getIngredientSubstitutions(ingredient, recipeName || '', language || 'en');
            res.status(200).json(result);
        } catch (error) {
            console.error('Error getting substitutions:', error);
            res.status(500).json({ message: 'Failed to get substitutions' });
        }
    }

    async whatCanICook(req: Request, res: Response): Promise<void> {
        try {
            const { ingredients, language } = req.body;
            if (!Array.isArray(ingredients) || ingredients.length === 0) {
                res.status(400).json({ message: 'No ingredients provided' });
                return;
            }
            const result = await this.recipeService.whatCanICook(ingredients, language || 'en');
            res.status(200).json(result);
        } catch (error) {
            console.error('Error in whatCanICook:', error);
            res.status(500).json({ message: 'Failed to find recipes' });
        }
    }

    async getRandomRecipe(_req: Request, res: Response): Promise<void> {
        try {
            const recipe = await this.recipeService.getRandomRecipe();
            if (!recipe) {
                res.status(404).json({ message: 'No recipes found' });
                return;
            }
            res.status(200).json(recipe);
        } catch (error) {
            console.error('Error getting random recipe:', error);
            res.status(500).json({ message: 'Failed to get random recipe' });
        }
    }

    async generateRecipe(req: Request, res: Response): Promise<void> {
        try {
            const { prompt, language, categories } = req.body;
            if (!prompt || !prompt.trim()) {
                res.status(400).json({ message: 'No prompt provided' });
                return;
            }
            const result = await this.recipeService.generateRecipe(prompt, language || 'en', categories || []);
            res.status(200).json(result);
        } catch (error) {
            console.error('Error generating recipe:', error);
            res.status(500).json({ message: 'Failed to generate recipe' });
        }
    }

    async askAboutRecipe(req: Request, res: Response): Promise<void> {
        try {
            const { recipeId, question, language, history } = req.body;
            if (!recipeId || !question || !question.trim()) {
                res.status(400).json({ message: 'recipeId and question are required' });
                return;
            }
            const answer = await this.recipeService.askAboutRecipe(recipeId, question, language || 'en', history || []);
            res.status(200).json({ answer });
        } catch (error) {
            console.error('Error in askAboutRecipe:', error);
            res.status(500).json({ message: 'Failed to answer' });
        }
    }

    async getPairing(req: Request, res: Response): Promise<void> {
        try {
            const { recipeName, ingredients, language } = req.body;
            if (!recipeName) {
                res.status(400).json({ message: 'recipeName is required' });
                return;
            }
            const result = await this.recipeService.getPairing(recipeName, ingredients || '', language || 'en');
            res.status(200).json(result);
        } catch (error) {
            console.error('Error getting pairing:', error);
            res.status(500).json({ message: 'Failed to get pairing' });
        }
    }

    async getIngredientNames(_req: Request, res: Response): Promise<void> {
        try {
            const names = await this.recipeService.getAllIngredientNames();
            res.status(200).json(names);
        } catch (error) {
            console.error('Error getting ingredient names:', error);
            res.status(500).json({ message: 'Failed to get ingredients' });
        }
    }

    async leftoverIdeas(req: Request, res: Response): Promise<void> {
        try {
            const { ingredients, language } = req.body;
            if (!Array.isArray(ingredients) || ingredients.length === 0) {
                res.status(400).json({ message: 'No ingredients provided' });
                return;
            }
            const result = await this.recipeService.leftoverIdeas(ingredients, language || 'en');
            res.status(200).json(result);
        } catch (error) {
            console.error('Error in leftoverIdeas:', error);
            res.status(500).json({ message: 'Failed to get ideas' });
        }
    }
}