import { ICategory, ISubCategory } from '../interfaces/category.interface';
import Category from '../models/category.model';
import SubCategory from '../models/subcategory.model';

export class CategoryService {

  constructor() {}

  async getCategories() {
    try {
      const categories = await Category.find({ isActive: true })
        .sort({ order: 1 })
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

  async getCategoryByPath(categoryPath: string): Promise<ICategory | null> {
    try {
      return await Category.findOne({ path: categoryPath });
    } catch (error) {
      console.error('Error fetching category by path:', error);
      return null;
    }
  }

  async getRecipesByCategory(categoryId: string): Promise<ISubCategory[]> {
    try {
      const category = await Category.findById(categoryId).populate('subCategories');
      return category?.subCategories || [];
    } catch (error) {
      console.error('Error fetching recipes by category:', error);
      return [];
    }
  }

  async getAllSubCategories(): Promise<ISubCategory[]> {
    try {
      return await SubCategory.find();
    } catch (error) {
      console.error('Error fetching all subcategories:', error);
      return [];
    }
  }
  
  async getSubCategoriesByCategory(categoryPath: string): Promise<ISubCategory[]> {
    try {
      const category = await Category.findOne({ path: categoryPath }).populate('subCategories');
      return category ? category.subCategories : [];
    } catch (error) {
      console.error('Error fetching subcategories by category:', error);
      return [];
    }
  }

  async getSubCategoryByPath(categoryPath: string, subCategoryPath: string): Promise<ISubCategory | null> {
    try {
      const category = await Category.findOne({ path: categoryPath }).populate('subCategories');
      if (category) {
        const subCategory = await SubCategory.findOne({ path: subCategoryPath, _id: { $in: category.subCategories.map(sc => sc._id) } });
        return subCategory || null;
      }
      return null;
    } catch (error) {
      console.error('Service error fetching subcategory by path:', error);
      return null;
    }
  }

  // async getRecipesBySubCategory(subCategoryId: string): Promise<IRecipe[]> {
  //   try {
  //     const subCategory = await SubCategory.findById(subCategoryId).populate('recipes');
  //     return subCategory?.recipes || [];
  //   } catch (error) {
  //     console.error('Error fetching recipes by subcategory:', error);
  //     return [];
  //   }
  // }
}
