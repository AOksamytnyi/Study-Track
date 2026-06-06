import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSession, deleteSession, getSessions, updateSession, type UpdateSessionDto } from "../api/session";

export const sessionsQueryKey = ["sessions"] as const;

export function useSessions() {
  return useQuery({
    queryKey: sessionsQueryKey,
    queryFn: getSessions,
  });
}

export function useSession(id: number | null) {
  return useQuery({
    queryKey: sessionsQueryKey,
    queryFn: getSessions,
    enabled: id !== null,
    select: (sessions) => sessions.find((session) => session.id === id),
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionsQueryKey });
    },
  });
}

export function useUpdateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSessionDto }) =>
      updateSession(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionsQueryKey });
    },
  });
}

export function useDeleteSession(){
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionsQueryKey });
    },
  });
}

