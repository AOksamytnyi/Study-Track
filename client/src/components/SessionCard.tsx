import { Link } from "react-router-dom";
import { Tag } from "./Tag";

export type SessionTag = {
  id: number;
  title: string;
  color: string;
};

type SessionCardProps = {
  id: number;
  title: string;
  date: string;
  description: string;
  tag: SessionTag | null;
  difficulty: "easy" | "medium" | "hard";
  comments: number;
};

export default function SessionCard(props: SessionCardProps) {
  return (
    <Link
      to={`/sessions/${props.id}`}
      className="w-90.75 h-50 flex flex-col gap-2.5 overflow-hidden rounded-lg bg-white shadow-[0px_0px_3px_1px_rgba(0,0,0,0.15)] p-3.75 font-roboto transition hover:-translate-y-0.5 hover:shadow-[0px_6px_18px_rgba(0,0,0,0.08)]">
      <div className="flex justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-px">
          <h2 className="truncate text-2xl text-slate-700 font-medium">
            {props.title}
          </h2>
          <div className="flex min-w-0 items-center gap-3">
            <img src="/clock unfill.svg" alt="" className="shrink-0" />
            <p className="truncate text-sm text-neutral-500 font-light">
              {props.date}
            </p>
          </div>
        </div>
        <div
          className={`w-12 h-5 relative shrink-0 rounded-[50px] flex justify-center items-center`}
          style={{
            backgroundColor: `${
              props.difficulty === "easy"
                ? "#5D7285"
                : props.difficulty === "medium"
                  ? "#7C6F42"
                  : "#9B4A4A"
            }`,
          }}>
          <span className="font-bold uppercase text-[10px] text-white">
            {props.difficulty}
          </span>
        </div>
      </div>

      <p className="block min-h-0 max-w-full flex-1 overflow-hidden break-words text-base text-neutral-500 font-light [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
        {props.description}
      </p>

      <div className="flex justify-between w-full mt-auto gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <img src="/message 3.svg" alt="" className="shrink-0" />
          <p className="text-sm text-neutral-500 font-light">
            {props.comments}
          </p>
        </div>
        {props.tag ? (
          <Tag title={props.tag.title} color={props.tag.color} />
        ) : (
          <div className="shrink-0 text-sm text-neutral-500 font-light">
            no tags
          </div>
        )}
      </div>
    </Link>
  );
}
