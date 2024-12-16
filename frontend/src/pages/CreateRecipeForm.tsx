import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { recipeApi } from "../api/recipe.api";
import RecipeForm from "../components/RecipeForm";

const CreateRecipeForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState([{ name: '', amount: '', unit: '' }]);
  const [instructions, setInstructions] = useState(['']);
  const [images, setImages] = useState<{ data: string; file: File }[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const recipeData = {
        name: formData.get('name'),
        description: formData.get('description'),
        prepTime: Number(formData.get('prepTime')),
        cookTime: Number(formData.get('cookTime')),
        servings: Number(formData.get('servings')),
        ingredients: ingredients.filter(ing => ing.name && ing.amount && ing.unit),
        instructions: instructions.filter(Boolean),
        images: images.map(img => ({
          data: img.data,
          description: ''
        }))
      };

      const response = await recipeApi.createRecipe(recipeData);

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
          <h1 className="text-4xl font-bold text-gray-800 mb-8">{t('createRecipe.title')}</h1>
          <RecipeForm
            onSubmit={handleSubmit}
            loading={loading}
            ingredients={ingredients}
            setIngredients={setIngredients}
            instructions={instructions}
            setInstructions={setInstructions}
            images={images}
            setImages={setImages}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateRecipeForm;