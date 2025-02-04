  import { useEffect, useState } from "react";
  import { useTranslation } from "react-i18next";
  import { useNavigate } from "react-router-dom";
  import { recipeApi } from "../api/recipe.api";
  import RecipeForm from "../components/RecipeForm";
  import { Category, SubCategory } from "../interfaces/Category";
  import { categoryApi } from "../api/category.api";
  import { ArrowLeft, ArrowRight } from "lucide-react";
  import i18n from "../i18n/i18n";
import { Ingredient, IngredientGroup, InstructionGroup } from "../interfaces/Recipe";

function CreateRecipeForm() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const isRTL = i18n.language === 'he';
  // const [ingredients, setIngredients] = useState([{ name: '', amount: '', unit: '' }]);
  // const [instructions, setInstructions] = useState(['']);
  const [images, setImages] = useState<{ data: string; file: File }[]>([]);
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
      const recipeData = {
        name: formData.get('name'),
        prepTime: Number(formData.get('prepTime')),
        cookTime: Number(formData.get('cookTime')),
        servings: Number(formData.get('servings')),
        category: selectedCategory,
        subcategory: selectedSubCategory,
        ingredientGroups: ingredientGroups.filter(group => 
          group.ingredients.some((ing: Ingredient) => ing.name && ing.amount)
        ),
        instructionGroups: instructionGroups.map(group => ({
          title: group.title,
          instructions: group.instructions
            .filter(inst => inst.content.trim())
            .map(inst => ({ content: inst.content }))
        })),
        images: images.map(img => ({
          data: img.data,
          description: ''
        }))
      };

      const response = await recipeApi.createRecipe(recipeData);
      console.log('response:', response.data);
      if (response.data) {
        navigate(`/recipe/${response.data._id}`);
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
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-4">
            <button
              onClick={() => navigate('/recipes')}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors p-2 rounded-lg hover:bg-purple-50"
            >
              {isRTL ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
              <span>{t('nav.backToRecipes')}</span>
            </button>
          </div>
          <h1 className="text-center text-4xl font-bold text-gray-800 mb-8">{t('createRecipe.title')}</h1>
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
          />
        </div>
      </div>
    </div>
  );
};

export default CreateRecipeForm;