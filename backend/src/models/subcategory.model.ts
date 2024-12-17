import mongoose, { Schema } from "mongoose";
import { ISubCategory } from "../interfaces/category.interface";

const SubCategorySchema: Schema<ISubCategory> = new Schema({
    nameKey: { type: String, required: true },
    path: { type: String, required: true },
    isActive: { type: Boolean, default: true }
});
  
export default mongoose.model<ISubCategory>('SubCategory', SubCategorySchema);