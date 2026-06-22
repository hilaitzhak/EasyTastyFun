import { useContext, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import UnsavedChangesPrompt from "../components/UnsavedChangesPrompt";
import { getApiErrorKey } from "../utils/apiError";
import ConfirmModal from "../components/ConfirmModal";
import { recipeApi } from "../api/recipe.api";
import RecipeForm from "../components/RecipeForm";
import { Category, SubCategory } from "../interfaces/Category";
import { categoryApi } from "../api/category.api";
import { ArrowLeft, ArrowRight, Camera, ChefHat, Sparkles } from "lucide-react";
import i18n from "../i18n/i18n";
import { Ingredient, IngredientGroup, InstructionGroup } from "../interfaces/Recipe";
import { AuthContext } from "../context/AuthContext";
import { fileToScaledBase64 } from "../utils/image";

function CreateRecipeForm() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const isRTL = i18n.language === 'he';
  const [images, setImages] = useState<{ data: string; file: File }[]>([]);
  const [video, setVideo] = useState<{ link: string } | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
  const [filteredSubcategories, setFilteredSubcategories] = useState<SubCategory[]>([]);
  const [ingredientGroups, setIngredientGroups] = useState<IngredientGroup[]>([
    {
      title: '',
      ingredients: [{ name: '', amount: '', unit: '' }]
    }
  ]);
  const [instructionGroups, setInstructionGroups] = useState<InstructionGroup[]>([
    { title: '', instructions: [{ content: '' }] }
  ]);
  const [tips, setTips] = useState<string[]>(['']);
  const [pendingRecipeData, setPendingRecipeData] = useState<any>(null);
  const [similarMessage, setSimilarMessage] = useState<string>('');
  const [isDirty, setIsDirty] = useState(false);
  const [scannedInitialData, setScannedInitialData] = useState<any>(undefined);
  const [basicInfoKey, setBasicInfoKey] = useState(0);
  const [genPrompt, setGenPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const scanInputRef = useRef<HTMLInputElement>(null);
  const auth = useContext(AuthContext);

  // Mark form dirty on any user input — but skip the initial mount so an
  // untouched form doesn't trigger the unsaved-changes warning.
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) { isInitialMount.current = false; return; }
    setIsDirty(true);
  }, [images, video, ingredientGroups, instructionGroups, tips, selectedCategory, selectedSubCategory]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: categoryData } = await categoryApi.getCategories();
        setCategories(categoryData);

        const subcategoryData = await categoryApi.getAllSubCategories();
        setSubcategories(subcategoryData);
      } catch (error) {
        console.error('Error fetching categories or subcategories:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const filtered = subcategories.filter(sub => sub.categoryId === selectedCategory);
      setFilteredSubcategories(filtered);
    } else {
      setFilteredSubcategories([]);
    }
  }, [selectedCategory, subcategories]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleSubCategoryChange = (subCategoryId: string) => {
    setSelectedSubCategory(subCategoryId);
  };

  // Build the category list (translated) so the AI can classify the recipe.
  const buildCategoryGuide = () => categories.map((c) => ({
    id: c.id,
    name: t(c.nameKey),
    subCategories: subcategories
      .filter((s) => s.categoryId === c.id)
      .map((s) => ({ id: s.id, name: t(s.nameKey) })),
  }));

  // Fill all form sections from an AI-produced recipe object (scan or generate).
  const fillFormFromData = (data: any) => {
    setScannedInitialData({
      name: data.name,
      prepTime: data.prepTime ?? undefined,
      cookTime: data.cookTime ?? undefined,
      servings: data.servings ?? undefined,
    });
    setBasicInfoKey(k => k + 1);

    if (data.ingredientGroups?.length) setIngredientGroups(data.ingredientGroups);
    if (data.instructionGroups?.length) setInstructionGroups(data.instructionGroups);
    if (data.tips?.length) setTips(data.tips);

    if (data.categoryId && categories.some((c) => c.id === data.categoryId)) {
      setSelectedCategory(data.categoryId);
      if (data.subCategoryId && subcategories.some((s) => s.id === data.subCategoryId && s.categoryId === data.categoryId)) {
        setSelectedSubCategory(data.subCategoryId);
      }
    }
  };

  const handleScanImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanning(true);
    const toastId = toast.loading(t('createRecipe.scan.scanning'));

    try {
      // Downscale/compress so large phone photos fit and read better.
      const base64 = await fileToScaledBase64(file);

      const { data } = await recipeApi.extractFromImage(base64, buildCategoryGuide());

      fillFormFromData(data);

      // Detect missing fields and alert the user
      const missing: string[] = [];
      if (!data.name) missing.push(t('createRecipe.scan.fields.name'));
      if (data.prepTime == null) missing.push(t('createRecipe.scan.fields.prepTime'));
      if (data.cookTime == null) missing.push(t('createRecipe.scan.fields.cookTime'));
      if (data.servings == null) missing.push(t('createRecipe.scan.fields.servings'));
      const hasIngredients = data.ingredientGroups?.some((g: any) => g.ingredients?.length > 0);
      if (!hasIngredients) missing.push(t('createRecipe.scan.fields.ingredients'));
      const hasInstructions = data.instructionGroups?.some((g: any) => g.instructions?.length > 0);
      if (!hasInstructions) missing.push(t('createRecipe.scan.fields.instructions'));

      if (missing.length > 0) {
        toast.success(t('createRecipe.scan.successWithMissing', { fields: missing.join(', ') }), { id: toastId, duration: 6000 });
      } else {
        toast.success(t('createRecipe.scan.success'), { id: toastId });
      }
    } catch (error: any) {
      toast.error(t('createRecipe.scan.error'), { id: toastId });
    } finally {
      setScanning(false);
      // Reset input so the same file can be re-selected if needed
      if (scanInputRef.current) scanInputRef.current.value = '';
    }
  };

  const handleGenerate = async () => {
    if (!genPrompt.trim()) return;
    setGenerating(true);
    const toastId = toast.loading(t('createRecipe.generate.generating'));
    try {
      const { data } = await recipeApi.generate(genPrompt.trim(), i18n.language, buildCategoryGuide());
      fillFormFromData(data);
      toast.success(t('createRecipe.generate.success'), { id: toastId });
    } catch {
      toast.error(t('createRecipe.generate.error'), { id: toastId });
    } finally {
      setGenerating(false);
    }
  };

  const doCreateRecipe = async (recipeData: any) => {
    try {
      const response = await recipeApi.createRecipe(recipeData, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      if (response.data) {
        // Clear the dirty flag synchronously so the success navigation isn't
        // intercepted by the unsaved-changes prompt.
        flushSync(() => setIsDirty(false));
        navigate(`/recipe/${response.data.recipeId}`);
      }
    } catch (error: any) {
      toast.error(t(getApiErrorKey(error)));
    } finally {
      setLoading(false);
      setPendingRecipeData(null);
      setSimilarMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const allIngredients = ingredientGroups
      .flatMap(group => group.ingredients)
      .map(ing => ing.name)
      .filter(name => name.trim());

    const recipeDataBase = {
      name: formData.get('name'),
      prepTime: Number(formData.get('prepTime')),
      cookTime: Number(formData.get('cookTime')),
      servings: Number(formData.get('servings')),
      category: selectedCategory,
      ingredientGroups: ingredientGroups.filter(group =>
        group.ingredients.some((ing: Ingredient) => ing.name || ing.amount || ing.unit)
      ),
      instructionGroups: instructionGroups.map(group => ({
        title: group.title,
        instructions: group.instructions.filter(inst => inst.content.trim()).map(inst => ({ content: inst.content }))
      })),
      images: images.map(img => ({ data: img.data })),
      video: video || null,
      tips: tips.filter(tip => tip.trim())
    };

    const recipeData: any = {
      ...recipeDataBase,
      ...(selectedSubCategory ? { subcategory: selectedSubCategory } : {})
    };
    if (!recipeData.subcategory) delete recipeData.subcategory;

    try {
      const similarRecipesResponse = await recipeApi.checkSimilarRecipes(allIngredients);
      if (similarRecipesResponse.data.length > 0) {
        setPendingRecipeData(recipeData);
        setSimilarMessage(t('createRecipe.similarRecipesFound', {
          count: similarRecipesResponse.data.length,
          recipes: similarRecipesResponse.data.map((r: any) => r.name).join(', ')
        }));
        setLoading(false);
        return;
      }
    } catch {
      // if similarity check fails, proceed anyway
    }

    await doCreateRecipe(recipeData);
  };

  return (
    <div className="min-h-screen bg-paper">
      <UnsavedChangesPrompt when={isDirty} />
      {/* Modern Header with Glass Effect */}
      <div className="sticky top-0 z-10 backdrop-blur-md bg-surface border-b border-line shadow-soft">
      <div className="max-w-8xl mx-auto px-6 w-full py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/recipes')}
                  className="group flex items-center gap-3 px-4 py-2 rounded-xl bg-surface hover:bg-terracotta-light shadow-soft hover:shadow-card transition-all duration-200 border border-line"
                >
                  {isRTL ? (
                    <ArrowRight className="w-5 h-5 text-terracotta group-hover:translate-x-1 transition-transform duration-200" />
                  ) : (
                    <ArrowLeft className="w-5 h-5 text-terracotta group-hover:-translate-x-1 transition-transform duration-200" />
                  )}
                  <span className="font-medium text-ink">{t('nav.backToRecipes')}</span>
                </button>

                <div className="hidden sm:block w-px h-8 bg-line"></div>

                <div className="flex items-center space-x-3 gap-4">
                  <div className="p-2 rounded-xl bg-terracotta shadow-card">
                    <ChefHat className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="font-display text-2xl md:text-3xl font-bold text-terracotta">
                      {t('createRecipe.title')}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-8xl mx-auto px-6 w-full">
        <div className="max-w-7xl mx-auto py-4 space-y-6">

          {/* Scan Recipe Banner */}
          <div className="bg-terracotta-light border border-line rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <h3 className="text-base font-semibold text-ink mb-0.5">{t('createRecipe.scan.title')}</h3>
              <p className="text-sm text-ink-soft">{t('createRecipe.scan.description')}</p>
            </div>
            <input
              ref={scanInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleScanImage}
            />
            <button
              type="button"
              disabled={scanning}
              onClick={() => scanInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-terracotta hover:bg-terracotta-dark shadow-soft hover:shadow-card transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
            >
              <Camera className="w-4 h-4" />
              {scanning ? t('createRecipe.scan.scanning') : t('createRecipe.scan.button')}
            </button>
          </div>

          {/* AI Generate Banner */}
          <div className="bg-surface border border-line rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-terracotta" />
              <h3 className="text-base font-semibold text-ink">{t('createRecipe.generate.title')}</h3>
            </div>
            <p className="text-sm text-ink-soft mb-3">{t('createRecipe.generate.description')}</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={genPrompt}
                onChange={(e) => setGenPrompt(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleGenerate(); } }}
                placeholder={t('createRecipe.generate.placeholder')}
                className="flex-1 px-4 py-2.5 rounded-xl border border-line focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-transparent bg-paper text-sm"
              />
              <button
                type="button"
                disabled={generating || !genPrompt.trim()}
                onClick={handleGenerate}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-terracotta hover:bg-terracotta-dark shadow-soft transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4" />
                {generating ? t('createRecipe.generate.generating') : t('createRecipe.generate.button')}
              </button>
            </div>
          </div>

          {/* Modern Card Container */}
          <div className="bg-surface backdrop-blur-sm rounded-3xl shadow-card border border-line overflow-hidden">
            <div className="p-8">
              <RecipeForm
                onSubmit={handleSubmit}
                loading={loading}
                isEdit={false}
                initialData={scannedInitialData}
                basicInfoKey={basicInfoKey}
                ingredientGroups={ingredientGroups}
                setIngredientGroups={setIngredientGroups}
                instructionGroups={instructionGroups}
                setInstructionGroups={setInstructionGroups}
                images={images}
                setImages={setImages}
                categories={categories}
                subcategories={filteredSubcategories}
                onCategoryChange={handleCategoryChange}
                onSubCategoryChange={handleSubCategoryChange}
                selectedCategory={selectedCategory}
                selectedSubCategory={selectedSubCategory}
                tips={tips}
                setTips={setTips}
                video={video}
                setVideo={setVideo}
              />
            </div>
          </div>
        </div>
      </div>
      {similarMessage && pendingRecipeData && (
        <ConfirmModal
          message={similarMessage}
          onConfirm={() => doCreateRecipe(pendingRecipeData)}
          onCancel={() => { setSimilarMessage(''); setPendingRecipeData(null); }}
        />
      )}
    </div>
  );
};

export default CreateRecipeForm;
