import axios from 'axios';

const API_URL = 'http://localhost:4000/easy-tasty-fun';

export const categoryApi = {
  getCategoryById: (id: string) => {
    return axios.get(`${API_URL}/categories/by-id/${id}`).then((response) => response.data);
  },
  getCategories: () => axios.get(`${API_URL}/categories`),
  getCategoryByPath: (categoryPath: string) => {
    return axios.get(`${API_URL}/categories/by-path/${categoryPath}`).then((response) => response.data);
  },
  getSubCategoriesByCategory: (categoryPath: string) => {
    return axios.get(`${API_URL}/categories/${categoryPath}/subcategories`).then((response) => response.data);
  },
  getSubCategoryByPath: (categoryPath: string, subCategoryPath: string) => {
    return axios.get(`${API_URL}/categories/${categoryPath}/${subCategoryPath}`).then((response) => response.data);
  },
  getRecipesByCategoryPath: (categoryPath: string) => {
    return axios.get(`${API_URL}/categories/${categoryPath}/recipes`).then((response) => response.data);
  },
  getRecipesByCategoryAndSubcategory: (categoryPath: string, subCategoryPath: string) => {
    return axios.get(`${API_URL}/categories/${categoryPath}/${subCategoryPath}/recipes`).then((response) => response.data);
  },
  getAllSubCategories: () => {
    return axios.get(`${API_URL}/subcategories`).then((response) => response.data);
  },
  getSubcategoryById: (subCategoryId: string) => {
    return axios.get(`${API_URL}/subcategories/by-id/${subCategoryId}`).then((response) => response.data);
  }
};