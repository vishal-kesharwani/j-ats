import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
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
}
