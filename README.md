# ResumeIntel — Frontend

React single-page app for the hiring platform. Candidates use it for resumes, job applications, and interview prep. Recruiters and org staff use it for pipelines, job posts, and search. There is also a public career portal per company (`/careers/your-org-slug`).

**Live demo:** [resume-intelligence.netlify.app](https://resume-intelligence.netlify.app)

The API runs separately — see [../backend/README.md](../backend/README.md).

---

## Stack

- React 18 + Vite
- React Router v7
- Redux Toolkit (auth, theme, org context)
- TanStack Query (server state / caching)
- Tailwind CSS
- Formik + Yup (forms)
- Axios
- Socket.io client (notifications, pipeline updates, resume parse status)
- Recharts (analytics)
- @hello-pangea/dnd (hiring pipeline board)

---

## What’s in the app

### Candidates (`/candidate/*`)

| Route | Purpose |
|-------|---------|
| `/candidate` | Dashboard, quick links |
| `/candidate/resumes` | Upload PDF, ATS score, parsing status |
| `/candidate/jobs` | Browse open jobs, apply with a resume |
| `/candidate/jobs/:id` | Job detail + apply |
| `/candidate/applications` | All applications + pipeline stage filters |
| `/candidate/jd-match` | Paste a JD and compare skills |
| `/candidate/interview` | AI interview questions |
| `/candidate/analytics` | Charts and ATS overview |

Registration is **candidate-only** on `/register` (recruiters are added by platform admin).

### Recruiters / org staff (`/recruiter/*`)

Needs an org account (seed data or admin-created). Nav depends on role permissions.

- Command center, **hiring pipeline** (drag-and-drop stages)
- Job postings (+ link to public career portal)
- Talent search, hiring analytics

### Platform admin (`/admin/*`)

- Overview across orgs
- Create organizations and add staff (org admin, recruiter, etc.)

### Public (no login)

- `/` — landing
- `/careers/:slug` — company job board
- `/careers/:slug/jobs/:jobId` — job detail; sign in to apply

---

## Project layout (good places to start)

```
src/
├── api/              # Axios client + API helpers
├── app/              # Root App wrapper
├── routes/           # AppRoutes, ProtectedRoute
├── pages/            # Screens by area (auth, candidate, recruiter, admin, careers)
├── components/       # UI, layouts, jobs, careers
├── features/         # authSlice, themeSlice, orgSlice
├── modules/hiring/   # Pipeline board
├── hooks/            # e.g. useMyApplications
├── sockets/          # SocketProvider
├── config/           # permissions, pipeline stage colors
└── utils/            # roles, apiUrl, auth redirect helpers
```

Auth token lives in `localStorage` (`accessToken`, `refreshToken`). The API client attaches `Authorization` and, for staff, `x-organization-id` when an org is selected.

---

## Run locally

**Requirements:** Node 18+, backend running on port 5000.

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

`.env`:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

Socket URL is derived from that automatically. Override only if needed:

```env
VITE_SOCKET_URL=http://localhost:5000
```

---

## Production build (Netlify)

Vite bakes env vars in at **build** time. Set in Netlify → Site settings → Environment variables:

```env
VITE_API_URL=https://your-backend.onrender.com/api/v1
```

Then trigger a new deploy. Changing `.env` locally does not affect the live site until you rebuild.

`public/_redirects` sends all routes to `index.html` so refresh on `/candidate/jobs` does not 404.

---

## Scripts

| Command | What it does |
|---------|----------------|
| `npm run dev` | Dev server (port 5173) |
| `npm run build` | Production bundle → `dist/` |
| `npm run preview` | Serve `dist/` locally |
| `npm run lint` | ESLint |

---

## Roles & routing

`ProtectedRoute` checks login and role:

- `candidateOnly` — candidate dashboard routes
- `staffOnly` + optional `permission` — recruiter routes
- `platformAdminOnly` — `/admin`

After login, redirect goes to `/admin`, `/recruiter`, or `/candidate` based on role. Career portal login can pass `?redirect=/careers/...` to land back on a job page.

---

## Things that bit us in prod (worth knowing)

1. **`VITE_API_URL` missing on Netlify** — app talked to `localhost` and WebSockets failed. Fix: set env on Netlify and redeploy.
2. **Do not set `Content-Type: application/json` on file upload** — `client.js` strips it for `FormData` so multipart uploads work.
3. **Resume list polls every 4s** while status is `parsing` — normal; not a bug.

---

## Related

- [Backend README](../backend/README.md)
- [Root README](../README.md)
