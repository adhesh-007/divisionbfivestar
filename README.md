# Division B — Club Health Console

A real, deployable web app: a **public read-only dashboard** plus an **admin-only console** for adding, editing and deleting data. It is built with plain HTML, CSS and JavaScript and a few small serverless API functions. There is no framework and no build step, so it deploys to Vercel with almost no configuration.

**Developed by Adhesh**

---

## Contents

- [What you get after deploying](#what-you-get-after-deploying)
- [Features](#features)
- [Project structure](#project-structure)
- [1. Push this folder to GitHub](#1-push-this-folder-to-github)
- [2. Import into Vercel](#2-import-into-vercel)
- [3. Add a Redis database](#3-add-a-redis-database-this-is-what-makes-data-persist)
- [4. Set your admin credentials and session secret](#4-required-set-your-admin-credentials-and-session-secret)
- [5. Rename the project](#5-optional-rename-the-project-to-get-the-exact-divisionbfivestar-link)
- [Troubleshooting](#troubleshooting)
- [Notes and honest limitations](#notes-and-honest-limitations)

---

## What you get after deploying

| Page | Address | Who can use it |
| --- | --- | --- |
| **Public dashboard** | `https://<your-project>.vercel.app/` (also at `/divisionbfivestar`) | Anyone. Browse every dashboard and export to Excel. No editing. |
| **Admin console** | `https://<your-project>.vercel.app/divisionbfivestaradmin` | Admin only. Asks for a username and password before showing anything. Once signed in, every add / edit / delete control is unlocked. |

Both pages read and write the **same shared data**, so an admin change shows up on the public link within seconds. Logging out of the admin console takes you back to the public dashboard (viewer mode).

---

## Features

**Dashboards**

- **Overview:** division-wide stats (clubs tracked, total membership, retention, 5-Star meeting rate, Pathways adoption, Mentor coverage, education badges, Success Plans submitted), plus club cards grouped by area.
- **Risk flags:** clubs are marked *Watch* or *Critical* automatically, for example when no meeting has been logged in 21+ days or the 5-Star rate is under 50%.
- **Club dashboards:** per-club donut and bar charts, attendance trends, club strength trend, and a monthly matrix.
- **Area dashboards and comparison:** per-area breakdowns, top and bottom performers, and an area leaderboard ranked by composite score.

**Data you can track (admin)**

- Meetings, scored out of 5 (on time, 2+ speeches, 2+ guests, agenda sent early, flyer sent early)
- Pathways adoption and Mentor coverage, by month
- Club strength (membership) and net growth
- Attendance (members and guests)
- Education badges and Club Success Plan submissions
- Clubs, areas and area directors, with bulk-paste for adding many clubs at once

**Exports**

- Whole-division Excel workbook (12 sheets)
- One workbook with a sheet per club
- Single-club export from each club dashboard

---

## Project structure

```
divisionb-app/
├── index.html      # Public dashboard (read-only)
├── admin.html      # Admin console (login required)
├── app.js          # All front-end logic and rendering
├── styles.css      # Styling
├── api/            # Serverless functions (state, login, logout, session, data endpoints)
├── lib/            # Shared helpers used by the API functions
├── package.json
└── vercel.json     # Routing (public, /divisionbfivestar, admin URL)
```

---

## 1. Push this folder to GitHub

```bash
cd divisionb-app
git init
git add .
git commit -m "Division B club health console"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

You can also use GitHub Desktop or GitHub's "Upload files" web UI if you'd rather not use the terminal.

## 2. Import into Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repo you just pushed.
2. Leave the framework preset as **Other**. No build command is needed.
3. Click **Deploy**. It will go live, but data won't save until step 3 is done.

## 3. Add a Redis database (this is what makes data persist)

Vercel's own KV product was retired. The replacement is **Upstash Redis**, installed the same way:

1. In your Vercel project, open the **Storage** tab.
2. Click **Create Database**, choose **Upstash**, then **Redis**.
3. Once it's created, click **Connect to Project** and select this project.
4. This adds the environment variables the app needs. Either naming works and the app reads both:
   - `KV_REST_API_URL` and `KV_REST_API_TOKEN`, or
   - `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
5. Go to **Deployments** and redeploy (or push a commit) so the new variables take effect.

## 4. (Required) Set your admin credentials and session secret

The app ships with built-in fallback credentials and a fallback signing secret so it runs out of the box. Because this repository is public, **treat those fallbacks as known to everyone and replace them before you use the admin console.**

In **Project Settings → Environment Variables**, add:

| Name | Value |
| --- | --- |
| `ADMIN_USERNAME` | Your chosen admin username |
| `ADMIN_PASSWORD` | A long, unique password (use a password manager) |
| `SESSION_SECRET` | A long random string that signs the login cookie |

Generate a session secret with:

```bash
openssl rand -hex 32
```

Redeploy after adding these, then confirm that the old fallback login no longer works. Never commit these values to the repository.

## 5. (Optional) Rename the project to get the exact `divisionbfivestar` link

In **Project Settings → General → Project Name**, rename it to `divisionbfivestar`. Vercel will then serve:

- the public dashboard at `https://divisionbfivestar.vercel.app`
- the admin console at `https://divisionbfivestar.vercel.app/divisionbfivestaradmin`

---

## Troubleshooting

| Problem | What to check |
| --- | --- |
| Data doesn't save or disappears | The Redis database isn't connected, or you haven't redeployed since connecting it (step 3). |
| Can't sign in with my new password | The environment variables weren't added to the **Production** environment, or the project wasn't redeployed (step 4). |
| Logging out doesn't return to the public dashboard | Make sure you're using the latest `app.js`. If the problem persists, check that the logout function in `api/` clears the session cookie with the same `Path` it was created with. |
| Kicked out while working | Admin sessions last 12 hours. Sign in again. |
| "Excel export library failed to load" | The page couldn't reach the Excel library. Check your internet connection and try again. |
| Changes don't show on the public page | Refresh the page. Public visitors see updates the next time the data loads. |

---

## Notes and honest limitations

- **This replaces the earlier Claude-artifact version.** That version's data lived inside Claude's own storage and only worked inside claude.ai, so it won't carry over. You'll re-enter your clubs. Bulk-paste still works: see **Manage Clubs & Areas** once you're signed in as admin.
- **Session length:** admin logins last 12 hours, then you'll need to sign in again.
- **Security model:** this is a single shared admin login (not per-person accounts), enforced on the server with a signed, HttpOnly cookie. That is a real improvement over the old client-side-only lock and is appropriate for a small club or division tool. It is not built for handling sensitive personal data at scale.
- **Free tier is plenty** for a division's worth of clubs. Upstash's free tier covers far more reads and writes than this app will generate.

---

**Developed by Adhesh**
