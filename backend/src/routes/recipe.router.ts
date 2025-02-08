import { Router } from 'express';
import { RecipeController } from '../controllers/recipe.controller';
import authMiddleware from '../middleware/authMiddleware';

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
        this.router.post('/recipes/add-recipe', authMiddleware,this.recipeController.createRecipe.bind(this.recipeController));
        // this.router.route('/recipes/add-recipe').get(authMiddleware, this.chatController.getChatById.bind(this.chatController)); // Get specific chat
        this.router.get('/recipes/recent', this.recipeController.getRecentRecipes.bind(this.recipeController));
        this.router.post('/recipes/check-similar', this.recipeController.checkSimilarRecipes.bind(this.recipeController));
        this.router.get('/recipes/:id', this.recipeController.getRecipeById.bind(this.recipeController));
        this.router.delete('/recipes/:id', authMiddleware, this.recipeController.deleteRecipe.bind(this.recipeController));
        this.router.put('/recipes/:id', authMiddleware, this.recipeController.updateRecipe.bind(this.recipeController));
    }

    public getRouter(): Router {
        return this.router;
    }
}