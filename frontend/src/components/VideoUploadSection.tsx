import { Minus, Upload, Video } from "lucide-react";
import { VideoUploadSectionProps } from "../interfaces/Recipe";
import { useTranslation } from "react-i18next";

function VideoUploadSection({ video, setVideo }: VideoUploadSectionProps) {
  const { t } = useTranslation();
  
  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 50MB limit
    if (file.size > 50 * 1024 * 1024) {
      alert(t('createRecipe.videoSizeError'));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setVideo(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const removeVideo = () => {
    setVideo(null);
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-purple-100/50 p-8 space-y-6 transition-all hover:shadow-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {t('createRecipe.video.title')}
      </h2>
      
      <div className="grid gap-6 items-center">
        {!video ? (
          <label className="border-2 border-dashed border-purple-200 rounded-xl p-8 flex flex-col items-center justify-center hover:bg-purple-50 transition-colors cursor-pointer group">
            <Video className="w-10 h-10 text-purple-400 group-hover:text-purple-600 transition-colors" />
            <span className="mt-4 text-sm font-medium text-gray-600 group-hover:text-purple-700">
              {t('createRecipe.video.upload')}
            </span>
            <span className="mt-2 text-xs text-gray-500">
              {t('createRecipe.video.maxSize')}
            </span>
            <input 
              type="file" 
              className="hidden" 
              accept="video/*" 
              onChange={handleVideoUpload} 
            />
          </label>
        ) : (
          <div className="relative group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all">
            <video
              src={video}
              controls
              className="w-full rounded-lg"
              controlsList="nodownload"
            >
              {t('recipe.videoNotSupported')}
            </video>
            <button
              type="button"
              onClick={removeVideo}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
  
export default VideoUploadSection;