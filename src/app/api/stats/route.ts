import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const [
      total,
      applied,
      screening,
      interview,
      assessment,
      hr,
      offer,
      rejected,
      ghosted,
      withdrawn,
      followupsDue,
    ] = await Promise.all([
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

    return NextResponse.json({
      total,
      applied,
      screening,
      interview,
      assessment,
      hr,
      offer,
      rejected,
      ghosted,
      withdrawn,
      followupsDue,
    });
  } catch (error) {
    console.error("GET /api/stats error:", error);
    return NextResponse.json({
      total: 0,
      applied: 0,
      screening: 0,
      interview: 0,
      assessment: 0,
      hr: 0,
      offer: 0,
      rejected: 0,
      ghosted: 0,
      withdrawn: 0,
      followupsDue: 0,
    }, { status: 200 });
  }
}
