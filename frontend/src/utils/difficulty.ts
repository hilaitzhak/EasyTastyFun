// Estimate a recipe's difficulty from its size and time — no AI needed, instant,
// and works for every existing recipe.
export type Difficulty = 'easy' | 'medium' | 'hard';

export function getDifficulty(recipe: any): Difficulty {
  const ingredientCount = (recipe?.ingredientGroups || [])
    .reduce((sum: number, g: any) => sum + (g.ingredients?.length || 0), 0);
  const stepCount = (recipe?.instructionGroups || [])
    .reduce((sum: number, g: any) => sum + (g.instructions?.length || 0), 0);
  const totalTime = (recipe?.prepTime || 0) + (recipe?.cookTime || 0);

  // Weighted score across the three signals.
  let score = 0;
  if (ingredientCount > 12) score += 2; else if (ingredientCount > 7) score += 1;
  if (stepCount > 10) score += 2; else if (stepCount > 5) score += 1;
  if (totalTime > 90) score += 2; else if (totalTime > 45) score += 1;

  if (score >= 4) return 'hard';
  if (score >= 2) return 'medium';
  return 'easy';
}
