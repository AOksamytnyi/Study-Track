import { apiClient } from "./client";

type loginDto = {
  email: string;
  password: string;
};

export async function login(data: loginDto) {
  const response = await apiClient.post("/auth/login", data);
  const token = response.data.token;
  apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;

  const user = await apiClient.get("/auth/me");

  return {
    token,
    user: user.data,
  };
}
