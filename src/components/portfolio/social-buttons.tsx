import { Github, Linkedin, Globe, Mail, Instagram, Twitter, Youtube, Link2 } from "lucide-react";
import type { PortfolioData } from "@/lib/portfolio-query";
import { cn } from "@/lib/utils";

type SocialLink = PortfolioData["socialLinks"][number];

function resolve(link: SocialLink) {
  const target = `${link.url} ${link.label}`.toLowerCase();
  if (target.includes("github")) return { Icon: Github, name: "GitHub" };
  if (target.includes("linkedin")) return { Icon: Linkedin, name: "LinkedIn" };
  if (target.includes("instagram")) return { Icon: Instagram, name: "Instagram" };
  if (target.includes("twitter") || target.includes("x.com")) return { Icon: Twitter, name: "X" };
  if (target.includes("youtube")) return { Icon: Youtube, name: "YouTube" };
  if (target.startsWith("mailto") || target.includes("@")) return { Icon: Mail, name: link.label };
  if (target.includes("http")) return { Icon: Globe, name: link.label };
  return { Icon: Link2, name: link.label };
}

function href(url: string) {
  if (/^(https?:|mailto:)/i.test(url)) return url;
  if (url.includes("@")) return `mailto:${url}`;
  return `https://${url.replace(/^\/+/, "")}`;
}

const RANK: Record<string, number> = { GitHub: 0, LinkedIn: 1 };

export function SocialButtons({
  links,
  className,
  primaryOnly = false,
}: {
  links: SocialLink[];
  className?: string;
  primaryOnly?: boolean;
}) {
  const resolved = links
    .map((link) => ({ link, ...resolve(link) }))
    .sort((a, b) => (RANK[a.name] ?? 9) - (RANK[b.name] ?? 9));
  const items = primaryOnly
    ? resolved.filter((item) => item.name === "GitHub" || item.name === "LinkedIn")
    : resolved;

  if (!items.length) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-2.5", className)}>
      {items.map(({ link, Icon, name }) => (
        <a
          key={link.id}
          href={href(link.url)}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={name}
          className="group inline-flex items-center gap-2 rounded-full border border-border bg-surface-2/50 px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary hover:shadow-[0_10px_30px_-16px_var(--neon)]"
        >
          <Icon className="h-4 w-4 text-primary transition-transform duration-300 group-hover:scale-110" />
          {name}
        </a>
      ))}
    </div>
  );
}