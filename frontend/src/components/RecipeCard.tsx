import { Clock, Users, UtensilsCrossed } from "lucide-react";
import { RecipeCardProps } from "../interfaces/Recipe";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function RecipeCard({ recipe }: RecipeCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const totalTime = (recipe?.prepTime || 0) + (recipe?.cookTime || 0);

  const handleClick = () => {
    navigate(`/recipe/${recipe.recipeId}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        {recipe.images && recipe.images[0] ? (
          <>
            <img
              src={recipe.images[0].link}
              alt={recipe.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-100 to-accent-100 flex flex-col items-center justify-center gap-2">
            <UtensilsCrossed className="w-10 h-10 text-primary-300" />
            <span className="text-gray-400 text-sm">{t('common.noImage')}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-base font-semibold mb-3 text-gray-800 group-hover:text-primary-500 transition-colors leading-snug line-clamp-2">
          {recipe.name}
        </h3>

        {(totalTime > 0 || (recipe?.servings ?? 0) > 0) && (
          <div className="mt-auto flex items-center gap-4 text-xs text-gray-500 pt-3 border-t border-gray-100">
            {totalTime > 0 && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primary-400" />
                <span>{totalTime} {t('recipe.minutes')}</span>
              </div>
            )}
            {(recipe?.servings ?? 0) > 0 && (
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-primary-400" />
                <span>{recipe.servings} {t('recipe.servings')}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default RecipeCard;
