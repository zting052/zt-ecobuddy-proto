# Ecobuddy Prototype (Web)

A framework-free, static prototype that matches the 3-row design:
- Bottom nav with three icons
- Each icon navigates to a page corresponding to each row in the design image
- Lightweight hash router
- Minimal component-less JS for fast iteration
- Social page uses the Level 2 “Bushes” theme (same header/progress/hills)

## Run locally

Open `index.html` or serve the folder (recommended):

```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Deploy on GitHub Pages

- Push to `main` (instructions below).
- In the repo, go to Settings → Pages → Source: `main` branch, `/ (root)`.
- Save and wait ~2 minutes.
- URL: `https://zting052.github.io/zt-ecobuddy-proto/`