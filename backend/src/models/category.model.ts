import mongoose, { Schema } from "mongoose";
import { ICategory } from "../interfaces/category.interface";
import { randomUUID } from "node:crypto";

const CategorySchema: Schema<ICategory> = new Schema({
    id: { type: String, unique: true, index: true, default: function () { return randomUUID(); } },
    nameKey: { type: String, required: true, unique: true },
    path: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    order: { type: Number, required: true },
    subCategories: [{ type: Schema.Types.ObjectId, ref: 'SubCategory' }]
});

export default mongoose.model<ICategory>('Category', CategorySchema);