import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { addDays } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const followup = searchParams.get("followup");

  const where: Record<string, unknown> = {};

  if (status && status !== "ALL") {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { company: { contains: search, mode: "insensitive" } },
      { role: { contains: search, mode: "insensitive" } },
      { platform: { contains: search, mode: "insensitive" } },
    ];
  }

  if (followup === "true") {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    where.followupDate = { lte: today };
    where.status = { notIn: ["OFFER", "REJECTED", "GHOSTED", "WITHDRAWN"] };
  }

  const applications = await prisma.application.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { events: { orderBy: { eventDate: "desc" }, take: 1 } },
  });

  return NextResponse.json(applications);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { company, role, location, jobUrl, platform, appliedDate, resumeVersion, notes } =
    body;

  if (!company || !role) {
    return NextResponse.json(
      { error: "Company and role are required" },
      { status: 400 }
    );
  }

  const applied = appliedDate ? new Date(appliedDate) : new Date();
  const followup = addDays(applied, 7);

  const application = await prisma.application.create({
    data: {
      company,
      role,
      location: location || null,
      jobUrl: jobUrl || null,
      platform: platform || null,
      appliedDate: applied,
      resumeVersion: resumeVersion || null,
      notes: notes || null,
      followupDate: followup,
      events: {
        create: {
          event: "Applied",
          eventDate: applied,
          notes: notes || null,
        },
      },
    },
    include: { events: true },
  });

  return NextResponse.json(application, { status: 201 });
}
