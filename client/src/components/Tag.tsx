type TagProps = {
  title: string;
};

export function Tag(props: TagProps) {
  return (
    <div className="flex h-5 max-w-32 items-center justify-center rounded-[50px] border border-black bg-white px-3">
      <span className="truncate text-[10px] font-bold uppercase leading-none text-black">
        {props.title}
      </span>
    </div>
  );
}
