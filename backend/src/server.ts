import cors from 'cors';
import express, { Express } from "express";
import { AppConfig } from './config/config';
import { connectDB } from './config/db.config';
import { RecipeRouter } from './routes/recipe.router';
import { CategoryRouter } from './routes/category.router';
import { AuthRouter } from './routes/auth.router';

export class AppServer {
    public app: Express;
    private config: AppConfig;
    
    constructor() {
        this.config = new AppConfig();
    }

    public async init() {
        this.setApp();
        await connectDB(); 
        this.setMiddlewares();
        this.setRouters();
    }

    private setApp() {
        this.app = express();
    }

    private setMiddlewares() {
        this.app.use(cors());
        this.app.use(express.json({ limit: '50mb' }));    }

    private setRouters() {
        const recipeRouter = new RecipeRouter();
        const categoryRouter = new CategoryRouter();
        const authRouter = new AuthRouter();
        this.app.use('/easy-tasty-fun', recipeRouter.getRouter());
        this.app.use('/easy-tasty-fun', categoryRouter.getRouter());
        this.app.use('/easy-tasty-fun', authRouter.getRouter());
    }

    public listen() {
        this.app.listen(this.config.port, () => {
            console.log(`Server is up on port ${this.config.port}!`);
        });
    }
}
