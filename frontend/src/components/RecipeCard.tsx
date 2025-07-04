import { Calendar, Clock, Users } from "lucide-react";
import { RecipeCardProps } from "../interfaces/Recipe";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function RecipeCard({ recipe }: RecipeCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const totalTime = (recipe?.prepTime || 0) + (recipe?.cookTime || 0);
  const formattedDate = new Date(recipe.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });  

  const handleClick = () => {
    navigate(`/recipe/${recipe.recipeId}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="group bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
    >
      <div className="relative h-56">
        {recipe.images && recipe.images[0] ? (
          <img
            src={recipe.images[0].link}
            alt={recipe.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
            <span className="text-gray-400">{t('common.noImage')}</span>
          </div>
        )}
      </div>
  
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-md font-bold mb-2 text-gray-800 group-hover:text-purple-600 transition-colors">
          {recipe.name}
        </h3>
        
        {(totalTime > 0 || (recipe?.servings ?? 0) > 0 || formattedDate) && (
          <div className="mt-auto grid grid-cols-2 gap-y-2 text-xs text-gray-500">
            {recipe && (
              <>
                {totalTime > 0 && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-500" />
                    <span>
                      {totalTime} {t('recipe.minutes')}
                    </span>
                  </div>
                )}
                
                {(recipe?.servings ?? 0) > 0 && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-500" />
                    <span>
                      {recipe.servings} {t('recipe.servings')}
                    </span>
                  </div>
                )}
                
                {formattedDate && (
                  <div className="flex items-center gap-2 col-span-2 mt-1">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    <span>{t('recipe.createdAt', { date: formattedDate })}</span>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default RecipeCard;