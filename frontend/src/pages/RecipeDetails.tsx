import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Users, Edit, Trash2, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { recipeApi } from '../api/recipe.api';
import i18n from '../i18n/i18n';
import { useTranslation } from 'react-i18next';
import { Ingredient } from '../interfaces/Recipe';
import ImageModal from '../components/ImageModal';
import { Category, SubCategory } from '../interfaces/Category';
import { categoryApi } from '../api/category.api';
import { AuthContext } from '../context/AuthContext';

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
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await recipeApi.getRecipeById(id!);
        const recipeData = response.data;
        setRecipe(recipeData);
        
        if (recipeData.category) {
          const categoryResponse = await categoryApi.getCategoryById(recipeData.category);
          setCategory(categoryResponse);
        }

        if (recipeData.subcategory) {
          const subcategoryResponse = await categoryApi.getSubcategoryById(recipeData.subcategory);
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
    if (!window.confirm(t('recipe.deleteConfirmation'))) return;

    try {
      await recipeApi.delete(id!, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      navigate('/recipes');
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert(t('recipe.deleteFailed'));
    }
  };

  const handleImageNavigation = (e: React.MouseEvent, direction: 'next' | 'prev') => {
    e.stopPropagation();
    if (direction === 'next') {
      setCurrentImageIndex((prev) => prev === recipe.images.length - 1 ? 0 : prev + 1);
    } else {
      setCurrentImageIndex((prev) => prev === 0 ? recipe.images.length - 1 : prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta"></div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-ink mb-4">{t('recipe.notFound')}</h2>
          <button onClick={() => navigate('/recipes')} className="text-terracotta hover:text-terracotta-dark transition-colors">
            {t('nav.backToRecipes')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper py-8">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="relative h-80 overflow-hidden mb-8 rounded-2xl">
          <img
            src={recipe.images?.[0]?.link || '/placeholder-recipe.jpg'}
            alt={recipe.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-7xl mx-auto px-6 pb-6 w-full">
              <button
                onClick={() => navigate('/recipes')}
                className="mb-4 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-white hover:bg-white/30 transition-all flex items-center gap-2"
              >
                {isRTL ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
                {t('nav.backToRecipes')}
              </button>
              
              <div className="text-white">
                <div className="mb-3 flex gap-2">
                  {category && (
                    <span className="inline-block bg-terracotta px-3 py-1 rounded-full text-sm font-medium">
                      {t(category.nameKey)}
                    </span>
                  )}
                  {subcategory && (
                    <span className="inline-block bg-terracotta px-3 py-1 rounded-full text-sm font-medium">
                      {t(subcategory.nameKey)}
                    </span>
                  )}
                </div>
                <h1 className="font-display text-3xl md:text-4xl font-bold">{recipe.name}</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-8xl mx-auto">
          {/* Recipe Info & Actions */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex gap-6 text-ink-soft">
              {recipe.prepTime > 0 && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-olive" />
                  <span>{t('recipe.totalTimeInMin', { time: recipe.prepTime + recipe.cookTime })}</span>
                </div>
              )}
              {recipe.servings > 0 && (
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-olive" />
                  <span>{t('recipe.servingsCount', { count: recipe.servings })}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/recipe/edit/${id}`)}
                className="relative group p-2 text-ink-soft hover:text-terracotta transition-colors"
                title={t('recipe.edit')}
              >
                <Edit className="w-5 h-5" />
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {t('recipe.edit')}
                </span>
              </button>
              <button
                onClick={handleDelete}
                className="relative group p-2 text-ink-soft hover:text-red-500 transition-colors"
                title={t('recipe.delete')}
              >
                <Trash2 className="w-5 h-5" />
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {t('recipe.delete')}
                </span>
              </button>
            </div>
          </div>

          {/* Images Gallery & Video */}
          {(recipe.images && recipe.images.length > 0) || recipe.video ? (
            <div className={`mb-8 ${recipe.images && recipe.images.length > 0 && recipe.video ? 'grid grid-cols-2 gap-6' : ''}`}>
              {/* Images Gallery */}
              {recipe.images && recipe.images.length > 0 && (
                <div>
                  <h2 className="font-display text-xl font-semibold text-ink mb-4">{t('createRecipe.images.title')}</h2>
                  <div className="relative rounded-2xl overflow-hidden">
                    <div className="w-full h-64 bg-terracotta-light cursor-pointer" onClick={() => setIsModalOpen(true)}>
                      <img
                        src={recipe.images[currentImageIndex]?.link}
                        alt={recipe.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {recipe.images.length > 1 && (
                      <>
                        <button
                          onClick={(e) => handleImageNavigation(e, 'prev')}
                          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => handleImageNavigation(e, 'next')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                          {currentImageIndex + 1} / {recipe.images.length}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Video */}
              {recipe.video && (
                <div>
                  <h2 className="font-display text-xl font-semibold text-ink mb-4">Video</h2>
                  <div className="rounded-2xl overflow-hidden">
                    <video
                      src={recipe.video.link}
                      controls
                      className="w-full h-64 rounded-2xl"
                      poster={recipe.images?.[0]?.data}
                      controlsList="nodownload"
                    >
                      {t('createRecipe.video.videoNotSupported')}
                    </video>
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {/* Ingredients */}
          <div className="bg-surface rounded-2xl border border-line p-6 mb-6 shadow-card">
            <h2 className="font-display text-xl font-semibold text-ink mb-4">{t('recipe.ingredients')}</h2>

            {recipe.ingredientGroups.map((group: any, groupIndex: number) => (
              <div key={groupIndex} className="mb-4 last:mb-0">
                {group.title && (
                  <h3 className="text-md font-medium text-ink-soft mb-2 border-b border-line pb-1">
                    {group.title}
                  </h3>
                )}
                <div className="space-y-1">
                  {group.ingredients.map((ingredient: Ingredient, ingIndex: number) => (
                    <div key={`${groupIndex}-${ingIndex}`} className="flex items-center gap-3 py-1">
                      <span className="text-sm text-ink-soft min-w-20">
                        {ingredient.amount} {ingredient.unit}
                      </span>
                      <span className="text-ink">{ingredient.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Instructions */}
          <div className="bg-surface rounded-2xl border border-line p-6 mb-6 shadow-card">
            <h2 className="font-display text-xl font-semibold text-ink mb-4">{t('recipe.instructions')}</h2>

            {recipe.instructionGroups.map((group: any, groupIndex: number) => (
              <div key={groupIndex} className="mb-4 last:mb-0">
                {group.title && (
                  <h3 className="text-md font-medium text-ink-soft mb-2 border-b border-line pb-1">
                    {group.title}
                  </h3>
                )}
                <ol className="space-y-3">
                  {group.instructions.map((instruction: { content: string }, instIndex: number) => (
                    <li key={`${groupIndex}-${instIndex}`} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-terracotta-light text-terracotta-dark rounded-full flex items-center justify-center text-sm font-semibold">
                        {instIndex + 1}
                      </span>
                      <p className="text-ink-soft leading-relaxed text-sm">{instruction.content}</p>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>

          {/* Tips */}
          {recipe.tips && recipe.tips.length > 0 && (
            <div className="bg-surface rounded-2xl border border-line p-6 shadow-card">
              <h2 className="font-display text-xl font-semibold text-ink mb-4">{t('createRecipe.tips.title')}</h2>

              <ul className="space-y-3">
                {recipe.tips.map((tip: string, index: number) => (
                  <li key={index} className="flex gap-3 items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-terracotta-light text-terracotta-dark rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </span>
                    <p className="text-ink-soft leading-relaxed text-sm">{tip}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {isModalOpen && (
          <ImageModal
            images={recipe.images}
            currentIndex={currentImageIndex}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default RecipeDetails;