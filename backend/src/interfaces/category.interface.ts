import mongoose, { Types } from "mongoose";

export interface ICategory extends Document {
    _id: Types.ObjectId;
    nameKey: string; // For translation keys
    path: string; // For routing
    isActive: boolean; // Enable/Disable categories
    order: number; // For custom sorting
    // subCategories?: mongoose.Types.ObjectId[];
    subCategories?: ISubCategory[];

}
  
export interface ISubCategory {
    _id: Types.ObjectId;
    nameKey: string;
    path: string;
    isActive: boolean;
}