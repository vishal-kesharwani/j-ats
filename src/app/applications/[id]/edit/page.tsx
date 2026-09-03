"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PLATFORMS } from "@/types";

export default function EditApplicationPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    company: "",
    role: "",
    location: "",
    jobUrl: "",
    platform: "",
    appliedDate: "",
    resumeVersion: "",
    notes: "",
  });

  useEffect(() => {
    fetchApplication();
  }, [id]);

  async function fetchApplication() {
    const res = await fetch(`/api/applications/${id}`);
    if (res.ok) {
      const data = await res.json();
      setForm({
        company: data.company || "",
        role: data.role || "",
        location: data.location || "",
        jobUrl: data.jobUrl || "",
        platform: data.platform || "",
        appliedDate: data.appliedDate ? new Date(data.appliedDate).toISOString().split("T")[0] : "",
        resumeVersion: data.resumeVersion || "",
        notes: data.notes || "",
      });
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const res = await fetch(`/api/applications/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push(`/applications/${id}`);
      router.refresh();
    } else {
      alert("Failed to update");
      setSaving(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FBFBFA]">
        <p className="text-sm text-[#B0AEA8]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFA]">
      <header className="border-b border-[#EAEAEA] bg-white">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-6 py-5">
          <Link
            href={`/applications/${id}`}
            className="text-sm font-medium text-[#787774] hover:text-[#111111] transition-colors"
          >
            Back
          </Link>
          <span className="text-[#EAEAEA]">/</span>
          <h1 className="text-lg font-semibold tracking-tight text-[#111111]">
            Edit Application
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium uppercase tracking-widest text-[#787774] mb-2">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  required
                  value={form.company}
                  onChange={handleChange}
                  className="w-full border border-[#EAEAEA] bg-white px-4 py-3 text-sm text-[#111111] placeholder-[#B0AEA8] focus:border-[#111111] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-widest text-[#787774] mb-2">
                  Role
                </label>
                <input
                  type="text"
                  name="role"
                  required
                  value={form.role}
                  onChange={handleChange}
                  className="w-full border border-[#EAEAEA] bg-white px-4 py-3 text-sm text-[#111111] placeholder-[#B0AEA8] focus:border-[#111111] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium uppercase tracking-widest text-[#787774] mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="w-full border border-[#EAEAEA] bg-white px-4 py-3 text-sm text-[#111111] placeholder-[#B0AEA8] focus:border-[#111111] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-widest text-[#787774] mb-2">
                  Platform
                </label>
                <select
                  name="platform"
                  value={form.platform}
                  onChange={handleChange}
                  className="w-full border border-[#EAEAEA] bg-white px-4 py-3 text-sm text-[#111111] focus:border-[#111111] focus:outline-none transition-colors"
                >
                  <option value="">Select platform</option>
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-[#787774] mb-2">
                Job URL
              </label>
              <input
                type="url"
                name="jobUrl"
                value={form.jobUrl}
                onChange={handleChange}
                className="w-full border border-[#EAEAEA] bg-white px-4 py-3 text-sm text-[#111111] placeholder-[#B0AEA8] focus:border-[#111111] focus:outline-none transition-colors"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium uppercase tracking-widest text-[#787774] mb-2">
                  Applied Date
                </label>
                <input
                  type="date"
                  name="appliedDate"
                  value={form.appliedDate}
                  onChange={handleChange}
                  className="w-full border border-[#EAEAEA] bg-white px-4 py-3 text-sm text-[#111111] focus:border-[#111111] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-widest text-[#787774] mb-2">
                  Resume Version
                </label>
                <input
                  type="text"
                  name="resumeVersion"
                  value={form.resumeVersion}
                  onChange={handleChange}
                  className="w-full border border-[#EAEAEA] bg-white px-4 py-3 text-sm text-[#111111] placeholder-[#B0AEA8] focus:border-[#111111] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-[#787774] mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                rows={3}
                value={form.notes}
                onChange={handleChange}
                className="w-full border border-[#EAEAEA] bg-white px-4 py-3 text-sm text-[#111111] placeholder-[#B0AEA8] focus:border-[#111111] focus:outline-none transition-colors resize-none"
              />
            </div>
          </div>

          <div className="mt-10 flex items-center justify-end gap-4">
            <Link
              href={`/applications/${id}`}
              className="px-6 py-3 text-sm font-medium text-[#787774] hover:text-[#111111] transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="bg-[#111111] px-8 py-3 text-sm font-medium text-white hover:bg-[#333333] active:scale-[0.98] disabled:opacity-50 transition-all"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
