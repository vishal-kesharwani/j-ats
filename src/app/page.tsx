import Link from "next/link";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentApplications } from "@/components/dashboard/recent-applications";

export const dynamic = "force-dynamic";

async function getStats() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/stats`, {
    cache: "no-store",
  });
  return res.json();
}

async function getRecentApplications() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/applications`,
    { cache: "no-store" }
  );
  const apps = await res.json();
  return apps.slice(0, 5);
}

async function getFollowups() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/followups`,
    { cache: "no-store" }
  );
  return res.json();
}

export default async function DashboardPage() {
  const [stats, recentApps, followups] = await Promise.all([
    getStats(),
    getRecentApplications(),
    getFollowups(),
  ]);

  return (
    <div className="min-h-screen bg-[#FBFBFA]">
      <header className="border-b border-[#EAEAEA] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-[#111111]">
              J-ATS
            </h1>
            <p className="text-xs text-[#B0AEA8] mt-0.5">Job Application Tracker</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/followups"
              className="text-xs font-medium text-[#787774] hover:text-[#111111] transition-colors"
            >
              Follow-ups
              {stats.followupsDue > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-[4px] bg-[#FDEBEC] text-[10px] font-medium text-[#9F2F2D]">
                  {stats.followupsDue}
                </span>
              )}
            </Link>
            <Link
              href="/applications/new"
              className="bg-[#111111] px-5 py-2.5 text-xs font-medium text-white hover:bg-[#333333] active:scale-[0.98] transition-all"
            >
              + Add Job
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="space-y-8">
          <StatsCards stats={stats} />

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RecentApplications applications={recentApps} />
            </div>

            <div>
              <div className="border border-[#EAEAEA] bg-white">
                <div className="border-b border-[#EAEAEA] px-5 py-4">
                  <h2 className="text-xs font-medium uppercase tracking-widest text-[#787774]">
                    Follow-ups Due
                  </h2>
                </div>
                {followups.length === 0 ? (
                  <div className="px-5 py-8 text-center">
                    <p className="text-xs text-[#B0AEA8]">All caught up</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#EAEAEA]">
                    {followups.slice(0, 5).map(
                      (f: {
                        id: string;
                        company: string;
                        role: string;
                        resumeVersion: string | null;
                      }) => (
                        <Link
                          key={f.id}
                          href={`/applications/${f.id}`}
                          className="block px-5 py-4 hover:bg-[#FBFBFA] transition-colors"
                        >
                          <p className="text-sm font-medium text-[#111111]">
                            {f.company}
                          </p>
                          <p className="text-xs text-[#787774]">{f.role}</p>
                          {f.resumeVersion && (
                            <span className="mt-2 inline-block rounded-[4px] bg-[#F7F6F3] px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-[#787774]">
                              {f.resumeVersion}
                            </span>
                          )}
                        </Link>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
