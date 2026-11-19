// Sans import : `content.config.ts` lit ces listes sans charger `astro:content`.
export const DOMAINS = ['frontend', 'backend', 'data', 'tools'] as const;
export const LEVELS = ['basics', 'proficient', 'advanced', 'expert'] as const;

export type Domain = (typeof DOMAINS)[number];
export type Level = (typeof LEVELS)[number];
