# Job Recommender

A full-stack job recommendation web app built with Next.js 14, featuring a hybrid ML engine that matches candidates to jobs based on skills and experience.

Live demo: [[your-app.vercel.app](https://your-app.vercel.app)](https://job-recommender-nine.vercel.app/) <!-- replace with your Vercel URL -->

---

## Features

- **AI-Powered Recommendations** — Hybrid ML engine combining content-based filtering (Jaccard skill similarity) and collaborative filtering to rank job matches
- **Job Search & Filtering** — Search by keyword, filter by experience level, location, and minimum salary with pagination
- **Application Tracker** — Kanban-style board to track applications across Saved → Applied → Interviewing → Offer → Rejected
- **User Profile** — LinkedIn-style profile with skills, proficiency levels, job preferences, education, certifications, and links
- **Skill Gap Analysis** — See which skills you have vs. which a job requires, on every job detail page
- **Salary Insights** — Charts showing salary ranges by experience level, top in-demand skills, and jobs by location
- **Company Pages** — Dedicated pages for each company with all their open roles
- **Saved Jobs** — Bookmark jobs to revisit later
- **Apply Modal** — In-app job application form that auto-adds to your tracker
- **Dark Mode** — Full dark/light theme toggle, persisted across sessions
- **Email Alerts** — Subscribe to job alerts by keyword (UI prototype)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| ML Engine | Custom Jaccard + Collaborative Filter (TypeScript) |
| Persistence | localStorage |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/job-recommender.git
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

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── jobs/
│   │   ├── page.tsx          # Job listings with search & filters
│   │   └── [id]/page.tsx     # Job detail page
│   ├── recommend/page.tsx    # AI recommendations page
│   ├── saved/page.tsx        # Saved jobs
│   ├── tracker/page.tsx      # Application tracker (Kanban)
│   ├── profile/page.tsx      # User profile
│   ├── insights/page.tsx     # Salary & market insights
│   ├── companies/[name]/     # Company pages
│   └── api/
│       ├── jobs/route.ts     # Jobs REST API
│       └── recommend/route.ts # Recommendations API
├── components/
│   ├── Navbar.tsx
│   ├── JobCard.tsx
│   ├── ApplyModal.tsx
│   ├── SkillGap.tsx
│   ├── ThemeProvider.tsx
│   └── ...
├── hooks/
│   ├── useProfile.ts         # Profile state + localStorage
│   ├── useSavedJobs.ts       # Saved jobs state
│   └── useApplications.ts   # Application tracker state
└── lib/
    ├── data.ts               # Synthetic data generation (seeded RNG)
    └── recommender.ts        # Hybrid ML recommender engine
```

---

## How the Recommender Works

1. **Content-Based Score** — Computes Jaccard similarity between the user's skills and each job's required skills
2. **Collaborative Score** — Finds users with similar skill profiles and surfaces jobs they interacted with
3. **Hybrid Score** — 50/50 weighted blend of both scores, with an experience-level bonus for seniority matches

Jobs are ranked by hybrid score and displayed with an expandable breakdown showing all three scores.

---

## Deployment

This project is deployed on Vercel with zero configuration. Every push to `main` triggers an automatic redeploy.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Viraj-Pathak/job-recommender)

---

## License

MIT
