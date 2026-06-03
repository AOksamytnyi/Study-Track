import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  id: number;
  email: string;
  username: string;
};

interface IAuthState {
  token: string | null;
  user: User | null;
}

interface IAuthActions {
  login: (token: string, user: User) => void;
  logout: () => void;
}

interface IAuthStore extends IAuthActions, IAuthState {}

export const useAuthStore = create<IAuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      login: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: "auth",
    },
  ),
);
