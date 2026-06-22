import axios from 'axios';
import { API_BACKEND_URL } from '../config';

const authHeader = (token: string | null) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const userApi = {
  getFavorites: (token: string | null) =>
    axios.get(`${API_BACKEND_URL}/favorites`, authHeader(token)),
  getFavoriteIds: (token: string | null) =>
    axios.get(`${API_BACKEND_URL}/favorites/ids`, authHeader(token)),
  addFavorite: (recipeId: string, token: string | null) =>
    axios.post(`${API_BACKEND_URL}/favorites/${recipeId}`, {}, authHeader(token)),
  removeFavorite: (recipeId: string, token: string | null) =>
    axios.delete(`${API_BACKEND_URL}/favorites/${recipeId}`, authHeader(token)),
};
