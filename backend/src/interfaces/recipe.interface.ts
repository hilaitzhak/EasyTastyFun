import { Document, Types } from 'mongoose';
import { ICategory, ISubCategory } from './category.interface';

export interface IRecipe extends Document {
  recipeId: string;
  name: string;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  ingredientGroups: IngredientGroup[];
  instructionGroups: InstructionGroup[];
  images?: {
    id?: string;
    link?: string,
  }[];
  video?: {
    id: string;
    link: string;
  };
  tips?: string[];
  category: Types.ObjectId | ICategory;
  subcategory: Types.ObjectId | ISubCategory;
  createdAt: Date;
  updatedAt: Date;
}

export interface IngredientTitle {
  name: string;
  isTitle: true;
}

export interface RecipeCardProps {
  recipe: IRecipe;
  onClick?: (id: string) => void;
}

export interface IngredientGroup {
  title: string;
  ingredients: Ingredient[];
}

export interface Ingredient {
  name: string;
  amount: string;
  unit?: string;
}

export interface Instruction {
  content: string;
}

export interface InstructionGroup {
  title: string;
  instructions: Instruction[];
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalRecipes: number;
  hasMore: boolean;
}

export interface RecipeResponse {
  recipes: IRecipe[];
  pagination: PaginationData;
}