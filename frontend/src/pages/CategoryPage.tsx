import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { categoryApi } from '../api/category.api';
import { IRecipe } from '../interfaces/Recipe';
import { RecipeCard } from '../components/RecipeCard';
import { Category, SubCategory } from '../interfaces/Category';

const CategoryPage: React.FC = () => {
  const { categoryPath = '', subCategoryPath = '' } = useParams<{ categoryPath: string; subCategoryPath?: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [subCategory, setSubCategory] = useState<SubCategory | null>(null);
  const [recipes, setRecipes] = useState<IRecipe[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (subCategoryPath) {
          const subCategoryData = await categoryApi.getSubCategoryByPath(categoryPath, subCategoryPath);
          if (subCategoryData) {
            setSubCategory(subCategoryData);
            const recipeData = await categoryApi.getRecipesBySubCategory(subCategoryData._id);
            setRecipes(recipeData);
          } else {
            setSubCategory(null);
          }
        } else {
          const categoryData = await categoryApi.getCategoryByPath(categoryPath);
          setCategory(categoryData);
          if (categoryData && categoryData.subCategories.length > 0) {
            const matchingSubCategory = categoryData.subCategories.find((sc: SubCategory) => sc.path === subCategoryPath);
            setSubCategory(matchingSubCategory || null);
          } else {
            setSubCategory(null);
          }
          const recipeData = await categoryApi.getRecipesByCategory(categoryData._id);
          setRecipes(recipeData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [categoryPath, subCategoryPath]);

  return (
    <div className="container mx-auto py-8">
      {subCategory ? (
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{t(`${subCategory.nameKey}`)}</h1>
        </div>
      ) : category ? (
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{t(`${category.nameKey}`)}</h1>
        </div>
      ) : null}

      {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div> */}
    </div>
  );
};

export default CategoryPage;