import { AddSessionForm } from "../components/AddSessionForm";
import { AddSessionButton } from "../components/AddSessionButton";
import SessionCard from "../components/SessionCard";
import { useState } from "react";
import { useSessions } from "../hooks/useSessions";

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
    <div className="flex flex-col gap-6 font-roboto">
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

      <div className="flex flex-wrap gap-5">
        {isAddingSession ? (
          <AddSessionForm
            onCancel={() => setIsAddingSession(false)}
            onCreated={() => setIsAddingSession(false)}
          />
        ) : (
          <AddSessionButton onClick={() => setIsAddingSession(true)} />
        )}

        {isLoading ? (
          <div className="w-90.75 h-50 rounded-lg bg-white p-3.75 font-roboto text-neutral-500 shadow-[0px_0px_3px_1px_rgba(0,0,0,0.15)]">
            Loading sessions...
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
