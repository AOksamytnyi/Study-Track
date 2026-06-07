type TagProps = {
  title: string;
  onDelete?: () => void;
  disabled?: boolean;
};

export function Tag(props: TagProps) {
  return (
    <div className="group relative flex h-5 max-w-32 items-center justify-center rounded-[50px] border border-black bg-white px-3">
      <span className="truncate text-[10px] font-bold uppercase leading-none text-black">
        {props.title}
      </span>
      {props.onDelete && (
        <button
          type="button"
          disabled={props.disabled}
          onClick={props.onDelete}
          aria-label={`Delete ${props.title} tag`}
          className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-[#9B1C1C] text-[11px] font-bold leading-none text-white opacity-0 shadow-[0px_1px_3px_rgba(0,0,0,0.2)] transition group-hover:opacity-100 group-focus-within:opacity-100 hover:bg-[#7F1D1D] disabled:cursor-not-allowed disabled:opacity-50">
          x
        </button>
      )}
    </div>
  );
}
