import { User } from "@shared/schema";
import { apiRequest } from "./queryClient";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await apiRequest("POST", "/api/auth/login", { email, password });
    return response.json();
  },

  register: async (userData: {
    email: string;
    password: string;
    username: string;
    firstName?: string;
    lastName?: string;
    role: string;
  }) => {
    const response = await apiRequest("POST", "/api/auth/register", userData);
    return response.json();
  },

  logout: async () => {
    const response = await apiRequest("POST", "/api/auth/logout");
    return response.json();
  },

  getCurrentUser: async () => {
    const response = await apiRequest("GET", "/api/auth/me");
    return response.json();
  },
};
