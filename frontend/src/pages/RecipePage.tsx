import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { categoryApi } from '../api/category.api';
import { IRecipe } from '../interfaces/Recipe';
import { Category, SubCategory } from '../interfaces/Category';
import RecipeCard from '../components/RecipeCard';
import Pagination from '../components/Pagination';

function RecipePage() {
  const ITEMS_PER_PAGE = 20;

  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const { categoryPath = '', subCategoryPath = '' } = useParams<{ categoryPath: string; subCategoryPath?: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [subCategory, setSubCategory] = useState<SubCategory | null>(null);
  const [recipes, setRecipes] = useState<IRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (subCategoryPath) {
          const subCategory = await categoryApi.getSubCategoryByPath(categoryPath, subCategoryPath);

          if (subCategory) {
            setSubCategory(subCategory);
            const { recipes, total } = await categoryApi.getRecipesByCategoryAndSubcategory(
              categoryPath, 
              subCategoryPath,
              currentPage,
              ITEMS_PER_PAGE
            );
            setRecipes(recipes || []);
            setTotalRecipes(total);
            
            // Also fetch parent category for breadcrumb
            const category = await categoryApi.getCategoryByPath(categoryPath);
            setCategory(category);
          }
        } else {
          // Fetch category data and its recipes
          const category = await categoryApi.getCategoryByPath(categoryPath);
          if (category) {
            setCategory(category);
            const { recipes, total } = await categoryApi.getRecipesByCategoryPath(
              categoryPath,
              currentPage,
              ITEMS_PER_PAGE
            );
            setRecipes(recipes || []);
            setTotalRecipes(total);

          }
          setSubCategory(null);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [categoryPath, subCategoryPath, currentPage]);

  const totalPages = Math.ceil(totalRecipes / ITEMS_PER_PAGE);

  // Reset to first page when category or subcategory changes
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryPath, subCategoryPath]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb Navigation */}
        <nav className="text-sm mb-8">
          <ol className="flex items-center space-x-2">
            <li>
              <a href="/" className="text-purple-600 hover:text-purple-700">
                {t('nav.home')}
              </a>
            </li>
            {category && (
              <>
                <li className="text-gray-500">/</li>
                <li>
                  <a href={`${category.path}`} className="text-purple-600 hover:text-purple-700">
                    {t(category.nameKey)}
                  </a>
                </li>
              </>
            )}
            {subCategory && (
              <>
                <li className="text-gray-500">/</li>
                <li className="text-gray-600">
                  {t(subCategory.nameKey)}
                </li>
              </>
            )}
          </ol>
        </nav>

        {/* Page Title */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {subCategory ? t(subCategory.nameKey) : category ? t(category.nameKey) : ''}
          </h1>
          <p className="text-gray-600">
            {t('recipe.foundCount', { count: recipes.length })}
          </p>
        </div>

        {/* Recipe Grid */}
        {recipes.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.recipeId} recipe={recipe} />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              {t('recipe.noRecipesFound')}
            </h2>
            <p className="text-gray-600">
              {t('recipe.tryDifferentCategory')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipePage;