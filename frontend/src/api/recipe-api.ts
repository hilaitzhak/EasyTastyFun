import axios from 'axios';

const API_URL = 'http://localhost:4000/easy-tasty-fun';

export const recipeApi = {
    create: (data: any) => axios.post(`${API_URL}/add-recipe`, data),
    getAll: () => axios.get(API_URL),
    getLatestRecipes: () => axios.get(`${API_URL}`),
    getById: (id: string) => axios.get(`${API_URL}/${id}`),
    update: (id: string, data: any) => axios.put(`${API_URL}/${id}`, data),
    delete: (id: string) => axios.delete(`${API_URL}/${id}`),
};
