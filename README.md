# AI Facial Recognition

Real-time face, body, and hand tracking rendered as stylised visuals in the browser. Powered by MediaPipe Holistic — no server, no install, just a camera.

---

## Features

- **Real-time tracking** — detects 468 face landmarks, 33 body pose points, and 21 hand landmarks per hand at up to 30 fps
- **5 visual modes** — switch between modes live without restarting
- **3D depth** — line thickness and brightness vary with the Z coordinate of each landmark, giving a sense of depth
- **Thumbs up gesture** — hold a thumbs up to trigger a radial burst animation from your thumb tip
- **Mirror view** — canvas is flipped horizontally for a natural selfie feel

## Visual Modes

| Mode | Description |
|---|---|
| **Lines** | Glowing wireframe connecting all landmarks. Feature lines (eyes, lips, oval) render with 3D depth. |
| **Dots** | Each landmark rendered as a glowing point — face, body, and hands in distinct colours. |
| **ASCII** | Full video frame mapped to coloured ASCII characters on a black background. |
| **Mosaic** | Video chunked into averaged colour blocks. |
| **Low Poly** | Face mesh triangulated and filled with colour sampled from the live video. |

## Gesture: Thumbs Up

Point your thumb upward with your fist closed and hold the pose steady. After a brief confirmation window (4 consecutive frames), a burst of concentric rings and radial lines fires from your thumb tip. There is a 2.5 second cooldown between triggers. Works in all visual modes.

---

## Getting Started

**Requirements:** Node.js 18+

```bash
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser and allow camera access when prompted.

## Build & Deploy

```bash
npm run build    # outputs to dist/
npm run preview  # preview the production build locally
```

The app is deployable to any static host. Camera access requires HTTPS, which platforms like Vercel provide automatically.

### Deploy to Vercel

1. Push the repository to GitHub
2. Import the repo at [vercel.com](https://vercel.com)
3. Vercel auto-detects Vite — click **Deploy**

Every push to `main` triggers an automatic redeploy.

---

## Tech Stack

- [React 18](https://react.dev) — UI and component state
- [Vite 5](https://vitejs.dev) — dev server and build tool
- [MediaPipe Holistic](https://developers.google.com/mediapipe/solutions/vision/holistic_landmarker) — face mesh, pose, and hand landmark detection (loaded via CDN)
- Canvas API — all rendering

## Project Structure

```
src/
├── components/
│   ├── App.jsx           — root state (started, mode)
│   ├── LandingPage.jsx   — intro screen with mode selector
│   ├── Tracker.jsx       — active tracking view
│   ├── Canvas.jsx        — canvas element ref
│   ├── StatusBar.jsx     — tracking status indicator
│   └── ModeSelector.jsx  — in-tracker mode switcher
├── hooks/
│   └── useDetector.js    — MediaPipe lifecycle and camera setup
└── lib/
    ├── renderer.js        — dispatches to the active mode renderer
    ├── renderers/
    │   ├── lines.js       — wireframe with 3D depth
    │   ├── dots.js        — point cloud
    │   ├── ascii.js       — ASCII art
    │   ├── mosaic.js      — pixel mosaic
    │   └── lowpoly.js     — Delaunay-triangulated low poly
    └── effects/
        ├── manager.js     — effect lifecycle and rendering
        └── thumbsUp.js    — thumbs up detection and trigger
```
