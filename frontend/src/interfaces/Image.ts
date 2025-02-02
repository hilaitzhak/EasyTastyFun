export interface ImageModalProps {
    images: { data: string }[];
    currentIndex: number;
    onClose: () => void;
}