import { Document, Types } from 'mongoose';
import { ICategory, ISubCategory } from './category.interface';

export interface IRecipe extends Document {
  name: string;
  description: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: {
    name: string;
    amount: number;
    unit: string;
  }[];
  instructions: string[];
  images: {
    data: string;
    description?: string;
  }[];
  category: Types.ObjectId | ICategory;
  subCategory: Types.ObjectId | ISubCategory;
  createdAt: Date;
  updatedAt: Date;
}