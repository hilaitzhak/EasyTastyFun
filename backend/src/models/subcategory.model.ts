import mongoose, { Schema } from "mongoose";
import { ISubCategory } from "../interfaces/category.interface";
import { randomUUID } from "node:crypto";

const SubCategorySchema: Schema<ISubCategory> = new Schema({
    id: { type: String, unique: true, index: true, default: function () { return randomUUID(); } },
    categoryId: { type: String, ref: 'Category' },
    nameKey: { type: String, required: true },
    path: { type: String, required: true },
    isActive: { type: Boolean, default: true }
});

export default mongoose.model<ISubCategory>('SubCategory', SubCategorySchema);