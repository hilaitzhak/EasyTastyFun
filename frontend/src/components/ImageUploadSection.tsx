import { X, Upload, ImagePlus } from "lucide-react";
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
        setImages(prev => [...prev, { data: reader.result as string, file }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center">
          <ImagePlus className="w-4 h-4 text-primary-500" />
        </div>
        <h2 className="text-lg font-semibold text-gray-800">{t('createRecipe.images.title')}</h2>
      </div>

      <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-200 rounded-2xl p-8 cursor-pointer hover:border-primary-300 hover:bg-primary-50/40 transition-all group">
        <div className="w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-primary-100 flex items-center justify-center transition-colors">
          <Upload className="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-600 group-hover:text-primary-700 transition-colors">
            {t('createRecipe.images.upload')}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">PNG, JPG up to 5MB</p>
        </div>
        <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
      </label>

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mt-4">
          {images.map((image, index) => (
            <div key={index} className="relative group rounded-xl overflow-hidden aspect-square">
              <img
                src={image.data}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-50"
              >
                <X className="w-3.5 h-3.5 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
  
export default ImageUploadSection;