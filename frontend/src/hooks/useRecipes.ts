import { useState, useEffect } from 'react';
import axios from 'axios';
import { IRecipe } from '../interfaces/Recipe';


export const useRecipes = (recent = false) => {
  const [recipes, setRecipes] = useState<IRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const endpoint = recent ? '/recipes/recent' : '/recipes';
        const { data } = await axios.get(`http://localhost:3000/easy-tasty-fun/${endpoint}`);
        setRecipes(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An error occurred while fetching recipes'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [recent]);

  return { recipes, loading, error };
};