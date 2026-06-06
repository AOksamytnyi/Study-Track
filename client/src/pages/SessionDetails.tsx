import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSession, useUpdateSession } from "../hooks/useSessions";
import type { Difficulty } from "../api/session";

const difficultyStyles: Record<
  Difficulty,
  { label: string; color: string; textColor: string; bordered?: boolean }
> = {
  easy: { label: "easy", color: "#5D7285", textColor: "#FFFFFF" },
  medium: {
    label: "medium",
    color: "#7C6F42",
    textColor: "#FFFFFF",
  },
  hard: { label: "hard", color: "#9B4A4A", textColor: "#FFFFFF" },
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

function getSessionId(value: string | undefined) {
  if (!value) {
    return null;
  }

  const id = Number(value);
  return Number.isNaN(id) ? null : id;
}

export default function SessionDetails() {
  const { id } = useParams();
  const sessionId = getSessionId(id);
  const { data: session, isLoading } = useSession(sessionId);
  const updateSession = useUpdateSession();
  const [editingField, setEditingField] = useState<
    "title" | "description" | "difficulty" | "duration" | null
  >(null);
  const [titleDraft, setTitleDraft] = useState("");
  const [descriptionDraft, setDescriptionDraft] = useState("");
  const [durationDraft, setDurationDraft] = useState<number>(0);

  if (sessionId === null) {
    return (
      <div className="font-roboto text-[#6f6f70]">Invalid session id.</div>
    );
  }

  if (isLoading) {
    return <div className="font-roboto text-[#6f6f70]">Loading session...</div>;
  }

  if (!session) {
    return (
      <div className="flex flex-col gap-4 font-roboto">
        <h1 className="font-nunito text-[25px] font-semibold text-[#9a93b3]">
          Session not found
        </h1>
        <Link to="/sessions" className="text-sm font-medium text-[#223759]">
          Back to sessions
        </Link>
      </div>
    );
  }

  const difficulty = difficultyStyles[session.difficulty];
  const detailsDate = formatDate(session.date);
  const noteDescription = session.description;

  const notes = ["Note 1 (title)", "Note 2 (title)", "Note 3 (title)"];
  const isSaving = updateSession.isPending;

  const saveTitle = async () => {
    const title = titleDraft.trim();

    if (!title || title === session.title) {
      setTitleDraft(session.title);
      setEditingField(null);
      return;
    }

    await updateSession.mutateAsync({
      id: session.id,
      data: { title },
    });
    setEditingField(null);
  };

  const saveDescription = async () => {
    const description = descriptionDraft.trim();

    if (description === session.description) {
      setDescriptionDraft(session.description);
      setEditingField(null);
      return;
    }

    await updateSession.mutateAsync({
      id: session.id,
      data: { description },
    });
    setEditingField(null);
  };

  const saveDifficulty = async (difficultyValue: Difficulty) => {
    if (difficultyValue === session.difficulty) {
      setEditingField(null);
      return;
    }

    await updateSession.mutateAsync({
      id: session.id,
      data: { difficulty: difficultyValue },
    });
    setEditingField(null);
  };

  const saveDuration = async () => {
    const durationValue = Math.trunc(durationDraft);

    if (!durationValue || durationValue < 1 || durationValue === session.duration) {
      setEditingField(null);
      setDurationDraft(session.duration);
      return;
    }

    await updateSession.mutateAsync({
      id: session.id,
      data: { duration: durationValue },
    });

    setEditingField(null);
  };

  const cancelEditing = () => {
    setTitleDraft(session.title);
    setDescriptionDraft(session.description);
    setDurationDraft(session.duration);
    setEditingField(null);
  };

  return (
    <div className="font-roboto">
      <h1 className="mb-5 font-nunito text-2xl font-semibold text-[#9a93b3]">
        Session detail
      </h1>

      <section className="min-h-[967px] rounded-lg bg-white px-[30px] py-[30px]">
        <div className="flex justify-between">
          <div className="w-full">
            {editingField === "title" ? (
              <input
                autoFocus
                disabled={isSaving}
                value={titleDraft}
                onChange={(event) => setTitleDraft(event.target.value)}
                onBlur={saveTitle}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.currentTarget.blur();
                  }

                  if (event.key === "Escape") {
                    cancelEditing();
                  }
                }}
                className="w-full min-w-90 border-b border-[#e3f2f3] bg-transparent text-[48px] font-medium leading-7 text-[#223759] outline-none focus:border-[#223759] disabled:opacity-60"
              />
            ) : (
              <button
                type="button"
                onClick={() => {
                  setTitleDraft(session.title);
                  setEditingField("title");
                }}
                className="block text-left text-[48px] font-medium leading-7 text-[#223759]">
                {session.title || "TITLE"}
              </button>
            )}

            {editingField === "description" ? (
              <textarea
                autoFocus
                disabled={isSaving}
                value={descriptionDraft}
                onChange={(event) => setDescriptionDraft(event.target.value)}
                onBlur={saveDescription}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    cancelEditing();
                  }

                  if (
                    (event.metaKey || event.ctrlKey) &&
                    event.key === "Enter"
                  ) {
                    event.currentTarget.blur();
                  }
                }}
                rows={2}
                className="mt-5 min-h-16 w-full min-w-150 resize-none border-b border-[#e3f2f3] bg-transparent pl-1 text-xl font-light leading-[1.291] text-[#6f6f70] outline-none focus:border-[#223759] disabled:opacity-60"
              />
            ) : (
              <button
                type="button"
                onClick={() => {
                  setDescriptionDraft(session.description);
                  setEditingField("description");
                }}
                className="mt-5 block max-w-250 pl-1 text-left text-xl font-light leading-[1.291] text-[#6f6f70]">
                {session.description || "description"}
              </button>
            )}
          </div>
          <div className="flex min-w-28 flex-col items-end justify-between gap-4">
            <div className="relative">
              <button
                type="button"
                disabled={isSaving}
                onClick={() =>
                  setEditingField(
                    editingField === "difficulty" ? null : "difficulty",
                  )
                }
                className="flex h-5 min-w-[50px] items-center justify-center rounded-[50px] px-1.5 text-[10px] font-bold uppercase leading-none disabled:opacity-60"
                style={{
                  backgroundColor: difficulty.color,
                  color: difficulty.textColor,
                  border: difficulty.bordered ? "1px solid #000000" : "none",
                }}>
                {difficulty.label}
              </button>

              {editingField === "difficulty" && (
                <div className="absolute right-0 top-8 z-10 flex flex-col gap-2 rounded-lg border border-[#e3f2f3] bg-white p-2 shadow-[0px_2px_3px_0px_rgba(0,0,0,0.25)]">
                  {(Object.keys(difficultyStyles) as Difficulty[]).map(
                    (difficultyValue) => {
                      const option = difficultyStyles[difficultyValue];

                      return (
                        <button
                          key={difficultyValue}
                          type="button"
                          disabled={isSaving}
                          onClick={() => saveDifficulty(difficultyValue)}
                          className="flex h-5 min-w-[70px] items-center justify-center rounded-[50px] px-2 text-[10px] font-bold uppercase leading-none disabled:opacity-60"
                          style={{
                            backgroundColor: option.color,
                            color: option.textColor,
                            border: option.bordered
                              ? "1px solid #000000"
                              : "none",
                          }}>
                          {option.label}
                        </button>
                      );
                    },
                  )}
                </div>
              )}
            </div>
            <div className="flex justify-end">
              {editingField === "duration" ? (
                <div className="flex h-8 items-center gap-1 rounded-md border border-[#e3f2f3] bg-white px-2 shadow-[0px_2px_3px_0px_rgba(0,0,0,0.12)] focus-within:border-[#223759]">
                  <input
                    autoFocus
                    disabled={isSaving}
                    min={1}
                    step={1}
                    value={durationDraft || ""}
                    onChange={(event) =>
                      setDurationDraft(event.target.valueAsNumber || 0)
                    }
                    onBlur={saveDuration}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.currentTarget.blur();
                      }

                      if (event.key === "Escape") {
                        cancelEditing();
                      }
                    }}
                    type="number"
                    className="w-14 bg-transparent text-right text-sm font-medium text-[#223759] outline-none disabled:opacity-60"
                  />
                  <span className="text-sm font-light text-[#6f6f70]">min</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setDurationDraft(session.duration);
                    setEditingField("duration");
                  }}
                  className="text-nowrap text-right text-sm font-light leading-[1.291] text-[#6f6f70]">
                  {session.duration || "duration"} min
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-[25px] h-px bg-[#e3f2f3]" />

        <div className="flex flex-col gap-1 py-1">
          <h3 className="font-roboto font-bold text-2xl text-[#223759]">
            Tags
          </h3>
          <div className="flex gap-[15px] py-3">
            <span className="flex h-5 min-w-[50px] items-center justify-center rounded-[50px] border border-black bg-white px-3 text-[10px] leading-none text-black">
              new
            </span>
          </div>
        </div>

        <div className="h-px bg-[#e3f2f3]" />

        <div>
          {notes.map((title) => (
            <article key={title} className="relative min-h-[184px] pt-[25px]">
              <div className="flex items-start justify-between gap-6">
                <div className="max-w-[calc(100%-50px)]">
                  <h3 className="text-[32px] font-medium leading-6 text-[#223759]">
                    {title}
                  </h3>
                  <p className="mt-[18px] text-xl font-light leading-[1.291] text-[#6f6f70]">
                    {noteDescription}
                  </p>
                </div>

                <button
                  type="button"
                  aria-label={`Edit ${title}`}
                  className="mt-[11px] size-6 shrink-0">
                  <img src="/edit.svg" alt="" className="size-6" />
                </button>
              </div>

              <div className="absolute bottom-[25px] right-0 flex items-center gap-3">
                <img src="/clock unfill.svg" alt="" className="size-4" />
                <p className="text-sm font-light leading-[1.291] text-[#6f6f70]">
                  {detailsDate}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
