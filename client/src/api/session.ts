import { apiClient } from "./client";

export type Difficulty = "easy" | "medium" | "hard";

export type StudySession = {
  id: number;
  title: string;
  description: string;
  duration: number;
  date: string;
  difficulty: Difficulty;
};

export type CreateSessionDto = {
  title: string;
  description: string;
  duration: number;
  date: string;
  difficulty: Difficulty;
};

export type UpdateSessionDto = Partial<CreateSessionDto>

export async function createSession(data: CreateSessionDto) {
  const response = await apiClient.post<StudySession>("/sessions", data);
  return response.data;
}

export async function getSessions() {
  const response = await apiClient.get<StudySession[]>("/sessions");
  return response.data;
}

export async function updateSession(id: number, data: UpdateSessionDto) {
  const response = await apiClient.patch<StudySession>(`/sessions/${id}`, data)
  return response.data
}

export async function deleteSession(id: number) {
  await apiClient.delete(`/sessions/${id}`)
}

