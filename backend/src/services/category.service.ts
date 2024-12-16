import Category from '../models/category.model';
import '../models/subcategory.model';

export class CategoryService {

  constructor() {}

  async getCategories() {
    try {
      const categories = await Category.find({ isActive: true }) // Fetch active categories
        .sort({ order: 1 })                                      // Sort by 'order' field
        .populate({
          path: 'subCategories',         // Field to populate
          match: { isActive: true },     // Only include active subcategories
          select: 'nameKey path isActive -_id' // Select specific fields to return
        });

      return categories;
    } catch (error) {
      console.error('Error in CategoryService.getCategories:', error);
      throw new Error('Service error fetching categories');
    }
  }
}
