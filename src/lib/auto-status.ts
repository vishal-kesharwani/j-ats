import { prisma } from "@/lib/db";

const STALE_DAYS = 30;

export async function checkStaleApplications() {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - STALE_DAYS);

    const staleApps = await prisma.application.findMany({
      where: {
        status: { in: ["APPLIED", "SCREENING"] },
        updatedAt: { lt: cutoffDate },
      },
    });

    for (const app of staleApps) {
      await prisma.application.update({
        where: { id: app.id },
        data: {
          status: "GHOSTED",
          followupDate: null,
        },
      });

      await prisma.applicationEvent.create({
        data: {
          applicationId: app.id,
          event: "Auto Ghosted",
          eventDate: new Date(),
          notes: `No update for ${STALE_DAYS} days. Auto-marked as Ghosted.`,
        },
      });
    }

    return staleApps.length;
  } catch (error) {
    console.error("checkStaleApplications error:", error);
    return 0;
  }
}
