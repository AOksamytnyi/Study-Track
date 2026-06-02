type TagProps = {
  title: string;
  color: string;
};

export function Tag(props: TagProps) {
  return (
    <div
      className={`w-12 h-5 relative rounded-[50px] flex justify-center items-center`}
      style={{ backgroundColor: props.color }}>
      <span className="font-bold uppercase text-xs text-white">
        {props.title}
      </span>
    </div>
  );
}
