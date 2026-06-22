import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { userApi } from '../api/user.api';

interface FavoritesContextProps {
  ids: Set<string>;
  isFavorite: (recipeId: string) => boolean;
  toggleFavorite: (recipeId: string) => void;
}

export const FavoritesContext = createContext<FavoritesContextProps | null>(null);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const auth = useContext(AuthContext);
  const [ids, setIds] = useState<Set<string>>(new Set());

  // Load the user's favorite ids whenever they log in/out.
  useEffect(() => {
    if (!auth?.token) {
      setIds(new Set());
      return;
    }
    userApi
      .getFavoriteIds(auth.token)
      .then(({ data }) => setIds(new Set(data)))
      .catch(() => { /* ignore — favorites are non-critical */ });
  }, [auth?.token]);

  const isFavorite = (recipeId: string) => ids.has(recipeId);

  const toggleFavorite = async (recipeId: string) => {
    if (!auth?.token) return;
    const willAdd = !ids.has(recipeId);

    // Optimistic update for instant feedback.
    setIds((prev) => {
      const next = new Set(prev);
      if (willAdd) next.add(recipeId);
      else next.delete(recipeId);
      return next;
    });

    try {
      if (willAdd) await userApi.addFavorite(recipeId, auth.token);
      else await userApi.removeFavorite(recipeId, auth.token);
    } catch {
      // Revert on failure.
      setIds((prev) => {
        const next = new Set(prev);
        if (willAdd) next.delete(recipeId);
        else next.add(recipeId);
        return next;
      });
    }
  };

  return (
    <FavoritesContext.Provider value={{ ids, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
