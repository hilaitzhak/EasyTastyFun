import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { recipeApi } from "../api/recipe.api";
import RecipeForm from "../components/RecipeForm";
import { Category, SubCategory } from "../interfaces/Category";
import { categoryApi } from "../api/category.api";
import { ArrowLeft, ArrowRight, ChefHat } from "lucide-react";
import i18n from "../i18n/i18n";
import { Ingredient, IngredientGroup, InstructionGroup } from "../interfaces/Recipe";
import { AuthContext } from "../context/AuthContext";

function CreateRecipeForm() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
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
  const auth = useContext(AuthContext);

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
      // Filter subcategories where categoryId matches the selected category
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      // Extract all ingredients for similarity check
      const allIngredients = ingredientGroups
        .flatMap(group => group.ingredients)
        .map(ing => ing.name)
        .filter(name => name.trim()); // Filter out empty ingredients

      // Check for similar recipes first
      const similarRecipesResponse = await recipeApi.checkSimilarRecipes(allIngredients);

      if (similarRecipesResponse.data.length > 0) {
        const confirmed = window.confirm(
          t('createRecipe.similarRecipesFound', {
            count: similarRecipesResponse.data.length,
            recipes: similarRecipesResponse.data.map((r: any) => r.name).join(', ')
          })
        );

        if (!confirmed) {
          setLoading(false);
          return;
        }
      }

      // If confirmed or no similar recipes, proceed with recipe creation
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
          instructions: group.instructions
            .filter(inst => inst.content.trim())
            .map(inst => ({ content: inst.content }))
        })),
        images: images.map(img => ({
          data: img.data,
        })),
        video: video || null,
        tips: tips.filter(tip => tip.trim())
      };

      const recipeData = {
        ...recipeDataBase,
        ...(selectedSubCategory && selectedSubCategory !== '' ? { subcategory: selectedSubCategory } : {})
      };

      if (!recipeData.subcategory || recipeData.subcategory === '') {
        delete recipeData.subcategory;
      }

      const response = await recipeApi.createRecipe(recipeData, {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      });

      console.log('response.data:', response.data);
      if (response.data) {
        navigate(`/recipe/${response.data.recipeId}`);
      }
    } catch (error: any) {
      if (error.response) {
        alert(t('createRecipe.errors.serverError', {
          message: error.response.data.message || error.response.statusText
        }));
      } else if (error.request) {
        alert(t('createRecipe.errors.connectionError'));
      } else {
        alert(t('createRecipe.errors.createError', { message: error.message }));
      }
    } finally {
      setLoading(false);
    }
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
      <div className="max-w-4xl mx-auto px-6 py-8">
        <RecipeForm
          onSubmit={handleSubmit}
          loading={loading}
          isEdit={false}
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
  );
};

export default CreateRecipeForm;