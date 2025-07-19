import { ICategory, ISubCategory } from '../interfaces/category.interface';
import { IRecipe, RecipeResponse } from '../interfaces/recipe.interface';
import Category from '../models/category.model';
import SubCategory from '../models/subcategory.model';
import Recipe from '../models/recipe.model';

export class CategoryService {

  constructor() {}

  async getCategories() {
    try {
      const categories = await Category.find({ isActive: true })
        .sort({ order: 1 })
        .lean();

      const categoriesWithSubcategories = await Promise.all(
        categories.map(async (category) => {
          if (category.subCategories && category.subCategories.length > 0) {
            const subcategories = await SubCategory.find({
              id: { $in: category.subCategories },
              isActive: true
            })
            .select('id nameKey path isActive')
            .lean();

            return {
              ...category,
              subCategories: subcategories
            };
          } else {
            return {
              ...category,
              subCategories: []
            };
          }
        })
      );

      return categoriesWithSubcategories;
    } catch (error) {
      console.error('Error in CategoryService.getCategories:', error);
      throw new Error('Service error fetching categories');
    }
  }

  async getCategoryById(categoryId: string) {
    try {
      const category = await Category.findOne({ id: categoryId, isActive: true });
      return category;
    } catch (error) {
      console.error('Error in CategoryService.getCategoryById:', error);
      throw new Error('Service error fetching category');
    }
  }

  async getSubcategoryById(subcategoryId: string) {
    try {
      const subcategory = await SubCategory.findOne({ id: subcategoryId, isActive: true });
      return subcategory;
    } catch (error) {
      console.error('Error in CategoryService.getSubcategoryById:', error);
      throw new Error('Service error fetching subcategory');
    }
  }

  async getCategoryByPath(categoryPath: string): Promise<ICategory | null> {
    try {
      return await Category.findOne({
        path: `/categories/${categoryPath}`,
        isActive: true
      });
    } catch (error) {
      console.error('Error fetching category by path:', error);
      return null;
    }
  }

  async getRecipesByCategory(categoryPath: string, page: number, limit: number): Promise<RecipeResponse> {
    try {
      const skip = (page - 1) * limit;

      const category = await Category.findOne({
        path: `/categories/${categoryPath}`,
        isActive: true
      });

      if (!category) {
        console.log('Category not found');
        return {
          recipes: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalRecipes: 0,
            hasMore: false
          }
        };
      }

      // Use custom id field for recipe queries
      const total = await Recipe.countDocuments({ category: category.id });
      const recipes = await Recipe.find({ category: category.id })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      return {
        recipes,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalRecipes: total,
          hasMore: page * limit < total
        }
      };

    } catch (error) {
      console.error('Error fetching recipes by category:', error);
      throw new Error('Error fetching recipes by category');
    }
  }

  async getAllSubCategories(): Promise<ISubCategory[]> {
    try {
      return await SubCategory.find({ isActive: true })
        .select('id nameKey path categoryId isActive')
        .lean();
    } catch (error) {
      console.error('Error fetching all subcategories:', error);
      return [];
    }
  }

  // Fixed to work with string-based references
  async getSubCategoriesByCategory(categoryPath: string): Promise<ISubCategory[]> {
    try {
      const category = await Category.findOne({ 
        path: categoryPath,
        isActive: true 
      });

      if (!category) {
        return [];
      }

      // Find subcategories using custom id references
      const subcategories = await SubCategory.find({
        id: { $in: category.subCategories || [] },
        isActive: true
      });

      return subcategories;
    } catch (error) {
      console.error('Error fetching subcategories by category:', error);
      return [];
    }
  }

  // Fixed to work with string-based references
  async getSubCategoryByPath(categoryPath: string, subCategoryPath: string): Promise<ISubCategory | null> {
    try {
      const category = await Category.findOne({ 
        path: categoryPath,
        isActive: true 
      });

      if (!category) {
        return null;
      }

      // Find subcategory by path and ensure it belongs to the category
      const subcategory = await SubCategory.findOne({
        path: subCategoryPath,
        id: { $in: category.subCategories || [] },
        isActive: true
      });

      return subcategory;
    } catch (error) {
      console.error('Service error fetching subcategory by path:', error);
      return null;
    }
  }

  async getRecipesByCategoryAndSubcategory(categoryPath: string, subCategoryPath: string, page: number = 1, limit: number = 20): Promise<RecipeResponse> {
    try {
      if (!categoryPath || !subCategoryPath) {
        return {
          recipes: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalRecipes: 0,
            hasMore: false
          }
        };
      }

      const category = await Category.findOne({
        path: `/categories/${categoryPath}`,
        isActive: true
      });

      if (!category) {
        console.log('Category not found');
        return {
          recipes: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalRecipes: 0,
            hasMore: false
          }
        };
      }

      const subcategory = await SubCategory.findOne({
        path: `/categories/${categoryPath}/${subCategoryPath}`,
        isActive: true
      });

      if (!subcategory) {
        console.log('Subcategory not found');
        return {
          recipes: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalRecipes: 0,
            hasMore: false
          }
        };
      }

      const skip = (page - 1) * limit;

      // Use custom id fields for recipe queries
      const totalRecipes = await Recipe.countDocuments({
        category: category.id,
        subcategory: subcategory.id
      });

      const recipes = await Recipe.find({
        category: category.id,
        subcategory: subcategory.id
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean() as unknown as IRecipe[];

      const totalPages = Math.ceil(totalRecipes / limit);
      const hasMore = page * limit < totalRecipes;

      return {
        recipes,
        pagination: {
          currentPage: page,
          totalPages,
          totalRecipes,
          hasMore
        }
      };

    } catch (error) {
      console.error('Error fetching recipes by category and subcategory:', error);
      throw new Error('Error fetching recipes by category and subcategory');
    }
  }

  // Additional helper method to get subcategories by category id
  async getSubcategoriesByCategoryId(categoryId: string): Promise<ISubCategory[]> {
    try {
      const subcategories = await SubCategory.find({ 
        categoryId: categoryId,
        isActive: true 
      })
      .select('id nameKey path categoryId isActive')
      .lean();
      
      return subcategories;
    } catch (error) {
      console.error('Error in CategoryService.getSubcategoriesByCategoryId:', error);
      throw new Error('Service error fetching subcategories by category id');
    }
  }

  // Method to validate if a category and subcategory combination is valid
  async validateCategorySubcategory(categoryId?: string, subcategoryId?: string): Promise<boolean> {
    try {
      if (categoryId) {
        const category = await Category.findOne({ id: categoryId, isActive: true });
        if (!category) {
          throw new Error(`Category with id ${categoryId} not found`);
        }

        if (subcategoryId) {
          const subcategory = await SubCategory.findOne({ id: subcategoryId, isActive: true });
          if (!subcategory) {
            throw new Error(`Subcategory with id ${subcategoryId} not found`);
          }

          // Check if subcategory belongs to the category
          if (subcategory.categoryId !== categoryId) {
            throw new Error(`Subcategory ${subcategoryId} does not belong to category ${categoryId}`);
          }
        }
      }

      return true;
    } catch (error) {
      console.error('Error in CategoryService.validateCategorySubcategory:', error);
      throw error;
    }
  }
}