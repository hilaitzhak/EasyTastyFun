import { Calendar, Clock, Heart, Users } from "lucide-react";
import { RecipeCardProps } from "../interfaces/Recipe";
import { useTranslation } from "react-i18next";

export const RecipeCard = ({ recipe, onClick }: RecipeCardProps) => {
  const { t } = useTranslation();
  const totalTime = recipe.prepTime + recipe.cookTime;
  const formattedDate = new Date(recipe.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });  
    
  return (
    <div 
      onClick={() => onClick?.(recipe._id)}
      className="group bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="relative h-56">
        {recipe.images && recipe.images[0] ? (
          <img
            src={recipe.images[0].data}
            alt={recipe.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
            <span className="text-gray-400">{t('common.noImage')}</span>
          </div>
        )}
        <div className="absolute top-4 right-4">
          <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
            <Heart className="w-5 h-5 text-pink-500" />
          </button>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-purple-600 transition-colors">
          {recipe.name}
        </h3>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-500" />
            <span>{totalTime} {t('recipe.minutes')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-500" />
            <span>{recipe.servings} {t('recipe.servings')}</span>
          </div>
          <div className="flex items-center gap-2 col-span-2">
            <Calendar className="w-4 h-4 text-purple-500" />
            <span>{t('recipe.createdAt', { date: formattedDate })}</span>
          </div>
        </div>
      </div>
    </div>
  );
};