# MICHAEL DARKO — The Creative Lab

An immersive Next.js portfolio: a theatrical three-second hacking entrance opens into a full-screen 3D studio.

## Run locally

```sh
npm install
npm run dev
```

Open http://127.0.0.1:3000. `npm run build` validates production compilation and TypeScript. `npm run typecheck` runs TypeScript separately. The production build uses Webpack because Turbopack workers encountered a port restriction in the local sandbox.

## Navigation

- Start at eye level inside the studio. Drag or swipe to look around; use WASD, scroll, or the step buttons to walk. Movement stays within the room and stops at the workbench.
- Select the computer for projects, sketchbook for About, clipboard for CV, or message board for contact.
- Selecting a destination moves the camera close to the object. Content appears after arrival in a matching reading surface: laptop display, sketchbook, CV paper, or contact card. These are readable HTML surfaces layered over the close-up view, rather than texture-rendered text.
- The destination bar offers the same navigation through ordinary buttons, including on devices without WebGL.
- Escape returns to the overview. Left/right arrow keys cycle destinations when focus is outside a button or link.
- The lamp changes the scene lighting. Reduced-motion preferences disable animated camera transitions.

## Main files

- `components/PortfolioExperience.tsx`: entrance timer, full-screen room interface, information panels, and accessible destination controls.
- `components/StudioScene.tsx`: procedural geometry, first-person look/movement, guided close-up camera stops, projected object labels, and scene lighting.
- `content/studio.ts`: studio destinations.
- `content/portfolio.ts`: Michael’s profile, links, experience, education, skills, and project summaries.
- `app/work/[slug]/page.tsx`: directly accessible project case studies.
- `public/michael-darko-cv.pdf`: an unchanged copy of the supplied CV, served for download.
- `app/globals.css`: responsive room, floating panels, terminal, and direct case-study styles.

The login is a visual simulation. It collects no credentials. Profile and work summaries come from the supplied CV. Project artwork is illustrative; no project screenshots, metrics, repository links, or implementation details are invented. The GitHub and LinkedIn links point to the provided profiles.

Project visuals and fuller technical case studies can be added in `content/portfolio.ts`. The original CV stays unchanged. Learning checkpoints are paused per the request to build directly and explain afterward; notes are in `.vibe-wise/`.

## Design directions

In the original local workspace, open `/concepts` to compare three complete alternative portfolio pages: `/concepts/bento` (modular colourful cards), `/concepts/poster` (bold condensed typography), and `/concepts/editorial` (soft editorial layout). Each uses Michael’s real content, project routes, CV download, and contact links. The monogram artwork is a designed graphic, not a substitute person's photograph.

`components/ThemeProvider.tsx` manages the site-wide light/dark preference, persists it in local storage, and synchronizes it across open tabs. Theme buttons are available on the entrance, studio, concepts, and case studies. Deep burgundy accents and warm cream are shared across routes.

The studio now has enclosing walls and a ceiling. The doorway is at the far end of the room. After the three-second hacking simulation, the hinged door opens inward and the camera enters; the workbench is roughly ten step-button presses farther along. Direct studio links skip the entry animation. Reduced-motion preferences complete entry immediately.

## Project links and Git scope

The project list in `content/portfolio.ts` features MaxEase Manager, Ball N Stick, NowComplaints, and EFD Services. The three supplied public repositories have source links; all four have live-site links. NowComplaints has no supplied source repository.

`.gitignore` excludes dependencies, Next build output, exports, TypeScript caches, environment secrets (while allowing `.env.example`), logs, generated previews/test reports, and local Vibe Wise notes. Concept routes and `ConceptPortfolio.tsx` remain local and are excluded from Git. Links to these concepts appear only during development, so the main portfolio works without them in a production checkout. App source, configuration, the package lockfile, and the public CV remain included.

## Vercel deployment

Import the repository into Vercel with the Next.js framework preset. The build command is `npm run build`; use the default Next.js output settings. Vercel handles App Router routes, including `/work/[slug]`, without SPA fallback rewrites or a `vercel.json`. The ignored concept pages are not included in a fresh checkout.
