import { ApplicationStatus, STATUS_LABELS, STATUS_COLORS } from "@/types";

interface StatusBadgeProps {
  status: ApplicationStatus;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const sizeClasses = size === "sm" ? "px-2.5 py-0.5 text-[10px]" : "px-3 py-1 text-[11px]";

  return (
    <span
      className={`inline-flex items-center rounded-[4px] font-medium uppercase tracking-widest ${STATUS_COLORS[status]} ${sizeClasses}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
