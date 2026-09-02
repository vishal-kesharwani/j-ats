import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const application = await prisma.application.findUnique({
    where: { id },
    include: { events: { orderBy: { eventDate: "desc" } } },
  });

  if (!application) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(application);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const existing = await prisma.application.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { status, ...otherFields } = body;

  const updateData: Record<string, unknown> = { ...otherFields };

  if (status && status !== existing.status) {
    updateData.status = status;
    updateData.followupDate = null;

    await prisma.applicationEvent.create({
      data: {
        applicationId: id,
        event: status.charAt(0) + status.slice(1).toLowerCase(),
        eventDate: new Date(),
      },
    });
  }

  const application = await prisma.application.update({
    where: { id },
    data: updateData,
    include: { events: { orderBy: { eventDate: "desc" } } },
  });

  return NextResponse.json(application);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const existing = await prisma.application.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.application.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
