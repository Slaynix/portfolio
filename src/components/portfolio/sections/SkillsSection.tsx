import type { PortfolioData } from "@/lib/portfolio-query";
import { FadeIn, Parallax } from "@/components/portfolio/jack";

export function SkillsSection({ data }: { data: PortfolioData }) {
  const items = data.skills;

  return (
    <section
      id="skills"
      className="relative z-[5] scroll-mt-28 rounded-t-[40px] bg-paper px-5 py-20 text-background sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32"
    >
      <Parallax speed={0.18}>
        <FadeIn as="h2" y={40} className="mb-16 text-center font-kanit font-black uppercase leading-none tracking-tight text-background sm:mb-20 md:mb-28" style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}>
          Skills
        </FadeIn>
      </Parallax>

      {!items.length ? (
        <p className="text-center text-sm opacity-60">Add skills from the Portfolio Manager.</p>
      ) : (
        <ul className="mx-auto max-w-5xl">
          {items.map((skill, index) => (
            <FadeIn
              as="li"
              key={skill.id}
              delay={index * 0.1}
              className="flex items-start gap-6 border-b border-background/15 py-8 first:border-t sm:gap-10 sm:py-10 md:gap-14 md:py-12"
            >
              <span
                className="w-[1.4em] shrink-0 font-kanit font-black leading-none"
                style={{ fontSize: "clamp(3rem, 10vw, 140px)" }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex min-w-0 flex-col gap-2 pt-2 sm:pt-4">
                <h3 className="font-kanit font-medium uppercase tracking-tight text-background" style={{ fontSize: "clamp(1rem, 2.2vw, 2.1rem)" }}>
                  {skill.icon ? <span className="mr-2">{skill.icon}</span> : null}
                  {skill.name}
                </h3>
                {skill.category ? (
                  <span className="text-[11px] font-medium uppercase tracking-[0.2em] opacity-50">
                    {skill.category}
                  </span>
                ) : null}
                {skill.description ? (
                  <p
                    className="max-w-2xl font-light leading-relaxed opacity-60"
                    style={{ fontSize: "clamp(0.85rem, 1.6vw, 1.25rem)" }}
                  >
                    {skill.description}
                  </p>
                ) : null}
                {typeof skill.level === "number" ? (
                  <span className="mt-2 block h-1 w-full max-w-sm overflow-hidden rounded-full bg-background/10">
                    <span
                      className="block h-full rounded-full bg-background"
                      style={{ width: `${Math.min(100, Math.max(8, skill.level))}%` }}
                    />
                  </span>
                ) : null}
              </div>
            </FadeIn>
          ))}
        </ul>
      )}
    </section>
  );
}
