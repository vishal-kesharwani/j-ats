import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const today = new Date();
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
      const key = d.toISOString().split("T")[0];
      countMap[key] = 0;
    }

    applications.forEach((app) => {
      const key = app.appliedDate.toISOString().split("T")[0];
      if (countMap[key] !== undefined) {
        countMap[key]++;
      }
    });

    const dailyCounts = Object.entries(countMap).map(([date, count]) => ({
      date,
      count,
    }));

    const todayKey = today.toISOString().split("T")[0];
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
