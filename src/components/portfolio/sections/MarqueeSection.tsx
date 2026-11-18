import { useEffect, useRef } from "react";
import { useMotionValue, useTransform } from "motion/react";
import type { PortfolioData } from "@/lib/portfolio-query";
import { motion } from "@/components/portfolio/jack";

type Tile =
  | { kind: "image"; key: string; src: string; alt: string }
  | { kind: "text"; key: string; title: string; subtitle?: string | null | undefined };

function buildTiles(data: PortfolioData): Tile[] {
  const images: Tile[] = [];
  for (const project of data.projects) {
    if (project.thumbnail_url)
      images.push({ kind: "image", key: `p-${project.id}`, src: project.thumbnail_url, alt: project.title });
    project.images?.forEach((src, index) =>
      images.push({ kind: "image", key: `pi-${project.id}-${index}`, src, alt: project.title }),
    );
  }
  for (const cert of data.certificates) {
    if (cert.image_url)
      images.push({ kind: "image", key: `c-${cert.id}`, src: cert.image_url, alt: cert.title });
  }
  const texts: Tile[] = data.highlights.map((item) => ({
    kind: "text",
    key: `h-${item.id}`,
    title: item.title,
    subtitle: item.section ?? item.description,
  }));
  data.achievements.forEach((item) =>
    texts.push({ kind: "text", key: `a-${item.id}`, title: item.title, subtitle: item.organization }),
  );

  // Interleave images with text tiles so the rows feel balanced.
  const tiles: Tile[] = [];
  const max = Math.max(images.length, texts.length);
  for (let i = 0; i < max; i += 1) {
    if (images[i]) tiles.push(images[i]!);
    if (texts[i]) tiles.push(texts[i]!);
  }
  return tiles;
}

export function MarqueeSection({ data }: { data: PortfolioData }) {
  const tiles = buildTiles(data);
  const ref = useRef<HTMLElement>(null);
  const offset = useMotionValue(0);
  const right = useTransform(offset, (value) => `translateX(${value - 200}px)`);
  const left = useTransform(offset, (value) => `translateX(${-(value - 200)}px)`);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const top = (ref.current?.getBoundingClientRect().top ?? 0) + window.scrollY;
      offset.set((window.scrollY - top + window.innerHeight) * 0.3);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [offset]);

  if (tiles.length < 2) return null;

  const half = Math.ceil(tiles.length / 2);
  const rowOne = [...tiles.slice(0, half), ...tiles.slice(0, half), ...tiles.slice(0, half)];
  const rowTwoBase = tiles.slice(half).length ? tiles.slice(half) : tiles.slice(0, half);
  const rowTwo = [...rowTwoBase, ...rowTwoBase, ...rowTwoBase];

  return (
    <section
      ref={ref}
      aria-label="Highlights"
      id="highlights"
      className="flex scroll-mt-28 flex-col gap-3 overflow-hidden pb-10 pt-24 sm:pt-32 md:pt-40"
    >
      <motion.div style={{ transform: right, willChange: "transform" }} className="flex w-max gap-3">
        {rowOne.map((tile, index) => (
          <TileView key={`${tile.key}-${index}`} tile={tile} />
        ))}
      </motion.div>
      <motion.div style={{ transform: left, willChange: "transform" }} className="flex w-max gap-3">
        {rowTwo.map((tile, index) => (
          <TileView key={`${tile.key}-${index}`} tile={tile} />
        ))}
      </motion.div>
    </section>
  );
}

function TileView({ tile }: { tile: Tile }) {
  if (tile.kind === "image") {
    return (
      <img
        src={tile.src}
        alt={tile.alt}
        loading="lazy"
        className="h-[180px] w-[280px] shrink-0 rounded-2xl object-cover sm:h-[270px] sm:w-[420px]"
      />
    );
  }
  return (
    <div className="glass flex h-[180px] w-[280px] shrink-0 flex-col justify-between rounded-2xl p-5 sm:h-[270px] sm:w-[420px] sm:p-7">
      <span className="text-[10px] uppercase tracking-[0.22em] text-primary">
        {tile.subtitle ?? "Highlight"}
      </span>
      <p className="font-kanit text-xl font-semibold leading-tight text-steel sm:text-3xl">{tile.title}</p>
    </div>
  );
}
