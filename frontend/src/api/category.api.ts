import axios from 'axios';

const API_URL = 'http://localhost:4000/easy-tasty-fun';

export const categoryApi = {
    getCategories: () => axios.get(`${API_URL}/categories`),
    getCategoryByPath: (categoryPath: string) => {
        return axios.get(`${API_URL}/categories/path/${categoryPath}`).then((response) => response.data);
    },
    getRecipesByCategory: (categoryId: string) => {
      return axios.get(`${API_URL}/categories/${categoryId}/recipes`).then((response) => response.data);
    },
    getAllSubCategories: () => axios.get(`${API_URL}/subcategories`).then((response) => response.data),
    getSubCategoryByPath: (categoryPath: string, subCategoryPath: string) => {
        return axios.get(`${API_URL}/categories/path/${categoryPath}/subcategories/path/${subCategoryPath}`).then((response) => response.data);
    },
      getRecipesBySubCategory: (subCategoryId: string) => {
        return axios.get(`${API_URL}/subcategories/${subCategoryId}/recipes`).then((response) => response.data);
    }
};