// Tracks the recipes the user recently opened, in localStorage (no backend).

const KEY = 'recently_viewed';
const MAX = 8;

// Keep only the fields RecipeCard needs, so we can render without a fetch.
export interface RecentRecipe {
  recipeId: string;
  name: string;
  images?: { link: string }[];
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  createdAt?: string;
}

export function getRecentlyViewed(): RecentRecipe[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addRecentlyViewed(recipe: any) {
  if (!recipe?.recipeId) return;
  const slim: RecentRecipe = {
    recipeId: recipe.recipeId,
    name: recipe.name,
    images: recipe.images?.slice(0, 1).map((img: any) => ({ link: img.link })),
    prepTime: recipe.prepTime,
    cookTime: recipe.cookTime,
    servings: recipe.servings,
    createdAt: recipe.createdAt,
  };
  const existing = getRecentlyViewed().filter((r) => r.recipeId !== slim.recipeId);
  const next = [slim, ...existing].slice(0, MAX);
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage full / unavailable — non-critical */
  }
}
