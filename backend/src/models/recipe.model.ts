import mongoose, { Schema, Document } from "mongoose";
import { IRecipe } from "../interfaces/recipe.interface";

const RecipeSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  prepTime: { type: Number, required: true },
  cookTime: { type: Number, required: true },
  servings: { type: Number, required: true },
  ingredients: [{
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    unit: { type: String, required: true }
  }],
  instructions: [{ type: String, required: true }],
  images: [{
    data: { type: String, required: true },
    description: { type: String }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IRecipe>('Recipe', RecipeSchema);