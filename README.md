# Seek

Point at nature. Discover what you're looking at.

Seek is a small full-stack app inspired by [iNaturalist Seek](https://www.inaturalist.org/pages/seek_app). Upload a photo of a plant or animal, and Gemini identifies it — common name, scientific name, habitat, conservation status, and more.

## Features

- Upload or drag-and-drop an image (camera supported on mobile)
- AI-powered species identification via **Google Gemini**
- Rich result card: taxonomy, habitat, IUCN status, confidence, and facts
- Warm, nature-themed UI

## Tech stack

| Layer | Stack |
|--------|--------|
| Frontend | React, Vite, Axios |
| API | Node.js, Express, Multer |
| AI | Python, LangChain, `langchain-google-genai` |
| Model | `gemini-2.5-flash` |

## Project structure

```
seek/
├── frontend/          # React app (Vite)
│   └── src/
│       ├── App.jsx
│       ├── Dashboard.jsx
│       └── Result.jsx
├── backend/
│   ├── server.js      # Express API, runs Python
│   ├── seek.py        # Gemini vision + JSON response
│   ├── requirements.txt
│   └── .env           # API keys (not committed)
├── Dockerfile         # Production build (Node + Python)
├── render.yaml        # Render.com blueprint
└── DEPLOY.md          # Free deployment guide
```

## Prerequisites

- **Node.js** 18+
- **Python** 3.11+
- A **Google AI Studio** API key → [aistudio.google.com/apikey](https://aistudio.google.com/apikey)

## Local setup

### 1. Clone and install

```bash
git clone https://github.com/namanyadav-08/seek.git
cd seek

# Frontend
cd frontend && npm install && cd ..

# Backend (Node)
cd backend && npm install && cd ..

# Backend (Python)
cd backend
python3 -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Environment variables

Create `backend/.env`:

```env
GOOGLE_API_KEY=your_key_here
```

### 3. Run

**Terminal 1 — API (port 3001):**

```bash
cd backend
source venv/bin/activate
node server.js
```

**Terminal 2 — frontend (port 5173):**

```bash
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Vite proxies `/identify` to the backend.

## API

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/identify` | Upload image (`multipart/form-data`, field: `image`) → JSON species data |
| `GET` | `/health` | Health check |

## Deploy for free

See **[DEPLOY.md](./DEPLOY.md)** for deploying to [Render](https://render.com) with Docker (free tier).

Quick summary: push to GitHub → connect Render → set `GOOGLE_API_KEY` → deploy.

## Gemini quota

The free tier limits requests per model per day (e.g. **20/day** for `gemini-2.5-flash`). If you hit the limit, you'll see a quota error — wait for the reset or enable billing in Google AI Studio.

## License

MIT (or your choice — add a `LICENSE` file if you publish the repo.)
