import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function toISTDate(date: Date): string {
  const ist = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
  const y = ist.getUTCFullYear();
  const m = String(ist.getUTCMonth() + 1).padStart(2, "0");
  const d = String(ist.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export async function GET() {
  try {
    const now = new Date();
    const istNow = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);

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

    return NextResponse.json({ dailyCounts, todayCount });
  } catch (error) {
    console.error("GET /api/daily-count error:", error);
    return NextResponse.json(
      { dailyCounts: [], todayCount: 0 },
      { status: 200 }
    );
  }
}
