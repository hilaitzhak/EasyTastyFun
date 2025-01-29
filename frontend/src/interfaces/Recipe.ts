import { Category, SubCategory } from "./Category";

export interface IRecipe {
  _id: string;
  name: string;
  prepTime?: number | undefined;
  cookTime?: number | undefined;
  servings?: number | undefined;
  ingredients: {
    name: string;
    amount: string;
    unit?: string;
  }[];
  instructions: string[];
  images?: {
    data: string;
    description?: string;
  }[];
  categories: Category;
  subcategories: SubCategory;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecipeCardProps {
  recipe: IRecipe;
  onClick?: (id: string) => void;
}

export interface Ingredient {
  name: string;
  amount: string;
  unit?: string;
}

export interface RecipeImage {
  data: string;
  file: File;
}

export interface RecipeFormData {
  name: string;
  categories: Category[];
  subcategories: SubCategory[];
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  ingredients: Ingredient[];
  instructions: string[];
  images?: RecipeImage[];
}

export interface RecipeFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  loading: boolean;
  isEdit?: boolean;
  initialData?: any;
  ingredients: Array<{ name: string; amount: string; unit: string }>;
  setIngredients: React.Dispatch<React.SetStateAction<Array<{ name: string; amount: string; unit: string }>>>;
  instructions: string[];
  setInstructions: React.Dispatch<React.SetStateAction<string[]>>;
  images: Array<{ data: string; file: File }>;
  setImages: React.Dispatch<React.SetStateAction<Array<{ data: string; file: File }>>>;
  onCancel?: () => void;
  categories: Category[];
  subcategories: SubCategory[];
  onCategoryChange: (categoryId: string) => void;
  selectedCategory: string;
}

export interface BasicInfoSectionProps {
  initialData?: {
    name?: string;
    prepTime?: number;
    cookTime?: number;
    servings?: number;
  };
  categories: Category[];
  subcategories: SubCategory[];
  onCategoryChange: (categoryId: string) => void;
  selectedCategory: string;
}

export interface ImageUploadSectionProps {
  images: Array<{ data: string; file: File }>;
  setImages: React.Dispatch<React.SetStateAction<Array<{ data: string; file: File }>>>;
}

export interface IngredientsProps {
  ingredients: Array<{ name: string; amount: string; unit: string }>;
  setIngredients: React.Dispatch<React.SetStateAction<Array<{ name: string; amount: string; unit: string }>>>;
}

export interface InstructionsSectionProps {
  instructions: string[];
  setInstructions: React.Dispatch<React.SetStateAction<string[]>>;
}