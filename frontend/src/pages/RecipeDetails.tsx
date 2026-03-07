import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, Users, Edit, Trash2, ShoppingBasket, ListOrdered, Lightbulb, Timer, UtensilsCrossed, Share2, Minus, Plus, Check } from 'lucide-react';
import { recipeApi } from '../api/recipe.api';
import i18n from '../i18n/i18n';
import { useTranslation } from 'react-i18next';
import { Ingredient } from '../interfaces/Recipe';
import ImageModal from '../components/ImageModal';
import { Category, SubCategory } from '../interfaces/Category';
import { categoryApi } from '../api/category.api';
import { AuthContext } from '../context/AuthContext';
import ConfirmModal from '../components/ConfirmModal';
import RecipeCard from '../components/RecipeCard';
import toast from 'react-hot-toast';

function RecipeDetails() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const [subcategory, setSubcategory] = useState<SubCategory | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [servings, setServings] = useState<number>(1);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());
  const [relatedRecipes, setRelatedRecipes] = useState<any[]>([]);
  const isRTL = i18n.language === 'he';
  const auth = useContext(AuthContext);

  const backPath: string = (location.state as any)?.from || '/recipes';
  const backLabel: string = (location.state as any)?.fromLabel || t('nav.backToRecipes');

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await recipeApi.getRecipeById(id!);
        const recipeData = response.data;
        setRecipe(recipeData);
        setServings(recipeData.servings || 1);

        if (recipeData.category) {
          const categoryResponse = await categoryApi.getCategoryById(recipeData.category);
          setCategory(categoryResponse);

          try {
            const { recipes } = await categoryApi.getRecipesByCategoryPath(categoryResponse.path, 1, 6);
            setRelatedRecipes((recipes || []).filter((r: any) => r.recipeId !== id).slice(0, 4));
          } catch {
            // silently ignore
          }
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
    setShowDeleteConfirm(false);
    const toastId = toast.loading(t('recipe.deleting'));
    try {
      await recipeApi.delete(id!, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      toast.success(t('recipe.deleteSuccess'), { id: toastId });
      navigate('/recipes');
    } catch {
      toast.error(t('recipe.deleteFailed'), { id: toastId });
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: recipe?.name, url }); } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success(t('recipe.linkCopied'));
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

  const scaleAmount = (amount: string): string => {
    const original = recipe?.servings || 1;
    const num = parseFloat(amount);
    if (isNaN(num)) return amount;
    const scaled = (num / original) * servings;
    return Number.isInteger(scaled) ? String(scaled) : scaled.toFixed(1).replace(/\.0$/, '');
  };

  const toggleIngredient = (key: string) => {
    setCheckedIngredients(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-400 border-t-transparent"></div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">{t('recipe.notFound')}</h2>
          <button onClick={() => navigate('/recipes')} className="text-primary-500 hover:text-primary-600 transition-colors font-medium">
            {t('nav.backToRecipes')}
          </button>
        </div>
      </div>
    );
  }

  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

  return (
    <div className="min-h-screen bg-surface">

      {/* ── Hero ─────────────────────────────────────────── */}
      <div className="relative h-[480px] overflow-hidden">
        {recipe.images?.[0]?.link ? (
          <img src={recipe.images[0].link} alt={recipe.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
            <UtensilsCrossed className="w-24 h-24 text-primary-300" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 pt-5">
          <button
            onClick={() => navigate(backPath)}
            className="flex items-center gap-2 text-sm text-white/90 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full transition-all"
          >
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {backLabel}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-sm text-white/90 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full transition-all"
            >
              <Share2 className="w-4 h-4" />
              {t('recipe.share')}
            </button>
            <button
              onClick={() => navigate(`/recipe/edit/${id}`)}
              className="flex items-center gap-1.5 text-sm text-white/90 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full transition-all"
            >
              <Edit className="w-4 h-4" />
              {t('recipe.edit')}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-1.5 text-sm text-white/90 hover:text-white bg-white/10 hover:bg-red-500/60 backdrop-blur-sm px-4 py-2 rounded-full transition-all"
            >
              <Trash2 className="w-4 h-4" />
              {t('recipe.delete')}
            </button>
          </div>
        </div>

        {/* Bottom: title + badges + stats */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-3">
              {category && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-500/80 text-white backdrop-blur-sm">
                  {t(category.nameKey)}
                </span>
              )}
              {subcategory && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm">
                  {t(subcategory.nameKey)}
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">{recipe.name}</h1>

            <div className="flex flex-wrap gap-3">
              {totalTime > 0 && (
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{t('recipe.totalTimeInMin', { time: totalTime })}</span>
                </div>
              )}
              {recipe.prepTime > 0 && (
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
                  <Timer className="w-4 h-4" />
                  <span>{recipe.prepTime} min {t('recipe.prepTime')}</span>
                </div>
              )}
              {recipe.servings > 0 && (
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
                  <Users className="w-4 h-4" />
                  <span>{t('recipe.servingsCount', { count: recipe.servings })}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">

        {/* Image thumbnails */}
        {recipe.images && recipe.images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {recipe.images.map((img: any, idx: number) => (
              <button
                key={idx}
                onClick={() => { setCurrentImageIndex(idx); setIsModalOpen(true); }}
                className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                  currentImageIndex === idx ? 'border-primary-400 ring-2 ring-primary-200' : 'border-transparent hover:border-primary-300'
                }`}
              >
                <img src={img.link} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Video */}
        {recipe.video && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center">
                <span className="text-primary-500 text-sm">▶</span>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">{t('createRecipe.video.title')}</h2>
            </div>
            <video src={recipe.video.link} controls className="w-full rounded-xl" poster={recipe.images?.[0]?.link} controlsList="nodownload">
              {t('createRecipe.video.videoNotSupported')}
            </video>
          </div>
        )}

        {/* Ingredients + Instructions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Ingredients */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-fit lg:sticky lg:top-20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center">
                <ShoppingBasket className="w-4 h-4 text-primary-500" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">{t('recipe.ingredients')}</h2>
            </div>

            {/* Serving size adjuster */}
            {recipe.servings > 0 && (
              <div className="flex items-center gap-3 mb-5 p-3 bg-surface-muted rounded-xl">
                <span className="text-sm text-gray-600 font-medium flex-1">{t('recipe.servings')}</span>
                <button
                  onClick={() => setServings(s => Math.max(1, s - 1))}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-gray-200 hover:border-orange-300 hover:text-orange-500 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-bold text-gray-800 w-5 text-center">{servings}</span>
                <button
                  onClick={() => setServings(s => s + 1)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-gray-200 hover:border-orange-300 hover:text-orange-500 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="space-y-5">
              {recipe.ingredientGroups.map((group: any, groupIndex: number) => (
                <div key={groupIndex}>
                  {group.title && (
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{group.title}</p>
                  )}
                  <ul className="space-y-1">
                    {group.ingredients.map((ingredient: Ingredient, ingIndex: number) => {
                      const key = `${groupIndex}-${ingIndex}`;
                      const checked = checkedIngredients.has(key);
                      return (
                        <li
                          key={key}
                          onClick={() => toggleIngredient(key)}
                          className={`flex items-center gap-2 text-sm cursor-pointer rounded-lg px-2 py-1.5 transition-colors select-none ${
                            checked ? 'opacity-40' : 'hover:bg-surface-muted'
                          }`}
                        >
                          <span className={`w-4 h-4 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition-all ${
                            checked ? 'bg-orange-400 border-orange-400' : 'border-gray-300'
                          }`}>
                            {checked && <Check className="w-2.5 h-2.5 text-white" />}
                          </span>
                          <span className={`text-gray-500 min-w-[3.5rem] ${checked ? 'line-through' : ''}`}>
                            {scaleAmount(ingredient.amount)} {ingredient.unit}
                          </span>
                          <span className={`text-gray-800 font-medium ${checked ? 'line-through' : ''}`}>
                            {ingredient.name}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-accent-50 flex items-center justify-center">
                <ListOrdered className="w-4 h-4 text-accent-500" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">{t('recipe.instructions')}</h2>
            </div>

            <div className="space-y-6">
              {recipe.instructionGroups.map((group: any, groupIndex: number) => (
                <div key={groupIndex}>
                  {group.title && (
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{group.title}</p>
                  )}
                  <ol className="space-y-4">
                    {group.instructions.map((instruction: { content: string }, instIndex: number) => (
                      <li key={`${groupIndex}-${instIndex}`} className="flex gap-4">
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary-100 text-primary-600 text-sm font-bold flex items-center justify-center mt-0.5">
                          {instIndex + 1}
                        </span>
                        <p className="text-gray-700 leading-relaxed pt-0.5">{instruction.content}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tips */}
        {recipe.tips && recipe.tips.filter((tip: string) => tip.trim()).length > 0 && (
          <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-yellow-100 flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-yellow-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">{t('createRecipe.tips.title')}</h2>
            </div>
            <ul className="space-y-3">
              {recipe.tips.filter((tip: string) => tip.trim()).map((tip: string, index: number) => (
                <li key={index} className="flex gap-3 items-start">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-200 text-yellow-700 text-xs font-bold flex items-center justify-center mt-0.5">
                    {index + 1}
                  </span>
                  <p className="text-gray-700 leading-relaxed">{tip}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Related Recipes */}
        {relatedRecipes.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-orange-400 to-pink-400" />
              <h2 className="text-xl font-bold text-gray-800">{t('recipe.relatedRecipes')}</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedRecipes.map((r) => (
                <RecipeCard key={r.recipeId} recipe={r} />
              ))}
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <ImageModal images={recipe.images} currentIndex={currentImageIndex} onClose={() => setIsModalOpen(false)} />
      )}

      {showDeleteConfirm && (
        <ConfirmModal
          message={t('recipe.deleteConfirmation')}
          danger
          confirmLabel={t('recipe.delete')}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
}

export default RecipeDetails;
