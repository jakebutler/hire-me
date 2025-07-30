# Product Requirements Document — *Hire Me!*

## 🧠 Overview
*Hire Me!* is a mobile-first web app offering a smart job‑search CRM with:
- Role-specific AI resume feedback
- Job application tracking & coaching
- High-quality, partially interactive weekly email plans

Built using:
- **Convex** (backend & storage)
- **Resend** (email delivery + tracking)
- **OpenAI API** (LLM)
- **PromptLayer** (prompt versioning/management)
- Initial prompt editing via **TinaCMS**, then migrated to PromptLayer API

Hosted on either **Bolt.new** or **Lovable.dev** (frontend), with email enabled from `hireme.corvolabs.com`.

---

## 🎯 User Personas
1. **Targeted Searcher**
   - 2–5 roles at a time
   - Wants deep role-specific feedback and dossier details
   - Prefers polished, actionable next steps
2. **High-Volume Applicant**
   - Applies to many roles weekly
   - Needs fast CRM workflows and bulk tools

📌 Persona is selected during onboarding to tailor UX and coaching tone, though brand voice remains consistent across personas.

---

## 🔁 Milestones & Detailed Feature Requirements

### Milestone 1: User Authentication & Resume Upload
**Requirements:**
- Email/password registration and login (magic link optional later)
- Upload **PDF** resume via drag/drop or file picker
- Auto‑parse and store key structured fields:
  - Name, contact info
  - Education, experience entries (role, dates, company)
  - Skills, certifications

- Store *master resume* on user profile

### Milestone 2: Add Job via URL or Paste Job Description
**Requirements:**
- User input:
  - Job URL **or** pasted description text
- System parses description using a free open‑source library (e.g. Mercury‑Parser or Readability.js)
- Job record created in CRM linked to user
- Extracted structured JD content stored (title, company, requirements, responsibilities)
- *Strict requirement*: job cannot be added without successful parsing of description

### Milestone 3: Role‑Specific Resume Feedback & Versioning
**Requirements:**
- For each job:
  - Clone user’s master resume as a *job‑specific version*
  - Run LLM comparison (via PromptLayer):
    - Resume vs. Job requirements
    - Identify missing skills, weak sections, keyword mismatches

- Store feedback and updated resume version in Convex
- Feedback displayed inline in UI

### Milestone 4: Job Status Tracking & Weekly Summary Emails
**Tracking statuses:**
- `New job` — just added, parsed successfully
- `Application submitted`
- `Interview scheduled`
- `Awaiting response`
- `Pending user response` — user needs to take an action (e.g. follow-up)
- `Not hired` — final, with optional reason (e.g. user withdrew, employer declined)

**Email Integration:**
- Generate weekly summary emails via Resend:
  - Display job status table (status badges)
  - Suggested next actions per job
  - Google Calendar links for follow‑up or interviews
  - Include a dossier snippet (if available)
- Email tracking:
  - Track opens and link clicks using Resend’s built‑in analytics features
  - Optional future feature: “reply‑to‑email” parsing to update job status via email content

### Milestone 5: Personalized Job Coach Recommendations
**Requirements:**
- LLM‑powered job coaching based on:
  - Role, resume, persona
  - Past actions/status
- Suggestions like:
  - Reach out to hiring team on LinkedIn
  - Practice interview questions
  - Draft follow‑up recruiter emails
  - Portfolio/content updates
- Output displayed inline and optionally emailed

### Milestone 6: Content Generation for Action Items
**Requirements:**
- Provide editable templates:
  - LinkedIn messages (connection, outreach)
  - Thank-you emails after interviews
  - Interview prep scripts (phone/video)
- Track whether user has used/sent content
- Allow copy/edit before sending

### Milestone 7: Stretch Capabilities & Third-Party Integrations
- PromptLayer API integration for prompt management/versioning
- Chrome Extension:
  - Scrapes job page and preprocesses job input form
  - Recognizes LinkedIn company/hiring manager page:
    - Offers message templates
    - Suggests outreach targets
  - Autofills application forms where possible
- Tagging UI (e.g. “dream job”, “easy apply”) for CRM
- Google Calendar integration (OAuth), Gmail integration for email forwarding, and follow-up tracking

### Milestone 8: LLM Tracing, Observability & Evaluation
- Track prompt usage and generated output via PromptLayer or external tool (e.g. LangSmith)
- Convex evaluation model for:
  - Resume suggestion quality
  - Skills match relevance
  - User feedback scoring (thumbs‑up/down)
- Collect in-app feedback on LLM output to improve prompt versions

---

## 🛠️ Technology Stack & Architecture

### Required
- **Convex** – backend (schema, serverless functions, CRON scheduling)
- **Resend** – email delivery from `hireme.corvolabs.com` with open/click tracking
- **OpenAI API** – GPT‑4 (allow easy swap to other models later)
- **PromptLayer** – management of LLM prompt versions and logging
- **TinaCMS** – in-app prompt editing during early phases, with migration pipeline to PromptLayer

### Suggested/Add-ons
- **Bolt.new** or **Lovable.dev** – frontend framework (mobile‑friendly)
- **Tailwind CSS**, **Radix UI** – styling & components
- **Mercury‑Parser**, **Readability.js** – free job JD extraction
- **LangSmith** – for advanced prompt evaluations
- **Context** (Convex storage optimization) – research chunking/file storage strategies for user files (resume, code samples)

---

## 📐 Data Model (Simplified)

```ts
interface User {
  id: string;
  email: string;
  passwordHash: string;
  persona: 'targeted' | 'volume';
  masterResume: Resume;
}

interface Resume {
  id: string;
  userId: string;
  fileUrl: string;
  parsedText: string;
  structured: {
    experience: ExperienceEntry[];
    education: EducationEntry[];
    skills: string[];
  };
  createdAt: number;
}

interface Job {
  id: string;
  userId: string;
  title: string;
  company: string;
  descriptionText: string;
  status: Status;
  jobResumeVersionId: string;
  coachSuggestions?: string;
  dossier?: CompanyDossier;
  notes?: string;
  files?: FileAttachment[];
  followUpDate?: number;
  createdAt: number;
}

type Status = 'New job' | 'Application submitted' | 'Interview scheduled' | 'Awaiting response' | 'Pending user response' | 'Not hired';

interface FileAttachment {
  id: string;
  jobId: string;
  type: 'coverLetter' | 'codeSample' | 'presentation';
  fileUrl: string;
  description?: string;
}

interface CompanyDossier {
  summary: string;
  hiringTeamInfo: string;
  recentNews: string[];
}