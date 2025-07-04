import mongoose, { Schema, Types } from "mongoose";
import { IRecipe } from "../interfaces/recipe.interface";
import { randomUUID } from "node:crypto";

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
  recipeId: { type: String, unique: true, index: true, default: function () { return randomUUID(); } },
  name: { type: String, required: true },
  prepTime: { type: Number },
  cookTime: { type: Number },
  servings: { type: Number },
  ingredientGroups: [IngredientGroupSchema],
  instructionGroups: [InstructionGroupSchema],
  images: [{ id: { type: String }, link: { type: String }}],
  video: { id: { type: String }, link: { type: String }},
  category: { type: Types.ObjectId, ref: 'Category', required: true },
  subcategory: { type: Types.ObjectId, ref: 'SubCategory', required: false },
  tips: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

RecipeSchema.index({ createdAt: -1 }); // For sorting by creation date
RecipeSchema.index({ category: 1 });   // For filtering by category
RecipeSchema.index({ subcategory: 1 }); // For filtering by subcategory

export default mongoose.model<IRecipe>('Recipe', RecipeSchema);