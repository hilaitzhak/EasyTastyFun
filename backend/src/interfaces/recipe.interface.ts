import { Document } from 'mongoose';

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
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategory extends Document {
  nameKey: string; // For translation keys
  path: string; // For routing
  isActive: boolean; // Enable/Disable categories
  order: number; // For custom sorting
  subCategories?: ISubCategory[];
}

export interface ISubCategory {
  nameKey: string;
  path: string;
  isActive: boolean;
}