"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ResumeData,
  generateLaTeX,
  downloadTex,
  getDefaultResumeData,
} from "@/lib/latex-generator";

const STORAGE_KEY = "jats-resume-data";

function loadResumeData(): ResumeData {
  if (typeof window === "undefined") return getDefaultResumeData();
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return { ...getDefaultResumeData(), ...JSON.parse(stored) };
    } catch {
      return getDefaultResumeData();
    }
  }
  return getDefaultResumeData();
}

function saveResumeData(data: ResumeData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export default function ResumeBuilderPage() {
  const [data, setData] = useState<ResumeData>(getDefaultResumeData);
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form");
  const [activeSection, setActiveSection] = useState("header");

  useEffect(() => {
    setData(loadResumeData());
  }, []);

  useEffect(() => {
    saveResumeData(data);
  }, [data]);

  const latex = useMemo(() => generateLaTeX(data), [data]);

  function updateHeader(field: string, value: string) {
    setData((prev) => ({
      ...prev,
      header: { ...prev.header, [field]: value },
    }));
  }

  function updateSummary(value: string) {
    setData((prev) => ({ ...prev, summary: value }));
  }

  // Skills
  function addSkill() {
    setData((prev) => ({
      ...prev,
      skills: [...prev.skills, { label: "", items: "" }],
    }));
  }
  function updateSkill(index: number, field: string, value: string) {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.map((s, i) =>
        i === index ? { ...s, [field]: value } : s
      ),
    }));
  }
  function removeSkill(index: number) {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  }

  // Experience
  function addExperience() {
    setData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { company: "", date: "", title: "", location: "", bullets: [""] },
      ],
    }));
  }
  function updateExperience(index: number, field: string, value: string) {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.map((e, i) =>
        i === index ? { ...e, [field]: value } : e
      ),
    }));
  }
  function addExperienceBullet(expIndex: number) {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.map((e, i) =>
        i === expIndex ? { ...e, bullets: [...e.bullets, ""] } : e
      ),
    }));
  }
  function updateExperienceBullet(
    expIndex: number,
    bulletIndex: number,
    value: string
  ) {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.map((e, i) =>
        i === expIndex
          ? {
              ...e,
              bullets: e.bullets.map((b, j) =>
                j === bulletIndex ? value : b
              ),
            }
          : e
      ),
    }));
  }
  function removeExperienceBullet(expIndex: number, bulletIndex: number) {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.map((e, i) =>
        i === expIndex
          ? { ...e, bullets: e.bullets.filter((_, j) => j !== bulletIndex) }
          : e
      ),
    }));
  }
  function removeExperience(index: number) {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  }

  // Projects
  function addProject() {
    setData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        { name: "", tech: "", link: "", bullets: [""] },
      ],
    }));
  }
  function updateProject(index: number, field: string, value: string) {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p, i) =>
        i === index ? { ...p, [field]: value } : p
      ),
    }));
  }
  function addProjectBullet(projIndex: number) {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p, i) =>
        i === projIndex ? { ...p, bullets: [...p.bullets, ""] } : p
      ),
    }));
  }
  function updateProjectBullet(
    projIndex: number,
    bulletIndex: number,
    value: string
  ) {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p, i) =>
        i === projIndex
          ? {
              ...p,
              bullets: p.bullets.map((b, j) =>
                j === bulletIndex ? value : b
              ),
            }
          : p
      ),
    }));
  }
  function removeProjectBullet(projIndex: number, bulletIndex: number) {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p, i) =>
        i === projIndex
          ? { ...p, bullets: p.bullets.filter((_, j) => j !== bulletIndex) }
          : p
      ),
    }));
  }
  function removeProject(index: number) {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  }

  // Education
  function addEducation() {
    setData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { school: "", date: "", degree: "", detail: "" },
      ],
    }));
  }
  function updateEducation(index: number, field: string, value: string) {
    setData((prev) => ({
      ...prev,
      education: prev.education.map((e, i) =>
        i === index ? { ...e, [field]: value } : e
      ),
    }));
  }
  function removeEducation(index: number) {
    setData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  }

  // Certifications
  function addCertification() {
    setData((prev) => ({
      ...prev,
      certifications: [...prev.certifications, ""],
    }));
  }
  function updateCertification(index: number, value: string) {
    setData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((c, i) =>
        i === index ? value : c
      ),
    }));
  }
  function removeCertification(index: number) {
    setData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
  }

  function handleDownload() {
    const filename = data.header.name
      ? `${data.header.name.replace(/\s+/g, "_")}_Resume.tex`
      : "Resume.tex";
    downloadTex(latex, filename);
  }

  const sections = [
    { id: "header", label: "Header" },
    { id: "summary", label: "Summary" },
    { id: "skills", label: "Skills" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: "education", label: "Education" },
    { id: "certifications", label: "Certifications" },
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFA]">
      <header className="border-b border-[#EAEAEA] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm font-medium text-[#787774] hover:text-[#111111] transition-colors"
            >
              Dashboard
            </Link>
            <span className="text-[#EAEAEA]">/</span>
            <h1 className="text-lg font-semibold tracking-tight text-[#111111]">
              Resume Builder
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (confirm("Reset all resume data?")) {
                  setData(getDefaultResumeData());
                }
              }}
              className="px-4 py-2 text-xs font-medium text-[#787774] hover:text-[#111111] border border-[#EAEAEA] transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleDownload}
              className="bg-[#111111] px-5 py-2.5 text-xs font-medium text-white hover:bg-[#333333] active:scale-[0.98] transition-all"
            >
              Download .tex
            </button>
          </div>
        </div>
      </header>

      {/* Mobile tab switcher */}
      <div className="border-b border-[#EAEAEA] bg-white lg:hidden">
        <div className="flex">
          <button
            onClick={() => setActiveTab("form")}
            className={`flex-1 py-3 text-xs font-medium uppercase tracking-widest transition-colors ${
              activeTab === "form"
                ? "text-[#111111] border-b-2 border-[#111111]"
                : "text-[#787774]"
            }`}
          >
            Form
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`flex-1 py-3 text-xs font-medium uppercase tracking-widest transition-colors ${
              activeTab === "preview"
                ? "text-[#111111] border-b-2 border-[#111111]"
                : "text-[#787774]"
            }`}
          >
            LaTeX Preview
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Form Panel */}
          <div
            className={`space-y-6 ${activeTab === "form" ? "block" : "hidden lg:block"}`}
          >
            {/* Section nav */}
            <div className="flex flex-wrap gap-2">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`rounded-[4px] px-3 py-1.5 text-[11px] font-medium uppercase tracking-widest transition-colors ${
                    activeSection === s.id
                      ? "bg-[#111111] text-white"
                      : "border border-[#EAEAEA] bg-white text-[#787774] hover:border-[#111111]"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* HEADER */}
            {activeSection === "header" && (
              <div className="border border-[#EAEAEA] bg-white p-6 space-y-5">
                <h2 className="text-xs font-medium uppercase tracking-widest text-[#787774]">
                  Contact Information
                </h2>
                {[
                  { label: "Full Name", field: "name", placeholder: "Vishal Kesharwani" },
                  { label: "Phone", field: "phone", placeholder: "+91-7972591242" },
                  { label: "Email", field: "email", placeholder: "email@example.com" },
                  { label: "Website", field: "website", placeholder: "vishalkesharwani.in" },
                  { label: "LinkedIn", field: "linkedin", placeholder: "linkedin.com/in/username" },
                  { label: "GitHub", field: "github", placeholder: "github.com/username" },
                  { label: "LeetCode", field: "leetcode", placeholder: "leetcode.com/username" },
                ].map((item) => (
                  <div key={item.field}>
                    <label className="block text-[10px] font-medium uppercase tracking-widest text-[#B0AEA8] mb-1.5">
                      {item.label}
                    </label>
                    <input
                      type="text"
                      value={(data.header as Record<string, string>)[item.field] || ""}
                      onChange={(e) => updateHeader(item.field, e.target.value)}
                      placeholder={item.placeholder}
                      className="w-full border border-[#EAEAEA] bg-white px-4 py-2.5 text-sm text-[#111111] placeholder-[#B0AEA8] focus:border-[#111111] focus:outline-none transition-colors"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* SUMMARY */}
            {activeSection === "summary" && (
              <div className="border border-[#EAEAEA] bg-white p-6 space-y-5">
                <h2 className="text-xs font-medium uppercase tracking-widest text-[#787774]">
                  Professional Summary
                </h2>
                <textarea
                  rows={6}
                  value={data.summary}
                  onChange={(e) => updateSummary(e.target.value)}
                  placeholder="Backend Software Engineer with hands-on experience..."
                  className="w-full border border-[#EAEAEA] bg-white px-4 py-3 text-sm text-[#111111] placeholder-[#B0AEA8] focus:border-[#111111] focus:outline-none transition-colors resize-none"
                />
              </div>
            )}

            {/* SKILLS */}
            {activeSection === "skills" && (
              <div className="border border-[#EAEAEA] bg-white p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-medium uppercase tracking-widest text-[#787774]">
                    Technical Skills
                  </h2>
                  <button
                    onClick={addSkill}
                    className="text-xs font-medium text-[#111111] hover:text-[#787774] transition-colors"
                  >
                    + Add
                  </button>
                </div>
                {data.skills.map((skill, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <input
                      type="text"
                      value={skill.label}
                      onChange={(e) => updateSkill(i, "label", e.target.value)}
                      placeholder="Category"
                      className="w-1/3 border border-[#EAEAEA] bg-white px-3 py-2.5 text-sm text-[#111111] placeholder-[#B0AEA8] focus:border-[#111111] focus:outline-none transition-colors"
                    />
                    <input
                      type="text"
                      value={skill.items}
                      onChange={(e) => updateSkill(i, "items", e.target.value)}
                      placeholder="Python, Java, JavaScript..."
                      className="flex-1 border border-[#EAEAEA] bg-white px-3 py-2.5 text-sm text-[#111111] placeholder-[#B0AEA8] focus:border-[#111111] focus:outline-none transition-colors"
                    />
                    <button
                      onClick={() => removeSkill(i)}
                      className="px-2 py-2.5 text-[#9F2F2D] hover:text-[#7a1f1e] text-sm"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* EXPERIENCE */}
            {activeSection === "experience" && (
              <div className="border border-[#EAEAEA] bg-white p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-medium uppercase tracking-widest text-[#787774]">
                    Experience
                  </h2>
                  <button
                    onClick={addExperience}
                    className="text-xs font-medium text-[#111111] hover:text-[#787774] transition-colors"
                  >
                    + Add
                  </button>
                </div>
                {data.experience.map((exp, i) => (
                  <div
                    key={i}
                    className="border border-[#EAEAEA] p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-medium uppercase tracking-widest text-[#B0AEA8]">
                        Experience {i + 1}
                      </span>
                      <button
                        onClick={() => removeExperience(i)}
                        className="text-xs text-[#9F2F2D] hover:text-[#7a1f1e]"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) =>
                          updateExperience(i, "company", e.target.value)
                        }
                        placeholder="Company"
                        className="border border-[#EAEAEA] bg-white px-3 py-2.5 text-sm text-[#111111] placeholder-[#B0AEA8] focus:border-[#111111] focus:outline-none transition-colors"
                      />
                      <input
                        type="text"
                        value={exp.title}
                        onChange={(e) =>
                          updateExperience(i, "title", e.target.value)
                        }
                        placeholder="Title"
                        className="border border-[#EAEAEA] bg-white px-3 py-2.5 text-sm text-[#111111] placeholder-[#B0AEA8] focus:border-[#111111] focus:outline-none transition-colors"
                      />
                      <input
                        type="text"
                        value={exp.date}
                        onChange={(e) =>
                          updateExperience(i, "date", e.target.value)
                        }
                        placeholder="Date (e.g. Feb 2026 -- Jun 2026)"
                        className="border border-[#EAEAEA] bg-white px-3 py-2.5 text-sm text-[#111111] placeholder-[#B0AEA8] focus:border-[#111111] focus:outline-none transition-colors"
                      />
                      <input
                        type="text"
                        value={exp.location}
                        onChange={(e) =>
                          updateExperience(i, "location", e.target.value)
                        }
                        placeholder="Location"
                        className="border border-[#EAEAEA] bg-white px-3 py-2.5 text-sm text-[#111111] placeholder-[#B0AEA8] focus:border-[#111111] focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-medium uppercase tracking-widest text-[#B0AEA8]">
                          Bullet Points
                        </span>
                        <button
                          onClick={() => addExperienceBullet(i)}
                          className="text-xs text-[#111111] hover:text-[#787774]"
                        >
                          + Add
                        </button>
                      </div>
                      {exp.bullets.map((bullet, j) => (
                        <div key={j} className="flex gap-2">
                          <input
                            type="text"
                            value={bullet}
                            onChange={(e) =>
                              updateExperienceBullet(i, j, e.target.value)
                            }
                            placeholder="Designed and developed 15+ production-grade REST APIs..."
                            className="flex-1 border border-[#EAEAEA] bg-white px-3 py-2 text-sm text-[#111111] placeholder-[#B0AEA8] focus:border-[#111111] focus:outline-none transition-colors"
                          />
                          <button
                            onClick={() => removeExperienceBullet(i, j)}
                            className="px-2 text-[#9F2F2D] text-sm"
                          >
                            x
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* PROJECTS */}
            {activeSection === "projects" && (
              <div className="border border-[#EAEAEA] bg-white p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-medium uppercase tracking-widest text-[#787774]">
                    Projects
                  </h2>
                  <button
                    onClick={addProject}
                    className="text-xs font-medium text-[#111111] hover:text-[#787774] transition-colors"
                  >
                    + Add
                  </button>
                </div>
                {data.projects.map((proj, i) => (
                  <div
                    key={i}
                    className="border border-[#EAEAEA] p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-medium uppercase tracking-widest text-[#B0AEA8]">
                        Project {i + 1}
                      </span>
                      <button
                        onClick={() => removeProject(i)}
                        className="text-xs text-[#9F2F2D] hover:text-[#7a1f1e]"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        type="text"
                        value={proj.name}
                        onChange={(e) =>
                          updateProject(i, "name", e.target.value)
                        }
                        placeholder="Project Name"
                        className="border border-[#EAEAEA] bg-white px-3 py-2.5 text-sm text-[#111111] placeholder-[#B0AEA8] focus:border-[#111111] focus:outline-none transition-colors"
                      />
                      <input
                        type="text"
                        value={proj.tech}
                        onChange={(e) =>
                          updateProject(i, "tech", e.target.value)
                        }
                        placeholder="Tech Stack"
                        className="border border-[#EAEAEA] bg-white px-3 py-2.5 text-sm text-[#111111] placeholder-[#B0AEA8] focus:border-[#111111] focus:outline-none transition-colors"
                      />
                    </div>
                    <input
                      type="text"
                      value={proj.link}
                      onChange={(e) =>
                        updateProject(i, "link", e.target.value)
                      }
                      placeholder="Link (optional)"
                      className="w-full border border-[#EAEAEA] bg-white px-3 py-2.5 text-sm text-[#111111] placeholder-[#B0AEA8] focus:border-[#111111] focus:outline-none transition-colors"
                    />
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-medium uppercase tracking-widest text-[#B0AEA8]">
                          Bullet Points
                        </span>
                        <button
                          onClick={() => addProjectBullet(i)}
                          className="text-xs text-[#111111] hover:text-[#787774]"
                        >
                          + Add
                        </button>
                      </div>
                      {proj.bullets.map((bullet, j) => (
                        <div key={j} className="flex gap-2">
                          <input
                            type="text"
                            value={bullet}
                            onChange={(e) =>
                              updateProjectBullet(i, j, e.target.value)
                            }
                            placeholder="Developed a Python-based LLM routing service..."
                            className="flex-1 border border-[#EAEAEA] bg-white px-3 py-2 text-sm text-[#111111] placeholder-[#B0AEA8] focus:border-[#111111] focus:outline-none transition-colors"
                          />
                          <button
                            onClick={() => removeProjectBullet(i, j)}
                            className="px-2 text-[#9F2F2D] text-sm"
                          >
                            x
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* EDUCATION */}
            {activeSection === "education" && (
              <div className="border border-[#EAEAEA] bg-white p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-medium uppercase tracking-widest text-[#787774]">
                    Education
                  </h2>
                  <button
                    onClick={addEducation}
                    className="text-xs font-medium text-[#111111] hover:text-[#787774] transition-colors"
                  >
                    + Add
                  </button>
                </div>
                {data.education.map((edu, i) => (
                  <div
                    key={i}
                    className="border border-[#EAEAEA] p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-medium uppercase tracking-widest text-[#B0AEA8]">
                        Education {i + 1}
                      </span>
                      <button
                        onClick={() => removeEducation(i)}
                        className="text-xs text-[#9F2F2D] hover:text-[#7a1f1e]"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        type="text"
                        value={edu.school}
                        onChange={(e) =>
                          updateEducation(i, "school", e.target.value)
                        }
                        placeholder="School / University"
                        className="border border-[#EAEAEA] bg-white px-3 py-2.5 text-sm text-[#111111] placeholder-[#B0AEA8] focus:border-[#111111] focus:outline-none transition-colors"
                      />
                      <input
                        type="text"
                        value={edu.date}
                        onChange={(e) =>
                          updateEducation(i, "date", e.target.value)
                        }
                        placeholder="Date (e.g. 2022 -- 2026)"
                        className="border border-[#EAEAEA] bg-white px-3 py-2.5 text-sm text-[#111111] placeholder-[#B0AEA8] focus:border-[#111111] focus:outline-none transition-colors"
                      />
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) =>
                          updateEducation(i, "degree", e.target.value)
                        }
                        placeholder="Degree"
                        className="border border-[#EAEAEA] bg-white px-3 py-2.5 text-sm text-[#111111] placeholder-[#B0AEA8] focus:border-[#111111] focus:outline-none transition-colors"
                      />
                      <input
                        type="text"
                        value={edu.detail}
                        onChange={(e) =>
                          updateEducation(i, "detail", e.target.value)
                        }
                        placeholder="CGPA / Percentage"
                        className="border border-[#EAEAEA] bg-white px-3 py-2.5 text-sm text-[#111111] placeholder-[#B0AEA8] focus:border-[#111111] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CERTIFICATIONS */}
            {activeSection === "certifications" && (
              <div className="border border-[#EAEAEA] bg-white p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-medium uppercase tracking-widest text-[#787774]">
                    Certifications & Achievements
                  </h2>
                  <button
                    onClick={addCertification}
                    className="text-xs font-medium text-[#111111] hover:text-[#787774] transition-colors"
                  >
                    + Add
                  </button>
                </div>
                {data.certifications.map((cert, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      value={cert}
                      onChange={(e) =>
                        updateCertification(i, e.target.value)
                      }
                      placeholder="AWS Certified Cloud Practitioner..."
                      className="flex-1 border border-[#EAEAEA] bg-white px-3 py-2.5 text-sm text-[#111111] placeholder-[#B0AEA8] focus:border-[#111111] focus:outline-none transition-colors"
                    />
                    <button
                      onClick={() => removeCertification(i)}
                      className="px-2 text-[#9F2F2D] text-sm"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* LaTeX Preview Panel */}
          <div
            className={`${activeTab === "preview" ? "block" : "hidden lg:block"}`}
          >
            <div className="sticky top-8">
              <div className="border border-[#EAEAEA] bg-white">
                <div className="flex items-center justify-between border-b border-[#EAEAEA] px-5 py-3">
                  <span className="text-xs font-medium uppercase tracking-widest text-[#787774]">
                    LaTeX Output
                  </span>
                  <button
                    onClick={handleDownload}
                    className="text-xs font-medium text-[#111111] hover:text-[#787774] transition-colors"
                  >
                    Download .tex
                  </button>
                </div>
                <pre className="p-5 text-[11px] leading-relaxed text-[#111111] overflow-auto max-h-[80vh] font-mono bg-[#FBFBFA]">
                  {latex}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
