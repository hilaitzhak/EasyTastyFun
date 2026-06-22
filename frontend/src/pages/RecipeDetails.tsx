import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, Users, Edit, Trash2, ShoppingBasket, ListOrdered, Lightbulb, Timer, UtensilsCrossed, Share2, Minus, Plus, Check, Repeat, X, Sparkles, Printer, StickyNote, Wine, Calculator, Ruler } from 'lucide-react';
import { recipeApi } from '../api/recipe.api';
import { userApi } from '../api/user.api';
import i18n from '../i18n/i18n';
import { useTranslation } from 'react-i18next';
import { Ingredient } from '../interfaces/Recipe';
import ImageModal from '../components/ImageModal';
import { Category, SubCategory } from '../interfaces/Category';
import { categoryApi } from '../api/category.api';
import { AuthContext } from '../context/AuthContext';
import ConfirmModal from '../components/ConfirmModal';
import RecipeCard from '../components/RecipeCard';
import FavoriteButton from '../components/FavoriteButton';
import DifficultyBadge from '../components/DifficultyBadge';
import ChatAssistant from '../components/ChatAssistant';
import UnitConverter from '../components/UnitConverter';
import PanScaler from '../components/PanScaler';
import { addRecentlyViewed } from '../utils/recentlyViewed';
import { NotesContext } from '../context/NotesContext';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';

interface Substitution { name: string; ratio: string; note: string; }

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
  const [subFor, setSubFor] = useState<string | null>(null);
  const [substitutions, setSubstitutions] = useState<Substitution[]>([]);
  const [subLoading, setSubLoading] = useState(false);
  const [note, setNote] = useState('');
  const [savedNote, setSavedNote] = useState('');
  const [noteSaving, setNoteSaving] = useState(false);
  const [pairingOpen, setPairingOpen] = useState(false);
  const [pairings, setPairings] = useState<{ name: string; note: string }[]>([]);
  const [pairingLoading, setPairingLoading] = useState(false);
  const [converterOpen, setConverterOpen] = useState(false);
  const [showPanScaler, setShowPanScaler] = useState(false);
  const [panFactor, setPanFactor] = useState(1);
  const isRTL = i18n.language === 'he';
  const auth = useContext(AuthContext);
  const notes = useContext(NotesContext);

  const backPath: string = (location.state as any)?.from || '/recipes';
  const backLabel: string = (location.state as any)?.fromLabel || t('nav.backToRecipes');

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await recipeApi.getRecipeById(id!);
        const recipeData = response.data;
        setRecipe(recipeData);
        setServings(recipeData.servings || 1);
        addRecentlyViewed(recipeData);

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

  // Load the user's personal note for this recipe.
  useEffect(() => {
    if (!auth?.token || !id) return;
    userApi
      .getNote(id, auth.token)
      .then(({ data }) => { setNote(data.note || ''); setSavedNote(data.note || ''); })
      .catch(() => { /* ignore */ });
  }, [id, auth?.token]);

  const handlePrint = () => window.print();

  const openPairing = async () => {
    setPairingOpen(true);
    setPairings([]);
    setPairingLoading(true);
    try {
      const flatIngredients = (recipe.ingredientGroups || [])
        .flatMap((g: any) => (g.ingredients || []).map((i: any) => i.name))
        .filter(Boolean)
        .join(', ');
      const { data } = await recipeApi.getPairing(recipe.name, flatIngredients, i18n.language);
      setPairings(data.pairings || []);
    } catch {
      toast.error(t('recipe.pairingError'));
      setPairingOpen(false);
    } finally {
      setPairingLoading(false);
    }
  };

  const saveNote = async () => {
    if (!auth?.token || !id) return;
    setNoteSaving(true);
    try {
      await userApi.setNote(id, note, auth.token);
      setSavedNote(note);
      notes?.markNote(id, !!note.trim());
      toast.success(t('recipe.noteSaved'));
    } catch {
      toast.error(t('recipe.noteError'));
    } finally {
      setNoteSaving(false);
    }
  };

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
    const scaled = (num / original) * servings * panFactor;
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

  const openSubstitutions = async (ingredientName: string) => {
    setSubFor(ingredientName);
    setSubstitutions([]);
    setSubLoading(true);
    try {
      const { data } = await recipeApi.getSubstitutions(ingredientName, recipe?.name || '', i18n.language);
      setSubstitutions(data.substitutions || []);
    } catch {
      toast.error(t('recipe.substitutionsError'));
      setSubFor(null);
    } finally {
      setSubLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-terracotta border-t-transparent"></div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-ink mb-4">{t('recipe.notFound')}</h2>
          <button onClick={() => navigate('/recipes')} className="text-terracotta hover:text-terracotta-dark transition-colors font-medium">
            {t('nav.backToRecipes')}
          </button>
        </div>
      </div>
    );
  }

  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

  return (
    <div className="min-h-screen bg-paper">

      {/* ── Hero ─────────────────────────────────────────── */}
      <div className="relative h-[480px] overflow-hidden print:hidden">
        {recipe.images?.[0]?.link ? (
          <img src={recipe.images[0].link} alt={recipe.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-terracotta-light flex items-center justify-center">
            <UtensilsCrossed className="w-24 h-24 text-olive" />
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
            <FavoriteButton
              recipeId={recipe.recipeId}
              className="w-9 h-9 rounded-full text-white/90 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm"
            />
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-sm text-white/90 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full transition-all"
            >
              <Share2 className="w-4 h-4" />
              {t('recipe.share')}
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 text-sm text-white/90 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full transition-all"
            >
              <Printer className="w-4 h-4" />
              {t('recipe.print')}
            </button>
            <button
              onClick={openPairing}
              className="flex items-center gap-1.5 text-sm text-white/90 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full transition-all"
            >
              <Wine className="w-4 h-4" />
              {t('recipe.pairing')}
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
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-terracotta/80 text-white backdrop-blur-sm">
                  {t(category.nameKey)}
                </span>
              )}
              {subcategory && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm">
                  {t(subcategory.nameKey)}
                </span>
              )}
              <DifficultyBadge recipe={recipe} />
            </div>

            <h1 className="font-display text-3xl md:text-5xl font-bold text-white leading-tight mb-4">{recipe.name}</h1>

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
                  <span>{t('recipe.serves', { count: recipe.servings })}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">

        {/* Print-only title (the image hero is hidden when printing) */}
        <div className="hidden print:flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-ink mb-1">{recipe.name}</h1>
            <p className="text-sm text-ink-soft">
              {[category && t(category.nameKey), subcategory && t(subcategory.nameKey), totalTime > 0 && t('recipe.totalTimeInMin', { time: totalTime }), recipe.servings > 0 && t('recipe.serves', { count: recipe.servings })].filter(Boolean).join(' · ')}
            </p>
          </div>
          <div className="text-center flex-shrink-0">
            <QRCodeSVG value={typeof window !== 'undefined' ? window.location.href : ''} size={84} />
            <p className="text-[10px] text-ink-muted mt-1">{t('recipe.scanToOpen')}</p>
          </div>
        </div>


        {/* Image thumbnails */}
        {recipe.images && recipe.images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-1 print:hidden">
            {recipe.images.map((img: any, idx: number) => (
              <button
                key={idx}
                onClick={() => { setCurrentImageIndex(idx); setIsModalOpen(true); }}
                className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                  currentImageIndex === idx ? 'border-terracotta ring-2 ring-terracotta-light' : 'border-transparent hover:border-terracotta'
                }`}
              >
                <img src={img.link} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Video */}
        {recipe.video && (
          <div className="bg-surface rounded-2xl border border-line shadow-card p-6 print:hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-terracotta-light flex items-center justify-center">
                <span className="text-terracotta text-sm">▶</span>
              </div>
              <h2 className="font-display text-lg font-semibold text-ink">{t('createRecipe.video.title')}</h2>
            </div>
            <video src={recipe.video.link} controls className="w-full rounded-xl" poster={recipe.images?.[0]?.link} controlsList="nodownload">
              {t('createRecipe.video.videoNotSupported')}
            </video>
          </div>
        )}

        {/* Ingredients + Instructions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Ingredients */}
          <div className="bg-surface rounded-2xl border border-line shadow-card p-6 h-fit lg:sticky lg:top-20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-terracotta-light flex items-center justify-center">
                <ShoppingBasket className="w-4 h-4 text-terracotta" />
              </div>
              <h2 className="font-display text-lg font-semibold text-ink">{t('recipe.ingredients')}</h2>
            </div>

            {/* Serving size adjuster */}
            {recipe.servings > 0 && (
              <div className="flex items-center gap-3 mb-5 p-3 bg-terracotta-light rounded-xl print:hidden">
                <span className="text-sm text-ink-soft font-medium flex-1">{t('recipe.forHowMany')}</span>
                <button
                  onClick={() => setServings(s => Math.max(1, s - 1))}
                  data-tooltip={t('common.decrease')}
                  aria-label={t('common.decrease')}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-surface border border-line hover:border-terracotta hover:text-terracotta transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-bold text-ink w-5 text-center">{servings}</span>
                <button
                  onClick={() => setServings(s => s + 1)}
                  data-tooltip={t('common.increase')}
                  aria-label={t('common.increase')}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-surface border border-line hover:border-terracotta hover:text-terracotta transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Kitchen tools: unit converter + pan-size scaler */}
            <div className="flex gap-2 mb-4 print:hidden">
              <button
                onClick={() => setConverterOpen(true)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-line text-xs font-medium text-ink-soft hover:border-terracotta hover:text-terracotta transition-colors"
              >
                <Calculator className="w-3.5 h-3.5" />
                {t('converter.title')}
              </button>
              <button
                onClick={() => setShowPanScaler(v => !v)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-medium transition-colors ${
                  showPanScaler ? 'border-terracotta text-terracotta bg-terracotta-light' : 'border-line text-ink-soft hover:border-terracotta hover:text-terracotta'
                }`}
              >
                <Ruler className="w-3.5 h-3.5" />
                {t('panScaler.title')}
              </button>
            </div>
            {showPanScaler && <div className="mb-4 print:hidden"><PanScaler onFactorChange={setPanFactor} /></div>}

            <div className="space-y-5">
              {recipe.ingredientGroups.map((group: any, groupIndex: number) => (
                <div key={groupIndex}>
                  {group.title && (
                    <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-2">{group.title}</p>
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
                            checked ? 'opacity-40' : 'hover:bg-terracotta-light'
                          }`}
                        >
                          <span className={`w-4 h-4 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition-all ${
                            checked ? 'bg-terracotta border-terracotta' : 'border-line'
                          }`}>
                            {checked && <Check className="w-2.5 h-2.5 text-white" />}
                          </span>
                          <span className={`text-ink-soft min-w-[3.5rem] ${checked ? 'line-through' : ''}`}>
                            {scaleAmount(ingredient.amount)} {ingredient.unit}
                          </span>
                          <span className={`text-ink font-medium ${checked ? 'line-through' : ''}`}>
                            {ingredient.name}
                          </span>
                          <button
                            onClick={(e) => { e.stopPropagation(); openSubstitutions(ingredient.name); }}
                            data-tooltip={t('recipe.substitute')}
                            aria-label={t('recipe.substitute')}
                            className={`${isRTL ? 'mr-auto' : 'ml-auto'} flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-lg text-ink-muted hover:text-terracotta hover:bg-terracotta-light transition-colors print:hidden`}
                          >
                            <Repeat className="w-3.5 h-3.5" />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="lg:col-span-2 bg-surface rounded-2xl border border-line shadow-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-terracotta-light flex items-center justify-center">
                <ListOrdered className="w-4 h-4 text-olive" />
              </div>
              <h2 className="font-display text-lg font-semibold text-ink">{t('recipe.instructions')}</h2>
            </div>

            <div className="space-y-6">
              {recipe.instructionGroups.map((group: any, groupIndex: number) => (
                <div key={groupIndex}>
                  {group.title && (
                    <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-3">{group.title}</p>
                  )}
                  <ol className="space-y-4">
                    {group.instructions.map((instruction: { content: string }, instIndex: number) => (
                      <li key={`${groupIndex}-${instIndex}`} className="flex gap-4">
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-terracotta-light text-terracotta-dark text-sm font-bold flex items-center justify-center mt-0.5">
                          {instIndex + 1}
                        </span>
                        <p className="text-ink-soft leading-relaxed pt-0.5">{instruction.content}</p>
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
              <h2 className="font-display text-lg font-semibold text-ink">{t('createRecipe.tips.title')}</h2>
            </div>
            <ul className="space-y-3">
              {recipe.tips.filter((tip: string) => tip.trim()).map((tip: string, index: number) => (
                <li key={index} className="flex gap-3 items-start">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-200 text-yellow-700 text-xs font-bold flex items-center justify-center mt-0.5">
                    {index + 1}
                  </span>
                  <p className="text-ink-soft leading-relaxed">{tip}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Personal notes */}
        {auth?.user && (
          <div className="bg-surface rounded-2xl border border-line shadow-card p-6 print:hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-terracotta-light flex items-center justify-center">
                <StickyNote className="w-4 h-4 text-terracotta" />
              </div>
              <h2 className="font-display text-lg font-semibold text-ink">{t('recipe.myNotes')}</h2>
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t('recipe.notesPlaceholder')}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-line focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-transparent bg-paper text-sm text-ink-soft resize-y"
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={saveNote}
                disabled={noteSaving || note === savedNote}
                className="px-5 py-2 rounded-xl font-semibold text-sm text-white bg-terracotta hover:bg-terracotta-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {noteSaving ? t('common.loading') : t('recipe.saveNote')}
              </button>
            </div>
          </div>
        )}

        {/* Related Recipes */}
        {relatedRecipes.length > 0 && (
          <div className="print:hidden">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-6 rounded-full bg-terracotta" />
              <h2 className="font-display text-xl font-bold text-ink">{t('recipe.relatedRecipes')}</h2>
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

      {/* AI substitutions modal */}
      {subFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSubFor(null)} />
          <div className="relative bg-surface rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-terracotta" />
                <h3 className="font-display text-lg font-semibold text-ink">{t('recipe.substitutesFor', { ingredient: subFor })}</h3>
              </div>
              <button onClick={() => setSubFor(null)} data-tooltip={t('common.close')} aria-label={t('common.close')} className="text-ink-muted hover:text-ink p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {subLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-terracotta border-t-transparent" />
              </div>
            ) : substitutions.length === 0 ? (
              <p className="text-ink-soft text-sm py-6 text-center">{t('recipe.noSubstitutions')}</p>
            ) : (
              <ul className="space-y-3 mt-4">
                {substitutions.map((sub, idx) => (
                  <li key={idx} className="bg-paper rounded-xl border border-line p-3">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-semibold text-ink">{sub.name}</span>
                      <span className="text-xs text-terracotta-dark font-medium whitespace-nowrap">{sub.ratio}</span>
                    </div>
                    {sub.note && <p className="text-sm text-ink-soft mt-1 leading-snug">{sub.note}</p>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Drink pairing modal */}
      {pairingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setPairingOpen(false)} />
          <div className="relative bg-surface rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Wine className="w-5 h-5 text-terracotta" />
                <h3 className="font-display text-lg font-semibold text-ink">{t('recipe.pairingTitle')}</h3>
              </div>
              <button onClick={() => setPairingOpen(false)} data-tooltip={t('common.close')} aria-label={t('common.close')} className="text-ink-muted hover:text-ink p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            {pairingLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-terracotta border-t-transparent" />
              </div>
            ) : (
              <ul className="space-y-3 mt-4">
                {pairings.map((p, idx) => (
                  <li key={idx} className="bg-paper rounded-xl border border-line p-3">
                    <span className="font-semibold text-ink">{p.name}</span>
                    {p.note && <p className="text-sm text-ink-soft mt-1 leading-snug">{p.note}</p>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {converterOpen && <UnitConverter onClose={() => setConverterOpen(false)} />}

      {/* Ask-the-chef floating chat */}
      <ChatAssistant recipeId={recipe.recipeId} recipeName={recipe.name} />
    </div>
  );
}

export default RecipeDetails;
