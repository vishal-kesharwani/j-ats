"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Application } from "@/types";
import { ApplicationCard } from "@/components/applications/application-card";

const STATUS_FILTERS: { label: string; value: string }[] = [
  { label: "All", value: "ALL" },
  { label: "Applied", value: "APPLIED" },
  { label: "Screening", value: "SCREENING" },
  { label: "Interview", value: "INTERVIEW" },
  { label: "Assessment", value: "ASSESSMENT" },
  { label: "HR", value: "HR" },
  { label: "Offer", value: "OFFER" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Ghosted", value: "GHOSTED" },
  { label: "Withdrawn", value: "WITHDRAWN" },
];

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, [activeFilter, search]);

  async function fetchApplications() {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeFilter !== "ALL") params.set("status", activeFilter);
    if (search) params.set("search", search);

    try {
      const res = await fetch(`/api/applications?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      } else {
        setApplications([]);
      }
    } catch {
      setApplications([]);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#FBFBFA]">
      <header className="border-b border-[#EAEAEA] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm font-medium text-[#787774] hover:text-[#111111] transition-colors"
            >
              Dashboard
            </Link>
            <span className="text-[#EAEAEA]">/</span>
            <h1 className="text-lg font-semibold tracking-tight text-[#111111]">
              Applications
            </h1>
          </div>
          <Link
            href="/applications/new"
            className="bg-[#111111] px-5 py-2.5 text-xs font-medium text-white hover:bg-[#333333] active:scale-[0.98] transition-all"
          >
            + Add Job
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search company, role, or platform..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-[#EAEAEA] bg-white px-4 py-3 text-sm text-[#111111] placeholder-[#B0AEA8] focus:border-[#111111] focus:outline-none transition-colors"
          />
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`rounded-[4px] px-3 py-1.5 text-[11px] font-medium uppercase tracking-widest transition-colors ${
                activeFilter === filter.value
                  ? "bg-[#111111] text-white"
                  : "border border-[#EAEAEA] bg-white text-[#787774] hover:border-[#111111] hover:text-[#111111]"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-20 text-center text-sm text-[#B0AEA8]">Loading...</div>
        ) : applications.length === 0 ? (
          <div className="border border-dashed border-[#EAEAEA] py-20 text-center">
            <p className="text-sm text-[#787774]">No applications found.</p>
            <Link
              href="/applications/new"
              className="mt-3 inline-block text-sm font-medium text-[#111111] underline underline-offset-4 hover:text-[#787774] transition-colors"
            >
              Add your first application
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {applications.map((app) => (
              <ApplicationCard key={app.id} application={app} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
