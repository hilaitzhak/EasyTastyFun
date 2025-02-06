import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
    private authService = new AuthService();
    
    constructor(){}

    async register(req: Request, res: Response) {
        try {
          const { name, email, password } = req.body;
          const result = await this.authService.register(name, email, password);
          res.json(result);
        } catch (error: any) {
          res.status(400).json({ message: error.message });
        }
    }
    
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const result = await this.authService.login(email, password);
            res.json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}