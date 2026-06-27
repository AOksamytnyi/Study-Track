import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSession, createSessionTag, deleteSession, deleteSessionTag, getSessions, updateSession, type CreateSessionTagDto, type SessionFilters, type UpdateSessionDto } from "../api/session";
import { toast } from "sonner";

export const sessionsQueryKey = ["sessions"] as const;

export function useSessions(filters?: SessionFilters) {
  return useQuery({
    queryKey: [...sessionsQueryKey, filters],
    queryFn:() => getSessions(filters),
  });
}

export function useSession(id: number | null) {
  return useQuery({
    queryKey: sessionsQueryKey,
    queryFn: () => getSessions(),
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
      toast.success("Session created")
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
      toast.success("Session updated")
    },
  });
}

export function useDeleteSession(){
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionsQueryKey });
      toast.success("Sessions deleted")
    },
  });
}

export function useCreateSessionTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sessionId,
      data,
    }: {
      sessionId: number;
      data: CreateSessionTagDto;
    }) => createSessionTag(sessionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionsQueryKey });
      toast.success("Tag added")
    },
  });
}

export function useDeleteSessionTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sessionId,
      tagId,
    }: {
      sessionId: number;
      tagId: number;
    }) => deleteSessionTag(sessionId, tagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionsQueryKey });
      toast.success("Tag deleted")
    },
  });
}
