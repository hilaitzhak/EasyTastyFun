import { RecipeImage } from "./Recipe";

export interface ImageModalProps {
    images: RecipeImage[];
    currentIndex: number;
    onClose: () => void;
}