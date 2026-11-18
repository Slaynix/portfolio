import { GraduationCap } from "lucide-react";
import type { PortfolioData } from "@/lib/portfolio-query";
import { AnimatedText, ContactButton, FadeIn, Parallax } from "@/components/portfolio/jack";
import { Chip } from "@/components/portfolio/shared";

const DECOR = {
  moon: "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png",
  object:
    "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png",
  lego: "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png",
  group:
    "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png",
};

function plain(text: string) {
  return text
    .replace(/^#{1,6}\s.*$/gm, "")
    .replace(/[*_`>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function AboutSection({ data }: { data: PortfolioData }) {
  const profile = data.profile;
  const source = profile?.intro?.trim() || (profile?.bio ? plain(profile.bio) : "");
  const text = source || "Add an intro in the Portfolio Manager and it will appear here.";

  return (
    <section
      id="about"
      className="relative flex min-h-screen scroll-mt-28 flex-col items-center justify-center overflow-hidden px-5 py-20 sm:px-8 md:px-10"
    >
      <Parallax speed={0.35} className="pointer-events-none absolute left-[1%] top-[4%] w-[120px] sm:left-[2%] sm:w-[160px] md:left-[4%] md:w-[210px]">
        <FadeIn delay={0.1} x={-80} y={0} duration={0.9}>
          <img src={DECOR.moon} alt="" aria-hidden loading="lazy" className="w-full" />
        </FadeIn>
      </Parallax>
      <Parallax speed={-0.22} className="pointer-events-none absolute bottom-[8%] left-[3%] w-[100px] sm:left-[6%] sm:w-[140px] md:left-[10%] md:w-[180px]">
        <FadeIn delay={0.25} x={-80} y={0} duration={0.9}>
          <img src={DECOR.object} alt="" aria-hidden loading="lazy" className="w-full" />
        </FadeIn>
      </Parallax>
      <Parallax speed={0.28} className="pointer-events-none absolute right-[1%] top-[4%] w-[120px] sm:right-[2%] sm:w-[160px] md:right-[4%] md:w-[210px]">
        <FadeIn delay={0.15} x={80} y={0} duration={0.9}>
          <img src={DECOR.lego} alt="" aria-hidden loading="lazy" className="w-full" />
        </FadeIn>
      </Parallax>
      <Parallax speed={-0.3} className="pointer-events-none absolute bottom-[8%] right-[3%] w-[130px] sm:right-[6%] sm:w-[170px] md:right-[10%] md:w-[220px]">
        <FadeIn delay={0.3} x={80} y={0} duration={0.9}>
          <img src={DECOR.group} alt="" aria-hidden loading="lazy" className="w-full" />
        </FadeIn>
      </Parallax>

      <div className="relative z-10 flex w-full flex-col items-center gap-16 sm:gap-20 md:gap-24">
        <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
          <Parallax speed={0.18}>
            <FadeIn as="h2" y={40} className="hero-heading text-center font-kanit font-black uppercase leading-none tracking-tight" style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}>
              About me
            </FadeIn>
          </Parallax>
          <AnimatedText
            text={text}
            className="max-w-[560px] text-center font-kanit font-medium leading-relaxed text-steel"
          />
          {data.education.length ? (
            <div className="flex w-full max-w-[720px] flex-col gap-3">
              {data.education.map((entry, index) => (
                <FadeIn key={entry.id} delay={index * 0.1} y={20} className="glass flex items-start gap-3 rounded-3xl p-5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary">
                    <GraduationCap className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-kanit text-sm font-semibold leading-snug text-steel">
                      {entry.degree ? `${entry.degree} — ` : ""}
                      {entry.field ?? ""}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{entry.institution}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {entry.start_date || entry.end_date ? (
                        <Chip>
                          {entry.start_date ?? ""}
                          {entry.end_date ? ` – ${entry.end_date}` : ""}
                        </Chip>
                      ) : null}
                      {entry.score ? <Chip>CGPA {entry.score}</Chip> : null}
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          ) : null}
        </div>
        <FadeIn y={20}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
}
