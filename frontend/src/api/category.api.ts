import axios from 'axios';

const API_URL = 'http://localhost:4000/easy-tasty-fun';

export const categoryApi = {
  getCategories: () => axios.get(`${API_URL}/categories`),
  getCategoryByPath: (categoryPath: string) => {
    return axios.get(`${API_URL}/categories/${categoryPath}`).then((response) => response.data);
  },
  getSubCategoriesByCategory: (categoryPath: string) => {
    return axios.get(`${API_URL}/categories/${categoryPath}/subcategories`).then((response) => response.data);
  },
  getSubCategoryByPath: (categoryPath: string, subCategoryPath: string) => {
    return axios.get(`${API_URL}/categories/${categoryPath}/${subCategoryPath}`).then((response) => response.data);
  },
  getRecipesByCategory: (categoryId: string) => {
    return axios.get(`${API_URL}/categories/${categoryId}/recipes`).then((response) => response.data);
  },
  getRecipesBySubCategory: (categoryPath: string, subCategoryPath: string) => {
    return axios.get(`${API_URL}/categories/${categoryPath}/${subCategoryPath}`).then((response) => response.data);
  },
  getAllSubCategories: () => {
    return axios.get(`${API_URL}/subcategories`).then((response) => response.data);
  }
};