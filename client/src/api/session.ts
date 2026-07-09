import { apiClient } from "./client";

export type Difficulty = "easy" | "medium" | "hard";

export type SessionTag = {
  id: number;
  name: string;
};

export type StudySession = {
  id: number;
  title: string;
  description: string;
  duration: number;
  date: string;
  difficulty: Difficulty;
  tags: SessionTag[];
};

export type CreateSessionDto = {
  title: string;
  description: string;
  duration: number;
  date: string;
  difficulty: Difficulty;
};

export type UpdateSessionDto = Partial<CreateSessionDto>

export type CreateSessionTagDto = {
  name?: string;
  tagId?: number;
};

type ApiStudySession = Omit<StudySession, "tags"> & {
  sessionTags?: { tag: SessionTag }[];
};

export type SessionFilters = {
  search?: string;
  difficulty?: Difficulty;
  tagIds?: number[];
};

function normalizeSession(session: ApiStudySession): StudySession {
  return {
    ...session,
    tags: session.sessionTags?.map((sessionTag) => sessionTag.tag) ?? [],
  };
}

export async function createSession(data: CreateSessionDto) {
  const response = await apiClient.post<ApiStudySession>("/sessions", data);
  return normalizeSession(response.data);
}

export async function getSessions(filters?: SessionFilters) {
  const response = await apiClient.get<ApiStudySession[]>("/sessions", {
    params: {
      search: filters?.search || undefined,
      difficulty: filters?.difficulty,
      tags: filters?.tagIds?.length ? filters.tagIds.join(",") : undefined,
    },
  });
  return response.data.map(normalizeSession);
}

export async function getSessionTags() {
  const response = await apiClient.get<SessionTag[]>("/sessions/tags");
  return response.data;
}

export async function updateSession(id: number, data: UpdateSessionDto) {
  const response = await apiClient.patch<ApiStudySession>(`/sessions/${id}`, data)
  return normalizeSession(response.data)
}

export async function deleteSession(id: number) {
  await apiClient.delete(`/sessions/${id}`)
}

export async function createSessionTag(
  sessionId: number,
  data: CreateSessionTagDto,
) {
  const response = await apiClient.post<SessionTag>(
    `/sessions/${sessionId}/tags`,
    data,
  );
  return response.data;
}

export async function deleteSessionTag(sessionId: number, tagId: number) {
  await apiClient.delete(`/sessions/${sessionId}/tags/${tagId}`);
}
