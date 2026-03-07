import React from 'react';
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
    <div className="py-20 bg-gradient-to-b from-surface to-surface-muted">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-1">{t('latestRecipes.title')}</h2>
            <div className="w-12 h-1 rounded-full bg-gradient-to-r from-primary-400 to-accent-400" />
          </div>
          <button
            onClick={() => navigate('/recipes/add-recipe')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white bg-gradient-to-r from-primary-500 to-accent-500 shadow-md hover:shadow-lg hover:from-primary-600 hover:to-accent-600 transition-all duration-200 hover:scale-105"
          >
            <span>{t('latestRecipes.addRecipe')}</span>
            <PlusCircle className="w-4 h-4" />
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="w-16 h-16 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
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
          <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-2xl font-semibold text-gray-600 mb-4">{t('latestRecipes.noRecipes')}</h3>
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