import { DashboardStats } from "@/types";

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    { label: "Total", value: stats.total, color: "text-[#111111]", bg: "bg-[#111111]" },
    { label: "Applied", value: stats.applied, color: "text-[#1F6C9F]", bg: "bg-[#1F6C9F]" },
    { label: "Screening", value: stats.screening, color: "text-[#956400]", bg: "bg-[#956400]" },
    { label: "Interview", value: stats.interview, color: "text-[#6B3FA0]", bg: "bg-[#6B3FA0]" },
    { label: "Offer", value: stats.offer, color: "text-[#346538]", bg: "bg-[#346538]" },
    { label: "Rejected", value: stats.rejected, color: "text-[#9F2F2D]", bg: "bg-[#9F2F2D]" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {cards.map((card, i) => (
        <div
          key={card.label}
          className="group relative overflow-hidden border border-[#EAEAEA] bg-white p-5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-300"
        >
          <div className={`absolute top-0 left-0 h-1 w-full ${card.bg} opacity-60`} />
          <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#B0AEA8] mb-2">
            {card.label}
          </p>
          <p className={`text-3xl font-bold tracking-tight ${card.color}`}>
            {card.value}
          </p>
          {card.label === "Total" && (
            <div className="mt-2 flex items-center gap-1">
              <div className="h-1 w-1 rounded-full bg-[#B0AEA8]" />
              <span className="text-[9px] text-[#B0AEA8]">all applications</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
