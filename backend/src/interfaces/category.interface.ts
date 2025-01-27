import { Types } from "mongoose";

export interface ICategory extends Document {
    nameKey: string;
    path: string;
    isActive: boolean;
    order: number;
    subCategories?: ISubCategory[];
}
  
export interface ISubCategory {
    categoryId: Types.ObjectId;
    nameKey: string;
    path: string;
    isActive: boolean;
}