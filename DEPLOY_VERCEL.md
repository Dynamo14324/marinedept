# Deploy Marine Dashboard on Vercel

This dashboard is a static client-side app (`index.html` + `app.js` + `styles.css`) and is ready for Vercel hosting.

## Option 1: Vercel Dashboard (recommended)
1. Push this repository to GitHub/GitLab/Bitbucket.
2. Go to https://vercel.com/new.
3. Import this repository.
4. Framework preset: **Other** (or Static Site).
5. Build command: **(leave empty)**.
6. Output directory: **(leave empty)**.
7. Deploy.

Vercel will serve `index.html` as the root page.

## Option 2: Vercel CLI
```bash
npm i -g vercel
vercel login
vercel
```
For production:
```bash
vercel --prod
```

## Notes
- `vercel.json` is included for clean URL and headers.
- File uploads stay browser-local; Excel files are **not** uploaded to a backend.
- To update dashboard data, users re-upload updated Excel files in the UI.


## Troubleshooting
- If Vercel shows `404: NOT_FOUND`, ensure Project Settings → Root Directory points to this repo root and redeploy latest commit.
- This repo includes a fallback route in `vercel.json` so any unmatched path rewrites to `/index.html`.
- If deployment was created before `vercel.json` existed, trigger a fresh redeploy from the latest commit.
