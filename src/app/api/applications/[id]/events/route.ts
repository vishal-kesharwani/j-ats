import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const events = await prisma.applicationEvent.findMany({
    where: { applicationId: id },
    orderBy: { eventDate: "desc" },
  });

  return NextResponse.json(events);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { event, notes } = body;

  if (!event) {
    return NextResponse.json({ error: "Event is required" }, { status: 400 });
  }

  const existing = await prisma.application.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const applicationEvent = await prisma.applicationEvent.create({
    data: {
      applicationId: id,
      event,
      notes: notes || null,
      eventDate: new Date(),
    },
  });

  return NextResponse.json(applicationEvent, { status: 201 });
}
