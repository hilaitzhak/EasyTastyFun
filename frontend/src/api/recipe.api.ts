import axios from 'axios';

const API_URL = 'http://localhost:4000/easy-tasty-fun';

export const recipeApi = {
    createRecipe: (recipeData: any, config = {}) => axios.post(`${API_URL}/recipes/add-recipe`, recipeData, config),
    getAll(page: number, limit: number, filters?: { search?: string; category?: string }) {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });
        if (filters?.search) params.append('search', filters.search);
        if (filters?.category) params.append('category', filters.category);
        console.log('Fetching recipes with params:', params.toString());
        return axios.get(`${API_URL}/recipes?${params.toString()}`);
    },
    getRecentRecipes: () => axios.get(`${API_URL}/recipes/recent`),
    getRecipeById: (recipeId: string) => axios.get(`${API_URL}/recipes/${recipeId}`),
    update: (id: string, data: any, config = {}) => axios.put(`${API_URL}/recipes/${id}`, data, config),
    delete: (id: string, config = {}) => axios.delete(`${API_URL}/recipes/${id}`, config),
    checkSimilarRecipes: (ingredients: string[]) => axios.post(`${API_URL}/recipes/check-similar`, ingredients)
};
