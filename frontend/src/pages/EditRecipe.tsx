import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Minus, Upload, Loader, ArrowLeft, ArrowRight, GripVertical } from 'lucide-react';
import { recipeApi } from '../api/recipe.api';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n/i18n';
import SortableList from '../components/SortableList';
import { Ingredient, IngredientGroup, InstructionGroup } from '../interfaces/Recipe';
import { arrayMove } from '@dnd-kit/sortable';
import InstructionsSection from '../components/InstructionsSection';

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
  const [ingredientGroups, setIngredientGroups] = useState<IngredientGroup[]>([
    {
      title: '',
      ingredients: [{ name: '', amount: '', unit: '' }]
    }
  ]);
  const [instructionGroups, setInstructionGroups] = useState<InstructionGroup[]>([
    { title: '', instructions: [{ content: '' }] }
  ]);
  
  const addInstructionGroup = () => {
    setInstructionGroups([...instructionGroups, { title: '', instructions: [{ content: '' }] }]);
  };
  
  const removeInstructionGroup = (groupIndex: number) => {
    setInstructionGroups(instructionGroups.filter((_, i) => i !== groupIndex));
  };
  
  const addInstructionToGroup = (groupIndex: number) => {
    const newGroups = [...instructionGroups];
    newGroups[groupIndex].instructions.push( { content: '' });
    setInstructionGroups(newGroups);
  };
  
  const removeInstructionFromGroup = (groupIndex: number, instructionIndex: number) => {
    const newGroups = [...instructionGroups];
    newGroups[groupIndex].instructions = newGroups[groupIndex].instructions.filter(
      (_: any, i: number) => i !== instructionIndex
    );
    setInstructionGroups(newGroups);
  };
  
  const addIngredientGroup = () => {
    setIngredientGroups([...ingredientGroups, {
      title: '',
      ingredients: [{ name: '', amount: '', unit: '' }]
    }]);
  };
  
  const removeIngredientGroup = (groupIndex: number) => {
    setIngredientGroups(ingredientGroups.filter((_, i) => i !== groupIndex));
  };
  
  const addIngredientToGroup = (groupIndex: number) => {
    const newGroups = [...ingredientGroups];
    newGroups[groupIndex].ingredients.push({ name: '', amount: '', unit: '' });
    setIngredientGroups(newGroups);
  };
  
  const removeIngredientFromGroup = (groupIndex: number, ingredientIndex: number) => {
    const newGroups = [...ingredientGroups];
    newGroups[groupIndex].ingredients = newGroups[groupIndex].ingredients.filter((_, i) => i !== ingredientIndex);
    setIngredientGroups(newGroups);
  };
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
        ingredientGroups,
        instructionGroups,
        images: images.map(img => ({
          data: img.data,
          description: ''
        }))
      };
      console.log('Frontend Updated Recipe:', updatedRecipe);

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
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => addIngredientGroup()}
                    className="flex items-center gap-2 text-purple-600 hover:text-purple-700"
                  >
                    <Plus className="w-4 h-4" />
                    {t('createRecipe.ingredients.addGroup')}
                  </button>
                </div>
              </div>

              <SortableList 
                items={ingredientGroups}
                setItems={setIngredientGroups}
                renderItem={(group: IngredientGroup, groupIndex: number) => (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <input
                        type="text"
                        value={group.title}
                        onChange={(e) => {
                          const newGroups = [...ingredientGroups];
                          newGroups[groupIndex].title = e.target.value;
                          setIngredientGroups(newGroups);
                        }}
                        placeholder={t('createRecipe.ingredients.groupTitlePlaceholder')}
                        className="font-semibold text-lg px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      {ingredientGroups.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeIngredientGroup(groupIndex)}
                          className="p-2 text-red-500 hover:text-red-600"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="pl-4 space-y-4">
                      <SortableList
                        items={group.ingredients}
                        setItems={(newIngredients) => {
                          const newGroups = [...ingredientGroups];
                          newGroups[groupIndex].ingredients = newIngredients;
                          setIngredientGroups(newGroups);
                        }}
                        groupId={`group-${groupIndex}`}
                        renderItem={(ingredient, ingredientIndex) => (
                          <div className="flex gap-4 items-start">
                            <div className="w-24">
                              <input
                                type="text"
                                value={ingredient.amount}
                                onChange={(e) => {
                                  const newGroups = [...ingredientGroups];
                                  newGroups[groupIndex].ingredients[ingredientIndex].amount = e.target.value;
                                  setIngredientGroups(newGroups);
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
                                  const newGroups = [...ingredientGroups];
                                  newGroups[groupIndex].ingredients[ingredientIndex].unit = e.target.value;
                                  setIngredientGroups(newGroups);
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
                                  const newGroups = [...ingredientGroups];
                                  newGroups[groupIndex].ingredients[ingredientIndex].name = e.target.value;
                                  setIngredientGroups(newGroups);
                                }}
                                placeholder={t('createRecipe.ingredients.namePlaceholder')}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                            {group.ingredients.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeIngredientFromGroup(groupIndex, ingredientIndex)}
                                className="p-2 text-red-500 hover:text-red-600"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => addIngredientToGroup(groupIndex)}
                        className="flex items-center gap-2 text-purple-600 hover:text-purple-700 ml-4"
                      >
                        <Plus className="w-4 h-4" />
                        {t('createRecipe.ingredients.addToGroup')}
                      </button>
                    </div>
                  </div>
                )}
              />
            </div>

            {/* Instructions Section */}
            <InstructionsSection instructionGroups={instructionGroups} setInstructionGroups={setInstructionGroups}/>

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