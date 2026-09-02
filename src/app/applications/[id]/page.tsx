"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Application, ApplicationEvent, ApplicationStatus, STATUS_LABELS } from "@/types";
import { StatusBadge } from "@/components/applications/status-badge";
import { Timeline } from "@/components/timeline/timeline";
import { formatDate } from "@/lib/utils";

const STATUS_OPTIONS: ApplicationStatus[] = [
  "APPLIED",
  "SCREENING",
  "INTERVIEW",
  "ASSESSMENT",
  "HR",
  "OFFER",
  "REJECTED",
  "GHOSTED",
  "WITHDRAWN",
];

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [application, setApplication] = useState<Application | null>(null);
  const [events, setEvents] = useState<ApplicationEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchApplication();
  }, [id]);

  async function fetchApplication() {
    const res = await fetch(`/api/applications/${id}`);
    if (res.ok) {
      const data = await res.json();
      setApplication(data);
      setEvents(data.events || []);
    }
    setLoading(false);
  }

  async function handleStatusChange(newStatus: ApplicationStatus) {
    if (!application || newStatus === application.status) return;
    setUpdating(true);

    const res = await fetch(`/api/applications/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      const data = await res.json();
      setApplication(data);
      setEvents(data.events || []);
    }
    setUpdating(false);
  }

  async function handleDelete() {
    if (!confirm("Delete this application?")) return;

    const res = await fetch(`/api/applications/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/applications");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FBFBFA]">
        <p className="text-sm text-[#B0AEA8]">Loading...</p>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FBFBFA]">
        <p className="text-sm text-[#787774]">Application not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFA]">
      <header className="border-b border-[#EAEAEA] bg-white">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-6 py-5">
          <Link
            href="/applications"
            className="text-sm font-medium text-[#787774] hover:text-[#111111] transition-colors"
          >
            Applications
          </Link>
          <span className="text-[#EAEAEA]">/</span>
          <h1 className="text-lg font-semibold tracking-tight text-[#111111] truncate">
            {application.company}
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="border border-[#EAEAEA] bg-white p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-[#111111]">
                    {application.company}
                  </h2>
                  <p className="text-sm text-[#787774] mt-0.5">{application.role}</p>
                  {application.location && (
                    <p className="text-xs text-[#B0AEA8] mt-1">{application.location}</p>
                  )}
                </div>
                <StatusBadge status={application.status} />
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-widest text-[#B0AEA8] mb-1">
                    Applied Date
                  </p>
                  <p className="text-sm text-[#111111]">
                    {formatDate(application.appliedDate)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-widest text-[#B0AEA8] mb-1">
                    Resume Version
                  </p>
                  <p className="text-sm text-[#111111]">
                    {application.resumeVersion || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-widest text-[#B0AEA8] mb-1">
                    Platform
                  </p>
                  <p className="text-sm text-[#111111]">
                    {application.platform || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-widest text-[#B0AEA8] mb-1">
                    Follow-up Date
                  </p>
                  <p className="text-sm text-[#111111]">
                    {application.followupDate
                      ? formatDate(application.followupDate)
                      : "N/A"}
                  </p>
                </div>
                {application.jobUrl && (
                  <div className="sm:col-span-2">
                    <p className="text-[10px] font-medium uppercase tracking-widest text-[#B0AEA8] mb-1">
                      Job URL
                    </p>
                    <a
                      href={application.jobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#111111] underline underline-offset-4 hover:text-[#787774] transition-colors"
                    >
                      Open Job Posting
                    </a>
                  </div>
                )}
              </div>

              {application.notes && (
                <div className="mt-5 pt-5 border-t border-[#EAEAEA]">
                  <p className="text-[10px] font-medium uppercase tracking-widest text-[#B0AEA8] mb-1">
                    Notes
                  </p>
                  <p className="text-sm text-[#787774]">
                    {application.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="border border-[#EAEAEA] bg-white p-6">
              <h3 className="text-xs font-medium uppercase tracking-widest text-[#787774] mb-5">
                Timeline
              </h3>
              <Timeline events={events} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="border border-[#EAEAEA] bg-white p-5">
              <h3 className="text-[10px] font-medium uppercase tracking-widest text-[#787774] mb-3">
                Update Status
              </h3>
              <div className="space-y-1">
                {STATUS_OPTIONS.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={updating || status === application.status}
                    className={`block w-full px-3 py-2 text-left text-sm transition-colors ${
                      status === application.status
                        ? "bg-[#F7F6F3] font-medium text-[#111111]"
                        : "text-[#787774] hover:bg-[#FBFBFA] hover:text-[#111111]"
                    } disabled:opacity-50`}
                  >
                    {STATUS_LABELS[status]}
                  </button>
                ))}
              </div>
            </div>

            <div className="border border-[#EAEAEA] bg-white p-5">
              <button
                onClick={handleDelete}
                className="w-full px-4 py-2.5 text-sm font-medium text-[#9F2F2D] hover:bg-[#FDEBEC] transition-colors"
              >
                Delete Application
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
