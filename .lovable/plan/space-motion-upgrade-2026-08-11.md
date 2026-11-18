# Space & Motion Upgrade

Turn the portfolio into a cinematic space experience: a real starfield/galaxy background, richer scroll effects, and more interactive 3D — without changing any content or the Portfolio Manager.

## 1. Universe background (3D)
Rebuild the background scene as a layered cosmos:
- Deep starfield: thousands of tiny stars in a large sphere, slow drift + subtle twinkle.
- Galaxy: spiral disc of colored points (cyan → violet → mint from the existing neon palette), slowly rotating, tilted for depth.
- Nebula haze: soft additive glow clouds behind the galaxy.
- Shooting stars: occasional streaks crossing the view.
- Parallax: the whole cosmos reacts gently to mouse position and to scroll (drifts/rotates as you move down the page).
- Static CSS star layer paints instantly so there is no empty flash before 3D loads.

Performance and accessibility: star/galaxy counts scale down on mobile and low-core devices, rendering pauses when the tab is hidden, and with `prefers-reduced-motion` only the still CSS star layer shows.

## 2. Scroll effects
- Section headings and cards get direction-aware reveals with slight 3D rotation instead of plain fades.
- Parallax drift on hero image, section glows, and project covers.
- A thin neon scroll-progress bar at the top of the page.
- Hero content subtly scales/fades as it scrolls away.
- Stat tiles count up when they enter view.

## 3. Interactivity
- Cursor-following neon glow that reacts to hoverable elements (desktop only).
- Project and certificate cards: 3D tilt with a moving light sheen, lifted shadow, cover image zoom.
- Skill bars fill with an animated neon gradient and a glow pulse on reveal.
- Nav links get an animated active indicator that slides between sections.
- Buttons keep the magnetic behavior, with a soft ripple/glow on press.

## 4. Final check
- Load the site headless at desktop and mobile widths, screenshot each section, and confirm no console errors, no layout breakage, header/nav scroll tracking works, media viewer opens, and the manager (`/auth`, `/manager`) still loads.
- Verify reduced-motion mode renders a clean static version.

## Technical notes
- Background lives in `BackgroundFX.tsx` + a rewritten `ParticleScene.tsx` (React Three Fiber, `additive` blending points, `useFrame` animation, `Points` buffer geometry generated once with `useMemo`).
- New motion primitives added to `src/components/portfolio/motion.tsx`: `Parallax`, `ScrollProgress`, `CountUp`, `Spotlight`, plus an upgraded `TiltCard` with sheen.
- Scroll values via `useScroll`/`useTransform` from `motion/react`; no new dependencies.
- Only presentation files change; data layer, schema, and manager stay untouched.
