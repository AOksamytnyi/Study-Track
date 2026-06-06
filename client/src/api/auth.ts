import { apiClient } from "./client";

type loginDto = {
  email: string;
  password: string;
};

type RegisterDto = {
    email: string,
    password: string,
    username: string
}

export async function login(data: loginDto) {
  const response = await apiClient.post("/auth/login", data);
  return response.data
}

export async function registerUser(data: RegisterDto) {
    const response = await apiClient.post("/auth/register", data)
    return response.data
}