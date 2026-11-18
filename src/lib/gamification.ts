import type { PortfolioData } from "./portfolio-query";

export type Stats = {
  xp: number;
  level: number;
  levelLabel: string;
  progress: number;
  nextLevelXp: number;
  certificates: number;
  projects: number;
  achievements: number;
  skills: number;
  hackathons: number;
  education: number;
  avgSkill: number;
};

const LEVEL_TITLES = [
  "Initiate",
  "Explorer",
  "Builder",
  "Engineer",
  "Architect",
  "Innovator",
  "Luminary",
];

export function computeStats(data: PortfolioData): Stats {
  const certificates = data.certificates.length;
  const projects = data.projects.length;
  const achievements = data.achievements.length;
  const skills = data.skills.length;
  const education = data.education.length;
  const hackathons = data.achievements.filter((a) =>
    `${a.category ?? ""} ${a.title ?? ""}`.toLowerCase().includes("hack"),
  ).length;

  const xp =
    (data.profile?.xp_override ?? 0) ||
    certificates * 120 + projects * 200 + achievements * 150 + skills * 40 + education * 100;

  const level = Math.max(1, Math.floor(xp / 750) + 1);
  const currentFloor = (level - 1) * 750;
  const nextLevelXp = level * 750;
  const progress = xp === 0 ? 0 : Math.min(100, ((xp - currentFloor) / 750) * 100);
  const avgSkill = skills
    ? Math.round(data.skills.reduce((sum, s) => sum + (s.level ?? 0), 0) / skills)
    : 0;

  return {
    xp,
    level,
    levelLabel:
      data.profile?.level_label ?? LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)]!,
    progress,
    nextLevelXp,
    certificates,
    projects,
    achievements,
    skills,
    hackathons,
    education,
    avgSkill,
  };
}

