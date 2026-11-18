import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import {
  createElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type Tag = "div" | "h1" | "h2" | "p" | "span" | "li" | "section" | "article";

/**
 * CSS-transition reveal on scroll. Uses a plain element plus IntersectionObserver so
 * content is always readable even if animation frames never run (hidden/背景 tabs).
 */
export function FadeIn({
  children,
  as = "div",
  className,
  style,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
}: {
  children: ReactNode;
  as?: Tag;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: "80px" },
    );
    observer.observe(node);
    const fallback = window.setTimeout(() => setShown(true), 2500);
    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  const offset = reduce ? "none" : `translate3d(${shown ? 0 : x}px, ${shown ? 0 : y}px, 0)`;

  return createElement(
    as,
    {
      ref: ref as never,
      className,
      style: {
        ...style,
        opacity: shown ? 1 : 0,
        transform: offset,
        transition: `opacity ${duration}s cubic-bezier(0.25,0.1,0.25,1) ${delay}s, transform ${duration}s cubic-bezier(0.25,0.1,0.25,1) ${delay}s`,
        willChange: "opacity, transform",
      },
    },
    children,
  );
}

/** Mouse-following magnetic wrapper. */
export function Magnet({
  children,
  className,
  padding = 150,
  strength = 3,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.6s ease-in-out",
}: {
  children: ReactNode;
  className?: string;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reduce) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (event: globalThis.MouseEvent) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = Math.abs(cx - event.clientX);
      const dy = Math.abs(cy - event.clientY);
      if (dx < rect.width / 2 + padding && dy < rect.height / 2 + padding) {
        setActive(true);
        setPos({ x: (event.clientX - cx) / strength, y: (event.clientY - cy) / strength });
      } else {
        setActive(false);
        setPos({ x: 0, y: 0 });
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [padding, strength, reduce]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        transition: active ? activeTransition : inactiveTransition,
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}

/** Character-by-character scroll reveal. */
export function AnimatedText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.2"] });
  const words = text.split(/\s+/).filter(Boolean);
  const total = words.reduce((sum, word) => sum + Array.from(word).length + 1, 0);
  let cursor = 0;

  return (
    <p ref={ref} className={cn("flex flex-wrap justify-center", className)}>
      {words.map((word, wordIndex) => {
        const start = cursor;
        cursor += word.length + 1;
        return (
          <span key={wordIndex} className="mr-[0.3em] inline-block whitespace-nowrap">
            {Array.from(word).map((char, charIndex) => {
              const index = start + charIndex;
              return (
                <Char
                  key={charIndex}
                  char={char}
                  progress={scrollYProgress}
                  range={[index / total, (index + 1) / total]}
                />
              );
            })}
          </span>
        );
      })}
    </p>
  );
}

function Char({
  char,
  progress,
  range,
}: {
  char: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <span className="relative inline-block">
      <span className="opacity-20">{char}</span>
      <motion.span style={{ opacity }} className="absolute inset-0">
        {char}
      </motion.span>
    </span>
  );
}

export function ContactButton({ className, href = "#contact" }: { className?: string; href?: string }) {
  return (
    <a
      href={href}
      className={cn(
        "btn-aurora inline-flex items-center justify-center rounded-full px-8 py-3 text-xs font-medium uppercase tracking-widest text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5 hover:scale-[1.03] sm:px-10 sm:py-3.5 sm:text-sm md:px-12 md:py-4 md:text-base",
        className,
      )}
      style={{ color: "white" }}
    >
      Contact Me
    </a>
  );
}

export function LiveProjectButton({
  href,
  label = "Live Project",
  className,
  icon,
}: {
  href: string;
  label?: string;
  className?: string;
  icon?: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={cn(
        "inline-flex items-center gap-2 rounded-full border-2 border-steel px-8 py-3 text-sm font-medium uppercase tracking-widest text-steel transition-colors duration-200 hover:bg-steel/10 sm:px-10 sm:py-3.5 sm:text-base",
        className,
      )}
    >
      {icon}
      {label}
    </a>
  );
}

/**
 * Scroll-linked parallax wrapper: children drift vertically (and optionally
 * fade/scale) as they travel through the viewport — the "scroll world" effect.
 */
export function Parallax({
  children,
  className,
  speed = 0.25,
  fade = false,
  scale = false,
}: {
  children: ReactNode;
  className?: string;
  /** Positive = lags behind scroll, negative = races ahead. 0.2–0.4 feels natural. */
  speed?: number;
  fade?: boolean;
  scale?: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const distance = speed * 220;
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.35, 1, 1, 0.35]);
  const s = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1, 0.96]);

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        y,
        willChange: "transform",
        ...(fade ? { opacity } : {}),
        ...(scale ? { scale: s } : {}),
      }}
    >
      {children}
    </motion.div>
  );
}

export { motion, useScroll, useTransform };
