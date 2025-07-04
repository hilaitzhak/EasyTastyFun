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
        .populate({
          path: 'subCategories',
          match: { isActive: true },
          select: 'id nameKey path isActive'
        });

      return categories;
    } catch (error) {
      console.error('Error in CategoryService.getCategories:', error);
      throw new Error('Service error fetching categories');
    }
  }

  async getCategoryId(categoryId: string) {
    try {
      const category = await Category.findOne({ id: categoryId });
      return category;
    } catch (error) {
      console.error('Error in CategoryService.getCategoryId:', error);
      throw new Error('Service error fetching category');
    }
  }

  async getSubcategoryById(subcategoryId: string) {
    try {
      const subcategory = await SubCategory.findOne({ id: subcategoryId });
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

  async getRecipesByCategory(categoryPath: string, page: number, limit: number): Promise<RecipeResponse> {
    try {
      const skip = (page - 1) * limit;

      const category = await Category.findOne({
        path: `/categories/${categoryPath}`
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
        const subCategoryIds = category.subCategories.map((sc: any) => sc.id);
        return await SubCategory.findOne({
          path: subCategoryPath,
          id: { $in: subCategoryIds }
        });
      }
      return null;
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
        path: `/categories/${categoryPath}`
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
        path: `/categories/${categoryPath}/${subCategoryPath}`
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

  // private async getRecipesForSubCategory(subCategoryId: string): Promise<IRecipe[]> {
  //   try {
  //     // Fetch recipes associated with the given subcategory
  //     // You'll need to update this based on your recipe model and associations
  //     return await Recipe.find({ subCategory: subCategoryId });
  //   } catch (error) {
  //     console.error('Error fetching recipes for subcategory:', error);
  //     return [];
  //   }
  // }
}