import { Minus, Upload } from "lucide-react";
import { ImageUploadSectionProps } from "../interfaces/Recipe";
import { useTranslation } from "react-i18next";

function ImageUploadSection({ images, setImages }: ImageUploadSectionProps) {
  const { t } = useTranslation();
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(t('createRecipe.imageSizeError'));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, {
          data: reader.result as string,
          file
        }]);
      };
      reader.readAsDataURL(file);
    });
  };
  
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-purple-100/50 p-8 space-y-6 transition-all hover:shadow-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {t('createRecipe.images.title')}
      </h2>
      
      <div className="grid gap-6 items-center">
        <label className="border-2 border-dashed border-purple-200 rounded-xl p-8 flex flex-col items-center justify-center hover:bg-purple-50 transition-colors cursor-pointer group">
          <Upload className="w-10 h-10 text-purple-400 group-hover:text-purple-600 transition-colors" />
          <span className="mt-4 text-sm font-medium text-gray-600 group-hover:text-purple-700">
            {t('createRecipe.images.upload')}
          </span>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*" 
            multiple 
            onChange={handleImageUpload} 
          />
        </label>

        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div 
                key={index} 
                className="relative group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all"
              >
                <img
                  src={image.data}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
  
export default ImageUploadSection;