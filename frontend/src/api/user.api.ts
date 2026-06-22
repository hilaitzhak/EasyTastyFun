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
  getNoteIds: (token: string | null) =>
    axios.get(`${API_BACKEND_URL}/notes`, authHeader(token)),
  getNote: (recipeId: string, token: string | null) =>
    axios.get(`${API_BACKEND_URL}/notes/${recipeId}`, authHeader(token)),
  setNote: (recipeId: string, note: string, token: string | null) =>
    axios.put(`${API_BACKEND_URL}/notes/${recipeId}`, { note }, authHeader(token)),
};
