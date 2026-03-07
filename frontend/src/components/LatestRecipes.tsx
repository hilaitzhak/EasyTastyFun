import React from 'react';
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
    <div className="py-20 bg-gradient-to-b from-surface to-surface-muted">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-1">{t('latestRecipes.title')}</h2>
            <div className="w-12 h-1 rounded-full bg-gradient-to-r from-primary-400 to-accent-400" />
          </div>
          <button
            onClick={() => navigate('/recipes/add-recipe')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-orange-400 to-pink-400 shadow-sm hover:shadow-md hover:from-orange-500 hover:to-pink-500 transition-all duration-200"
          >
            <span>{t('latestRecipes.addRecipe')}</span>
            <PlusCircle className="w-4 h-4" />
          </button>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => <RecipeCardSkeleton key={i} />)}
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-orange-500 hover:text-orange-600 font-medium underline"
            >
              {t('common.tryAgain')}
            </button>
          </div>
        ) : recipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center">
              <UtensilsCrossed className="w-8 h-8 text-orange-400" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-700 mb-1">{t('latestRecipes.noRecipes')}</h3>
              <p className="text-gray-500 text-sm mb-5">{t('latestRecipes.beFirst')}</p>
              <button
                onClick={() => navigate('/recipes/add-recipe')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-orange-400 to-pink-400 shadow-sm hover:shadow-md hover:from-orange-500 hover:to-pink-500 transition-all duration-200"
              >
                <PlusCircle className="w-4 h-4" />
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