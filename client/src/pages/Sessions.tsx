import { AddSessionForm } from "../components/AddSessionForm";
import { AddSessionButton } from "../components/AddSessionButton";
import SessionCard from "../components/SessionCard";
import { useState } from "react";
import { useSessions, useSessionTags } from "../hooks/useSessions";
import { EmptyState } from "../components/ui/EmptyState";
import { SessionCardSkeleton } from "../components/ui/Skeletons";
import { useSearchParams } from "react-router-dom";
import type { SessionFilters } from "../api/session";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

function formatSessionDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export default function Sessions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isAddingSession, setIsAddingSession] = useState(false);

  const search = searchParams.get("search") ?? "";
  const selectedDifficulty = searchParams.get("difficulty") ?? "";
  const selectedTagIds = (searchParams.get("tags") ?? "")
    .split(",")
    .map((tagId) => Number(tagId))
    .filter((tagId) => Number.isInteger(tagId) && tagId > 0);

  const difficulty =
    selectedDifficulty === "easy" ||
    selectedDifficulty === "medium" ||
    selectedDifficulty === "hard"
      ? selectedDifficulty
      : undefined;

  const debouncedSearch = useDebouncedValue(search);
  const filters: SessionFilters = {
    search: debouncedSearch,
    difficulty,
    tagIds: selectedTagIds,
  };

  const { data: sessions = [], isLoading } = useSessions(filters);
  const { data: tags = [] } = useSessionTags();
  const hasActiveFilters =
    search !== "" || selectedDifficulty !== "" || selectedTagIds.length > 0;
  const selectedTags = tags.filter((tag) => selectedTagIds.includes(tag.id));
  const availableTags = tags.filter((tag) => !selectedTagIds.includes(tag.id));

  const updateTagFilter = (nextTagIds: number[]) => {
    setSearchParams((params) => {
      if (nextTagIds.length) {
        params.set("tags", nextTagIds.join(","));
      } else {
        params.delete("tags");
      }

      return params;
    });
  };

  const addTagFilter = (tagId: number) => {
    if (selectedTagIds.includes(tagId)) {
      return;
    }

    updateTagFilter([...selectedTagIds, tagId]);
  };

  const removeTagFilter = (tagId: number) => {
    updateTagFilter(selectedTagIds.filter((selectedTagId) => selectedTagId !== tagId));
  };

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
      <div className="flex gap-3">
        <input
          className="w-100 py-3.75 px-3 bg-[#F0F6FF] text-neutral-500 text-sm font-light rounded-lg"
          type="text"
          value={search}
          onChange={(event) => {
            const value = event.target.value;
            setSearchParams((params) => {
              if (value) {
                params.set("search", value);
              } else {
                params.delete("search");
              }

              return params;
            });
          }}
          placeholder="Search sessions..."
        />

        <select
          name="difficulty_select"
          className="bg-[#F0F6FF] text-neutral-500 text-sm font-light rounded-lg py-3.75 px-3"
          value={selectedDifficulty}
          onChange={(event) => {
            const value = event.target.value;

            setSearchParams((params) => {
              if (value) {
                params.set("difficulty", value.toLowerCase());
              } else {
                params.delete("difficulty");
              }
              return params;
            });
          }}>
          <option value="">All</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <select
          name="tag_select"
          className="bg-[#F0F6FF] text-neutral-500 text-sm font-light rounded-lg py-3.75 px-3"
          value=""
          onChange={(event) => {
            const tagId = Number(event.target.value);

            if (Number.isInteger(tagId) && tagId > 0) {
              addTagFilter(tagId);
            }
          }}>
          <option value="">Filter by tag</option>
          {availableTags.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </select>
      </div>
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => removeTagFilter(tag.id)}
              className="rounded-full border border-black bg-black px-3 py-1 text-xs font-bold uppercase text-white transition hover:bg-neutral-800"
              aria-label={`Remove ${tag.name} tag filter`}>
              {tag.name} x
            </button>
          ))}
        </div>
      )}
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
                title={hasActiveFilters ? "No sessions found" : "No sessions yet"}
                description={
                  hasActiveFilters
                    ? "Try changing search, difficulty, or tag filters."
                    : "Create your first study session to start tracking progress."
                }
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
