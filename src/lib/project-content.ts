import defaultContent from "@/data/project-status.json";

export type ProjectContent = typeof defaultContent;
export type ProjectBlock = ProjectContent["blocks"][number];
export type ContactPerson = ProjectContent["contacts"][number];

export const projectDefaults: ProjectContent = defaultContent;

export const PROJECT_DATA_COLLECTION = "projectData";
export const CONTENT_DOCUMENT = "website";

/** Firestore'daki kısmi dokümanı JSON varsayılanlarının üzerine bindirir. */
export function mergeProjectContent(stored?: Partial<ProjectContent> | null): ProjectContent {
  if (!stored) return projectDefaults;

  return {
    ...projectDefaults,
    ...stored,
    general: { ...projectDefaults.general, ...stored.general },
    hero: { ...projectDefaults.hero, ...stored.hero },
    location: {
      ...projectDefaults.location,
      ...stored.location,
      metrics: projectDefaults.location.metrics,
    },
    contacts: stored.contacts?.length ? stored.contacts : projectDefaults.contacts,
    blocks: stored.blocks?.length ? stored.blocks : projectDefaults.blocks,
  };
}
