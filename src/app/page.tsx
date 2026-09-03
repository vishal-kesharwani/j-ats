import Link from "next/link";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentApplications } from "@/components/dashboard/recent-applications";
import { DailyTarget } from "@/components/dashboard/daily-target";
import { ApplicationGraph } from "@/components/dashboard/application-graph";
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

function toISTDate(date: Date): string {
  const ist = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
  const y = ist.getUTCFullYear();
  const m = String(ist.getUTCMonth() + 1).padStart(2, "0");
  const d = String(ist.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

async function getDailyCounts() {
  try {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);

    const applications = await prisma.application.findMany({
      where: {
        appliedDate: { gte: thirtyDaysAgo },
      },
      select: { appliedDate: true },
    });

    const countMap: Record<string, number> = {};

    for (let i = 0; i < 30; i++) {
      const d = new Date(thirtyDaysAgo);
      d.setDate(d.getDate() + i);
      countMap[toISTDate(d)] = 0;
    }

    applications.forEach((app) => {
      const key = toISTDate(app.appliedDate);
      if (countMap[key] !== undefined) {
        countMap[key]++;
      }
    });

    const dailyCounts = Object.entries(countMap).map(([date, count]) => ({
      date,
      count,
    }));

    const todayKey = toISTDate(now);
    const todayCount = countMap[todayKey] || 0;

    return { dailyCounts, todayCount };
  } catch {
    return { dailyCounts: [], todayCount: 0 };
  }
}

export default async function DashboardPage() {
  await checkStaleApplications();

  const [stats, recentApps, followups, dailyData] = await Promise.all([
    getStats(),
    getRecentApplications(),
    getFollowups(),
    getDailyCounts(),
  ]);

  return (
    <div className="min-h-screen bg-[#FBFBFA]">
      <header className="border-b border-[#EAEAEA] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#111111] flex items-center justify-center">
              <span className="text-white text-xs font-bold">J</span>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-[#111111]">
                J-ATS
              </h1>
              <p className="text-[9px] text-[#B0AEA8] uppercase tracking-[0.2em]">Job Application Tracker</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/resume-builder"
              className="px-4 py-2 text-[10px] font-medium text-[#787774] hover:text-[#111111] hover:bg-[#F7F6F3] transition-all uppercase tracking-widest"
            >
              Resume
            </Link>
            <Link
              href="/followups"
              className="px-4 py-2 text-[10px] font-medium text-[#787774] hover:text-[#111111] hover:bg-[#F7F6F3] transition-all uppercase tracking-widest relative"
            >
              Follow-ups
              {stats.followupsDue > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#9F2F2D] text-[8px] font-bold text-white flex items-center justify-center">
                  {stats.followupsDue}
                </span>
              )}
            </Link>
            <Link
              href="/applications/new"
              className="bg-[#111111] px-5 py-2 text-[10px] font-medium text-white hover:bg-[#333333] active:scale-[0.98] transition-all uppercase tracking-widest"
            >
              + New
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Stats */}
        <StatsCards stats={stats} />

        {/* Target + Graph */}
        <div className="grid gap-6 lg:grid-cols-3 mt-6">
          <div>
            <DailyTarget todayCount={dailyData.todayCount} />
          </div>
          <div className="lg:col-span-2">
            <ApplicationGraph data={dailyData.dailyCounts} />
          </div>
        </div>

        {/* Recent + Follow-ups */}
        <div className="grid gap-6 lg:grid-cols-3 mt-6">
          <div className="lg:col-span-2">
            <RecentApplications applications={recentApps} />
          </div>

          <div>
            <div className="border border-[#EAEAEA] bg-white h-full">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAEAEA]">
                <h2 className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#B0AEA8]">
                  Follow-ups Due
                </h2>
                <Link
                  href="/followups"
                  className="text-[10px] font-medium text-[#787774] hover:text-[#111111] transition-colors uppercase tracking-widest"
                >
                  View all
                </Link>
              </div>
              {followups.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <div className="w-10 h-10 mx-auto mb-3 bg-[#EDF3EC] flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#346538]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-xs text-[#787774]">All caught up</p>
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
                        className="flex items-center justify-between px-6 py-4 hover:bg-[#FBFBFA] transition-colors group"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#111111] group-hover:text-[#333333] transition-colors truncate">
                            {f.company}
                          </p>
                          <p className="text-xs text-[#787774] truncate">{f.role}</p>
                        </div>
                        {f.resumeVersion && (
                          <span className="ml-2 shrink-0 rounded-[3px] bg-[#F7F6F3] px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-widest text-[#787774]">
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
      </main>
    </div>
  );
}
