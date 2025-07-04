import axios from "axios";
import { API_BACKEND_URL } from "../config";

export const authApi = {
    registerUser: (data: { name: string; email: string; password: string }) => {
      return axios.post(`${API_BACKEND_URL}/register`, data);
    },
    loginUser: (data: { email: string; password: string }) => {
      return axios.post(`${API_BACKEND_URL}/login`, data);
    },
    googleLogin: (credential: string) => {
      return axios.post(`${API_BACKEND_URL}/google`, { credential });
    }
}