import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
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
  } catch (error) {
    console.error("GET /api/followups error:", error);
    return NextResponse.json([], { status: 200 });
  }
}
