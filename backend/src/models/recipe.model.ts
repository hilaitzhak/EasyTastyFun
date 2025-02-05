import mongoose, { Schema, Types } from "mongoose";
import { IRecipe } from "../interfaces/recipe.interface";

const IngredientSchema: Schema = new Schema({
  name: { type: String, required: true },
  amount: { type: String },
  unit: { type: String }
});

const IngredientGroupSchema: Schema = new Schema({
  title: { type: String, default: '' },
  ingredients: [IngredientSchema]
});

const InstructionSchema = new mongoose.Schema({
  content: { type: String, required: true }
});

const InstructionGroupSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  instructions: [InstructionSchema]
});

const RecipeSchema: Schema = new Schema({
  name: { type: String, required: true },
  prepTime: { type: Number },
  cookTime: { type: Number },
  servings: { type: Number },
  ingredientGroups: [IngredientGroupSchema],
  instructionGroups: [InstructionGroupSchema],
  images: [{
    data: { type: String},
    description: { type: String }
  }],
  category: { type: Types.ObjectId, ref: 'Category', required: true },
  subcategory: { type: Types.ObjectId, ref: 'SubCategory', required: true },
  tips: [{ type: String }],
  video: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IRecipe>('Recipe', RecipeSchema);