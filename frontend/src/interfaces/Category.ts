export interface Category {
    id: string;
    nameKey: string;
    path: string;
    isActive: boolean;
    order: number;
    subCategories?: SubCategory[];
}

export interface SubCategory {
    id: string;
    categoryId: string;
    nameKey: string;
    path: string;
    isActive: boolean;
}