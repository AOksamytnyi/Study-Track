import { useMutation } from "@tanstack/react-query";
import { login, registerUser } from "../api/auth";
import { useAuthStore, type User } from "../store/authStore";
import { apiClient } from "../api/client";

export function useLogin() {
  const setAuth = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: login,

    onSuccess: async (data) => {
      handleAuthSuccess(data.token, setAuth);
    },
  });
}

export function useRegister() {
  const setAuth = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: registerUser,

    onSuccess: async (data) => {
      handleAuthSuccess(data.token, setAuth);
    },
  });
}

async function handleAuthSuccess(
  token: string,
  setAuth: (token: string, user: User) => void,
) {
  apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;

  const { data: user } = await apiClient.get("/auth/me");

  setAuth(token, user);
}
