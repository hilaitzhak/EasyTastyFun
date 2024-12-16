export interface Category {
    _id: string;
    nameKey: string;
    path: string;
    isActive: boolean;
    order: number;
    subCategories?: SubCategory[];
}

export interface SubCategory {
    _id: string;
    nameKey: string;
    path: string;
    isActive: boolean;
}