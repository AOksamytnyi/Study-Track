type StatsSquareProps = {
  title: string;
  count: number;
};

export function StatsSquare(props: StatsSquareProps) {
  return (
    <div className="w-96 h-64 bg-[#90BE6D] rounded-2xl flex flex-col items-center gap-14.5 pt-1.75 pb-11 font-nunito">
      <p className="text-black/50 text-sm font-black ml-auto pr-3.5">
        Study Track
      </p>
      <div className="flex flex-col items-center gap-5">
        <h2 className="text-6xl font-black text-white">{props.count}</h2>
        <p className="text-3xl font-black text-white">{props.title}</p>
      </div>
    </div>
  );
}
