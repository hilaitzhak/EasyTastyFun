import express, { Router } from 'express';
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
        this.router.get('/categories', this.categoryController.getCategories.bind(this.categoryController));
    }

    public getRouter(): Router {
        return this.router;
    }
}