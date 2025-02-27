import { ReactNode } from "react";
import { Category, SubCategory } from "./Category";
import { DragEndEvent } from '@dnd-kit/core';

export interface IRecipe {
  recipeId: string;
  name: string;
  prepTime?: number | undefined;
  cookTime?: number | undefined;
  servings?: number | undefined;
  ingredientGroups: {
    title: string;
    ingredients: {
      name: string;
      amount: string;
      unit: string;
    }[];
  }[];
  instructionGroups: {
    title: string;
    instructions: string[];
  }[];
  images?: RecipeImage[];
  video: {
    id?: string;
    link: string;
  } | null;
  categories: Category;
  subcategories: SubCategory;
  tips?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IngredientTitle {
  name: string;
  isTitle: true;
}

export interface RecipeCardProps {
  recipe: IRecipe;
  onClick?: (recipeId: string) => void;
}

export interface IngredientGroup {
  title: string;
  ingredients: Ingredient[];
}

export interface Ingredient {
  name: string;
  amount: string;
  unit?: string;
}

export interface Instruction {
  content: string;
}

export interface InstructionGroup {
  title: string;
  instructions: Instruction[];
}

export interface RecipeImage {
  data: string;
  file: File;
  id?: string;
  link?: string;
}

export interface RecipeFormData {
  recipeId?: string;
  name: string;
  categories: Category[];
  subcategories: SubCategory[];
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  ingredients: Ingredient[];
  instructions: string[];
  images?: RecipeImage[];
  tips?: string[];
  video: {
    id?: string;
    link: string;
  } | null;
}

export interface RecipeFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  loading: boolean;
  isEdit?: boolean;
  initialData?: any;
  ingredientGroups: IngredientGroup[];
  setIngredientGroups: React.Dispatch<React.SetStateAction<IngredientGroup[]>>;
  instructionGroups: InstructionGroup[];
  setInstructionGroups: React.Dispatch<React.SetStateAction<InstructionGroup[]>>;
  images: Array<RecipeImage>;
  setImages: React.Dispatch<React.SetStateAction<Array<RecipeImage>>>;
  onCancel?: () => void;
  categories: Category[];
  subcategories: SubCategory[];
  onCategoryChange: (categoryId: string) => void;
  onSubCategoryChange: (subCategoryId: string) => void;
  selectedCategory: string;
  selectedSubCategory: string;
  tips?: string[];
  setTips: (tips: string[]) => void;
  video: {
    id?: string;
    link: string;
  } | null;
  setVideo: (video: { id?: string; link: string } | null) => void;
}

export interface SubmitButtonProps {
  onCancel?: () => void;
  loading: boolean;
  isEdit?: boolean;
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
  onSubCategoryChange: (subCategoryId: string) => void;
  selectedCategory: string;
  selectedSubCategory: string;
}

export interface ImageUploadSectionProps {
  images: Array<RecipeImage>;
  setImages: React.Dispatch<React.SetStateAction<Array<RecipeImage>>>;
}

export interface IngredientsProps {
  ingredientGroups: IngredientGroup[];
  setIngredientGroups: React.Dispatch<React.SetStateAction<IngredientGroup[]>>;
}

export interface InstructionsSectionProps {
  instructionGroups: InstructionGroup[];
  setInstructionGroups: React.Dispatch<React.SetStateAction<InstructionGroup[]>>;
}

export interface SortableItemProps {
  id: string;
  children: ReactNode;
  nested?: boolean;
}

export interface SortableListProps<T> {
  items: T[];
  setItems: (items: T[]) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  groupId?: string;
  onDragEnd?: (event: DragEndEvent) => void;
}

export interface TipsSectionProps {
  tips: string[];
  setTips: (tips: string[]) => void;
}

export interface VideoUploadSectionProps {
  video: { 
    id?: string;
    link: string;
   } | null;
  setVideo: (video: { id?: string; link: string } | null) => void;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
}