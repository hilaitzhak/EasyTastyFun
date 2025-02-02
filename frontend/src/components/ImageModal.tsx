import { useState } from "react";
import { ImageModalProps } from "../interfaces/Image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

function ImageModal({ images, currentIndex, onClose }: ImageModalProps) {
    const [activeIndex, setActiveIndex] = useState(currentIndex);

    const nextImage = () => {
      setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };
  
    const prevImage = () => {
      setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };
    
    return (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-black/75">
          <div className="relative w-full max-w-5xl mx-4 md:mx-auto">
            <img
              src={images[activeIndex].data}
              alt="Recipe"
              className="w-full h-auto max-h-[90vh] object-contain"
            />
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
    );
}

export default ImageModal;