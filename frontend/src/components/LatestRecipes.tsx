import { useNavigate } from 'react-router-dom';
import { useRecipes } from '../hooks/useRecipes';
import { PlusCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import RecipeCard from './RecipeCard';

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
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="w-16 h-16 border-4 border-terracotta border-t-transparent rounded-full animate-spin"></div>
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
          <div className="text-center py-16 bg-surface rounded-xl border border-line shadow-soft">
            <h3 className="font-display text-2xl font-semibold text-ink-soft mb-4">{t('latestRecipes.noRecipes')}</h3>
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