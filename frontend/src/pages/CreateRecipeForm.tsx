import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { getApiErrorKey } from "../utils/apiError";
import ConfirmModal from "../components/ConfirmModal";
import { recipeApi } from "../api/recipe.api";
import RecipeForm from "../components/RecipeForm";
import { Category, SubCategory } from "../interfaces/Category";
import { categoryApi } from "../api/category.api";
import { ArrowLeft, ArrowRight, Camera, ChefHat } from "lucide-react";
import i18n from "../i18n/i18n";
import { Ingredient, IngredientGroup, InstructionGroup } from "../interfaces/Recipe";
import { AuthContext } from "../context/AuthContext";

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
  const scanInputRef = useRef<HTMLInputElement>(null);
  const auth = useContext(AuthContext);

  // Mark form dirty on any user input
  useEffect(() => { setIsDirty(true); }, [images, video, ingredientGroups, instructionGroups, tips, selectedCategory, selectedSubCategory]);

  // Warn on browser close/refresh
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

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

  const handleScanImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('createRecipe.imageSizeError'));
      return;
    }

    setScanning(true);
    const toastId = toast.loading(t('createRecipe.scan.scanning'));

    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const { data } = await recipeApi.extractFromImage(base64);

      // Auto-fill all sections
      setScannedInitialData({
        name: data.name,
        prepTime: data.prepTime ?? undefined,
        cookTime: data.cookTime ?? undefined,
        servings: data.servings ?? undefined,
      });
      setBasicInfoKey(k => k + 1);

      if (data.ingredientGroups?.length) {
        setIngredientGroups(data.ingredientGroups);
      }
      if (data.instructionGroups?.length) {
        setInstructionGroups(data.instructionGroups);
      }
      if (data.tips?.length) {
        setTips(data.tips);
      }

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

  const doCreateRecipe = async (recipeData: any) => {
    try {
      const response = await recipeApi.createRecipe(recipeData, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      if (response.data) {
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
    <div className="min-h-screen bg-surface">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center shadow-sm">
                <ChefHat className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">
                {t('createRecipe.title')}
              </h1>
            </div>
            <button
              onClick={() => navigate('/recipes')}
              className="group flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors duration-200"
            >
              {isRTL ? (
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              ) : (
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              )}
              <span>{t('nav.backToRecipes')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">

        {/* Scan Recipe Banner */}
        <div className="bg-gradient-to-r from-orange-50 to-pink-50 border border-orange-100 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-800 mb-0.5">{t('createRecipe.scan.title')}</h3>
            <p className="text-sm text-gray-500">{t('createRecipe.scan.description')}</p>
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
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-orange-400 to-pink-400 shadow-sm hover:shadow-md hover:from-orange-500 hover:to-pink-500 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
          >
            <Camera className="w-4 h-4" />
            {scanning ? t('createRecipe.scan.scanning') : t('createRecipe.scan.button')}
          </button>
        </div>

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
