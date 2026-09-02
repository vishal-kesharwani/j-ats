# J-ATS — WhatsApp-Powered Job Application Tracker

## Overview

Personal job application tracker with WhatsApp integration. Apply for jobs → send details via WhatsApp → track status → get follow-up reminders.

---

## Tech Stack

| Layer        | Technology                |
|--------------|---------------------------|
| Frontend     | Next.js 14 (App Router)   |
| Styling      | Tailwind CSS + shadcn/ui  |
| Database     | PostgreSQL                |
| ORM          | Prisma                    |
| Hosting      | Vercel                    |
| DB Hosting   | Supabase / Neon           |
| WhatsApp     | Phase 2 (Twilio/WATI)     |
| Auth         | None (single user)        |

---

## Project Structure

```
j-ats/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                 # Dashboard
│   │   ├── globals.css
│   │   ├── applications/
│   │   │   ├── page.tsx             # All applications list
│   │   │   ├── new/
│   │   │   │   └── page.tsx         # Add new application
│   │   │   └── [id]/
│   │   │       └── page.tsx         # Application detail + timeline
│   │   ├── followups/
│   │   │   └── page.tsx             # Follow-ups due
│   │   └── api/
│   │       ├── applications/
│   │       │   ├── route.ts         # GET all, POST new
│   │       │   └── [id]/
│   │       │       ├── route.ts     # GET one, PUT update, DELETE
│   │       │       └── events/
│   │       │           └── route.ts # GET events, POST event
│   │       ├── followups/
│   │       │   └── route.ts         # GET due follow-ups
│   │       └── stats/
│   │           └── route.ts         # GET dashboard stats
│   ├── components/
│   │   ├── ui/                      # shadcn components
│   │   ├── dashboard/
│   │   │   ├── stats-cards.tsx
│   │   │   └── recent-applications.tsx
│   │   ├── applications/
│   │   │   ├── application-form.tsx
│   │   │   ├── application-list.tsx
│   │   │   ├── application-card.tsx
│   │   │   └── status-badge.tsx
│   │   └── timeline/
│   │       └── timeline.tsx
│   ├── lib/
│   │   ├── db.ts                    # Prisma client
│   │   └── utils.ts                 # Helpers
│   └── types/
│       └── index.ts                 # TypeScript types
├── .env.example
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

---

## Database Schema (Prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Application {
  id            String           @id @default(cuid())
  company       String
  role          String
  location      String?
  jobUrl        String?          @map("job_url")
  appliedDate   DateTime         @default(now()) @map("applied_date")
  resumeVersion String?          @map("resume_version")
  status        ApplicationStatus @default(APPLIED)
  followupDate  DateTime?        @map("followup_date")
  notes         String?
  createdAt     DateTime         @default(now()) @map("created_at")
  updatedAt     DateTime         @updatedAt @map("updated_at")

  events        ApplicationEvent[]

  @@map("applications")
}

model ApplicationEvent {
  id            String      @id @default(cuid())
  applicationId String      @map("application_id")
  event         String
  eventDate     DateTime    @default(now()) @map("event_date")
  notes         String?
  createdAt     DateTime    @default(now()) @map("created_at")

  application   Application @relation(fields: [applicationId], references: [id], onDelete: Cascade)

  @@map("application_events")
}

enum ApplicationStatus {
  APPLIED
  SCREENING
  INTERVIEW
  ASSESSMENT
  HR
  OFFER
  REJECTED
  GHOSTED
  WITHDRAWN
}
```

---

## API Routes

### GET /api/applications
Returns all applications with optional filters.

**Query params:**
- `status` — filter by status
- `search` — search company/role
- `followup` — boolean, applications with follow-up due today or earlier

### POST /api/applications
Create new application.

**Body:**
```json
{
  "company": "Deloitte",
  "role": "Associate Analyst",
  "location": "Bengaluru",
  "jobUrl": "https://...",
  "appliedDate": "2026-09-02",
  "resumeVersion": "V7",
  "notes": ""
}
```

### PUT /api/applications/[id]
Update application fields.

### DELETE /api/applications/[id]
Delete application and its events.

### GET /api/applications/[id]/events
Get timeline events for an application.

### POST /api/applications/[id]/events
Add a new event to timeline.

### GET /api/followups
Get all applications where `followupDate <= today` and status is not terminal (Rejected/Ghosted/Withdrawn/Offer).

### GET /api/stats
Dashboard statistics:
- Total applications
- Applied count
- Interview count
- Offer count
- Rejected count
- Follow-ups due today

---

## Pages

### Dashboard (`/`)
- Stats cards: Applied, Interviews, Offers, Rejected
- Recent 5 applications
- Follow-ups due today
- Quick add button

### All Applications (`/applications`)
- Table/card list of all applications
- Filters: status tabs, search bar
- Click to view detail

### Add Application (`/applications/new`)
- Form: Company, Role, Location, Job URL, Applied Date, Resume Version, Notes
- Auto-calculates follow-up date (7 days from applied)
- Submit creates application + "Applied" event in timeline

### Application Detail (`/applications/[id]`)
- Full details card
- Status update dropdown
- Timeline (all events chronological)
- Edit/Delete buttons
- Follow-up date display + mark done

### Follow-ups (`/followups`)
- List of applications due for follow-up
- Quick status update buttons
- Mark as followed up

---

## Status Flow

```
Applied → Screening → Interview → Assessment → HR → Offer
    ↓
Rejected / Ghosted / Withdrawn
```

When status changes, an event is automatically added to timeline.

---

## Follow-up Logic

- Default follow-up: 7 days after applied date
- If status changes from "Applied" → follow-up auto-cleared
- Follow-up reminders show on dashboard + dedicated page
- User can snooze (add 3 days) or mark done

---

## Build Phases

### Phase 1 — Core MVP (Build Now)
1. Project setup (Next.js + Prisma + PostgreSQL)
2. Database schema + migration
3. API routes (CRUD)
4. Dashboard page
5. Application list page
6. Add application form
7. Application detail + timeline
8. Status update
9. Follow-up system
10. Resume version tracking

### Phase 2 — WhatsApp Integration (Later)
1. WhatsApp Business API setup (Twilio/WATI)
2. Webhook endpoint
3. Message parser (ATS ADD, ATS LIST, ATS FOLLOWUP, ATS UPDATE)
4. Bot reply formatter
5. Follow-up notifications via WhatsApp

### Phase 3 — Enhancements (Future)
1. Resume version analytics
2. Export to CSV
3. Multi-user support
4. Authentication
5. Email follow-up templates

---

## Environment Variables

```env
DATABASE_URL="postgresql://user:password@host:5432/jats"
```

---

## Commands

```bash
# Setup
npx create-next-app@latest j-ats --typescript --tailwind --app --src-dir
npx prisma init
npx prisma migrate dev
npx prisma db seed

# Dev
npm run dev

# Build
npm run build
```
