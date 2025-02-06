import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';

export class CategoryRouter {
    private router: Router;
    private categoryController: CategoryController;

    constructor() {
        this.init();
    }

    private init() {
        this.setRouter();
        this.setCategoryController();
        this.setRoutes();
    }

    private setRouter() {
        this.router = Router();
    }

    private setCategoryController() {
        this.categoryController = new CategoryController();
    }

    private setRoutes() {
        this.router.get('/categories/by-id/:id', this.categoryController.getCategoryById.bind(this.categoryController)); // Fetches the category by id.
        this.router.get('/categories/by-path/:categoryPath', this.categoryController.getCategoryByPath.bind(this.categoryController)); // Fetches a category by its path.
        this.router.get('/categories/:categoryPath/:subCategoryPath/recipes', this.categoryController.getRecipesByCategoryAndSubcategory.bind(this.categoryController));
        this.router.get('/categories/:categoryPath/recipes', this.categoryController.getRecipesByCategory.bind(this.categoryController));
        this.router.get('/categories/:categoryPath/:subCategoryPath', this.categoryController.getSubCategoryByPath.bind(this.categoryController)); // Fetches a specific subcategory by its path within a category.
        this.router.get('/categories', this.categoryController.getCategories.bind(this.categoryController)); // Fetches all the categories.
        this.router.get('/subcategories/by-id/:id', this.categoryController.getSubcategoryById.bind(this.categoryController)); // Fetches all the categories.
        this.router.get('/subcategories', this.categoryController.getAllSubCategories.bind(this.categoryController)); // Fetches all the subcategories.
    }

    public getRouter(): Router {
        return this.router;
    }
}