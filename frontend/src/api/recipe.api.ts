import axios from 'axios';
import { API_BACKEND_URL, LONG_REQUEST_TIMEOUT } from '../config';
export const recipeApi = {
    createRecipe: (recipeData: any, config = {}) => axios.post(`${API_BACKEND_URL}/recipes/add-recipe`, recipeData, { timeout: LONG_REQUEST_TIMEOUT, ...config }),
    getAll(page: number, limit: number, filters?: { search?: string; category?: string }) {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });
        if (filters?.search) params.append('search', filters.search);
        if (filters?.category) params.append('category', filters.category);
        console.log('Fetching recipes with params:', params.toString());
        return axios.get(`${API_BACKEND_URL}/recipes?${params.toString()}`);
    },
    getRecentRecipes: () => axios.get(`${API_BACKEND_URL}/recipes/recent`),
    getRecipeById: (recipeId: string) => axios.get(`${API_BACKEND_URL}/recipes/${recipeId}`),
    update: (id: string, data: any, config = {}) => axios.put(`${API_BACKEND_URL}/recipes/${id}`, data, { timeout: LONG_REQUEST_TIMEOUT, ...config }),
    delete: (id: string, config = {}) => axios.delete(`${API_BACKEND_URL}/recipes/${id}`, config),
    checkSimilarRecipes: (ingredients: string[]) => axios.post(`${API_BACKEND_URL}/recipes/check-similar`, ingredients),
    extractFromImage: (base64Image: string, categories?: any[]) => axios.post(`${API_BACKEND_URL}/recipes/extract-from-image`, { image: base64Image, categories }, { timeout: LONG_REQUEST_TIMEOUT }),
    getSubstitutions: (ingredient: string, recipeName: string, language: string) => axios.post(`${API_BACKEND_URL}/recipes/substitutions`, { ingredient, recipeName, language }, { timeout: LONG_REQUEST_TIMEOUT }),
    whatCanICook: (ingredients: string[], language: string) => axios.post(`${API_BACKEND_URL}/recipes/what-can-i-cook`, { ingredients, language }, { timeout: LONG_REQUEST_TIMEOUT }),
    getIngredientNames: () => axios.get(`${API_BACKEND_URL}/recipes/ingredient-names`),
    getRandom: () => axios.get(`${API_BACKEND_URL}/recipes/random`),
    generate: (prompt: string, language: string, categories?: any[]) => axios.post(`${API_BACKEND_URL}/recipes/generate`, { prompt, language, categories }, { timeout: LONG_REQUEST_TIMEOUT }),
    ask: (recipeId: string, question: string, language: string, history: { role: string; content: string }[]) => axios.post(`${API_BACKEND_URL}/recipes/ask`, { recipeId, question, language, history }, { timeout: LONG_REQUEST_TIMEOUT }),
    getPairing: (recipeName: string, ingredients: string, language: string) => axios.post(`${API_BACKEND_URL}/recipes/pairing`, { recipeName, ingredients, language }, { timeout: LONG_REQUEST_TIMEOUT }),
    leftoverIdeas: (ingredients: string[], language: string) => axios.post(`${API_BACKEND_URL}/recipes/leftovers`, { ingredients, language }, { timeout: LONG_REQUEST_TIMEOUT })
};
