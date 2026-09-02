import Link from "next/link";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentApplications } from "@/components/dashboard/recent-applications";
import { prisma } from "@/lib/db";
import { checkStaleApplications } from "@/lib/auto-status";

export const dynamic = "force-dynamic";

async function getStats() {
  try {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const [total, applied, screening, interview, assessment, hr, offer, rejected, ghosted, withdrawn, followupsDue] =
      await Promise.all([
        prisma.application.count(),
        prisma.application.count({ where: { status: "APPLIED" } }),
        prisma.application.count({ where: { status: "SCREENING" } }),
        prisma.application.count({ where: { status: "INTERVIEW" } }),
        prisma.application.count({ where: { status: "ASSESSMENT" } }),
        prisma.application.count({ where: { status: "HR" } }),
        prisma.application.count({ where: { status: "OFFER" } }),
        prisma.application.count({ where: { status: "REJECTED" } }),
        prisma.application.count({ where: { status: "GHOSTED" } }),
        prisma.application.count({ where: { status: "WITHDRAWN" } }),
        prisma.application.count({
          where: {
            followupDate: { lte: today },
            status: { notIn: ["OFFER", "REJECTED", "GHOSTED", "WITHDRAWN"] },
          },
        }),
      ]);

    return { total, applied, screening, interview, assessment, hr, offer, rejected, ghosted, withdrawn, followupsDue };
  } catch {
    return { total: 0, applied: 0, screening: 0, interview: 0, assessment: 0, hr: 0, offer: 0, rejected: 0, ghosted: 0, withdrawn: 0, followupsDue: 0 };
  }
}

async function getRecentApplications() {
  try {
    const apps = await prisma.application.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    });
    return apps.map((app) => ({
      ...app,
      appliedDate: app.appliedDate.toISOString(),
      followupDate: app.followupDate?.toISOString() || null,
      createdAt: app.createdAt.toISOString(),
      updatedAt: app.updatedAt.toISOString(),
    }));
  } catch {
    return [];
  }
}

async function getFollowups() {
  try {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const followups = await prisma.application.findMany({
      where: {
        followupDate: { lte: today },
        status: { notIn: ["OFFER", "REJECTED", "GHOSTED", "WITHDRAWN"] },
      },
      orderBy: { followupDate: "asc" },
      take: 5,
    });

    return followups.map((f) => ({
      ...f,
      appliedDate: f.appliedDate.toISOString(),
      followupDate: f.followupDate?.toISOString() || null,
      createdAt: f.createdAt.toISOString(),
      updatedAt: f.updatedAt.toISOString(),
    }));
  } catch {
    return [];
  }
}

export default async function DashboardPage() {
  await checkStaleApplications();

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
              href="/resume-builder"
              className="text-xs font-medium text-[#787774] hover:text-[#111111] transition-colors"
            >
              Resume Builder
            </Link>
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
                    {followups.map(
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
