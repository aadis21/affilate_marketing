'use client';

import { create } from 'zustand';
import Cookies from 'js-cookie';

interface User {
  id: string;
  email: string;
  role: 'user' | 'admin' | 'superadmin';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  setAuth: (user, token) => {
    Cookies.set('token', token, { expires: 7 });
    Cookies.set('role', user.role, { expires: 7 });
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token, isLoading: false });
  },
  logout: () => {
    Cookies.remove('token');
    Cookies.remove('role');
    localStorage.removeItem('user');
    set({ user: null, token: null, isLoading: false });
  },
  initAuth: () => {
    const token = Cookies.get('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ user, token, isLoading: false });
      } catch {
        set({ isLoading: false });
      }
    } else {
      set({ isLoading: false });
    }
  },
}));
