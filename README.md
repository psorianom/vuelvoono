# vuelvoono

> *¿Vuelvo o no?*

A personal restaurant and bar tracker born out of frustration.

## The problem

We are a group of friends — mexicans living in Paris, french living in Mexico — who share a very specific affliction: we know exactly what good food, good service, and a good room looks like. We've sat in actual Parisian bistros. We've eaten real tacos at 2am. We have references.

So when a restaurant in Mexico City charges Paris prices, puts on the linen tablecloths, dims the lights, and then brings you lukewarm food after 45 minutes of being ignored by the staff — we notice. We notice a lot.

The *aspirational Parisian vibe* is everywhere. The actual Parisian quality is not. And nobody is keeping score.

We decided to keep score.

## What it does

A private web app to log and rate places we visit — restaurants, bars, cafés — across four categories we actually care about:

| Category | What it means |
|---|---|
| **Recepción** | Were we welcomed? Did they know we existed? |
| **Atención / Servicio** | The whole experience of being attended to |
| **Lugar** | The space, the vibe, the music, the light |
| **Producto** | The actual food and drink. The reason we're there. |

Each category is rated 1–10. The app shows the average, keeps the history, and lets us write notes for the things numbers can't capture.

The name comes from the only question that matters after leaving a place: *¿Vuelvo o no?*

---

## How it works

### The big picture

```
You (browser)
    │
    ├── visits ──────────────► GitHub Pages
    │                          (serves the static app)
    │
    ├── reads data ──────────► GitHub API → db/lugares.json
    │
    └── writes data ─────────► GitHub API → db/lugares.json
                                             (saved as a commit in the repo)
```

There is no backend server. No database. No paid service. Everything lives in this GitHub repo:
- The **app code** lives in `app/`
- The **data** lives in `db/lugares.json`
- The **hosting** is GitHub Pages, which serves the built static files

---

### Tech stack

| Layer | What | Why |
|---|---|---|
| **Framework** | Next.js 15 (App Router) | File-based routing, TypeScript, great static export |
| **Styling** | Tailwind CSS v3 | Utility classes, no separate CSS files |
| **Language** | TypeScript | Type safety, better autocomplete |
| **Data storage** | `db/lugares.json` in this repo | Free, version-controlled, no database needed |
| **Hosting** | GitHub Pages | Free, HTTPS, auto-deploys |
| **CI/CD** | GitHub Actions | Builds the app and deploys on every code push |

---

### Repository structure

```
vuelvoono/
├── app/                        ← Next.js project lives here
│   ├── app/                    ← Next.js App Router pages
│   │   ├── layout.tsx          ← Root layout (wraps all pages)
│   │   ├── page.tsx            ← Main page: token gate + list of lugares
│   │   └── nuevo/
│   │       └── page.tsx        ← Add new lugar form
│   ├── lib/
│   │   └── github.ts           ← All GitHub API calls (read/write data)
│   ├── public/
│   │   └── .nojekyll           ← Tells GitHub Pages not to use Jekyll
│   ├── next.config.ts          ← Static export config + basePath
│   ├── tailwind.config.ts
│   └── package.json
├── db/
│   └── lugares.json            ← All your data lives here
├── .github/
│   └── workflows/
│       └── deploy.yml          ← GitHub Actions: build + deploy to Pages
└── README.md
```

---

### Auth flow

There is no login server. Auth works like this:

1. You open the app for the first time
2. The app asks for a **GitHub Personal Access Token** (fine-grained, Contents read & write on this repo only)
3. The token is saved in **localStorage** in your browser — it never leaves your device, it's never sent to any server other than GitHub's API
4. Every subsequent visit, the app reads the token from localStorage and uses it silently
5. "Log out" = clear localStorage

The token is the password. If someone else opens the URL, they'll see the token entry screen and can't get in without a valid token with access to this repo.

---

### Data flow: reading lugares

```
page.tsx (browser)
    │
    └── calls getLugares(token) in lib/github.ts
            │
            └── GET https://api.github.com/repos/psorianom/vuelvoono/contents/db/lugares.json
                    │
                    └── returns base64-encoded JSON
                            │
                            └── decoded → array of Lugar objects → rendered as cards
```

---

### Data flow: saving a new lugar

```
nuevo/page.tsx (browser)
    │
    └── calls addLugar(token, data) in lib/github.ts
            │
            ├── GET current file (to get current SHA — required by GitHub API to update a file)
            │
            └── PUT new file content (appends new lugar to the array)
                    │
                    └── GitHub creates a commit on master
                            (this is why each new lugar appears as a commit in the repo history)
```

---

### Deploy flow: how code changes go live

Only triggered when files inside `app/` change (not when data changes).

```
git push (local) → GitHub repo
    │
    └── GitHub Actions: deploy.yml
            │
            ├── actions/checkout         ← downloads the repo code
            ├── actions/setup-node       ← installs Node 20
            ├── npm install              ← installs Next.js and dependencies
            ├── npm run build            ← next build → generates static files in app/out/
            ├── touch app/out/.nojekyll  ← prevents Jekyll from breaking _next/ folder
            ├── upload-pages-artifact    ← packages app/out/ for Pages
            └── deploy-pages             ← pushes to GitHub Pages infrastructure
                    │
                    └── live at https://psorianom.github.io/vuelvoono/
```

The build takes about 1–2 minutes. Data changes (adding a lugar) skip this entirely — they go directly to the GitHub API and are visible in the app immediately.

---

### Key files to know

| File | What to touch when... |
|---|---|
| `app/app/page.tsx` | changing the main page layout or cards |
| `app/app/nuevo/page.tsx` | changing the add form |
| `app/lib/github.ts` | changing how data is read or written |
| `app/next.config.ts` | changing build settings (basePath, etc.) |
| `.github/workflows/deploy.yml` | changing how/when the app deploys |
| `db/lugares.json` | the data itself (don't edit manually — use the app) |

---

## Running it

**To use the app:** go to **https://psorianom.github.io/vuelvoono/**, paste your GitHub token, done.

**To develop locally** (requires Node 20+):
```bash
cd app
npm install
npm run dev
# → http://localhost:3000
```
In dev mode `basePath` is empty so the app runs at the root. The token flow works the same as production.

**To deploy a change:** just `git push`. GitHub Actions handles the rest.

---

## Self-hosting

Fork the repo, enable GitHub Pages (Settings → Pages → Source: GitHub Actions), update the `REPO` constant in `app/lib/github.ts` to point to your fork, and use your own token. Your data stays in your fork.
