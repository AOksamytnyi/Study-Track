import { apiClient } from "./client";

export type Note = {
  id: number;
  title: string;
  text: string;
  createdAt: string;
  studySessionId: number;
};

export type CreateNoteDto = {
  title: string;
  text: string;
  studySessionId: number;
};

export type UpdateNoteDto = Partial<Pick<CreateNoteDto, "title" | "text">>;

export async function getNotes(sessionId?: number) {
  const response = await apiClient.get<Note[]>("/notes", {
    params: sessionId ? { sessionId } : undefined,
  });

  return response.data;
}

export async function createNote(data: CreateNoteDto) {
  const response = await apiClient.post<Note>("/notes", data);
  return response.data;
}

export async function updateNote(id: number, data: UpdateNoteDto) {
  const response = await apiClient.patch<Note>(`/notes/${id}`, data);
  return response.data;
}

export async function deleteNote(id: number) {
  await apiClient.delete(`/notes/${id}`);
}
