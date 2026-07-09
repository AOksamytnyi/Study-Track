import { useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import {
  useCreateSessionTag,
  useDeleteSessionTag,
  useSession,
  useSessionTags,
  useUpdateSession,
} from "../hooks/useSessions";
import type { Difficulty } from "../api/session";
import { Note } from "../components/Note";
import { NoteForm } from "../components/NoteForm";
import {
  useCreateNote,
  useDeleteNote,
  useNotes,
  useUpdateNote,
} from "../hooks/useNotes";
import type { Note as NoteModel } from "../api/note";
import { EmptyState } from "../components/ui/EmptyState";
import { NoteSkeleton, SessionDetailsSkeleton } from "../components/ui/Skeletons";
import { SessionTagManager } from "../components/SessionTagManager";

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
  const { data: allTags = [] } = useSessionTags();
  const { data: notes = [], isLoading: areNotesLoading } = useNotes(sessionId);
  const updateSession = useUpdateSession();
  const createSessionTag = useCreateSessionTag();
  const deleteSessionTag = useDeleteSessionTag();
  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();
  const [editingField, setEditingField] = useState<
    "title" | "description" | "difficulty" | "duration" | null
  >(null);
  const [titleDraft, setTitleDraft] = useState("");
  const [descriptionDraft, setDescriptionDraft] = useState("");
  const [durationDraft, setDurationDraft] = useState<number>(0);
  const [tagName, setTagName] = useState("");
  const [tagError, setTagError] = useState<string | null>(null);
  const [deletingTagId, setDeletingTagId] = useState<number | null>(null);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [noteError, setNoteError] = useState<string | null>(null);

  if (sessionId === null) {
    return (
      <div className="font-roboto text-[#6f6f70]">Invalid session id.</div>
    );
  }

  if (isLoading) {
    return <SessionDetailsSkeleton />;
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
  const isSaving = updateSession.isPending;
  const isCreatingTag = createSessionTag.isPending;
  const isDeletingTag = deleteSessionTag.isPending;
  const isSavingNote =
    createNote.isPending || updateNote.isPending || deleteNote.isPending;
  const sessionTagIds = new Set(session.tags.map((tag) => tag.id));
  const availableExistingTags = allTags.filter(
    (tag) => !sessionTagIds.has(tag.id),
  );

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

    if (
      !durationValue ||
      durationValue < 1 ||
      durationValue === session.duration
    ) {
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

  const handleCreateTag = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = tagName.trim();

    if (!name) {
      return;
    }

    setTagError(null);

    try {
      await createSessionTag.mutateAsync({
        sessionId: session.id,
        data: { name },
      });
      setTagName("");
    } catch (error) {
      console.error(error);
      setTagError("Не удалось добавить тэг. Проверь, что сервер обновлён.");
    }
  };

  const handleAttachExistingTag = async (tagId: number) => {
    if (!tagId) {
      return;
    }

    setTagError(null);

    try {
      await createSessionTag.mutateAsync({
        sessionId: session.id,
        data: { tagId },
      });
    } catch (error) {
      console.error(error);
      setTagError("Не удалось добавить существующий тэг. Попробуй ещё раз.");
    }
  };

  const handleDeleteTag = async (tagId: number) => {
    setTagError(null);
    setDeletingTagId(tagId);

    try {
      await deleteSessionTag.mutateAsync({
        sessionId: session.id,
        tagId,
      });
    } catch (error) {
      console.error(error);
      setTagError("Не удалось удалить тэг. Попробуй ещё раз.");
    } finally {
      setDeletingTagId(null);
    }
  };

  const handleCreateNote = async (values: { title: string; text: string }) => {
    setNoteError(null);

    try {
      await createNote.mutateAsync({
        ...values,
        studySessionId: session.id,
      });
      setIsAddingNote(false);
    } catch (error) {
      console.error(error);
      setNoteError("Не удалось создать нотатку. Попробуй ещё раз.");
    }
  };

  const handleUpdateNote = async (
    note: NoteModel,
    values: { title: string; text: string },
  ) => {
    setNoteError(null);

    try {
      await updateNote.mutateAsync({
        id: note.id,
        data: values,
      });
      setEditingNoteId(null);
    } catch (error) {
      console.error(error);
      setNoteError("Не удалось обновить нотатку. Попробуй ещё раз.");
    }
  };

  const handleDeleteNote = async (note: NoteModel) => {
    setNoteError(null);

    try {
      await deleteNote.mutateAsync({
        id: note.id,
        sessionId: session.id,
      });
    } catch (error) {
      console.error(error);
      setNoteError("Не удалось удалить нотатку. Попробуй ещё раз.");
    }
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

        <SessionTagManager
          sessionTags={session.tags}
          availableTags={availableExistingTags}
          tagName={tagName}
          tagError={tagError}
          isCreatingTag={isCreatingTag}
          isDeletingTag={isDeletingTag}
          deletingTagId={deletingTagId}
          onTagNameChange={(value) => {
            setTagName(value);
            setTagError(null);
          }}
          onAttachExistingTag={(tagId) => {
            void handleAttachExistingTag(tagId);
          }}
          onCreateTag={handleCreateTag}
          onDeleteTag={handleDeleteTag}
        />

        <div className="h-px bg-[#e3f2f3]" />

        <div className="pt-[25px]">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h3 className="font-roboto text-2xl font-bold text-[#223759]">
              Notes
            </h3>
            <button
              type="button"
              disabled={isSavingNote}
              onClick={() => {
                setIsAddingNote(true);
                setEditingNoteId(null);
                setNoteError(null);
              }}
              className="h-9 rounded-md bg-zinc-950 px-5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50">
              Add note
            </button>
          </div>
          {isAddingNote && (
            <div className="mb-2">
              <NoteForm
                key="new-note"
                isSaving={isSavingNote}
                submitLabel="Add note"
                onSubmit={handleCreateNote}
                onCancel={() => setIsAddingNote(false)}
              />
            </div>
          )}

          {noteError && (
            <p className="mb-2 text-sm font-medium text-[#9B4A4A]">
              {noteError}
            </p>
          )}

          {areNotesLoading ? (
            <>
              <NoteSkeleton />
              <NoteSkeleton />
            </>
          ) : notes.length === 0 && !isAddingNote ? (
            <EmptyState
              title="No notes yet"
              description="Create your first note to remember important information."
            />
          ) : (
            notes.map((note) =>
              editingNoteId === note.id ? (
                <div key={note.id} className="border-t border-[#e3f2f3] py-4">
                  <NoteForm
                    key={`edit-note-${note.id}`}
                    initialValues={{ title: note.title, text: note.text }}
                    isSaving={isSavingNote}
                    submitLabel="Update note"
                    onSubmit={(values) => handleUpdateNote(note, values)}
                    onCancel={() => setEditingNoteId(null)}
                  />
                </div>
              ) : (
                <div key={note.id} className="border-t border-[#e3f2f3]">
                  <Note
                    title={note.title}
                    text={note.text}
                    date={formatDate(note.createdAt)}
                    isSaving={isSavingNote}
                    onEdit={() => {
                      setEditingNoteId(note.id);
                      setIsAddingNote(false);
                      setNoteError(null);
                    }}
                    onDelete={() => handleDeleteNote(note)}
                  />
                </div>
              ),
            )
          )}
        </div>
      </section>
    </div>
  );
}
