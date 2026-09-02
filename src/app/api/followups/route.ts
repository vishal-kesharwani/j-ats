import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const followups = await prisma.application.findMany({
    where: {
      followupDate: { lte: today },
      status: { notIn: ["OFFER", "REJECTED", "GHOSTED", "WITHDRAWN"] },
    },
    orderBy: { followupDate: "asc" },
  });

  return NextResponse.json(followups);
}
