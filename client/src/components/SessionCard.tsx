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
  comments: number;
};

export default function SessionCard(props: SessionCardProps) {
  return (
    <article
      key={props.id}
      className="w-90.75 h-50 flex flex-col gap-2.5 rounded-lg shadow-[0px_0px_3px_1px_rgba(0,0,0,0.15)] p-3.75 font-roboto">
      <div className="flex flex-col gap-px">
        <h2 className="text-2xl text-slate-700 font-medium">{props.title}</h2>
        <div className="flex gap-3 items-center">
          <img src="/clock unfill.svg" alt="" />
          <p className="text-sm text-neutral-500 font-light">{props.date}</p>
        </div>
      </div>

      <p className="text-base text-neutral-500 font-light">
        {props.description}
      </p>

      <div className="flex justify-between w-full mt-auto">
        <div className="flex gap-2.5 items-center">
          <img src="/message 3.svg" alt="" />
          <p className="text-sm text-neutral-500 font-light">
            {props.comments}
          </p>
        </div>
        {props.tag ? (
          <Tag title={props.tag.title} color={props.tag.color} />
        ) : (
          <div className="text-sm text-neutral-500 font-light">no tags</div>
        )}
      </div>
    </article>
  );
}
