import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader, Plus, Filter } from 'lucide-react';
import { IRecipe } from '../interfaces/Recipe';
import { recipeApi } from '../api/recipe.api';
import { categoryApi } from '../api/category.api';
import RecipeCard from '../components/RecipeCard';
import Pagination from '../components/Pagination';
import { useTranslation } from 'react-i18next';

function AllRecipes() {
  const ITEMS_PER_PAGE = 15;

  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [selectedCategory, setSelectedCategory] = useState({ id: 'all', label: t('nav.all') });
  const [allRecipes, setAllRecipes] = useState<IRecipe[]>([]);
  const [categories, setCategories] = useState<Array<{ id: string, label: string }>>([{ id: 'all', label: t('nav.all') }]);
  const [backendTotalPages, setBackendTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Fetch categories only once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data: categoryData } = await categoryApi.getCategories();
        setCategories([
          { id: 'all', label: t('nav.all') },
          ...categoryData.map((cat) => ({
            id: cat._id,
            label: cat.name || cat.nameKey
          }))
        ]);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, [t]);

  // Fetch recipes when filters or page changes
  useEffect(() => {
    fetchRecipes();
  }, [currentPage, debouncedSearchTerm, selectedCategory]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);

      const { data } = await recipeApi.getAll(currentPage, ITEMS_PER_PAGE, {
        search: debouncedSearchTerm,
        category: selectedCategory.id !== 'all' ? selectedCategory.id : undefined
      });
      setAllRecipes(data.recipes);
      setBackendTotalPages(data.pagination.totalPages);
      setError(null);
    } catch (err) {
      console.error('Error details:', err);
      setError(t('allRecipes.fetchError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const currentRecipes = allRecipes;
  const totalPages = backendTotalPages;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/30 via-white to-pink-50/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-700 mb-4">{t('allRecipes.title')}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('allRecipes.subtitle')}
          </p>
        </div>

        {/* Add Recipe Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => navigate('/recipes/add-recipe')}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-400 to-pink-400 text-white px-6 py-3 rounded-full hover:from-orange-500 hover:to-pink-500 transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>{t('recipe.create')}</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-6">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder={t('allRecipes.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 h-12 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white shadow-sm"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory.id === category.id
                  ? "bg-gradient-to-r from-orange-400 to-pink-400 text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  }`}
              >
                {t(category.label)}
              </button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6">
          <p className="text-gray-600 text-center">
            {currentRecipes.length} {t('allRecipes.recipe', { count: currentRecipes.length })}
            {selectedCategory.id !== 'all' && ` ${t('allRecipes.inCategory')} ${t(selectedCategory.label)}`}
            {debouncedSearchTerm && ` ${t('allRecipes.matching')} "${debouncedSearchTerm}"`}
          </p>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="flex items-center gap-3 text-orange-500">
              <Loader className="w-6 h-6 animate-spin" />
              <span className="text-lg">{t('common.loading')}</span>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => fetchRecipes()}
              className="text-orange-500 hover:text-orange-600 font-medium underline"
            >
              {t('common.tryAgain')}
            </button>
          </div>
        ) : currentRecipes.length === 0 ? (
          <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-gray-400 mb-4">
              <Filter className="h-16 w-16 mx-auto" />
            </div>
            {searchTerm || selectedCategory.id !== 'all' ? (
              <>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">{t('allRecipes.noResults')}</h3>
                <p className="text-gray-600 mb-4">{t('allRecipes.adjustSearch')}</p>
                <div className="space-x-4">
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="text-orange-500 hover:text-orange-600 font-medium"
                    >
                      {t('allRecipes.clearSearch')}
                    </button>
                  )}
                  {selectedCategory.id !== 'all' && (
                    <button
                      onClick={() => setSelectedCategory({ id: 'all', label: t('nav.all') })}
                      className="text-orange-500 hover:text-orange-600 font-medium"
                    >
                      {t('allRecipes.clearFilters')}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {t('allRecipes.noRecipes')}
                </h3>
                <p className="text-gray-600 mb-6">{t('allRecipes.startAdding')}</p>
                <button
                  onClick={() => navigate('/recipes/add-recipe')}
                  className="bg-gradient-to-r from-orange-400 to-pink-400 text-white px-6 py-3 rounded-full hover:from-orange-500 hover:to-pink-500 transition-all shadow-md"
                >
                  {t('recipe.create')}
                </button>
              </>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 cursor-pointer">
              {currentRecipes.map((recipe: IRecipe) => {
                return (
                  <RecipeCard
                    key={recipe.recipeId}
                    recipe={recipe}
                    onClick={(id: string) => navigate(`/recipe/${id}`)}
                  />
                );
              })}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AllRecipes;