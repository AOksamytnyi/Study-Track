type NoteProps = {
  title: string;
  text: string;
  date: string;
  isSaving?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function Note(props: NoteProps) {
  return (
    <article className="relative min-h-[184px] pt-[25px] font-roboto">
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0 max-w-[calc(100%-88px)]">
          <h3 className="break-words text-[32px] font-medium leading-8 text-[#223759]">
            {props.title}
          </h3>
          <p className="mt-[18px] whitespace-pre-wrap break-words text-xl font-light leading-[1.291] text-[#6f6f70]">
            {props.text}
          </p>
        </div>

        <div className="mt-[11px] flex shrink-0 items-center gap-3">
          {props.onEdit && (
            <button
              type="button"
              disabled={props.isSaving}
              onClick={props.onEdit}
              aria-label={`Edit ${props.title}`}
              className="size-6 disabled:cursor-not-allowed disabled:opacity-50">
              <img src="/edit.svg" alt="" className="size-6" />
            </button>
          )}
          {props.onDelete && (
            <button
              type="button"
              disabled={props.isSaving}
              onClick={props.onDelete}
              aria-label={`Delete ${props.title}`}
              className="flex size-6 items-center justify-center rounded-full border border-[#9B4A4A] text-sm font-bold leading-none text-[#9B4A4A] transition hover:bg-[#9B4A4A] hover:text-white disabled:cursor-not-allowed disabled:opacity-50">
              x
            </button>
          )}
        </div>
      </div>

      <div className="absolute bottom-[25px] right-0 flex items-center gap-3">
        <img src="/clock unfill.svg" alt="" className="size-4" />
        <p className="text-sm font-light leading-[1.291] text-[#6f6f70]">
          {props.date}
        </p>
      </div>
    </article>
  );
}
