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