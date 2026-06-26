import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createNote,
  deleteNote,
  getNotes,
  updateNote,
  type UpdateNoteDto,
} from "../api/note";
import { toast } from "sonner";

export const notesQueryKey = ["notes"] as const;

export function useNotes(sessionId: number | null) {
  return useQuery({
    queryKey: [...notesQueryKey, sessionId],
    queryFn: () => getNotes(sessionId ?? undefined),
    enabled: sessionId !== null,
  });
}

export function useAllNotes() {
  return useQuery({
    queryKey: notesQueryKey,
    queryFn: () => getNotes(),
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNote,
    onSuccess: (note) => {
      queryClient.invalidateQueries({
        queryKey: [...notesQueryKey, note.studySessionId],
      });
      toast.success("Note created")
    },
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateNoteDto }) =>
      updateNote(id, data),
    onSuccess: (note) => {
      queryClient.invalidateQueries({
        queryKey: [...notesQueryKey, note.studySessionId],
      });
      toast.success("Note updated")
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: number; sessionId: number }) => deleteNote(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...notesQueryKey, variables.sessionId],
      });
      toast.success("Note deleted")
    },
  });
}
