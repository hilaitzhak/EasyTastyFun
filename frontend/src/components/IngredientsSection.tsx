
import { Plus, Minus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { IngredientGroup, IngredientsProps } from '../interfaces/Recipe';
import SortableList from './SortableList';

function IngredientsSection({ ingredientGroups, setIngredientGroups }: IngredientsProps) {
  const { t } = useTranslation();

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
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100/50 p-8 transition-all hover:shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-extrabold text-gray-900">
          {t('createRecipe.ingredients.title')}
        </h2>
        <button
          type="button"
          onClick={addIngredientGroup}
          className="flex items-center gap-2 text-orange-600 hover:text-orange-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('createRecipe.ingredients.addGroup')}
        </button>
      </div>

      <div className="space-y-6">
        {ingredientGroups.map((group: IngredientGroup, groupIndex: number) => (
          <div key={groupIndex} className="bg-orange-50 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={group.title}
                onChange={(e) => {
                  const newGroups = [...ingredientGroups];
                  newGroups[groupIndex].title = e.target.value;
                  setIngredientGroups(newGroups);
                }}
                placeholder={t('createRecipe.ingredients.groupTitlePlaceholder')}
                className="font-semibold text-lg px-4 py-2 rounded-xl border-2 border-orange-200 focus:border-orange-400 focus:outline-none transition-colors"
              />
              {ingredientGroups.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeIngredientGroup(groupIndex)}
                  className="p-2 text-red-500 hover:text-red-600 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
              )}
            </div>

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
                      className="w-full px-3 py-2 rounded-lg border-2 border-orange-200 focus:border-orange-400 focus:outline-none transition-colors"
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
                      className="w-full px-3 py-2 rounded-lg border-2 border-orange-200 focus:border-orange-400 focus:outline-none transition-colors"
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
                      className="w-full px-3 py-2 rounded-lg border-2 border-orange-200 focus:border-orange-400 focus:outline-none transition-colors"
                    />
                  </div>
                  {group.ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredientFromGroup(groupIndex, ingredientIndex)}
                      className="p-2 text-red-500 hover:text-red-600 transition-colors"
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
              className="flex items-center gap-2 text-orange-600 hover:text-orange-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {t('createRecipe.ingredients.addToGroup')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IngredientsSection;