import { DashboardStats } from "@/types";

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    { label: "Total", value: stats.total, accent: false },
    { label: "Applied", value: stats.applied, accent: false },
    { label: "Screening", value: stats.screening, accent: false },
    { label: "Interview", value: stats.interview, accent: false },
    { label: "Offer", value: stats.offer, accent: true },
    { label: "Rejected", value: stats.rejected, accent: false },
  ];

  return (
    <div className="grid grid-cols-3 gap-px bg-[#EAEAEA] lg:grid-cols-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white p-5"
        >
          <p className="text-[10px] font-medium uppercase tracking-widest text-[#B0AEA8]">
            {card.label}
          </p>
          <p className={`mt-2 text-2xl font-semibold tracking-tight ${card.accent ? "text-[#346538]" : "text-[#111111]"}`}>
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
