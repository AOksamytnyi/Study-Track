import { Link, useParams } from "react-router-dom";
import { useSession } from "../hooks/useSessions";
import type { Difficulty } from "../api/session";

const difficultyStyles: Record<
  Difficulty,
  { label: string; color: string; textColor: string; bordered?: boolean }
> = {
  easy: { label: "react", color: "#06D0F9", textColor: "#FFFFFF" },
  medium: {
    label: "medium",
    color: "#FFFFFF",
    textColor: "#000000",
    bordered: true,
  },
  hard: { label: "hard", color: "#9B4A4A", textColor: "#FFFFFF" },
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

function getSessionId(value: string | undefined) {
  if (!value) {
    return null;
  }

  const id = Number(value);
  return Number.isNaN(id) ? null : id;
}

export default function SessionDetails() {
  const { id } = useParams();
  const sessionId = getSessionId(id);
  const { data: session, isLoading } = useSession(sessionId);

  if (sessionId === null) {
    return (
      <div className="font-roboto text-[#6f6f70]">Invalid session id.</div>
    );
  }

  if (isLoading) {
    return <div className="font-roboto text-[#6f6f70]">Loading session...</div>;
  }

  if (!session) {
    return (
      <div className="flex flex-col gap-4 font-roboto">
        <h1 className="font-nunito text-[25px] font-semibold text-[#9a93b3]">
          Session not found
        </h1>
        <Link to="/sessions" className="text-sm font-medium text-[#223759]">
          Back to sessions
        </Link>
      </div>
    );
  }

  const difficulty = difficultyStyles[session.difficulty];
  const detailsDate = formatDate(session.date);
  const noteDescription = session.description;

  const notes = ["Note 1 (title)", "Note 2 (title)", "Note 3 (title)"];

  return (
    <div className="font-roboto">
      <h1 className="mb-5 font-nunito text-2xl font-semibold text-[#9a93b3]">
        Session detail
      </h1>

      <section className="min-h-[967px] rounded-lg bg-white px-[30px] py-[30px]">
        <div className="flex justify-between">
          <div className="">
            <h2 className="text-[48px] font-medium leading-7 text-[#223759]">
              {session.title || "TITLE"}
            </h2>
            <p className="mt-5 text-xl pl-1 font-light leading-[1.291] text-[#6f6f70]">
              {session.description || "description"}
            </p>
          </div>
          <span
            className="flex h-5 min-w-[50px] items-center justify-center rounded-[50px] px-1.5 text-[10px] font-bold uppercase leading-none"
            style={{
              backgroundColor: difficulty.color,
              color: difficulty.textColor,
              border: difficulty.bordered ? "1px solid #000000" : "none",
            }}>
            {difficulty.label}
          </span>
        </div>

        <div className="mt-[25px] h-px bg-[#e3f2f3]" />

        <div className="flex flex-col gap-1 py-1">
          <h3 className="font-roboto font-bold text-2xl text-[#223759]">Tags</h3>
          <div className="flex gap-[15px] py-3">
            <span className="flex h-5 min-w-[50px] items-center justify-center rounded-[50px] border border-black bg-white px-3 text-[10px] leading-none text-black">
              new
            </span>
          </div>

        </div>

        <div className="h-px bg-[#e3f2f3]" />

        <div>
          {notes.map((title) => (
            <article key={title} className="relative min-h-[184px] pt-[25px]">
              <div className="flex items-start justify-between gap-6">
                <div className="max-w-[calc(100%-50px)]">
                  <h3 className="text-[32px] font-medium leading-6 text-[#223759]">
                    {title}
                  </h3>
                  <p className="mt-[18px] text-xl font-light leading-[1.291] text-[#6f6f70]">
                    {noteDescription}
                  </p>
                </div>

                <button
                  type="button"
                  aria-label={`Edit ${title}`}
                  className="mt-[11px] size-6 shrink-0">
                  <img src="/edit.svg" alt="" className="size-6" />
                </button>
              </div>

              <div className="absolute bottom-[25px] right-0 flex items-center gap-3">
                <img src="/clock unfill.svg" alt="" className="size-4" />
                <p className="text-sm font-light leading-[1.291] text-[#6f6f70]">
                  {detailsDate}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
