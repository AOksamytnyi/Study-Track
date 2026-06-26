import { useMutation } from "@tanstack/react-query";
import { login, registerUser } from "../api/auth";
import { useAuthStore, type User } from "../store/authStore";
import { apiClient } from "../api/client";
import { toast } from "sonner";

export function useLogin() {
  const setAuth = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: login,

    onSuccess: async (data) => {
      await handleAuthSuccess(data.token, setAuth);
      toast.success("You are authorized");
    },
  });
}

export function useRegister() {
  const setAuth = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: registerUser,

    onSuccess: async (data) => {
      await handleAuthSuccess(data.token, setAuth);
       toast.success("You are registered")
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
