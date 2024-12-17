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

    async getCategoryByPath(req: Request, res: Response): Promise<void> {
        try {
          const { categoryPath } = req.params;
          const category = await this.categoryService.getCategoryByPath(categoryPath);
          res.status(200).json(category);
        } catch (error) {
          res.status(500).json({ message: 'Controller error fetching category by path' });
        }
      }
    
    async getRecipesByCategory(req: Request, res: Response): Promise<void> {
        try {
            const { categoryId } = req.params;
            const recipes = await this.categoryService.getRecipesByCategory(categoryId);
            res.status(200).json(recipes);
        } catch (error) {
            res.status(500).json({ message: 'Controller error fetching recipes by category' });
        }
    }

    async getAllSubCategories(req: Request, res: Response): Promise<void> {
      try {
        const subcategories = await this.categoryService.getAllSubCategories();
        res.status(200).json(subcategories);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching all subcategories' });
      }
    }
    
    async getSubCategoryByPath(req: Request, res: Response): Promise<void> {
        try {
          const { categoryPath, subCategoryPath } = req.params;
          const subCategory = await this.categoryService.getSubCategoryByPath(categoryPath, subCategoryPath);
          res.status(200).json(subCategory);
        } catch (error) {
          res.status(500).json({ message: 'Error fetching subcategory by path' });
        }
      }
    
    // async getRecipesBySubCategory(req: Request, res: Response): Promise<void> {
    //     try {
    //         const { subCategoryId } = req.params;
    //         const recipes = await this.categoryService.getRecipesBySubCategory(subCategoryId);
    //         res.status(200).json(recipes);
    //     } catch (error) {
    //         res.status(500).json({ message: 'Error fetching recipes by subcategory' });
    //     }
    // }
}
