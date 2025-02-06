import axios from "axios";

const API_URL = 'http://localhost:4000/easy-tasty-fun';

export const authApi = {
    registerUser: (data: { name: string; email: string; password: string }) => {
      return axios.post(`${API_URL}/register`, data);
    },
    loginUser: (data: { email: string; password: string }) => {
      return axios.post(`${API_URL}/login`, data);
    }
}