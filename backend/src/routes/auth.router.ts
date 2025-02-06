import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

export class AuthRouter {
    private router: Router;
    private authController: AuthController;

    constructor() {
        this.init();
    }

    private init() {
        this.setRouter();
        this.setAuthController();
        this.setRoutes();
    }

    private setRouter() {
        this.router = Router();
    }

    private setAuthController() {
        this.authController = new AuthController();
    }

    private setRoutes() {
        this.router.post('/login', this.authController.login.bind(this.authController));
        this.router.post('/register', this.authController.register.bind(this.authController));
    }

    public getRouter(): Router {
        return this.router;
    }
}