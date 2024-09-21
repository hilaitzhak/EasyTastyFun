// import { AppConfig } from "./config";
import cors from 'cors';
import express, { Express } from "express";
import { AppRouter } from "./routes/app-router";
// import { URLRequest, URLResponse } from "./interfaces/global.interface";

export class AppServer {
    public app: Express;
    // private config: AppConfig;
    
    constructor() {
    }

    public async init() {
        // this.setConfig();
        this.setApp();
        this.setMiddlewares();
        this.setRouter();
    }

    // private setConfig() {
    //     this.config = new AppConfig();
    // }

    private setApp() {
        this.app = express();
    }

    private setMiddlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        // this.app.use((req: URLRequest, res: URLResponse, next) => {
        //     req.base_redirect_url = this.config.base_redirect_url;
        //     next();
        // });
    }

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
