import { useMemo } from "react";
import type { Note } from "../api/note";
import type { StudySession } from "../api/session";
import { useAllNotes } from "./useNotes";
import { useSessions } from "./useSessions";

export type DashboardStats = {
  totalSessions: number;
  studyHours: number;
  totalNotes: number;
  performance: { label: string; value: number }[];
  topSessions: {
    id: number;
    title: string;
    date: string;
    notesCount: number;
    tagsCount: number;
  }[];
};

function formatMonthLabel(date: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatSessionDate(date: string) {
  return new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

function getMonthKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}`;
}

function getLastSixMonths() {
  const currentMonth = new Date();
  currentMonth.setDate(1);

  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(currentMonth);
    date.setMonth(currentMonth.getMonth() - (5 - index));
    return date;
  });
}

function countNotesBySession(notes: Note[]) {
  return notes.reduce<Record<number, number>>((acc, note) => {
    acc[note.studySessionId] = (acc[note.studySessionId] ?? 0) + 1;
    return acc;
  }, {});
}

function buildPerformance(sessions: StudySession[]) {
  const months = getLastSixMonths();
  const sessionCounts = sessions.reduce<Record<string, number>>(
    (acc, session) => {
      const key = getMonthKey(new Date(session.date));
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    },
    {},
  );

  return months.map((month) => ({
    label: formatMonthLabel(month),
    value: sessionCounts[getMonthKey(month)] ?? 0,
  }));
}

function buildTopSessions(sessions: StudySession[], notes: Note[]) {
  const notesBySession = countNotesBySession(notes);

  return [...sessions]
    .map((session) => ({
      id: session.id,
      title: session.title,
      date: formatSessionDate(session.date),
      notesCount: notesBySession[session.id] ?? 0,
      tagsCount: session.tags.length,
    }))
    .sort((first, second) => second.notesCount - first.notesCount)
    .slice(0, 3);
}

export function useDashboardStats() {
  const sessionsQuery = useSessions();
  const notesQuery = useAllNotes();

  const stats = useMemo<DashboardStats>(() => {
    const sessions = sessionsQuery.data ?? [];
    const notes = notesQuery.data ?? [];
    const totalMinutes = sessions.reduce(
      (total, session) => total + session.duration,
      0,
    );

    return {
      totalSessions: sessions.length,
      studyHours: Math.round(totalMinutes / 60),
      totalNotes: notes.length,
      performance: buildPerformance(sessions),
      topSessions: buildTopSessions(sessions, notes),
    };
  }, [notesQuery.data, sessionsQuery.data]);

  return {
    stats,
    isLoading: sessionsQuery.isLoading || notesQuery.isLoading,
    isError: sessionsQuery.isError || notesQuery.isError,
  };
}
