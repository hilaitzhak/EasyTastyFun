import express, { Router } from 'express';
// import { UrlController } from '../controllers/url.controller';

export class AppRouter {
    private router: Router;
    // private url_controller: UrlController;

    constructor() {
        this.init();
    }

    private init() {
        this.setRouter();
        // this.setUrlController();
        // this.setRoutes();
    }

    private setRouter() {
        this.router = Router();
    }

    // private setUrlController() {
    //     this.url_controller = new UrlController();
    // }

    // private setRoutes() {
    //     this.router.post('/shorten', this.url_controller.shortenUrl.bind(this.url_controller));
    //     this.router.get('/:short_str', this.url_controller.redirectToOriginalUrl.bind(this.url_controller));
    // }

    public getRouter(): Router {
        return this.router;
    }
}
