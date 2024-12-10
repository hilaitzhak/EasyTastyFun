import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader, ArrowLeft, Plus, ArrowRight } from 'lucide-react';
import { IRecipe } from '../interfaces/Recipe';
import { recipeApi } from '../api/recipe.api';
import { RecipeCard } from '../components/RecipeCard';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n/i18n';

const AllRecipes = () => {
  const { t } = useTranslation();
  const [recipes, setRecipes] = useState<IRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const isRTL = i18n.language === 'he';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const { data } = await recipeApi.getAll();
        setRecipes(data);
        setError(null);
      } catch (err) {
        setError(t('allRecipes.fetchError'));
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, [t]);

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="flex items-center justify-between w-full mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors p-2 rounded-lg hover:bg-purple-50"
            >
              { isRTL ? (<ArrowRight className="w-5 h-5" />) : (<ArrowLeft className="w-5 h-5" />) }
              <span>{t('nav.backToHome')}</span>
            </button>
          </div>

          <div className="flex items-center">
            <button
              onClick={() => navigate('/recipes/add-recipe')}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-full hover:from-purple-700 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>{t('recipe.create')}</span>
            </button>
          </div>
        </div>
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{t('allRecipes.title')}</h1>
          <p className="text-gray-600 mb-8">{t('allRecipes.subtitle')}</p>
          
          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <input
              type="text"
              placeholder={t('allRecipes.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 pl-12"
            />
            <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="flex items-center gap-3 text-purple-600">
              <Loader className="w-6 h-6 animate-spin" />
              <span className="text-lg">{t('common.loading')}</span>
            </div>
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
        ) : filteredRecipes.length === 0 ? (
          <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-2xl">
            {searchTerm ? (
              <>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  {t('allRecipes.noSearchResults', { searchTerm })}
                </h3>
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  {t('allRecipes.clearSearch')}
                </button>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  {t('allRecipes.noRecipes')}
                </h3>
                <p className="text-gray-600 mb-6">{t('allRecipes.startAdding')}</p>
                <button
                  onClick={() => navigate('/recipes/add-recipe')}
                  className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-full hover:from-purple-700 hover:to-pink-600 transition-all"
                >
                  {t('recipe.create')}
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                recipe={recipe}
                onClick={(id) => navigate(`/recipe/${id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllRecipes;