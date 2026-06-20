import { X, Video } from "lucide-react";
import { VideoUploadSectionProps } from "../interfaces/Recipe";
import { useTranslation } from "react-i18next";

function VideoUploadSection({ video, setVideo }: VideoUploadSectionProps) {
  const { t } = useTranslation();

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      alert(t('createRecipe.videoSizeError'));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setVideo({ link: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const removeVideo = () => {
    setVideo(null);
  };

  return (
    <div className="bg-surface rounded-2xl border border-line shadow-card p-8 space-y-6 transition-all hover:shadow-soft">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-xl bg-terracotta-light flex items-center justify-center">
          <Video className="w-4 h-4 text-terracotta" />
        </div>
        <h2 className="text-2xl font-bold font-display text-ink">{t('createRecipe.video.title')}</h2>
      </div>

      {!video?.link ? (
        <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-line rounded-2xl p-8 cursor-pointer hover:border-terracotta hover:bg-terracotta-light transition-all group">
          <div className="w-12 h-12 rounded-xl bg-terracotta-light group-hover:bg-terracotta-light flex items-center justify-center transition-colors">
            <Video className="w-5 h-5 text-terracotta group-hover:text-terracotta-dark transition-colors" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-ink-soft group-hover:text-terracotta-dark transition-colors">
              {t('createRecipe.video.upload')}
            </p>
            <p className="text-xs text-ink-muted mt-0.5">{t('createRecipe.video.maxSize')}</p>
          </div>
          <input type="file" className="hidden" accept="video/*" onChange={handleVideoUpload} />
        </label>
      ) : (
        <div className="relative group rounded-xl overflow-hidden w-full max-w-sm">
          <video
            src={video.link}
            controls
            className="w-full rounded-xl"
            controlsList="nodownload"
          >
            {t('recipe.videoNotSupported')}
          </video>
          <button
            type="button"
            onClick={removeVideo}
            className="absolute top-2 right-2 w-7 h-7 bg-surface rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-50"
          >
            <X className="w-3.5 h-3.5 text-red-500" />
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoUploadSection;
