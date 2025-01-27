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
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        {t('createRecipe.images.title')}
      </h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-center w-full">
          <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-purple-500">
            <Upload className="w-8 h-8 text-gray-400" />
            <span className="mt-2 text-gray-500">{t('createRecipe.images.dragDrop')}</span>
            <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
          </label>
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {images.map((image, index) => (
              <div key={index} className="relative rounded-lg overflow-hidden">
                <img
                  src={image.data}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
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