import mongoose, { Schema } from "mongoose";
import { ICategory } from "../interfaces/recipe.interface";

const CategorySchema: Schema = new Schema({
    nameKey: { type: String, required: true, unique: true },
    path: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    order: { type: Number, required: true },
    subCategories: [
        {
            type: mongoose.Schema.Types.ObjectId, // Reference to another model
            ref: 'SubCategory',
        },
    ]
});
  
export default mongoose.model<ICategory>('Category', CategorySchema);