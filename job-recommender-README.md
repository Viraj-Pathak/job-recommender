# 💼 Job Recommender

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20App-blue?style=for-the-badge)](https://job-recommender-nine.vercel.app/)
[![TypeScript](https://img.shields.io/badge/TypeScript-88.7%25-3178C6?style=for-the-badge&logo=typescript)](https://github.com/Viraj-Pathak/job-recommender)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com)

> A full-stack job recommendation platform powered by a custom hybrid ML engine — built with Next.js 14 and TypeScript.

---

## 📌 Overview

Job Recommender helps candidates find the right roles by matching their skills and experience against job listings using a two-stage ML pipeline. Beyond recommendations, it provides a complete job-search toolkit: an application tracker, skill gap analysis, salary market insights, and company pages — all in one place.

**Live:** [job-recommender-nine.vercel.app](https://job-recommender-nine.vercel.app/)

---

## ✨ Features

- 🤖 **Hybrid ML Recommendations** — Content-based (Jaccard skill similarity) + collaborative filtering, blended 50/50 with an experience-level bonus
- 🔍 **Job Search & Filtering** — Keyword search, experience level, location, and salary filters with pagination
- 📊 **Skill Gap Analysis** — Per-job breakdown of which skills you have vs. which are required
- 📈 **Salary Insights** — Charts for salary ranges by experience, top in-demand skills, and job distribution by location
- 🗂️ **Kanban Application Tracker** — Track every application through Saved → Applied → Interviewing → Offer → Rejected
- 🏢 **Company Pages** — Dedicated pages per company showing all open roles
- 🔖 **Saved Jobs** — Bookmark listings to revisit later
- 📝 **In-App Apply Modal** — Submit applications and auto-add to your tracker
- 🌙 **Dark / Light Mode** — Persisted across sessions
- 📧 **Email Alerts (UI)** — Subscribe to keyword-based job alerts (prototype)

---

## 🧠 How the Recommender Works

```
User Skills Profile
       │
       ├──► Content-Based Score  (Jaccard similarity: user skills ∩ job skills)
       │
       └──► Collaborative Score  (users with similar profiles → their interactions)
                   │
                   ▼
           Hybrid Score = 0.5 × Content + 0.5 × Collaborative + Experience Bonus
                   │
                   ▼
           Ranked Job List with score breakdown
```

Each recommendation card shows an expandable score breakdown so users understand exactly why a job was ranked.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| ML Engine | Custom Jaccard + Collaborative Filter (TypeScript) |
| State / Persistence | React hooks + localStorage |
| Deployment | Vercel |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/Viraj-Pathak/job-recommender.git
cd job-recommender
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## 📂 Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── jobs/
│   │   ├── page.tsx              # Job listings with search & filters
│   │   └── [id]/page.tsx         # Job detail + skill gap
│   ├── recommend/page.tsx        # AI recommendations
│   ├── saved/page.tsx            # Saved jobs
│   ├── tracker/page.tsx          # Kanban application tracker
│   ├── profile/page.tsx          # User profile
│   ├── insights/page.tsx         # Salary & market insights
│   ├── companies/[name]/         # Company pages
│   └── api/
│       ├── jobs/route.ts         # Jobs REST API
│       └── recommend/route.ts    # Recommendations API
├── components/
│   ├── Navbar.tsx
│   ├── JobCard.tsx
│   ├── ApplyModal.tsx
│   ├── SkillGap.tsx
│   └── ThemeProvider.tsx
├── hooks/
│   ├── useProfile.ts
│   ├── useSavedJobs.ts
│   └── useApplications.ts
└── lib/
    ├── data.ts                   # Synthetic data generation (seeded RNG)
    └── recommender.ts            # Hybrid ML recommender engine
```

---

## 🚢 Deployment

Deployed on Vercel with zero configuration. Every push to `main` triggers an automatic redeploy.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Viraj-Pathak/job-recommender)

---

## 📄 License

MIT — see [LICENSE](LICENSE) for details.

---

## 👨‍💻 Author

**Viraj Pathak**  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=flat&logo=linkedin)](https://www.linkedin.com/in/viraj-pathak-3a19551b8)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-black?style=flat&logo=github)](https://github.com/Viraj-Pathak)
