import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { IngredientsProps } from '../interfaces/Recipe';

function IngredientsSection({ ingredients, setIngredients }: IngredientsProps) {
  const { t } = useTranslation();

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '', unit: '' }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          {t('createRecipe.ingredients.title')}
        </h2>
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
  );
};

export default IngredientsSection;