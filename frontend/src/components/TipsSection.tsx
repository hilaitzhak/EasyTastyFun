import { Plus, Minus, Lightbulb } from 'lucide-react';
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
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-yellow-50 flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-yellow-500" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">{t('createRecipe.tips.title')}</h2>
        </div>
        <button
          type="button"
          onClick={addTip}
          className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-800 font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('createRecipe.tips.addTip')}
        </button>
      </div>

      <SortableList
        items={tips}
        setItems={setTips}
        renderItem={(tip: string, index: number) => (
          <div className="flex gap-3 items-center">
            <span className="w-5 h-5 flex-shrink-0 rounded-full bg-yellow-100 text-yellow-600 text-xs font-bold flex items-center justify-center">
              {index + 1}
            </span>
            <input
              type="text"
              value={tip}
              onChange={(e) => {
                const newTips = [...tips];
                newTips[index] = e.target.value;
                setTips(newTips);
              }}
              placeholder={t('createRecipe.tips.tipPlaceholder')}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-colors placeholder-gray-400"
            />
            {tips.length > 1 && (
              <button
                type="button"
                onClick={() => removeTip(index)}
                className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      />
    </div>
  );
}

export default TipsSection;