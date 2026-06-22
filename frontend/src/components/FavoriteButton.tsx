import { useContext } from 'react';
import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FavoritesContext } from '../context/FavoritesContext';

interface FavoriteButtonProps {
  recipeId: string;
  className?: string;
}

/** Heart toggle for favoriting a recipe. Stops propagation so it works on clickable cards. */
function FavoriteButton({ recipeId, className = '' }: FavoriteButtonProps) {
  const favorites = useContext(FavoritesContext);
  const { t } = useTranslation();
  if (!favorites) return null;

  const active = favorites.isFavorite(recipeId);

  return (
    <button
      type="button"
      aria-label={active ? t('recipe.removeFavorite') : t('recipe.favorite')}
      title={active ? t('recipe.removeFavorite') : t('recipe.favorite')}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        favorites.toggleFavorite(recipeId);
      }}
      className={`flex items-center justify-center transition-all ${className}`}
    >
      <Heart className={`w-5 h-5 transition-all ${active ? 'fill-terracotta text-terracotta' : ''}`} />
    </button>
  );
}

export default FavoriteButton;
