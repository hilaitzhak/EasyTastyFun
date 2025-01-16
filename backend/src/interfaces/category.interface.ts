import mongoose, { Types } from "mongoose";

export interface ICategory extends Document {
    _id: Types.ObjectId;
    nameKey: string;
    path: string;
    isActive: boolean;
    order: number;
    // subCategories?: mongoose.Types.ObjectId[];
    subCategories?: ISubCategory[];

}
  
export interface ISubCategory {
    _id: Types.ObjectId;
    nameKey: string;
    path: string;
    isActive: boolean;
}