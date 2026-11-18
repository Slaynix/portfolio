import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { portfolioQueryOptions } from "@/lib/portfolio-query";
import { Section } from "@/components/portfolio/shared";
import { HeroSection } from "@/components/portfolio/sections/HeroSection";
import { AboutSection } from "@/components/portfolio/sections/AboutSection";
import { MarqueeSection } from "@/components/portfolio/sections/MarqueeSection";
import { SkillsSection } from "@/components/portfolio/sections/SkillsSection";
import { ProjectsSection } from "@/components/portfolio/sections/ProjectsSection";
import { CredentialsSection } from "@/components/portfolio/sections/CredentialsSection";
import { ContactSection } from "@/components/portfolio/sections/ContactSection";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(portfolioQueryOptions),
  head: () => ({
    meta: [
      { title: "Sanskar Girase — 3D & AI Developer Portfolio" },
      {
        name: "description",
        content: "Portfolio of Sanskar Girase — Interactive AI developer, projects, skills, certificates, and achievements.",
      },
      { property: "og:title", content: "Sanskar Girase — 3D & AI Developer Portfolio" },
      {
        property: "og:description",
        content: "Portfolio of Sanskar Girase — Interactive AI developer, projects, skills, certificates, and achievements.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Sanskar Girase — 3D & AI Developer Portfolio" },
      { name: "twitter:description", content: "Portfolio of Sanskar Girase — Interactive AI developer, projects, skills, certificates, and achievements." },
      { property: "og:url", content: "https://sanskar-girase-portfolio.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://sanskar-girase-portfolio.lovable.app/" }],
  }),
  component: Home,
  errorComponent: ({ error }) => (
    <Section>
      <p role="alert" className="glass rounded-2xl p-6 text-sm">
        {error instanceof Error ? error.message : "Something went wrong."}
      </p>
    </Section>
  ),
  notFoundComponent: () => (
    <Section>
      <p className="glass rounded-2xl p-6 text-sm">Nothing published yet.</p>
    </Section>
  ),
});

function Home() {
  const { data } = useSuspenseQuery(portfolioQueryOptions);

  return (
    <>
      <HeroSection data={data} />
      <MarqueeSection data={data} />
      <AboutSection data={data} />
      <SkillsSection data={data} />
      <ProjectsSection data={data} />
      <CredentialsSection data={data} />
      <ContactSection data={data} />
    </>
  );
}
