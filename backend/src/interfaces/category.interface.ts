import { Types } from "mongoose";

export interface ICategory extends Document {
    _id: string;
    nameKey: string;
    path: string;
    isActive: boolean;
    order: number;
    subCategories?: ISubCategory[];
}
  
export interface ISubCategory {
    _id: string;
    categoryId: Types.ObjectId;
    nameKey: string;
    path: string;
    isActive: boolean;
}