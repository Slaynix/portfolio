import { useRef } from "react";
import type { PortfolioData } from "@/lib/portfolio-query";
import { ContactButton, FadeIn, Magnet, motion, useScroll, useTransform } from "@/components/portfolio/jack";
import { SocialButtons } from "@/components/portfolio/social-buttons";

function firstName(name?: string | null) {
  return (name ?? "there").trim().split(/\s+/)[0] ?? "there";
}

export function HeroSection({ data }: { data: PortfolioData }) {
  const profile = data.profile;
  const name = firstName(profile?.full_name);
  const blurb =
    profile?.title
      ? `${profile.title.toLowerCase()} driven by crafting striking and unforgettable digital experiences`
      : (profile?.tagline ?? "building futuristic digital experiences");

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const nameY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const nameScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const nameOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 90]);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative flex min-h-[calc(100svh-5rem)] flex-col scroll-mt-28 pt-4 sm:min-h-[calc(100svh-6rem)] sm:pt-6"
      style={{ overflowX: "clip" }}
    >
      <motion.div
        className="px-3 sm:px-6 md:px-10"
        style={{ y: nameY, scale: nameScale, opacity: nameOpacity }}
      >
        <h1 className="mt-6 w-full text-center sm:mt-4">
          <span className="block text-sm font-medium uppercase tracking-[0.35em] text-foreground/90 sm:text-base">
            Hi, i&apos;m
          </span>
          <span className="hero-heading block w-full whitespace-nowrap font-kanit font-black uppercase leading-[0.92] tracking-tight [font-size:min(24vw,calc(94vw/var(--name-len)*1.55))]"
            style={{ "--name-len": Math.max(name.length, 5) } as React.CSSProperties}
          >
            {name}
          </span>
        </h1>
      </motion.div>

      <div className="relative mt-auto flex items-end justify-between gap-4 px-6 pb-7 sm:pb-8 md:px-10 md:pb-10">
        <FadeIn delay={0.35} y={20} className="relative z-20 max-w-[160px] sm:max-w-[220px] md:max-w-[260px]">
          <p
            className="font-light uppercase leading-snug tracking-wide text-steel"
            style={{ fontSize: "clamp(0.75rem, 1.4vw, 1.5rem)" }}
          >
            {blurb}
          </p>
          <SocialButtons links={data.socialLinks} primaryOnly className="mt-4" />
        </FadeIn>
        <FadeIn delay={0.5} y={20} className="relative z-20">
          <ContactButton />
        </FadeIn>
      </div>

      <motion.div
        style={{ y: portraitY }}
        className="pointer-events-none absolute left-1/2 top-1/2 z-10 w-[280px] -translate-x-1/2 -translate-y-1/2 sm:bottom-0 sm:top-auto sm:w-[360px] sm:translate-y-0 md:w-[440px] lg:w-[520px]"
      >
        <FadeIn delay={0.6} y={30}>
          <Magnet padding={150} strength={3} className="pointer-events-auto">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name ?? "Portrait"}
                loading="eager"
                className="aspect-square w-full rounded-t-[2.5rem] object-cover object-top [mask-image:linear-gradient(to_bottom,black_82%,transparent)]"
              />
            ) : (
              <div className="grid aspect-square w-full place-items-center rounded-t-[2.5rem] glass text-xs text-muted-foreground">
                Add a profile image in the Portfolio Manager
              </div>
            )}
          </Magnet>
        </FadeIn>
      </motion.div>
    </section>
  );
}
