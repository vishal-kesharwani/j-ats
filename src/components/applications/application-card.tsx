import Link from "next/link";
import { Application } from "@/types";
import { StatusBadge } from "./status-badge";
import { formatDate } from "@/lib/utils";

interface ApplicationCardProps {
  application: Application;
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  return (
    <Link
      href={`/applications/${application.id}`}
      className="block border border-[#EAEAEA] bg-white p-5 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold tracking-tight text-[#111111] group-hover:text-[#333333] transition-colors">
            {application.company}
          </h3>
          <p className="mt-0.5 text-sm text-[#787774] truncate">{application.role}</p>
          <div className="mt-2 flex items-center gap-3 text-xs text-[#B0AEA8]">
            {application.location && <span>{application.location}</span>}
            {application.platform && (
              <>
                <span className="text-[#EAEAEA]">|</span>
                <span>{application.platform}</span>
              </>
            )}
          </div>
        </div>
        <StatusBadge status={application.status} size="sm" />
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-[#EAEAEA] pt-3">
        <span className="text-xs text-[#B0AEA8]">
          {formatDate(application.appliedDate)}
        </span>
        {application.resumeVersion && (
          <span className="rounded-[4px] bg-[#F7F6F3] px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-[#787774]">
            {application.resumeVersion}
          </span>
        )}
      </div>
    </Link>
  );
}
