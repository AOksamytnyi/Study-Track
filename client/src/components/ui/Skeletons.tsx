import type { CSSProperties } from "react";

function SkeletonBlock({
  className = "",
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`animate-pulse rounded bg-slate-200 ${className}`}
      style={style}
    />
  );
}

export function SessionCardSkeleton() {
  return (
    <div className="flex h-50 w-90.75 flex-col gap-3 rounded-lg bg-white p-3.75 shadow-[0px_0px_3px_1px_rgba(0,0,0,0.15)]">
      <div className="flex justify-between gap-3">
        <div className="flex flex-1 flex-col gap-2">
          <SkeletonBlock className="h-7 w-2/3" />
          <SkeletonBlock className="h-4 w-1/2" />
        </div>
        <SkeletonBlock className="h-5 w-12 rounded-[50px]" />
      </div>

      <div className="flex flex-1 flex-col gap-2 py-2">
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-5/6" />
        <SkeletonBlock className="h-4 w-3/5" />
      </div>

      <div className="mt-auto flex items-center justify-between">
        <SkeletonBlock className="h-4 w-12" />
        <SkeletonBlock className="h-5 w-16 rounded-[50px]" />
      </div>
    </div>
  );
}

export function SessionDetailsSkeleton() {
  return (
    <div className="font-roboto">
      <SkeletonBlock className="mb-5 h-8 w-44" />
      <section className="min-h-[967px] rounded-lg bg-white px-[30px] py-[30px]">
        <div className="flex justify-between gap-8">
          <div className="w-full">
            <SkeletonBlock className="h-12 w-2/5" />
            <SkeletonBlock className="mt-5 h-6 w-3/4" />
          </div>
          <div className="flex min-w-28 flex-col items-end justify-between gap-4">
            <SkeletonBlock className="h-5 w-14 rounded-[50px]" />
            <SkeletonBlock className="h-5 w-16" />
          </div>
        </div>

        <div className="mt-[25px] h-px bg-[#e3f2f3]" />

        <div className="py-4">
          <SkeletonBlock className="h-7 w-20" />
          <div className="mt-4 flex gap-3">
            <SkeletonBlock className="h-5 w-16 rounded-[50px]" />
            <SkeletonBlock className="h-5 w-20 rounded-[50px]" />
          </div>
        </div>

        <div className="h-px bg-[#e3f2f3]" />
        <div className="pt-[25px]">
          <SkeletonBlock className="mb-4 h-8 w-24" />
          <NoteSkeleton />
          <NoteSkeleton />
        </div>
      </section>
    </div>
  );
}

export function NoteSkeleton() {
  return (
    <article className="relative min-h-[184px] border-t border-[#e3f2f3] pt-[25px]">
      <div className="flex items-start justify-between gap-6">
        <div className="w-full max-w-[calc(100%-88px)]">
          <SkeletonBlock className="h-8 w-1/3" />
          <div className="mt-[18px] flex flex-col gap-2">
            <SkeletonBlock className="h-5 w-full" />
            <SkeletonBlock className="h-5 w-5/6" />
            <SkeletonBlock className="h-5 w-2/3" />
          </div>
        </div>
        <SkeletonBlock className="mt-[11px] size-6 rounded-full" />
      </div>
      <SkeletonBlock className="absolute bottom-[25px] right-0 h-4 w-28" />
    </article>
  );
}

export function DashboardMetricSkeleton() {
  return (
    <div className="flex h-[138px] min-w-0 flex-1 flex-col items-center justify-center rounded-lg bg-white px-6 shadow-[0px_0px_12px_0px_rgba(0,0,0,0.16)]">
      <SkeletonBlock className="h-10 w-16" />
      <SkeletonBlock className="mt-3 h-7 w-28" />
    </div>
  );
}

export function DashboardChartSkeleton() {
  return (
    <section className="rounded-lg bg-white p-7 shadow-[0px_0px_12px_0px_rgba(0,0,0,0.16)]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <SkeletonBlock className="h-8 w-40" />
        <SkeletonBlock className="h-[34px] w-28" />
      </div>
      <SkeletonBlock className="mb-4 ml-auto h-4 w-24" />
      <div className="flex h-[300px] items-end gap-5">
        {[48, 72, 56, 94, 68, 84].map((height, index) => (
          <SkeletonBlock
            key={`${height}-${index}`}
            className="flex-1"
            style={{ height }}
          />
        ))}
      </div>
    </section>
  );
}

export function DashboardTopSessionSkeleton() {
  return (
    <div className="h-[107px] rounded-lg bg-white p-4 shadow-[0px_0px_3px_1px_rgba(0,0,0,0.15)]">
      <SkeletonBlock className="h-6 w-2/3" />
      <SkeletonBlock className="mt-2 h-4 w-32" />
      <div className="mt-5 flex justify-between">
        <SkeletonBlock className="h-4 w-10" />
        <SkeletonBlock className="h-4 w-16" />
      </div>
    </div>
  );
}
