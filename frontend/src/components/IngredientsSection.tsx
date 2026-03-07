import { Plus, Minus, ShoppingBasket, Trash2 } from 'lucide-react';
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

  const inputClass = "w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-colors bg-white text-sm placeholder-gray-400";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center">
            <ShoppingBasket className="w-4 h-4 text-primary-500" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">{t('createRecipe.ingredients.title')}</h2>
        </div>
        <button
          type="button"
          onClick={addIngredientGroup}
          className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-800 font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('createRecipe.ingredients.addGroup')}
        </button>
      </div>

      <div className="space-y-4">
        {ingredientGroups.map((group: IngredientGroup, groupIndex: number) => (
          <div key={groupIndex} className="bg-surface-muted rounded-xl p-5 space-y-3">
            {/* Group header */}
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={group.title}
                onChange={(e) => {
                  const newGroups = [...ingredientGroups];
                  newGroups[groupIndex].title = e.target.value;
                  setIngredientGroups(newGroups);
                }}
                placeholder={t('createRecipe.ingredients.groupTitlePlaceholder')}
                className="flex-1 px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-colors"
              />
              {ingredientGroups.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeIngredientGroup(groupIndex)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Column labels */}
            <div className="flex gap-3 items-center px-1">
              <span className="w-24 text-xs font-medium text-gray-400">{t('createRecipe.ingredients.amountPlaceholder')}</span>
              <span className="w-24 text-xs font-medium text-gray-400">{t('createRecipe.ingredients.unitPlaceholder')}</span>
              <span className="flex-1 text-xs font-medium text-gray-400">{t('createRecipe.ingredients.namePlaceholder')}</span>
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
                <div className="flex gap-3 items-center">
                  <div className="w-24">
                    <input
                      type="text"
                      value={ingredient.amount}
                      onChange={(e) => {
                        const newGroups = [...ingredientGroups];
                        newGroups[groupIndex].ingredients[ingredientIndex].amount = e.target.value;
                        setIngredientGroups(newGroups);
                      }}
                      placeholder="0"
                      className={inputClass}
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
                      placeholder="g / ml"
                      className={inputClass}
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
                      className={inputClass}
                    />
                  </div>
                  {group.ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredientFromGroup(groupIndex, ingredientIndex)}
                      className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            />

            <button
              type="button"
              onClick={() => addIngredientToGroup(groupIndex)}
              className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-800 font-medium transition-colors pt-1"
            >
              <Plus className="w-3.5 h-3.5" />
              {t('createRecipe.ingredients.addToGroup')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IngredientsSection;