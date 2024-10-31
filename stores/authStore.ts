import { create } from "zustand";

interface AuthState {
  SECRET: string;
  ACCESS_TOKEN: string;
  setAuth: (secret: string, token: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  SECRET: typeof window !== 'undefined' ? sessionStorage.getItem("SECRET") || "" : "",
  ACCESS_TOKEN: typeof window !== 'undefined' ? sessionStorage.getItem("ACCESS_TOKEN") || "" : "",
  setAuth: (secret: string, token: string) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem("SECRET", secret);
      sessionStorage.setItem("ACCESS_TOKEN", token);
    }
    set({ SECRET: secret, ACCESS_TOKEN: token });
  },
}));