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

  async getCategoryById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const category = await this.categoryService.getCategoryId(id);
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ message: 'Controller error fetching category' });
    }
  };

  async getSubcategoryById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const subcategory = await this.categoryService.getSubcategoryById(id);
      res.status(200).json(subcategory);
    } catch (error) {
      res.status(500).json({ message: 'Controller error fetching subcategory' });
    }
  };

  async getCategoryByPath(req: Request, res: Response): Promise<void> {
    try {
      const { categoryPath } = req.params;
      const category = await this.categoryService.getCategoryByPath(categoryPath);
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching category by path' });
    }
  }
  
  async getSubCategoriesByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { categoryPath } = req.params;
      const subcategories = await this.categoryService.getSubCategoriesByCategory(categoryPath);
      res.status(200).json(subcategories);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching subcategories by category' });
    }
  }

  async getRecipesByCategory(req: Request, res: Response): Promise<void> {
    const { categoryPath } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    try {
      const recipes = await this.categoryService.getRecipesByCategory(categoryPath, page, limit);
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
      const fullCategoryPath = `/categories/${categoryPath}`;
      const fullSubCategoryPath = `/categories/${categoryPath}/${subCategoryPath}`;
      const subCategory = await this.categoryService.getSubCategoryByPath(fullCategoryPath, fullSubCategoryPath);
      res.status(200).json(subCategory);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching subcategory by path' });
    }
  }
    
  async getRecipesByCategoryAndSubcategory(req: Request, res: Response): Promise<void> {
    const { categoryPath, subCategoryPath } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    try {
      const recipes = await this.categoryService.getRecipesByCategoryAndSubcategory(categoryPath, subCategoryPath, page, limit);
      res.status(200).json(recipes);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching recipes by subcategory' });
    }
  }
}