import { ICategory, ISubCategory } from '../interfaces/category.interface';
import { IRecipe } from '../interfaces/recipe.interface';
import Category from '../models/category.model';
import SubCategory from '../models/subcategory.model';
import Recipe from '../models/recipe.model';

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

  async getCategoryId(categoryId: string) {
    try {
      const category = await Category.findById(categoryId);

      return category;
    } catch (error) {
      console.error('Error in CategoryService.getCategoryId:', error);
      throw new Error('Service error fetching category');
    }
  }

  async getSubcategoryById(subcategoryId: string) {
    try {
      const subcategory = await SubCategory.findById(subcategoryId);

      return subcategory;
    } catch (error) {
      console.error('Error in CategoryService.getSubcategoryById:', error);
      throw new Error('Service error fetching subcategory');
    }
  }

  async getCategoryByPath(categoryPath: string): Promise<ICategory | null> {
    try {
      return await Category.findOne({
        path: `/categories/${categoryPath}`
      });
    } catch (error) {
      console.error('Error fetching category by path:', error);
      return null;
    }
  }

  async getRecipesByCategory(categoryPath: string): Promise<IRecipe[]> {
    try {
      if (!categoryPath) {
        return [];
      }
      const category = await Category.findOne({ 
        path: `/categories/${categoryPath}`
      });
  
      if (!category) {
        console.log('Category not found');
        return [];
      }
      const recipes = await Recipe.find({
        category: category._id,
      }).sort({ createdAt: -1 });
  
      return recipes;

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

  async getRecipesByCategoryAndSubcategory(categoryPath: string, subCategoryPath: string): Promise<IRecipe[]> {
    try {
      if (!categoryPath || !subCategoryPath) {
        return [];
      }
  
      const category = await Category.findOne({ 
        path: `/categories/${categoryPath}`
      });
  
      if (!category) {
        console.log('Category not found');
        return [];
      }

      const subcategory = await SubCategory.findOne({
        path: `/categories/${categoryPath}/${subCategoryPath}`
      });
  
      if (!subcategory) {
        console.log('Subcategory not found');
        return [];
      }
  
      // Find recipes that match both category and subcategory IDs
      const recipes = await Recipe.find({
        category: category._id,
        subcategory: subcategory._id
      }).sort({ createdAt: -1 });
  
      return recipes;
    } catch (error) {
      console.error('Error fetching recipes by category and subcategory:', error);
      return [];
    }
  }

  private async getRecipesForSubCategory(subCategoryId: string): Promise<IRecipe[]> {
    try {
      // Fetch recipes associated with the given subcategory
      // You'll need to update this based on your recipe model and associations
      return await Recipe.find({ subCategory: subCategoryId });
    } catch (error) {
      console.error('Error fetching recipes for subcategory:', error);
      return [];
    }
  }
}