import { AddSessionForm } from "../components/AddSessionForm";
import { AddSessionButton } from "../components/AddSessionButton";
import SessionCard from "../components/SessionCard";
import { useState } from "react";
import { useSessions } from "../hooks/useSessions";
import { EmptyState } from "../components/ui/EmptyState";
import { SessionCardSkeleton } from "../components/ui/Skeletons";

function formatSessionDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export default function Sessions() {
  const [isAddingSession, setIsAddingSession] = useState(false);
  const { data: sessions = [], isLoading } = useSessions();

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col gap-6 bg-white px-7 py-6 font-roboto">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-inter text-3xl font-semibold text-slate-800">
            Sessions
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Track what you studied and how much time it took.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        {isAddingSession ? (
          <AddSessionForm
            onCancel={() => setIsAddingSession(false)}
            onCreated={() => setIsAddingSession(false)}
          />
        ) : (
          <AddSessionButton onClick={() => setIsAddingSession(true)} />
        )}

        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <SessionCardSkeleton key={index} />
          ))
        ) : sessions.length === 0 ? (
          <div className="flex items-center justify-center gap-5">
            <div className="flex flex-col items-center gap-5">
              <EmptyState
                title="No sessions yet"
                description="Create your first study session to start tracking progress."
              />
            </div>
          </div>
        ) : (
          sessions.map((session) => (
            <SessionCard
              key={session.id}
              id={session.id}
              title={session.title}
              date={`${formatSessionDate(session.date)} · ${session.duration} min`}
              description={session.description}
              comments={0}
              difficulty={session.difficulty}
              tags={session.tags}
            />
          ))
        )}
      </div>
    </div>
  );
}
