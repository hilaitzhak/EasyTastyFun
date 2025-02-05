import { Plus, Minus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SortableList from './SortableList';
import { TipsSectionProps } from '../interfaces/Recipe';

function TipsSection({ tips, setTips }: TipsSectionProps) {
  const { t } = useTranslation();

  const addTip = () => {
    setTips([...tips, '']);
  };

  const removeTip = (index: number) => {
    setTips(tips.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-purple-100/50 p-8 transition-all hover:shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-extrabold text-gray-900">
          {t('createRecipe.tips.title')}
        </h2>
        <button
          type="button"
          onClick={addTip}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('createRecipe.tips.addTip')}
        </button>
      </div>

      <div className="space-y-4">
        <SortableList
          items={tips}
          setItems={setTips}
          renderItem={(tip: string, index: number) => (
            <div className="flex gap-4 items-start">
              <div className="flex-1">
                <input
                  type="text"
                  value={tip}
                  onChange={(e) => {
                    const newTips = [...tips];
                    newTips[index] = e.target.value;
                    setTips(newTips);
                  }}
                  placeholder={t('createRecipe.tips.tipPlaceholder')}
                  className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none transition-colors"
                />
              </div>
              {tips.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTip(index)}
                  className="p-2 text-red-500 hover:text-red-600 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        />
      </div>
    </div>
  );
}

export default TipsSection;