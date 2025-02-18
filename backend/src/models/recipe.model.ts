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
  recipeId: { type: String, unique: true, default: function () { return randomUUID(); } },
  name: { type: String, required: true },
  prepTime: { type: Number },
  cookTime: { type: Number },
  servings: { type: Number },
  ingredientGroups: [IngredientGroupSchema],
  instructionGroups: [InstructionGroupSchema],
  images: [{ id: { type: String }, link: { type: String }}],
  video: { id: { type: String }, link: { type: String }},
  category: { type: Types.ObjectId, ref: 'Category', required: true },
  subcategory: { type: Types.ObjectId, ref: 'SubCategory', required: true },
  tips: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// // In your Recipe model file
// export async function createIndexes() {
//   try {
//     const Recipe = mongoose.model('Recipe');
    
//     // First, let's check existing indexes
//     const existingIndexes = await Recipe.collection.getIndexes();
//     console.log('Existing indexes:', existingIndexes);

//     // Only create indexes that don't exist
//     const requiredIndexes = [
//       { key: { name: 1 }, name: 'name_asc' },
//       { key: { category: 1, subcategory: 1 }, name: 'category_subcategory' }
//     ];

//     for (const index of requiredIndexes) {
//       try {
//         await Recipe.collection.createIndex(index.key, { name: index.name });
//         console.log(`Index ${index.name} created successfully`);
//       } catch (error) {
//         if (error === 85) { // Index already exists
//           console.log(`Index for ${Object.keys(index.key)} already exists`);
//         } else {
//           console.error(`Error creating index ${index.name}:`, error);
//         }
//       }
//     }

//     console.log('Index creation process completed');
//   } catch (error) {
//     console.error('Error in createIndexes:', error);
//   }
// }

RecipeSchema.index({ createdAt: -1 }); // For sorting by creation date
RecipeSchema.index({ category: 1 });   // For filtering by category
RecipeSchema.index({ subcategory: 1 }); // For filtering by subcategory

export default mongoose.model<IRecipe>('Recipe', RecipeSchema);