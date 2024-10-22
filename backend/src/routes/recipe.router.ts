import express, { Router } from 'express';
import { RecipeController } from '../controllers/recipe.controller';
import { upload } from '../middlewares/upload';

export class AppRouter {
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
        this.router.post('/add-recipe', upload.single, this.recipeController.createRecipe.bind(this.recipeController));
        this.router.get('/recipes', this.recipeController.getAllRecipes.bind(this.recipeController));
        this.router.get('/', this.recipeController.getLatestRecipes.bind(this.recipeController));
        this.router.get('/:id', this.recipeController.getRecipeById.bind(this.recipeController));
        this.router.put('/:id', this.recipeController.updateRecipe.bind(this.recipeController));
        this.router.delete('/:id', this.recipeController.deleteRecipe.bind(this.recipeController));
    }

    public getRouter(): Router {
        return this.router;
    }
}
