import { useState, useEffect } from 'react';
import axios from 'axios';
import { IRecipe } from '../interfaces/Recipe';
import { API_BACKEND_URL } from "../config";

export const useRecipes = (recent = false) => {
  const [recipes, setRecipes] = useState<IRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecipes();
  }, [recent]);
  
  const fetchRecipes = async () => {
    try {
      const endpoint = recent ? 'recipes/recent' : 'recipes';
      const { data } = await axios.get(`${API_BACKEND_URL}/${endpoint}`);
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
  return { recipes, loading, error };
};