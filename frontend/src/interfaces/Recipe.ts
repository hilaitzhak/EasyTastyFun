import { ReactNode } from "react";
import { Category, SubCategory } from "./Category";
import { DragEndEvent } from '@dnd-kit/core';

export interface IRecipe {
  _id: string;
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
  images?: {
    data: string;
    description?: string;
  }[];
  categories: Category;
  subcategories: SubCategory;
  createdAt: Date;
  updatedAt: Date;
}

export interface IngredientTitle {
  name: string;
  isTitle: true;
}

export interface RecipeCardProps {
  recipe: IRecipe;
  onClick?: (id: string) => void;
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
  ingredientGroups: IngredientGroup[];
  setIngredientGroups: React.Dispatch<React.SetStateAction<IngredientGroup[]>>;
  instructionGroups: InstructionGroup[];
  setInstructionGroups: React.Dispatch<React.SetStateAction<InstructionGroup[]>>;
  images: Array<{ data: string; file: File }>;
  setImages: React.Dispatch<React.SetStateAction<Array<{ data: string; file: File }>>>;
  onCancel?: () => void;
  categories: Category[];
  subcategories: SubCategory[];
  onCategoryChange: (categoryId: string) => void;
  selectedCategory: string;
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
  selectedCategory: string;
}

export interface ImageUploadSectionProps {
  images: Array<{ data: string; file: File }>;
  setImages: React.Dispatch<React.SetStateAction<Array<{ data: string; file: File }>>>;
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