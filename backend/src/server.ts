import cors from 'cors';
import express, { Express } from "express";
import { AppConfig } from './config/config';
import { connectDB } from './config/db.config';
import { RecipeRouter } from './routes/recipe.router';
import { CategoryRouter } from './routes/category.router';
import { AuthRouter } from './routes/auth.router';
import Redis from 'ioredis';
import { RedisService } from './services/redis.service';

export class AppServer {
    public app: Express;
    private config: AppConfig;
    private redisService: RedisService;
    
    constructor() {
        this.config = new AppConfig();
    }

    public async init() {
        this.setApp();
        await connectDB(); 
        await this.initRedis();
        this.setMiddlewares();
        this.setRouters();
    }

    private setApp() {
        this.app = express();
    }

    private setMiddlewares() {
        this.app.use(cors({
            origin: 'http://localhost:5173',
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
          }));
        this.app.use(express.json({ limit: '50mb' }));
        this.app.use((req, res, next) => {
            const start = Date.now();
            console.log(`Request [START]: ${req.method} ${req.url}`);
            res.on("finish", () => {
                const duration = Date.now() - start;
                console.log(`Request [END]: ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
            });
            next();
        });  
    }

    private setRouters() {
        const recipeRouter = new RecipeRouter(this.redisService);
        const categoryRouter = new CategoryRouter();
        const authRouter = new AuthRouter();
        this.app.use('/easy-tasty-fun', recipeRouter.getRouter());
        this.app.use('/easy-tasty-fun', categoryRouter.getRouter());
        this.app.use('/easy-tasty-fun', authRouter.getRouter());
    }

    private async initRedis() {
        const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";
    
        const redisInstance = new Redis(redisUrl, {
            lazyConnect: true, // Prevents excessive connections
            enableReadyCheck: false, // Speeds up readiness detection
            connectTimeout: 1000, // Fails quickly if Redis is unreachable
            maxRetriesPerRequest: 2, // Reduces unnecessary retries
            keepAlive: 1,
            socketTimeout: 10_000,
            commandTimeout: 10_000,
            disconnectTimeout: 10_000,
            sentinelCommandTimeout: 10_000,
            reconnectOnError: (err) => {
                console.log('Redis error:', err);
                return 1;
            }
        });
    
        this.redisService = new RedisService(redisInstance);
    
        redisInstance.on("connect", () => console.log("✅ Connected to Redis"));
        redisInstance.on("error", (err) => console.error("❌ Redis error:", err));

        await redisInstance.connect();
    }
    
    public listen() {
        this.app.listen(this.config.port, () => {
            console.log(`Server is up on port ${this.config.port}!`);
        });
    }
}
