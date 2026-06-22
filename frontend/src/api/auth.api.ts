import axios from "axios";
import { API_BACKEND_URL, LONG_REQUEST_TIMEOUT } from "../config";

export const authApi = {
    registerUser: (data: { name: string; email: string; password: string }) => {
      return axios.post(`${API_BACKEND_URL}/register`, data, { timeout: LONG_REQUEST_TIMEOUT });
    },
    loginUser: (data: { email: string; password: string }) => {
      return axios.post(`${API_BACKEND_URL}/login`, data, { timeout: LONG_REQUEST_TIMEOUT });
    },
    googleLogin: (credential: string) => {
      // The first login after the backend/DB has been idle can
      // be slow (host cold start + MongoDB Atlas reconnect). Don't cut it off.
      return axios.post(`${API_BACKEND_URL}/google`, { credential }, { timeout: LONG_REQUEST_TIMEOUT });
    }
}