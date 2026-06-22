import { useTranslation } from 'react-i18next';
import { getDifficulty } from '../utils/difficulty';

const STYLES: Record<string, string> = {
  easy: 'bg-green-100 text-green-700',
  medium: 'bg-amber-100 text-amber-700',
  hard: 'bg-red-100 text-red-700',
};

function DifficultyBadge({ recipe, className = '' }: { recipe: any; className?: string }) {
  const { t } = useTranslation();
  // Need enough data to estimate; skip on slim cards without ingredient/step info.
  if (!recipe?.ingredientGroups && !recipe?.instructionGroups && !recipe?.prepTime && !recipe?.cookTime) {
    return null;
  }
  const level = getDifficulty(recipe);
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${STYLES[level]} ${className}`}>
      {t(`difficulty.${level}`)}
    </span>
  );
}

export default DifficultyBadge;
