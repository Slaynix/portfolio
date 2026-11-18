import { useRef } from "react";
import { ExternalLink, Github } from "lucide-react";
import type { PortfolioData } from "@/lib/portfolio-query";
import { FadeIn, LiveProjectButton, Parallax, motion, useScroll, useTransform } from "@/components/portfolio/jack";
import { useReducedMotion } from "motion/react";

type Project = PortfolioData["projects"][number];

export function ProjectsSection({ data }: { data: PortfolioData }) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: container, offset: ["start start", "end end"] });
  const projects = data.projects;

  return (
    <section
      id="projects"
      className="relative z-10 -mt-10 scroll-mt-28 rounded-t-[40px] bg-background px-5 pb-20 pt-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:pt-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pt-32"
    >
      <Parallax speed={0.18}>
        <FadeIn as="h2" y={40} className="hero-heading mb-10 text-center font-kanit font-black uppercase leading-none tracking-tight sm:mb-14" style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}>
          Projects
        </FadeIn>
      </Parallax>

      {!projects.length ? (
        <p className="text-center text-sm text-muted-foreground">Add projects from the Portfolio Manager.</p>
      ) : (
        <div ref={container} className="mx-auto max-w-6xl">
          {projects.map((project, index) => (
            <Card
              key={project.id}
              project={project}
              index={index}
              total={projects.length}
              progress={scrollYProgress}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function Card({
  project,
  index,
  total,
  progress,
}: {
  project: Project;
  index: number;
  total: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const reduce = useReducedMotion();
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);
  const images = [project.thumbnail_url, ...(project.images ?? [])].filter(
    (src): src is string => Boolean(src),
  );

  return (
    <div className="sticky top-24 flex h-[85vh] items-start justify-center md:top-32">
      <motion.article
        style={{ scale: reduce ? 1 : scale, top: `${index * 28}px` }}
        className="relative flex w-full origin-top flex-col gap-6 rounded-[40px] border-2 border-steel bg-background p-4 sm:rounded-[50px] sm:p-6 md:rounded-[60px] md:p-8"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4 sm:gap-6">
            <span
              className="font-kanit font-black leading-none text-steel"
              style={{ fontSize: "clamp(3rem, 10vw, 140px)" }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="pt-1 sm:pt-3">
              {project.category ? (
                <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-steel/60 sm:text-xs">
                  {project.category}
                </p>
              ) : null}
              <h3 className="font-kanit font-medium uppercase leading-tight text-steel" style={{ fontSize: "clamp(1.1rem, 2.6vw, 2.4rem)" }}>
                {project.title}
              </h3>
              {project.summary ? (
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-steel/70">{project.summary}</p>
              ) : null}
              {project.technologies.length ? (
                <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-steel/50">
                  {project.technologies.join(" · ")}
                </p>
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.live_url ? (
              <LiveProjectButton href={project.live_url} icon={<ExternalLink className="h-4 w-4" />} />
            ) : null}
            {project.github_url ? (
              <LiveProjectButton
                href={project.github_url}
                label="Code"
                icon={<Github className="h-4 w-4" />}
              />
            ) : null}
          </div>
        </div>

        {images.length >= 3 ? (
          <div className="grid grid-cols-[40%_1fr] gap-3 sm:gap-4">
            <div className="flex flex-col gap-3 sm:gap-4">
              <img
                src={images[0]}
                alt={`${project.title} preview 1`}
                loading="lazy"
                className="w-full rounded-[40px] object-cover sm:rounded-[50px] md:rounded-[60px]"
                style={{ height: "clamp(130px, 16vw, 230px)" }}
              />
              <img
                src={images[1]}
                alt={`${project.title} preview 2`}
                loading="lazy"
                className="w-full rounded-[40px] object-cover sm:rounded-[50px] md:rounded-[60px]"
                style={{ height: "clamp(160px, 22vw, 340px)" }}
              />
            </div>
            <img
              src={images[2]}
              alt={`${project.title} preview 3`}
              loading="lazy"
              className="h-full w-full rounded-[40px] object-cover sm:rounded-[50px] md:rounded-[60px]"
            />
          </div>
        ) : images.length === 2 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {images.map((src, i) => (
              <img
                key={src}
                src={src}
                alt={`${project.title} preview ${i + 1}`}
                loading="lazy"
                className="w-full rounded-[40px] object-cover sm:rounded-[50px] md:rounded-[60px]"
                style={{ height: "clamp(180px, 28vw, 420px)" }}
              />
            ))}
          </div>
        ) : images[0] ? (
          <img
            src={images[0]}
            alt={`${project.title} preview`}
            loading="lazy"
            className="w-full rounded-[40px] object-cover object-top sm:rounded-[50px] md:rounded-[60px]"
            style={{ height: "clamp(200px, 34vw, 480px)" }}
          />
        ) : null}
      </motion.article>
    </div>
  );
}
