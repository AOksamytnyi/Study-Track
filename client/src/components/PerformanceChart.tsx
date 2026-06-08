import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";

type PerformancePoint = {
  label: string;
  value: number;
};

type PerformanceChartProps = {
  data: PerformancePoint[];
};

ChartJS.register(
  CategoryScale,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
);

export function PerformanceChart({ data }: PerformanceChartProps) {
  const chartData: ChartData<"line"> = {
    labels: data.map((point) => point.label),
    datasets: [
      {
        label: "Sessions",
        data: data.map((point) => point.value),
        borderColor: "#ff775f",
        backgroundColor: "rgba(255, 119, 95, 0.16)",
        borderWidth: 3,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0.42,
      },
    ],
  };

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index",
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#223759",
        displayColors: false,
        padding: 10,
      },
    },
    scales: {
      x: {
        border: {
          display: false,
        },
        grid: {
          display: false,
        },
        ticks: {
          color: "#6b7280",
          font: { size: 12 },
          maxRotation: 0,
        },
      },
      y: {
        min: 0,
        max: 12,
        ticks: {
          stepSize: 2,
          color: "#6b7280",
          font: { size: 12 },
        },
        border: {
          display: false,
        },
        grid: {
          color: "#e5e7eb",
        },
      },
    },
  };

  return (
    <section className="rounded-lg bg-white p-7 shadow-[0px_0px_12px_0px_rgba(0,0,0,0.16)]">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <h2 className="font-nunito text-[26px] font-semibold text-[#0e2040]">
          Performance
        </h2>
        <div className="flex h-[34px] items-center gap-3 rounded bg-[#238899]/20 px-4 font-nunito text-sm text-[#238899]">
          This Week
          <span className="size-0 border-x-[5px] border-t-[6px] border-x-transparent border-t-[#238899]" />
        </div>
      </div>

      <div className="mb-2 flex justify-end">
        <div className="flex items-center gap-2 text-sm text-[#787486]">
          <span className="size-2.5 rounded-full bg-[#ff775f]" />
          Sessions
        </div>
      </div>

      <div className="h-[300px]">
        <Line data={chartData} options={chartOptions} />
      </div>
    </section>
  );
}
