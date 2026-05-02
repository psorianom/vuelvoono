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

## Stack

Pure GitHub — no paid services, no extra accounts.

- **Frontend:** Next.js + Tailwind CSS, exported as a static site
- **Hosting:** GitHub Pages (auto-deploys on every push via GitHub Actions)
- **Data:** `db/lugares.json` in this repo, written via GitHub API
- **Auth:** GitHub Personal Access Token stored in your browser's localStorage

## Running it

The app is a static site deployed to GitHub Pages. There's nothing to run locally.

To use it:
1. Go to the live URL
2. Paste your GitHub Personal Access Token (fine-grained, Contents read & write on this repo)
3. Start logging places

To develop locally you need Node 20+ and to run `npm install && npm run dev` inside `app/`.

## Self-hosting

Fork the repo, enable GitHub Pages (Settings → Pages → Source: GitHub Actions), and use your own token. The data stays in your fork.
