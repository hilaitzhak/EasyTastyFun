import mongoose, { Schema, Types } from "mongoose";
import { IRecipe } from "../interfaces/recipe.interface";

const RecipeSchema: Schema = new Schema({
  name: { type: String, required: true },
  prepTime: { type: Number },
  cookTime: { type: Number },
  servings: { type: Number },
  ingredients: [{
    name: { type: String, required: true },
    amount: { type: String, required: true },
    unit: { type: String }
  }],
  instructions: [{ type: String, required: true }],
  images: [{
    data: { type: String},
    description: { type: String }
  }],
  category: { type: Types.ObjectId, ref: 'Category', required: true },
  subcategory: { type: Types.ObjectId, ref: 'SubCategory', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IRecipe>('Recipe', RecipeSchema);