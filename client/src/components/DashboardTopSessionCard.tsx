type DashboardTopSessionCardProps = {
  title: string;
  date: string;
  notesCount: number;
  tagsCount: number;
};

export function DashboardTopSessionCard({
  title,
  date,
  notesCount,
  tagsCount,
}: DashboardTopSessionCardProps) {
  return (
    <article className="h-[107px] rounded-lg bg-white p-4 font-roboto shadow-[0px_0px_3px_1px_rgba(0,0,0,0.15)]">
      <h3 className="truncate text-2xl font-medium leading-6 text-[#223759]">
        {title}
      </h3>
      <div className="mt-1 flex min-w-0 items-center gap-3">
        <img src="/clock unfill.svg" alt="" className="size-4 shrink-0" />
        <p className="truncate text-sm font-light text-[#6f6f70]">{date}</p>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img src="/message 3.svg" alt="" className="size-[18px]" />
          <span className="text-sm font-light text-[#6f6f70]">
            {notesCount}
          </span>
        </div>
        <span className="truncate text-sm font-light text-[#6f6f70]">
          {tagsCount > 0 ? `${tagsCount} tags` : "no tags"}
        </span>
      </div>
    </article>
  );
}
