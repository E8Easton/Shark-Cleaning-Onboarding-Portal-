# Shark Cleaning LLC — Onboarding Portal

Professional contractor onboarding for **technicians** and **door-to-door sales reps**: video training, operations manuals, agreement sign-off, and sales tracking.

## Quick start

```bash
npm install
cp .env.example .env
# Set VITE_OWNER_EMAILS to your email for Content Studio access
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### How to use

**Home screen — 3 buttons:**

1. **Technician** or **Door-to-Door Sales** → enter your name → start the training path
2. **Admin / Owner** → open the admin dashboard (edit videos, add steps, see completions)

Progress is saved by **name + role**, so the same person can return and continue later.

### Admin (add videos & manage steps)

Click **Admin / Owner**, then **Admin dashboard** in the sidebar:

- **Completions** tab — see every trainee, progress %, and who fully finished
- **Edit training content** tab — add steps 8, 9, 10…, delete steps, edit page text, videos, manuals, and agreements

## Deploy (Vercel)

1. Push to GitHub.
2. Import the repo in [Vercel](https://vercel.com).
3. Add environment variables from `.env.example`.
4. Deploy — `vercel.json` handles SPA routing.

## Supabase (optional)

For data that persists across browsers and devices:

1. Create a [Supabase](https://supabase.com) project.
2. Run `supabase/schema.sql` in the SQL Editor.
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env` and Vercel.

Without Supabase, everything saves to **localStorage** in the browser (fine for demos and single-device use).

## Scripts

| Command        | Description              |
|----------------|--------------------------|
| `npm run dev`  | Local development server |
| `npm run build`| Production build         |
| `npm run preview` | Preview production build |

## Stack

- React 19 + Vite 8
- Tailwind CSS 4
- Lucide icons
- Optional Supabase for cloud storage
