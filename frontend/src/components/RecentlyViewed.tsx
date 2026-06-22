import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import RecipeCard from './RecipeCard';
import { getRecentlyViewed, RecentRecipe } from '../utils/recentlyViewed';

function RecentlyViewed() {
  const { t } = useTranslation();
  const [recipes, setRecipes] = useState<RecentRecipe[]>([]);

  useEffect(() => {
    setRecipes(getRecentlyViewed());
  }, []);

  if (recipes.length === 0) return null;

  return (
    <div className="py-12 bg-paper">
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-xl bg-terracotta-light flex items-center justify-center">
            <Clock className="w-5 h-5 text-terracotta" />
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-ink">{t('recentlyViewed.title')}</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {recipes.slice(0, 4).map((recipe) => (
            <RecipeCard key={recipe.recipeId} recipe={recipe as any} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default RecentlyViewed;
