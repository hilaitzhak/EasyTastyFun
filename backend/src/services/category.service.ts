import Category from '../models/category.model';

export class CategoryService {

  constructor() {}

  async getCategories() {
    const categories = await Category.find({ isActive: true })
    .sort({ order: 1 });
    return categories;
  }
}
