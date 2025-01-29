import { Document, Types } from 'mongoose';
import { ICategory, ISubCategory } from './category.interface';

export interface IRecipe extends Document {
  name: string;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  ingredients: {
    name: string;
    amount: string;
    unit?: string;
  }[];
  instructions: string[];
  images?: {
    data: string;
    description?: string;
  }[];
  category: Types.ObjectId | ICategory;
  subcategory: Types.ObjectId | ISubCategory;
  createdAt: Date;
  updatedAt: Date;
}