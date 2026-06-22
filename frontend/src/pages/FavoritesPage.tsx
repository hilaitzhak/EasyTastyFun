import { useContext, useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../api/user.api';
import { AuthContext } from '../context/AuthContext';
import { FavoritesContext } from '../context/FavoritesContext';
import RecipeCard from '../components/RecipeCard';
import RecipeCardSkeleton from '../components/RecipeCardSkeleton';

function FavoritesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const favorites = useContext(FavoritesContext);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Re-fetch when the set of favorite ids changes (e.g. unfavorite on this page).
  const favCount = favorites?.ids.size ?? 0;

  useEffect(() => {
    if (!auth?.token) return;
    setLoading(true);
    userApi
      .getFavorites(auth.token)
      .then(({ data }) => setRecipes(data || []))
      .catch(() => setRecipes([]))
      .finally(() => setLoading(false));
  }, [auth?.token, favCount]);

  return (
    <div className="min-h-screen bg-paper">
      <div className="bg-terracotta-light border-b border-line px-6 py-10">
        <div className="max-w-6xl mx-auto flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-terracotta flex items-center justify-center shadow-md flex-shrink-0">
            <Heart className="w-7 h-7 text-white fill-white" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-ink">{t('nav.favorites')}</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {Array.from({ length: 5 }).map((_, i) => <RecipeCardSkeleton key={i} />)}
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-line mx-auto mb-4" />
            <p className="text-ink-soft text-lg mb-6">{t('favorites.empty')}</p>
            <button
              onClick={() => navigate('/recipes')}
              className="px-6 py-2.5 rounded-xl font-semibold text-sm text-white bg-terracotta hover:bg-terracotta-dark transition-colors"
            >
              {t('nav.allRecipes')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {recipes.map((r) => <RecipeCard key={r.recipeId} recipe={r} />)}
          </div>
        )}
      </div>
    </div>
  );
}

export default FavoritesPage;
