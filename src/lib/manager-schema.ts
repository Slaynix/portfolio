export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "tags"
  | "file"
  | "image";

export type Field = {
  key: string;
  label: string;
  type: FieldType;
  hint?: string;
};

export type EntityConfig = {
  table: string;
  label: string;
  titleKey: string;
  subtitleKey?: string;
  fields: Field[];
  hasPublished?: boolean;
  hasSort?: boolean;
  singleton?: boolean;
};

export const ENTITIES: EntityConfig[] = [
  {
    table: "profile",
    label: "Profile",
    titleKey: "full_name",
    singleton: true,
    hasPublished: true,
    fields: [
      { key: "full_name", label: "Full name", type: "text" },
      { key: "title", label: "Professional title", type: "text" },
      { key: "tagline", label: "Tagline", type: "text" },
      { key: "intro", label: "Short intro (hero)", type: "textarea" },
      { key: "bio", label: "About me", type: "textarea" },
      { key: "location", label: "Location", type: "text" },
      { key: "email", label: "Public email", type: "text" },
      { key: "phone", label: "Public phone", type: "text", hint: "Leave empty to keep it private." },
      { key: "avatar_url", label: "Profile photo", type: "image" },
      { key: "hero_media_url", label: "Hero visual", type: "image" },
      { key: "interests", label: "Interests", type: "tags" },
      { key: "goals", label: "Goals", type: "tags" },
      { key: "level_label", label: "Level label", type: "text" },
      { key: "xp_override", label: "XP override", type: "number" },
    ],
  },
  {
    table: "education",
    label: "Education",
    titleKey: "institution",
    subtitleKey: "degree",
    hasPublished: true,
    hasSort: true,
    fields: [
      { key: "institution", label: "Institution", type: "text" },
      { key: "degree", label: "Degree", type: "text" },
      { key: "field", label: "Field of study", type: "text" },
      { key: "start_date", label: "Start", type: "text" },
      { key: "end_date", label: "End", type: "text" },
      { key: "score", label: "Score / GPA", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "achievements", label: "Highlights", type: "tags" },
      { key: "image_url", label: "Image", type: "image" },
      { key: "file_url", label: "Attachment", type: "file" },
    ],
  },
  {
    table: "certificates",
    label: "Certificates",
    titleKey: "title",
    subtitleKey: "organization",
    hasPublished: true,
    hasSort: true,
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "organization", label: "Issuing organization", type: "text" },
      { key: "issue_date", label: "Issue date", type: "text" },
      { key: "credential_id", label: "Credential ID", type: "text" },
      { key: "credential_url", label: "Credential URL", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "skills", label: "Skills", type: "tags" },
      { key: "image_url", label: "Preview image", type: "image" },
      { key: "file_url", label: "Certificate file (PDF/image)", type: "file" },
    ],
  },
  {
    table: "projects",
    label: "Projects",
    titleKey: "title",
    subtitleKey: "category",
    hasPublished: true,
    hasSort: true,
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "summary", label: "Summary", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "category", label: "Category", type: "text" },
      { key: "technologies", label: "Technologies", type: "tags" },
      { key: "status", label: "Status", type: "text" },
      { key: "featured", label: "Featured", type: "boolean" },
      { key: "thumbnail_url", label: "Thumbnail", type: "image" },
      { key: "images", label: "Gallery image URLs", type: "tags" },
      { key: "github_url", label: "GitHub URL", type: "text" },
      { key: "live_url", label: "Live URL", type: "text" },
      { key: "video_url", label: "Video", type: "file" },
      { key: "file_url", label: "Case study file", type: "file" },
    ],
  },
  {
    table: "achievements",
    label: "Achievements",
    titleKey: "title",
    subtitleKey: "organization",
    hasPublished: true,
    hasSort: true,
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "organization", label: "Organization", type: "text" },
      { key: "achieved_on", label: "Date", type: "text" },
      { key: "category", label: "Category", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "image_url", label: "Image", type: "image" },
      { key: "file_url", label: "Attachment", type: "file" },
      { key: "external_url", label: "External link", type: "text" },
    ],
  },
  {
    table: "skills",
    label: "Skills",
    titleKey: "name",
    subtitleKey: "category",
    hasPublished: true,
    hasSort: true,
    fields: [
      { key: "name", label: "Skill", type: "text" },
      { key: "category", label: "Category", type: "text" },
      { key: "level", label: "Level (0-100)", type: "number" },
      { key: "icon", label: "Icon (emoji or name)", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "related_projects", label: "Related projects", type: "tags" },
    ],
  },
  {
    table: "documents",
    label: "Resume & Documents",
    titleKey: "title",
    subtitleKey: "kind",
    hasPublished: true,
    hasSort: true,
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "kind", label: "Kind", type: "text", hint: "resume, cover-letter, transcript…" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "file_url", label: "File", type: "file" },
      { key: "is_primary", label: "Primary resume", type: "boolean" },
    ],
  },
  {
    table: "highlights",
    label: "Highlights",
    titleKey: "title",
    subtitleKey: "section",
    hasPublished: true,
    hasSort: true,
    fields: [
      {
        key: "section",
        label: "Section",
        type: "text",
        hint: "highlight, focus or learning",
      },
      { key: "title", label: "Title", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "icon", label: "Icon", type: "text", hint: "Lucide name (Rocket, Brain…) or emoji" },
    ],
  },
  {
    table: "social_links",
    label: "Social Links",
    titleKey: "label",
    subtitleKey: "url",
    hasPublished: true,
    hasSort: true,
    fields: [
      { key: "label", label: "Label", type: "text" },
      { key: "url", label: "URL", type: "text" },
      { key: "icon", label: "Icon", type: "text" },
    ],
  },
  {
    table: "site_settings",
    label: "Settings",
    titleKey: "site_title",
    singleton: true,
    fields: [
      { key: "site_title", label: "Site title", type: "text" },
      { key: "site_description", label: "Site description", type: "textarea" },
      { key: "accent", label: "Accent", type: "text" },
      { key: "enable_3d", label: "Enable 3D background", type: "boolean" },
      { key: "enable_particles", label: "Enable particles", type: "boolean" },
      { key: "show_contact_form", label: "Show contact form", type: "boolean" },
    ],
  },
];

export const ENTITY_TABLES = ENTITIES.map((e) => e.table);
