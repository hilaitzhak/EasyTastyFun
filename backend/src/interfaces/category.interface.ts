import mongoose from "mongoose";

export interface ICategory extends Document {
    nameKey: string; // For translation keys
    path: string; // For routing
    isActive: boolean; // Enable/Disable categories
    order: number; // For custom sorting
    // subCategories?: mongoose.Types.ObjectId[];
    subCategories?: ISubCategory[];

}
  
export interface ISubCategory {
    nameKey: string;
    path: string;
    isActive: boolean;
}