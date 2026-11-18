import Lenis from "lenis";
import { useEffect } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Inertial wheel scrolling and anchor glides, with native touch scrolling on
 * touch-only mobile devices and for people who prefer reduced motion.
 */
export function SmoothScroll() {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const touchOnlyMobile =
      window.matchMedia("(pointer: coarse) and (hover: none)").matches &&
      !window.matchMedia("(any-pointer: fine)").matches;
    if (touchOnlyMobile) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Anchor links (#about, #projects, ...) glide instead of jumping.
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        !(event.target instanceof Element)
      ) {
        return;
      }
      const anchor = event.target.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#" || anchor.target === "_blank") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -90, duration: 1.4 });
    };
    document.addEventListener("click", onClick);

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, [reduce]);

  return null;
}
