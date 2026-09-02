"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Application } from "@/types";
import { StatusBadge } from "@/components/applications/status-badge";
import { formatDate } from "@/lib/utils";

export default function FollowupsPage() {
  const [followups, setFollowups] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFollowups();
  }, []);

  async function fetchFollowups() {
    const res = await fetch("/api/followups");
    const data = await res.json();
    setFollowups(data);
    setLoading(false);
  }

  async function markDone(id: string) {
    const res = await fetch(`/api/applications/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ followupDate: null }),
    });

    if (res.ok) {
      setFollowups(followups.filter((f) => f.id !== id));
    }
  }

  async function snooze(id: string) {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + 3);

    const res = await fetch(`/api/applications/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ followupDate: newDate.toISOString() }),
    });

    if (res.ok) {
      setFollowups(followups.filter((f) => f.id !== id));
    }
  }

  return (
    <div className="min-h-screen bg-[#FBFBFA]">
      <header className="border-b border-[#EAEAEA] bg-white">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-6 py-5">
          <Link
            href="/"
            className="text-sm font-medium text-[#787774] hover:text-[#111111] transition-colors"
          >
            Dashboard
          </Link>
          <span className="text-[#EAEAEA]">/</span>
          <h1 className="text-lg font-semibold tracking-tight text-[#111111]">
            Follow-ups
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        {loading ? (
          <div className="py-20 text-center text-sm text-[#B0AEA8]">Loading...</div>
        ) : followups.length === 0 ? (
          <div className="border border-dashed border-[#EAEAEA] py-20 text-center">
            <p className="text-sm text-[#787774]">All caught up. No follow-ups due.</p>
          </div>
        ) : (
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-[#B0AEA8] mb-6">
              {followups.length} follow-up{followups.length !== 1 ? "s" : ""} due
            </p>
            <div className="space-y-4">
              {followups.map((app) => (
                <div
                  key={app.id}
                  className="border border-[#EAEAEA] bg-white p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <Link href={`/applications/${app.id}`} className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold tracking-tight text-[#111111]">
                        {app.company}
                      </h3>
                      <p className="text-sm text-[#787774]">{app.role}</p>
                      <div className="mt-2 flex items-center gap-3 text-xs text-[#B0AEA8]">
                        <span>Applied: {formatDate(app.appliedDate)}</span>
                        {app.resumeVersion && (
                          <>
                            <span className="text-[#EAEAEA]">|</span>
                            <span>{app.resumeVersion}</span>
                          </>
                        )}
                        {app.platform && (
                          <>
                            <span className="text-[#EAEAEA]">|</span>
                            <span>{app.platform}</span>
                          </>
                        )}
                      </div>
                    </Link>
                    <StatusBadge status={app.status} size="sm" />
                  </div>
                  <div className="mt-4 flex gap-2 pt-4 border-t border-[#EAEAEA]">
                    <button
                      onClick={() => markDone(app.id)}
                      className="rounded-[4px] bg-[#EDF3EC] px-3 py-1.5 text-[11px] font-medium uppercase tracking-widest text-[#346538] hover:bg-[#D4E8D2] transition-colors"
                    >
                      Mark Done
                    </button>
                    <button
                      onClick={() => snooze(app.id)}
                      className="rounded-[4px] bg-[#FBF3DB] px-3 py-1.5 text-[11px] font-medium uppercase tracking-widest text-[#956400] hover:bg-[#F5E8C4] transition-colors"
                    >
                      Snooze 3d
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
