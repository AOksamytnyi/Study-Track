import { create } from "zustand";

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

export const useAuthStore = create<IAuthStore>()((set) => ({
  token: null,
  user: null,
  login: (token, user) => set({ token, user }),
  logout: () => set({ token: null, user: null }),
}));
