type DashboardMetricCardProps = {
  label: string;
  value: number;
  variant: "green" | "blue" | "yellow";
};

const metricColors: Record<DashboardMetricCardProps["variant"], string> = {
  green: "bg-[#90BE6D]",
  blue: "bg-[#339FD5]",
  yellow: "bg-[#FFD166]",
};

export function DashboardMetricCard({
  label,
  value,
  variant,
}: DashboardMetricCardProps) {
  return (
    <article
      className={`relative flex h-[138px] min-w-0 flex-1 flex-col items-center justify-center rounded-lg px-6 text-white shadow-[0px_0px_12px_0px_rgba(0,0,0,0.16)] ${metricColors[variant]}`}>
      <span className="absolute right-4 top-2 font-nunito text-xs font-black text-black/50">
        Study Track
      </span>
      <strong className="font-nunito text-[40px] font-black leading-none">
        {value}
      </strong>
      <span className="mt-2 text-center font-nunito text-2xl font-black leading-7">
        {label}
      </span>
    </article>
  );
}
