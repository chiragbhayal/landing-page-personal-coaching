# Gomzi Transformation Program – Landing page

Fat loss → Muscle → Stage landing page, built with [Vite](https://vite.dev/) (plain HTML, CSS and JavaScript, no framework).

## Getting started

Requires Node.js 18+.

```bash
npm install
cp .env.example .env   # then edit VITE_BACKEND_URL if needed
npm run dev            # http://localhost:5173
```

| Command           | What it does                                  |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Start the dev server with hot reload          |
| `npm run build`   | Production build into `dist/`                 |
| `npm run preview` | Serve the production build locally            |

## Project structure

```
index.html                  Page markup (Vite entry point)
src/
  main.js                   Loads styles and initialises all page scripts
  config.js                 Backend URL + WhatsApp number
  styles/main.css           All page styles
  scripts/
    mobile-nav.js           Mobile navigation drawer
    goal-dropdown.js        "Your goal" dropdown in the form
    counselling-form.js     Form validation, CRM capture, WhatsApp hand-off
    prep-slider.js          Contest-prep image slider
  assets/images/            Images (hashed and optimised by Vite on build)
```

## Configuration

- **WhatsApp number**: change `WHATSAPP_PHONE` / `WHATSAPP_DISPLAY` in `src/config.js`. The number is
  also written as text in `index.html` (search for `wa.me` and `WhatsApp +91`).
- **Brand accent colour**: `--gomzi-accent` at the top of `src/styles/main.css`.
- **Backend (CRM) URL**: `VITE_BACKEND_URL` in `.env`. It is baked in at build time, so restart
  `npm run dev` / rebuild after changing it. If it is empty, form inquiries go to WhatsApp only.

## Vercel deployment

`vercel.json` sets the Vite preset (build: `npm run build`, output: `dist`). Add
`VITE_BACKEND_URL` under **Project → Settings → Environment Variables** in Vercel.
