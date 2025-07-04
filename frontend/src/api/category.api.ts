import axios from 'axios';
import { API_BACKEND_URL } from '../config';

export const categoryApi = {
  getCategoryById: (id: string) => {
    return axios.get(`${API_BACKEND_URL}/categories/by-id/${id}`).then((response) => response.data);
  },
  getCategories: () => axios.get(`${API_BACKEND_URL}/categories`),
  getCategoryByPath: (categoryPath: string) => {
    return axios.get(`${API_BACKEND_URL}/categories/by-path/${categoryPath}`).then((response) => response.data);
  },
  getSubCategoriesByCategory: (categoryPath: string) => {
    return axios.get(`${API_BACKEND_URL}/categories/${categoryPath}/subcategories`).then((response) => response.data);
  },
  getSubCategoryByPath: (categoryPath: string, subCategoryPath: string) => {
    return axios.get(`${API_BACKEND_URL}/categories/${categoryPath}/${subCategoryPath}`).then((response) => response.data);
  },
  getRecipesByCategoryPath: (categoryPath: string, page: number = 1, limit: number = 20) => {
    return axios.get(`${API_BACKEND_URL}/categories/${categoryPath}/recipes?page=${page}&limit=${limit}`).then((response) => response.data);
  },
  getRecipesByCategoryAndSubcategory: (categoryPath: string, subCategoryPath: string, page: number = 1, limit: number = 20) => {
    return axios.get(`${API_BACKEND_URL}/categories/${categoryPath}/${subCategoryPath}/recipes?page=${page}&limit=${limit}`).then((response) => response.data);
  },
  getAllSubCategories: () => {
    return axios.get(`${API_BACKEND_URL}/subcategories`).then((response) => response.data);
  },
  getSubcategoryById: (subCategoryId: string) => {
    return axios.get(`${API_BACKEND_URL}/subcategories/by-id/${subCategoryId}`).then((response) => response.data);
  }
};