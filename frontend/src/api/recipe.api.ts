import axios from 'axios';

const API_URL = 'http://localhost:4000/easy-tasty-fun';

export const recipeApi = {
    createRecipe: (data: any) => axios.post(`${API_URL}/recipes/add-recipe`, data),
    getAll: () => axios.get(`${API_URL}/recipes`),
    getRecentRecipes: () => axios.get(`${API_URL}/recipes/recent`),
    getById: (id: string) => axios.get(`${API_URL}/recipes/${id}`),
    update: (id: string, data: any) => axios.put(`${API_URL}/recipes/${id}`, data),
    delete: (id: string) => axios.delete(`${API_URL}/recipes/${id}`),
};
