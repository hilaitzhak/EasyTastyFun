import { Request, Response } from "express";
import { CategoryService } from "../services/category.service";

export class CategoryController {
    private categoryService = new CategoryService();

    constructor() {}

    async getCategories(req: Request, res: Response): Promise<void> {
        try {
            const allCategories = await this.categoryService.getCategories();
            res.status(200).json(allCategories);
        } catch (error) {
            res.status(500).json({ message: 'Controller error fetching categories' });
        }
    }
}
