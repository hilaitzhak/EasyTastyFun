import cors from 'cors';
import express, { Express } from "express";
import { AppRouter } from "./routes/recipe.router";
import { AppConfig } from './config/config';
import { connectDB } from './config/db.config';

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
        this.setRouter();
    }

    private setApp() {
        this.app = express();
    }

    private setMiddlewares() {
        this.app.use(cors());
        this.app.use(express.json({ limit: '50mb' }));    }

    private setRouter() {
        const app_router = new AppRouter();
        this.app.use('/easy-tasty-fun', app_router.getRouter());
    }

    public listen() {
        this.app.listen(this.config.port, () => {
            console.log(`Server is up on port ${this.config.port}!`);
        });
    }
}
