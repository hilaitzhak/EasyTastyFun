import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Minus, Upload, Loader, ArrowLeft, ArrowRight } from 'lucide-react';
import { recipeApi } from '../api/recipe.api';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n/i18n';

const EditRecipe = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [recipe, setRecipe] = useState<any>(null);
  const [ingredients, setIngredients] = useState([{ name: '', amount: '', unit: '' }]);
  const [instructions, setInstructions] = useState(['']);
  const [images, setImages] = useState<{ data: string; file: File }[]>([]);
  const isRTL = i18n.language === 'he';

  // Fetch recipe data
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await recipeApi.getById(id!);
        const recipeData = response.data;
        setRecipe(recipeData);
        setIngredients(recipeData.ingredients);
        setInstructions(recipeData.instructions);
        setImages(recipeData.images.map((img: any) => ({ data: img.data, file: new File([], "placeholder") })));
      } catch (error) {
        console.error('Error fetching recipe:', error);
        alert(t('editRecipe.loadError'));
        navigate('/recipes');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, navigate, t]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(t('createRecipe.imageSizeError'));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, {
          data: reader.result as string,
          file
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '', unit: '' }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const addInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const removeInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData(e.currentTarget);
      const updatedRecipe = {
        name: formData.get('name'),
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

      await recipeApi.update(id!, updatedRecipe);
      navigate(`/recipe/${id}`);
    } catch (error) {
      console.error('Error updating recipe:', error);
      alert('Failed to update recipe');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => navigate(`/recipe/${id}`)}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
            >
              { isRTL ? (<ArrowRight className="w-5 h-5" />) : (<ArrowLeft className="w-5 h-5" />) }
              {t('editRecipe.backToRecipe')}
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">{t('editRecipe.title')}</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info Section */}
            <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">{t('createRecipe.basicInfo.name.label')}</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={recipe.name}
                  required
                  placeholder={t('createRecipe.basicInfo.name.placeholder')}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">{t('recipe.prepTime')}</label>
                  <input
                    type="number"
                    name="prepTime"
                    defaultValue={recipe.prepTime}
                    min="0"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">{t('recipe.cookTime')}</label>
                  <input
                    type="number"
                    name="cookTime"
                    defaultValue={recipe.cookTime}
                    min="0"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">{t('recipe.servings')}</label>
                  <input
                    type="number"
                    name="servings"
                    defaultValue={recipe.servings}
                    min="0"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Images Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('createRecipe.images.title')}</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-purple-500">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="mt-2 text-gray-500">Add more images</span>
                    <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
                  </label>
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative rounded-lg overflow-hidden">
                        <img
                          src={image.data}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Ingredients Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">{t('recipe.ingredients')}</h2>
                <button
                  type="button"
                  onClick={addIngredient}
                  className="flex items-center gap-2 text-purple-600 hover:text-purple-700"
                >
                  <Plus className="w-4 h-4" />
                  {t('createRecipe.ingredients.add')}
                </button>
              </div>

              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-4 items-start mb-4">
                  <div className="w-24">
                    <input
                      type="text"
                      value={ingredient.amount}
                      onChange={(e) => {
                        const newIngredients = [...ingredients];
                        newIngredients[index].amount = e.target.value;
                        setIngredients(newIngredients);
                      }}
                      placeholder={t('createRecipe.ingredients.amountPlaceholder')}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="w-24">
                    <input
                      type="text"
                      value={ingredient.unit}
                      onChange={(e) => {
                        const newIngredients = [...ingredients];
                        newIngredients[index].unit = e.target.value;
                        setIngredients(newIngredients);
                      }}
                      placeholder={t('createRecipe.ingredients.unitPlaceholder')}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={ingredient.name}
                      onChange={(e) => {
                        const newIngredients = [...ingredients];
                        newIngredients[index].name = e.target.value;
                        setIngredients(newIngredients);
                      }}
                      placeholder={t('createRecipe.ingredients.namePlaceholder')}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="p-2 text-red-500 hover:text-red-600"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Instructions Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">Instructions</h2>
                <button
                  type="button"
                  onClick={addInstruction}
                  className="flex items-center gap-2 text-purple-600 hover:text-purple-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Step
                </button>
              </div>

              {instructions.map((instruction, index) => (
                <div key={index} className="flex gap-4 items-start mb-4">
                  <span className="mt-3 text-gray-500 font-medium">{index + 1}.</span>
                  <div className="flex-1">
                    <textarea
                      value={instruction}
                      onChange={(e) => {
                        const newInstructions = [...instructions];
                        newInstructions[index] = e.target.value;
                        setInstructions(newInstructions);
                      }}
                      placeholder={`Step ${index + 1}`}
                      rows={2}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  {instructions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeInstruction(index)}
                      className="p-2 text-red-500 hover:text-red-600"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate(`/recipe/${id}`)}
                className="px-8 py-3 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-3 rounded-full hover:from-purple-700 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    {t('editRecipe.savingChanges')}
                  </>
                ) : (
                  t('editRecipe.saveChanges')
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditRecipe;