import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecipes } from '../hooks/useRecipes';
import { RecipeCard } from './RecipeCard';
import { PlusCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LatestRecipes = () => {
  const { recipes, loading, error } = useRecipes(true);
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-gradient-to-b from-white to-purple-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-2">{t('latestRecipes.title')}</h2>
            <p className="text-gray-600">{t('latestRecipes.subtitle')}</p>
          </div>
          <button
            onClick={() => navigate('/recipes')}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-full hover:from-purple-700 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
          >
            <span>{t('latestRecipes.addRecipe')}</span>
            <PlusCircle className="w-5 h-5" />
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white/60 backdrop-blur-sm rounded-2xl">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="text-purple-600 hover:text-purple-700 font-medium underline"
            >
              {t('common.tryAgain')}
            </button>
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-2xl">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">{t('latestRecipes.noRecipes')}</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                recipe={recipe}
                onClick={(id) => navigate(`/recipe/${id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestRecipes;