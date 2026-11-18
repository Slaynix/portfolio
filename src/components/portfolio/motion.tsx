import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useInView,
} from "motion/react";
import { useEffect, useRef, useState, type RefObject, type ReactNode, type MouseEvent, type ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** Hook: true once the element has scrolled into view. */
function useRevealed(ref: RefObject<HTMLElement | null>) {
  return useInView(ref, { once: true, margin: "-60px 0px -60px 0px" });
}

export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const shown = useRevealed(ref);
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      animate={shown ? { opacity: 1, y: 0 } : { opacity: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  className,
  step = 0.07,
}: {
  children: ReactNode;
  className?: string;
  step?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useRevealed(ref);
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={shown ? "show" : "hidden"}
      variants={{ show: { transition: { staggerChildren: step } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={{
        hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 22, scale: 0.98 },
        show: { opacity: 1, y: 0, scale: 1 },
      }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function TiltCard({
  children,
  className,
  intensity = 10,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [intensity, -intensity]), {
    stiffness: 220,
    damping: 22,
  });
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-intensity, intensity]), {
    stiffness: 220,
    damping: 22,
  });
  const sheenX = useTransform(x, [-0.5, 0.5], ["0%", "100%"]);
  const sheenY = useTransform(y, [-0.5, 0.5], ["0%", "100%"]);
  const [hover, setHover] = useState(false);

  function onMove(event: MouseEvent<HTMLDivElement>) {
    if (reduce) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        x.set(0);
        y.set(0);
      }}
      style={reduce ? {} : { rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className={cn("relative will-change-transform", className)}
    >
      {children}
      {reduce ? null : (
        <motion.span
          aria-hidden
          style={{
            opacity: hover ? 0.5 : 0,
            background: `radial-gradient(220px circle at var(--sheen-x) var(--sheen-y), color-mix(in oklab, var(--neon) 22%, transparent), transparent 70%)`,
            ["--sheen-x" as string]: sheenX,
            ["--sheen-y" as string]: sheenY,
          }}
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
        />
      )}
    </motion.div>
  );
}

type MagneticProps = ComponentProps<typeof motion.button> & { strength?: number };

export function MagneticButton({ children, className, strength = 0.25, ...rest }: MagneticProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);
  const x = useSpring(0, { stiffness: 260, damping: 20 });
  const y = useSpring(0, { stiffness: 260, damping: 20 });

  return (
    <motion.button
      ref={ref}
      style={{ x, y }}
      onMouseMove={(event) => {
        if (reduce) return;
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
        y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileTap={{ scale: 0.97 }}
      className={className}
      {...rest}
    >
      {children}
    </motion.button>
  );
}

export { motion, useReducedMotion };

/** Vertical parallax drift tied to page scroll while the element is in view. */
export function Parallax({
  children,
  className,
  distance = 60,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [distance, -distance]), {
    stiffness: 90,
    damping: 24,
    mass: 0.5,
  });
  return (
    <div ref={ref} className={className}>
      <motion.div style={reduce ? {} : { y }} className="will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}

/** Direction-aware reveal with a subtle 3D rotation. */
export function Reveal3D({
  children,
  className,
  delay = 0,
  from = "bottom",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  from?: "bottom" | "left" | "right";
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const shown = useRevealed(ref);
  const offset =
    from === "left"
      ? { x: -46, rotateY: 10 }
      : from === "right"
        ? { x: 46, rotateY: -10 }
        : { y: 40, rotateX: 12 };
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ transformPerspective: 1200 }}
      initial={reduce ? { opacity: 0 } : { opacity: 0, ...offset }}
      animate={shown ? { opacity: 1, x: 0, y: 0, rotateX: 0, rotateY: 0 } : { opacity: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Thin neon progress bar showing how far the page is scrolled. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.3 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-gradient-to-r from-neon via-neon-2 to-neon-3"
    />
  );
}

/** Counts a numeric value up when it scrolls into view. */
export function CountUp({
  value,
  className,
  duration = 1.1,
}: {
  value: number;
  className?: string;
  duration?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(reduce ? value : 0);

  useEffect(() => {
    if (reduce || !inView) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / (duration * 1000));
      setDisplay(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduce, value, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}

/** Cursor-following neon glow (desktop pointers only). */
export function Spotlight() {
  const reduce = useReducedMotion();
  const x = useSpring(-500, { stiffness: 120, damping: 22, mass: 0.4 });
  const y = useSpring(-500, { stiffness: 120, damping: 22, mass: 0.4 });
  const scale = useSpring(1, { stiffness: 200, damping: 20 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (reduce) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      const target = event.target as HTMLElement | null;
      scale.set(target?.closest("a,button,[role='button']") ? 1.6 : 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, scale, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      style={{ x, y, scale }}
      className="pointer-events-none fixed left-0 top-0 z-30 -ml-40 -mt-40 h-80 w-80 rounded-full opacity-60 mix-blend-screen"
    >
      <div className="h-full w-full rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--neon)_26%,transparent)_0%,transparent_62%)]" />
    </motion.div>
  );
}
