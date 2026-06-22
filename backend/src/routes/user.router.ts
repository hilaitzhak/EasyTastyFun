import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import authMiddleware from '../middleware/authMiddleware';

export class UserRouter {
    private router: Router;
    private userController: UserController;

    constructor() {
        this.router = Router();
        this.userController = new UserController();
        this.setRoutes();
    }

    private setRoutes() {
        this.router.get('/favorites', authMiddleware, this.userController.getFavorites.bind(this.userController));
        this.router.get('/favorites/ids', authMiddleware, this.userController.getFavoriteIds.bind(this.userController));
        this.router.post('/favorites/:recipeId', authMiddleware, this.userController.addFavorite.bind(this.userController));
        this.router.delete('/favorites/:recipeId', authMiddleware, this.userController.removeFavorite.bind(this.userController));
        this.router.get('/notes', authMiddleware, this.userController.getNoteIds.bind(this.userController));
        this.router.get('/notes/:recipeId', authMiddleware, this.userController.getNote.bind(this.userController));
        this.router.put('/notes/:recipeId', authMiddleware, this.userController.setNote.bind(this.userController));
    }

    public getRouter(): Router {
        return this.router;
    }
}
