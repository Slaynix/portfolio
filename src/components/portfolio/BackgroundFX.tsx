import { Suspense, lazy, useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

const ParticleScene = lazy(() => import("./ParticleScene"));

/** Layered cosmos background: instant CSS starfield + lazy 3D galaxy scene. */
export function BackgroundFX({ enabled = true }: { enabled?: boolean }) {
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [count, setCount] = useState(1600);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 768px)").matches;
    const lowPower = (navigator.hardwareConcurrency ?? 4) <= 4;
    setCount(mobile ? 900 : lowPower ? 1900 : 4200);
    const id = window.setTimeout(() => setReady(true), 300);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,color-mix(in_oklab,var(--neon-2)_10%,transparent),transparent_60%)]" />

      {/* Static star layers paint immediately, so there is never an empty flash. */}
      <div className="starfield-static absolute -inset-[20%] opacity-90 animate-twinkle" />
      <div
        className="starfield-static absolute -inset-[20%] opacity-60 animate-drift"
        style={{ backgroundSize: "520px 520px" }}
      />
      <div
        className="starfield-static absolute -inset-[20%] opacity-45 animate-twinkle"
        style={{ backgroundSize: "260px 260px", animationDelay: "1.4s" }}
      />

      <div className="grid-lines absolute inset-0 opacity-25" />
      <div className="absolute -top-40 left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-neon/12 blur-[130px] animate-aurora" />
      <div className="absolute bottom-[-14rem] right-[-8rem] h-[32rem] w-[32rem] rounded-full bg-neon-2/12 blur-[140px] animate-aurora" />

      {enabled && !reduce && ready ? (
        <div className="absolute inset-0 opacity-80">
          <Suspense fallback={null}>
            <ParticleScene count={count} />
          </Suspense>
        </div>
      ) : null}

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background/80" />
    </div>
  );
}
