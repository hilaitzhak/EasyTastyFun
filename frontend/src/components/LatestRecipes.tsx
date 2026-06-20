import { useNavigate } from 'react-router-dom';
import { useRecipes } from '../hooks/useRecipes';
import { PlusCircle, UtensilsCrossed } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import RecipeCard from './RecipeCard';
import RecipeCardSkeleton from './RecipeCardSkeleton';

function LatestRecipes() {
  const { recipes, loading, error } = useRecipes(true);
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="py-20 bg-paper">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-12 border-b border-line pb-6">
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-ink mb-2">{t('latestRecipes.title')}</h2>
          </div>
          <button
            onClick={() => navigate('/recipes/add-recipe')}
            className="inline-flex items-center justify-center gap-2 min-w-[100px]
                bg-terracotta text-white px-6 py-3 rounded-full text-sm font-medium
                transition-colors duration-200 hover:bg-terracotta-dark
                disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{t('latestRecipes.addRecipe')}</span>
            <PlusCircle className="w-5 h-5" strokeWidth={1.75} />
          </button>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => <RecipeCardSkeleton key={i} />)}
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-surface rounded-xl border border-line shadow-soft">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-terracotta-dark hover:text-terracotta font-medium underline"
            >
              {t('common.tryAgain')}
            </button>
          </div>
        ) : recipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-surface rounded-xl border border-line shadow-soft gap-4">
            <div className="w-16 h-16 rounded-2xl bg-terracotta-light flex items-center justify-center">
              <UtensilsCrossed className="w-8 h-8 text-terracotta" />
            </div>
            <div className="text-center">
              <h3 className="font-display text-2xl font-semibold text-ink-soft mb-1">{t('latestRecipes.noRecipes')}</h3>
              <p className="text-ink-soft text-sm mb-5">{t('latestRecipes.beFirst')}</p>
              <button
                onClick={() => navigate('/recipes/add-recipe')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm text-white bg-terracotta hover:bg-terracotta-dark transition-colors duration-200"
              >
                <PlusCircle className="w-4 h-4" strokeWidth={1.75} />
                {t('latestRecipes.createRecipe')}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.recipeId}
                recipe={recipe}
                onClick={(recipeId) => navigate(`/recipe/${recipeId}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LatestRecipes;