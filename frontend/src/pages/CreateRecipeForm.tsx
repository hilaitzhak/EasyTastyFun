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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50">
      {/* Modern Header with Glass Effect */}
      <div className="sticky top-0 z-10 backdrop-blur-md bg-white/80 border-b border-orange-100/50 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/recipes')}
                  className="group flex items-center gap-3 px-4 py-2 rounded-xl bg-white/70 hover:bg-white shadow-sm hover:shadow-md transition-all duration-200 border border-orange-100"
                >
                  {isRTL ? (
                    <ArrowRight className="w-5 h-5 text-orange-500 group-hover:translate-x-1 transition-transform duration-200" />
                  ) : (
                    <ArrowLeft className="w-5 h-5 text-orange-500 group-hover:-translate-x-1 transition-transform duration-200" />
                  )}
                  <span className="font-medium text-gray-700">{t('nav.backToRecipes')}</span>
                </button>
                
                <div className="hidden sm:block w-px h-8 bg-orange-200"></div>
                
                <div className="flex items-center space-x-3 gap-4">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-orange-400 to-pink-400 shadow-md">
                    <ChefHat className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
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
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Modern Card Container */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
            <div className="p-8">
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
        </div>
      </div>
    </div>
  );
};

export default CreateRecipeForm;