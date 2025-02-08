import axios from 'axios';

const API_URL = 'http://localhost:4000/easy-tasty-fun';

export const recipeApi = {
    createRecipe: (recipeData: any, config = {}) => axios.post(`${API_URL}/recipes/add-recipe`, recipeData, config),
    getAll: () => axios.get(`${API_URL}/recipes`),
    getRecentRecipes: () => axios.get(`${API_URL}/recipes/recent`),
    getById: (id: string) => axios.get(`${API_URL}/recipes/${id}`),
    update: (id: string, data: any, config = {}) => axios.put(`${API_URL}/recipes/${id}`, data, config),
    delete: (id: string, config = {}) => axios.delete(`${API_URL}/recipes/${id}`, config),
    checkSimilarRecipes: (ingredients: string[]) => axios.post(`${API_URL}/recipes/check-similar`, ingredients)
};
