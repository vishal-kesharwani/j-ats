import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const application = await prisma.application.findUnique({
      where: { id },
      include: { events: { orderBy: { eventDate: "desc" } } },
    });

    if (!application) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...application,
      appliedDate: application.appliedDate.toISOString(),
      followupDate: application.followupDate?.toISOString() || null,
      createdAt: application.createdAt.toISOString(),
      updatedAt: application.updatedAt.toISOString(),
      events: application.events.map((e) => ({
        ...e,
        eventDate: e.eventDate.toISOString(),
        createdAt: e.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("GET /api/applications/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.application.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const { status, ...otherFields } = body;

    const updateData: Record<string, unknown> = {};

    if (otherFields.company !== undefined) updateData.company = otherFields.company;
    if (otherFields.role !== undefined) updateData.role = otherFields.role;
    if (otherFields.location !== undefined) updateData.location = otherFields.location || null;
    if (otherFields.jobUrl !== undefined) updateData.jobUrl = otherFields.jobUrl || null;
    if (otherFields.platform !== undefined) updateData.platform = otherFields.platform || null;
    if (otherFields.resumeVersion !== undefined) updateData.resumeVersion = otherFields.resumeVersion || null;
    if (otherFields.notes !== undefined) updateData.notes = otherFields.notes || null;
    if (otherFields.appliedDate !== undefined) updateData.appliedDate = new Date(otherFields.appliedDate);

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

    return NextResponse.json({
      ...application,
      appliedDate: application.appliedDate.toISOString(),
      followupDate: application.followupDate?.toISOString() || null,
      createdAt: application.createdAt.toISOString(),
      updatedAt: application.updatedAt.toISOString(),
      events: application.events.map((e) => ({
        ...e,
        eventDate: e.eventDate.toISOString(),
        createdAt: e.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("PUT /api/applications/[id] error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await prisma.application.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.application.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/applications/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
