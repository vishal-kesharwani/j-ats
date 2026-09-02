import Link from "next/link";
import { StatusBadge } from "@/components/applications/status-badge";
import { formatDate } from "@/lib/utils";

interface ApplicationData {
  id: string;
  company: string;
  role: string;
  location: string | null;
  platform: string | null;
  appliedDate: string;
  resumeVersion: string | null;
  status: string;
}

interface RecentApplicationsProps {
  applications: ApplicationData[];
}

export function RecentApplications({ applications }: RecentApplicationsProps) {
  if (applications.length === 0) {
    return (
      <div className="border border-dashed border-[#EAEAEA] p-12 text-center">
        <p className="text-sm text-[#787774]">No applications yet.</p>
        <Link
          href="/applications/new"
          className="mt-3 inline-block text-sm font-medium text-[#111111] underline underline-offset-4 hover:text-[#787774] transition-colors"
        >
          Add your first application
        </Link>
      </div>
    );
  }

  return (
    <div className="border border-[#EAEAEA] bg-white">
      <div className="border-b border-[#EAEAEA] px-5 py-4">
        <h2 className="text-xs font-medium uppercase tracking-widest text-[#787774]">
          Recent
        </h2>
      </div>
      <div className="divide-y divide-[#EAEAEA]">
        {applications.map((app) => (
          <Link
            key={app.id}
            href={`/applications/${app.id}`}
            className="flex items-center justify-between px-5 py-4 hover:bg-[#FBFBFA] transition-colors"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[#111111] truncate">
                {app.company}
              </p>
              <p className="text-xs text-[#787774] truncate">{app.role}</p>
            </div>
            <div className="ml-4 flex items-center gap-3">
              <span className="text-xs text-[#B0AEA8]">
                {formatDate(app.appliedDate)}
              </span>
              <StatusBadge status={app.status as never} size="sm" />
            </div>
          </Link>
        ))}
      </div>
      <div className="border-t border-[#EAEAEA] px-5 py-3 text-center">
        <Link
          href="/applications"
          className="text-xs font-medium text-[#787774] hover:text-[#111111] transition-colors"
        >
          View all
        </Link>
      </div>
    </div>
  );
}
