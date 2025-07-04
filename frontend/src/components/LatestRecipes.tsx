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
    <div className="py-20 bg-gradient-to-b from-white to-orange-50/30">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-700 mb-2">{t('latestRecipes.title')}</h2>
            {/* <p className="text-gray-600">{t('latestRecipes.subtitle')}</p> */}
          </div>
          <button
            onClick={() => navigate('/recipes/add-recipe')}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-400 to-pink-400 text-white px-6 py-3 rounded-full hover:from-orange-500 hover:to-pink-500 transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            <span>{t('latestRecipes.addRecipe')}</span>
            <PlusCircle className="w-5 h-5" />
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