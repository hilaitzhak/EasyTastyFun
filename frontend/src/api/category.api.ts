import axios from 'axios';

const API_URL = 'http://localhost:3000/easy-tasty-fun';

export const categoryApi = {
    getCategories: () => axios.get(`${API_URL}/categories`)
};