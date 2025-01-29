import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { IngredientGroup, IngredientsProps } from '../interfaces/Recipe';
import SortableList from './SortableList';

function IngredientsSection({ ingredientGroups, setIngredientGroups }: IngredientsProps) {
  const { t } = useTranslation();

  // const addIngredient = () => {
  //   setIngredients([...ingredients, { name: '', amount: '', unit: '' }]);
  // };

  // const removeIngredient = (index: number) => {
  //   setIngredients(ingredients.filter((_, i) => i !== index));
  // };

    
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

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          {t('createRecipe.ingredients.title')}
        </h2>
        <button
          type="button"
          onClick={() => addIngredientGroup()}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700"
        >
          <Plus className="w-4 h-4" />
          {t('createRecipe.ingredients.addGroup')}
        </button>
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
  );
};

export default IngredientsSection;