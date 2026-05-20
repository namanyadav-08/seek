# Deploy Seek for free (Render)

This app needs **Node + Python + Gemini API**. The easiest free setup is one [Render](https://render.com) web service using the included `Dockerfile`.

## What you get (free tier)

| Piece | Where |
|--------|--------|
| React UI + Express API + Python | Render free web service |
| Gemini AI | Google AI Studio free tier (20 req/day per model on `gemini-2.5-flash`) |

**Trade-offs:** Render free instances **sleep after ~15 minutes** of no traffic (first visit after sleep can take 30–60s to wake up). Gemini free quota is easy to hit while testing.

---

## 1. Push code to GitHub

From the `seek/` folder (the one that contains `frontend/`, `backend/`, and `Dockerfile`):

```bash
cd seek
git init
git add .
git commit -m "Prepare for Render deployment"
```

Create a new repo on GitHub, then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/seek.git
git branch -M main
git push -u origin main
```

Do **not** commit `.env` — it is in `.gitignore`.

---

## 2. Deploy on Render

1. Sign up at [render.com](https://render.com) (GitHub login is fine).
2. **New → Web Service** → connect your GitHub repo.
3. Settings:
   - **Root Directory:** leave blank if the repo root is the `seek/` folder with `Dockerfile`; if your repo root is `seek/seek/`, set root to `seek`.
   - **Runtime:** Docker
   - **Instance type:** Free
4. **Environment variables** → add:
   - `GOOGLE_API_KEY` = your key from [Google AI Studio](https://aistudio.google.com/apikey)
   - `NODE_ENV` = `production` (optional; Dockerfile sets it)
5. Click **Create Web Service** and wait for the first build (~5–10 min).

Your live URL will look like: `https://seek-xxxx.onrender.com`

---

## 3. Test

- Open the Render URL in a browser.
- Upload a photo and tap **seek**.
- If you see a quota error, wait or switch model in `backend/seek.py` (separate free limits per model).

---

## Local dev (unchanged)

Terminal 1 — backend:

```bash
cd backend
source venv/bin/activate   # if you use a venv
node server.js
```

Terminal 2 — frontend:

```bash
cd frontend
npm run dev
```

Vite proxies `/identify` to `localhost:3001`, so the app works the same as production routing.

---

## Optional: deploy with Blueprint

If Render detects `render.yaml` in the repo, you can use **New → Blueprint** and apply it; set `GOOGLE_API_KEY` when prompted.

---

## Other free options

| Platform | Notes |
|----------|--------|
| **Railway** | Small monthly credit; similar Docker deploy |
| **Fly.io** | Free allowance; needs `fly.toml` (not included) |
| **Vercel (frontend only)** | Would require splitting API to Render/Railway anyway |

Keeping **one Docker service on Render** is the simplest path for this stack.
