export type ApplicationStatus =
  | "APPLIED"
  | "SCREENING"
  | "INTERVIEW"
  | "ASSESSMENT"
  | "HR"
  | "OFFER"
  | "REJECTED"
  | "GHOSTED"
  | "WITHDRAWN";

export interface Application {
  id: string;
  company: string;
  role: string;
  location: string | null;
  jobUrl: string | null;
  platform: string | null;
  appliedDate: string;
  resumeVersion: string | null;
  status: ApplicationStatus;
  followupDate: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationEvent {
  id: string;
  applicationId: string;
  event: string;
  eventDate: string;
  notes: string | null;
  createdAt: string;
}

export interface DashboardStats {
  total: number;
  applied: number;
  screening: number;
  interview: number;
  assessment: number;
  hr: number;
  offer: number;
  rejected: number;
  ghosted: number;
  withdrawn: number;
  followupsDue: number;
}

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  APPLIED: "Applied",
  SCREENING: "Screening",
  INTERVIEW: "Interview",
  ASSESSMENT: "Assessment",
  HR: "HR Round",
  OFFER: "Offer",
  REJECTED: "Rejected",
  GHOSTED: "Ghosted",
  WITHDRAWN: "Withdrawn",
};

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  APPLIED: "bg-[#E1F3FE] text-[#1F6C9F]",
  SCREENING: "bg-[#FBF3DB] text-[#956400]",
  INTERVIEW: "bg-[#F0E6F6] text-[#6B3FA0]",
  ASSESSMENT: "bg-[#FDEBEC] text-[#9F2F2D]",
  HR: "bg-[#E8EAF6] text-[#3949AB]",
  OFFER: "bg-[#EDF3EC] text-[#346538]",
  REJECTED: "bg-[#FDEBEC] text-[#9F2F2D]",
  GHOSTED: "bg-[#F5F5F5] text-[#666666]",
  WITHDRAWN: "bg-[#F5F5F5] text-[#666666]",
};

export const ACTIVE_STATUSES: ApplicationStatus[] = [
  "APPLIED",
  "SCREENING",
  "INTERVIEW",
  "ASSESSMENT",
  "HR",
];

export const TERMINAL_STATUSES: ApplicationStatus[] = [
  "OFFER",
  "REJECTED",
  "GHOSTED",
  "WITHDRAWN",
];

export const PLATFORMS = [
  "LinkedIn",
  "Indeed",
  "Naukri",
  "Glassdoor",
  "Company Website",
  "Referral",
  "AngelList",
  "Hirect",
  "Instahyre",
  "Other",
] as const;
