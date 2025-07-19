import { Types } from "mongoose";

export interface ICategory {
    id: string;
    nameKey: string;
    path: string;
    isActive: boolean;
    order: number;
    subCategories?: ISubCategory[];
}
  
export interface ISubCategory {
    id: string;
    categoryId: string;
    nameKey: string;
    path: string;
    isActive: boolean;
}