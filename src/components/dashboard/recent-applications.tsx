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
      <div className="border border-dashed border-[#EAEAEA] p-16 text-center">
        <div className="w-12 h-12 mx-auto mb-4 bg-[#FBFBFA] flex items-center justify-center">
          <svg className="w-6 h-6 text-[#B0AEA8]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <p className="text-sm text-[#787774] mb-2">No applications yet</p>
        <Link
          href="/applications/new"
          className="inline-block text-xs font-medium text-[#111111] underline underline-offset-4 decoration-1 hover:text-[#787774] transition-colors"
        >
          Add your first application
        </Link>
      </div>
    );
  }

  return (
    <div className="border border-[#EAEAEA] bg-white">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAEAEA]">
        <h2 className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#B0AEA8]">
          Recent Applications
        </h2>
        <Link
          href="/applications"
          className="text-[10px] font-medium text-[#787774] hover:text-[#111111] transition-colors uppercase tracking-widest"
        >
          View all
        </Link>
      </div>
      <div className="divide-y divide-[#EAEAEA]">
        {applications.map((app) => (
          <Link
            key={app.id}
            href={`/applications/${app.id}`}
            className="flex items-center justify-between px-6 py-4 hover:bg-[#FBFBFA] transition-colors group"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-[#111111] group-hover:text-[#333333] transition-colors">
                  {app.company}
                </p>
                {app.platform && (
                  <span className="text-[9px] font-medium text-[#B0AEA8] bg-[#F7F6F3] px-1.5 py-0.5 uppercase tracking-wider">
                    {app.platform}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#787774] mt-0.5">{app.role}</p>
            </div>
            <div className="ml-4 flex items-center gap-3">
              <span className="text-[10px] text-[#B0AEA8]">
                {formatDate(app.appliedDate)}
              </span>
              <StatusBadge status={app.status as never} size="sm" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
