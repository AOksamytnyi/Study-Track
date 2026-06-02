type NoteProps = {
  title: string;
  description: string;
  date: string;
};

export function Note(props: NoteProps) {
  return (
    <div className="flex flex-col gap-4.5 max-w-368.75 font-roboto">
      <div className="flex justify-between">
        <h2 className="text-slate-700 text-3xl font-medium">{props.title}</h2>
        <button type="button" aria-label="Edit note">
          <img src="/edit.svg" alt="" />
        </button>
      </div>
      <p className="text-xl font-light text-neutral-500">{props.description}</p>

      <div className="flex gap-3 ml-auto">
        <img src="/clock unfill.svg" alt="" />
        <p className="text-neutral-500 text-sm font-light">{props.date}</p>
      </div>
    </div>
  );
}
