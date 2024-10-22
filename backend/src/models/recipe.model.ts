import mongoose, { Schema, Document } from "mongoose";

export interface IRecipe extends Document {
  title: string;
  description?: string;
  ingredients: string[];
  instructions: string;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const RecipeSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  ingredients: { type: [String], required: true },
  instructions: { type: String, required: true },
  images: { type: [String] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Recipe = mongoose.model<IRecipe>('Recipe', RecipeSchema);