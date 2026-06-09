import { DashboardMetricCard } from "../components/DashboardMetricCard";
import { DashboardTopSessionCard } from "../components/DashboardTopSessionCard";
import { PerformanceChart } from "../components/PerformanceChart";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { useAuthStore } from "../store/authStore";

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const { stats, isError, isLoading } = useDashboardStats();
  const username = user?.username || "Student";

  return (
    <div className="font-roboto">
      <section className="min-h-[calc(100vh-8rem)] bg-white px-7 py-6 sm:px-10">
        <div className="mb-10">
          <h1 className="font-nunito text-4xl font-bold text-black md:text-5xl">
            Hello {username}!
          </h1>
          <p className="mt-2 font-nunito text-2xl font-semibold text-[#9a93b3]">
            Have a good day with Study Track!
          </p>
        </div>

        {isError && (
          <div className="mb-6 rounded-lg border border-[#9B4A4A]/30 bg-[#9B4A4A]/10 p-4 text-sm font-medium text-[#9B4A4A]">
            Could not load dashboard statistics.
          </div>
        )}

        <div className="grid gap-7 lg:grid-cols-3">
          <DashboardMetricCard
            label="sessions"
            value={isLoading ? 0 : stats.totalSessions}
            variant="green"
          />
          <DashboardMetricCard
            label="study hours"
            value={isLoading ? 0 : stats.studyHours}
            variant="blue"
          />
          <DashboardMetricCard
            label="notes"
            value={isLoading ? 0 : stats.totalNotes}
            variant="yellow"
          />
        </div>

        <div className="mt-7 grid gap-7 xl:grid-cols-[minmax(0,2fr)_minmax(320px,0.9fr)]">
          <PerformanceChart data={stats.performance} />

          <aside className="rounded-lg bg-white p-1">
            <h2 className="mb-4 font-roboto text-[26px] font-medium leading-7 text-[#223759]">
              Top sessions with a large number of notes
            </h2>

            <div className="flex flex-col gap-5">
              {isLoading ? (
                <p className="rounded-lg bg-white p-4 text-sm font-light text-[#6f6f70] shadow-[0px_0px_3px_1px_rgba(0,0,0,0.15)]">
                  Loading sessions...
                </p>
              ) : stats.topSessions.length > 0 ? (
                stats.topSessions.map((session) => (
                  <DashboardTopSessionCard
                    key={session.id}
                    title={session.title}
                    date={session.date}
                    notesCount={session.notesCount}
                    tagsCount={session.tagsCount}
                  />
                ))
              ) : (
                <p className="rounded-lg bg-white p-4 text-sm font-light text-[#6f6f70] shadow-[0px_0px_3px_1px_rgba(0,0,0,0.15)]">
                  no sessions
                </p>
              )}
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
