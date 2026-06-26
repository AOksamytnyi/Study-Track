import { AddSessionForm } from "../components/AddSessionForm";
import { AddSessionButton } from "../components/AddSessionButton";
import SessionCard from "../components/SessionCard";
import { useState } from "react";
import { useSessions } from "../hooks/useSessions";
import { EmptyState } from "../components/ui/EmptyState";
import { LoadingState } from "../components/ui/LoadingState";

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
    <div className=" min-h-[calc(100vh-8rem)] bg-white px-7 py-6 flex flex-col gap-6 font-roboto">
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
      {isLoading ? (
          <LoadingState text="Loading session" />
      ) : (
        <div className="flex gap-4 flex-wrap">
          {sessions.length === 0 ? (
            <div className="flex items-center justify-center gap-5">
              <div className="flex flex-col gap-5 items-center">
                <EmptyState
                  title="No sessions yet"
                  description="Create your first study session to start tracking progress."
                />
                {isAddingSession ? (
                  <AddSessionForm
                    onCancel={() => setIsAddingSession(false)}
                    onCreated={() => setIsAddingSession(false)}
                  />
                ) : (
                  <AddSessionButton onClick={() => setIsAddingSession(true)} />
                )}
              </div>
            </div>
          ) : (
            <>
              {isAddingSession ? (
                <AddSessionForm
                  onCancel={() => setIsAddingSession(false)}
                  onCreated={() => setIsAddingSession(false)}
                />
              ) : (
                <AddSessionButton onClick={() => setIsAddingSession(true)} />
              )}
              {sessions.map((session) => (
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
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
