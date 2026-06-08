import { useState, type FormEvent } from "react";

type NoteFormValues = {
  title: string;
  text: string;
};

type NoteFormProps = {
  initialValues?: NoteFormValues;
  isSaving?: boolean;
  submitLabel?: string;
  onSubmit: (values: NoteFormValues) => Promise<void> | void;
  onCancel?: () => void;
};

export function NoteForm({
  initialValues,
  isSaving = false,
  submitLabel = "Save note",
  onSubmit,
  onCancel,
}: NoteFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [text, setText] = useState(initialValues?.text ?? "");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const titleValue = title.trim();
    const textValue = text.trim();

    if (!titleValue || !textValue) {
      setError("Title and text are required.");
      return;
    }

    setError(null);
    await onSubmit({ title: titleValue, text: textValue });

    if (!initialValues) {
      setTitle("");
      setText("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-lg border border-[#e3f2f3] bg-white p-4 font-roboto">
      <input
        value={title}
        disabled={isSaving}
        maxLength={100}
        onChange={(event) => {
          setTitle(event.target.value);
          setError(null);
        }}
        placeholder="Note title"
        className="w-full border-b border-[#e3f2f3] bg-transparent py-1.5 text-2xl font-medium text-[#223759] outline-none placeholder:text-[#6f6f70]/50 focus:border-[#223759] disabled:opacity-60"
      />

      <textarea
        value={text}
        disabled={isSaving}
        rows={4}
        onChange={(event) => {
          setText(event.target.value);
          setError(null);
        }}
        placeholder="Write your note"
        className="min-h-24 w-full resize-y border-b border-[#e3f2f3] bg-transparent py-1.5 text-base font-light text-[#6f6f70] outline-none placeholder:text-[#6f6f70]/50 focus:border-[#223759] disabled:opacity-60"
      />

      {error && <p className="text-sm font-medium text-[#9B4A4A]">{error}</p>}

      <div className="flex flex-wrap justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            disabled={isSaving}
            onClick={onCancel}
            className="h-9 rounded-md border border-neutral-300 px-5 text-sm font-medium text-neutral-500 transition hover:border-neutral-500 hover:text-[#223759] disabled:cursor-not-allowed disabled:opacity-50">
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSaving}
          className="h-9 rounded-md bg-zinc-950 px-5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50">
          {isSaving ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
