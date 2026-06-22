import { Request, Response } from "express";
import { UserService } from "../services/user.service";

interface AuthRequest extends Request {
    user?: { userId: string };
}

export class UserController {
    private userService = new UserService();

    constructor() {}

    async getFavorites(req: AuthRequest, res: Response): Promise<void> {
        try {
            const recipes = await this.userService.getFavorites(req.user!.userId);
            res.status(200).json(recipes);
        } catch (error) {
            console.error("Error fetching favorites:", error);
            res.status(500).json({ message: "Failed to fetch favorites" });
        }
    }

    async getFavoriteIds(req: AuthRequest, res: Response): Promise<void> {
        try {
            const ids = await this.userService.getFavoriteIds(req.user!.userId);
            res.status(200).json(ids);
        } catch (error) {
            console.error("Error fetching favorite ids:", error);
            res.status(500).json({ message: "Failed to fetch favorite ids" });
        }
    }

    async addFavorite(req: AuthRequest, res: Response): Promise<void> {
        try {
            const ids = await this.userService.addFavorite(req.user!.userId, req.params.recipeId);
            res.status(200).json(ids);
        } catch (error) {
            console.error("Error adding favorite:", error);
            res.status(500).json({ message: "Failed to add favorite" });
        }
    }

    async removeFavorite(req: AuthRequest, res: Response): Promise<void> {
        try {
            const ids = await this.userService.removeFavorite(req.user!.userId, req.params.recipeId);
            res.status(200).json(ids);
        } catch (error) {
            console.error("Error removing favorite:", error);
            res.status(500).json({ message: "Failed to remove favorite" });
        }
    }

    async getNoteIds(req: AuthRequest, res: Response): Promise<void> {
        try {
            const ids = await this.userService.getNoteIds(req.user!.userId);
            res.status(200).json(ids);
        } catch (error) {
            console.error("Error fetching note ids:", error);
            res.status(500).json({ message: "Failed to fetch note ids" });
        }
    }

    async getNote(req: AuthRequest, res: Response): Promise<void> {
        try {
            const note = await this.userService.getNote(req.user!.userId, req.params.recipeId);
            res.status(200).json({ note });
        } catch (error) {
            console.error("Error fetching note:", error);
            res.status(500).json({ message: "Failed to fetch note" });
        }
    }

    async setNote(req: AuthRequest, res: Response): Promise<void> {
        try {
            const note = await this.userService.setNote(req.user!.userId, req.params.recipeId, req.body.note || "");
            res.status(200).json({ note });
        } catch (error) {
            console.error("Error saving note:", error);
            res.status(500).json({ message: "Failed to save note" });
        }
    }
}
