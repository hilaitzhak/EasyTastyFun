import { Calendar, Clock, Users, UtensilsCrossed } from "lucide-react";
import { RecipeCardProps } from "../interfaces/Recipe";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function RecipeCard({ recipe }: RecipeCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const totalTime = (recipe?.prepTime || 0) + (recipe?.cookTime || 0);
  const formattedDate = recipe?.createdAt
    ? new Date(recipe.createdAt).toLocaleDateString()
    : "";

  const handleClick = () => {
    navigate(`/recipe/${recipe.recipeId}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group bg-surface rounded-3xl overflow-hidden border border-line shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        {recipe.images && recipe.images[0] ? (
          <>
            <img
              src={recipe.images[0].link}
              alt={recipe.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </>
        ) : (
          <div className="w-full h-full bg-terracotta-light flex flex-col items-center justify-center gap-2">
            <UtensilsCrossed className="w-10 h-10 text-terracotta" />
            <span className="text-ink-muted text-sm">{t('common.noImage')}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-display text-xl font-semibold mb-3 text-ink leading-snug group-hover:text-terracotta-dark transition-colors line-clamp-2">
          {recipe.name}
        </h3>

        {(totalTime > 0 || (recipe?.servings ?? 0) > 0 || formattedDate) && (
          <div className="mt-auto pt-4 border-t border-line grid grid-cols-2 gap-y-2 text-xs text-ink-muted">
            {recipe && (
              <>
                {totalTime > 0 && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-olive" strokeWidth={1.75} />
                    <span>
                      {totalTime} {t('recipe.minutes')}
                    </span>
                  </div>
                )}

                {(recipe?.servings ?? 0) > 0 && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-olive" strokeWidth={1.75} />
                    <span>
                      {recipe.servings} {t('recipe.servings')}
                    </span>
                  </div>
                )}

                {formattedDate && (
                  <div className="flex items-center gap-2 col-span-2 mt-1">
                    <Calendar className="w-4 h-4 text-olive" strokeWidth={1.75} />
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
