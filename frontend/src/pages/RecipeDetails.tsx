import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Users, Edit, Trash2, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { recipeApi } from '../api/recipe.api';
import i18n from '../i18n/i18n';
import { useTranslation } from 'react-i18next';
import { Ingredient } from '../interfaces/Recipe';
import ImageModal from '../components/ImageModal';
import { Category, SubCategory } from '../interfaces/Category';
import { categoryApi } from '../api/category.api';

function RecipeDetails() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const [subcategory, setSubcategory] = useState<SubCategory | null>(null);
  const isRTL = i18n.language === 'he';

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await recipeApi.getById(id!);
        const recipeData = response.data;
        setRecipe(recipeData);
        if (recipeData.category) {
          console.log('recipeData: ', recipeData)
          const categoryResponse = await categoryApi.getCategoryById(recipeData.category);
          console.log('categoryResponse: ', categoryResponse)
          setCategory(categoryResponse);
        }
  
        if (recipeData.subcategory) {
          const subcategoryResponse = await categoryApi.getSubcategoryById(recipeData.subcategory);
          console.log('subcategoryResponse: ', subcategoryResponse)
          setSubcategory(subcategoryResponse);
        }
      } catch (error) {
        console.error('Error fetching recipe:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm(t('recipe.deleteConfirmation'))) {
      return;
    }

    try {
      await recipeApi.delete(id!);
      navigate('/recipes');
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert(t('recipe.deleteFailed'));
    }
  };

  const handleImageNavigation = (e: React.MouseEvent, direction: 'next' | 'prev') => {
    e.stopPropagation(); // Prevent modal from opening when clicking navigation buttons
    if (direction === 'next') {
      nextImage();
    } else {
      previousImage();
    }
  };

  const nextImage = () => {
    if (recipe?.images?.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === recipe.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const previousImage = () => {
    if (recipe?.images?.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? recipe.images.length - 1 : prev - 1
      );
    }
  };

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('recipe.notFound')}</h2>
          <button
            onClick={() => navigate('/recipes')}
            className="text-purple-600 hover:text-purple-700 transition-colors"
          >
            {t('nav.backToRecipes')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 py-8">
      <div className="container mx-auto px-4">
        {/* Navigation and Actions */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate('/recipes')}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
          >
            { isRTL ? (<ArrowRight className="w-5 h-5" />) : (<ArrowLeft className="w-5 h-5" />) }
            {t('nav.backToRecipes')}
          </button>
          
          <div className="flex gap-4">
            <button
              onClick={() => navigate(`/recipe/edit/${id}`)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              {t('recipe.edit')}
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              {t('recipe.delete')}
            </button>
          </div>
        </div>

        {/* Recipe Title */}
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{recipe.name}</h1>
          {category && subcategory && (
            <p className="text-gray-600 mb-8">
              {t(category.nameKey)} {'>'} {t(subcategory.nameKey)}
            </p>
          )}

          {(recipe.prepTime > 0 || recipe?.cookTime > 0 || recipe.servings > 0) && (
            <div className="flex gap-6 text-gray-600 mb-8">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{t('recipe.totalTimeInMin', { time: recipe.prepTime + recipe.cookTime })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>{t('recipe.servingsCount', { count: recipe.servings })}</span>
              </div>
            </div>
          )}

          {recipe.images && recipe.images.length > 0 && (
            <div className="relative mb-8 rounded-2xl overflow-hidden">
              <div className="w-full h-[32rem] bg-gray-100 cursor-pointer" onClick={handleImageClick}>
                <img
                  src={recipe.images[currentImageIndex].data}
                  alt={recipe.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {recipe.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => handleImageNavigation(e, 'prev')}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={(e) => handleImageNavigation(e, 'next')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
          )}

          {isModalOpen && (
            <ImageModal
              images={recipe.images}
              currentIndex={currentImageIndex}
              onClose={handleModalClose}
            />
          )}

          {/* Ingredients */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('recipe.ingredients')}</h2>
            
            {recipe.ingredientGroups.map((group: any, groupIndex: number) => (
              <div key={groupIndex} className="mb-6">
                {group.title && (
                  <h3 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">
                    {group.title}
                  </h3>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {group.ingredients.map((ingredient: Ingredient, ingIndex: number) => (
                    <li 
                      key={`${groupIndex}-${ingIndex}`} 
                      className="flex items-center gap-3 border-b border-gray-100 py-2 list-none"
                    >
                      <span className="text-gray-600">
                        {t('recipe.ingredientAmount', { 
                          amount: ingredient.amount, 
                          unit: ingredient.unit 
                        })}
                      </span>
                      <span className="text-gray-800">{ingredient.name}</span>
                    </li>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('recipe.instructions')}</h2>
            
            {recipe.instructionGroups.map((group: any, groupIndex: number) => (
              <div key={groupIndex} className="mb-6">
                {group.title && (
                  <h3 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">
                    {group.title}
                  </h3>
                )}
                <ol className="space-y-4">
                  {group.instructions.map((instruction: { content: string }, instIndex: number) => (
                    <li 
                      key={`${groupIndex}-${instIndex}`} 
                      className="flex gap-4"
                    >
                      <span className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-semibold">
                        {instIndex + 1}
                      </span>
                      <p className="text-gray-700 leading-relaxed">{instruction.content}</p>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;