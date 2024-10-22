import dotenv from 'dotenv';

export class AppConfig {
    public port: number;

    constructor() {
        dotenv.config(); // Load environment variables from .env
        this.port = this.getPort();
    }

    private getPort(): number {
        const port = process.env.PORT || '3000'; // Fallback to port 3000 if not provided
        return parseInt(port, 10); // Parse it as an integer
    }
}