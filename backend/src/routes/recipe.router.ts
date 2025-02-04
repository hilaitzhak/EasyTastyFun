import { Router } from 'express';
import { RecipeController } from '../controllers/recipe.controller';

export class RecipeRouter {
    private router: Router;
    private recipeController: RecipeController;

    constructor() {
        this.init();
    }

    private init() {
        this.setRouter();
        this.setRecipeController();
        this.setRoutes();
    }

    private setRouter() {
        this.router = Router();
    }

    private setRecipeController() {
        this.recipeController = new RecipeController();
    }

    private setRoutes() {
        this.router.get('/recipes', this.recipeController.getAllRecipes.bind(this.recipeController));
        this.router.post('/recipes/add-recipe', this.recipeController.createRecipe.bind(this.recipeController));
        this.router.get('/recipes/recent', this.recipeController.getRecentRecipes.bind(this.recipeController));
        this.router.post('/recipes/check-similar', this.recipeController.checkSimilarRecipes.bind(this.recipeController));
        this.router.get('/recipes/:id', this.recipeController.getRecipeById.bind(this.recipeController));
        this.router.delete('/recipes/:id', this.recipeController.deleteRecipe.bind(this.recipeController));
        this.router.put('/recipes/:id', this.recipeController.updateRecipe.bind(this.recipeController));
    }

    public getRouter(): Router {
        return this.router;
    }
}