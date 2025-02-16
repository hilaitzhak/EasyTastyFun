import { Router } from 'express';
import { RecipeController } from '../controllers/recipe.controller';
import authMiddleware from '../middleware/authMiddleware';
import { RedisService } from '../services/redis.service';

export class RecipeRouter {
    private router: Router;
    private recipeController: RecipeController;

    constructor(redisService: RedisService) {
        this.router = Router();
        this.recipeController = new RecipeController(redisService);
        this.setRoutes();
    }

    // private init() {
    //     this.setRouter();
    //     this.setRecipeController(redisService);
    //     this.setRoutes();
    // }

    private setRouter() {
        this.router = Router();
    }

    private setRecipeController(redisService: RedisService) {
        this.recipeController = new RecipeController(redisService);
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