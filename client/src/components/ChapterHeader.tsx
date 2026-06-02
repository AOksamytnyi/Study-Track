type ChapterHeaderProps = {
  title: string;
  description: string;
};

export function ChapterHeader(props: ChapterHeaderProps) {
  return (
    <div className="flex flex-col gap-2.5 font-roboto">
      <h2 className="font-medium text-xl text-slate-700"> {props.title}</h2>
      <p className="text-sm text-neutral-500 font-light">
        {" "}
        {props.description}
      </p>
    </div>
  );
}
