import { defineCollection, reference } from 'astro:content';
import { file, glob, type Loader } from 'astro/loaders';
import { z } from 'astro/zod';
import { DOMAINS, LEVELS } from './lib/skill-scale';

const text = z.string().trim().min(1);
const webUrl = z.url({ protocol: /^https?$/ });
const square = z.string().regex(/^[a-h][1-8]$/);

const localized = z.strictObject({ fr: text, en: text });
const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'attendu : AAAA-MM');

const timelineEntry = z
  .strictObject({
    start: month,
    end: month.optional(),
    title: localized,
    place: text,
    detail: localized,
    tech: z.array(text).default([]),
    highlights: z.array(localized).default([]),
  })
  .refine((entry) => !entry.end || entry.end >= entry.start, {
    message: '`end` ne peut pas précéder `start`',
    path: ['end'],
  });

const pages = defineCollection({
  loader: glob({ pattern: '*/*.md', base: './src/content/pages' }),
  schema: z.strictObject({
    title: text,
    description: text,
    photoAlt: text.optional(),
    summary: text.optional(),
    updated: z.iso.date().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects/fr' }),
  schema: ({ image }) =>
    z
      .strictObject({
        title: text,
        year: z.number().int().min(2000).max(2100),
        summary: text,
        keyMove: text,
        tech: z.array(text).min(1),
        eval: z.enum(['!', '!?', '!!']),
        links: z
          .strictObject({
            code: webUrl.optional(),
            demo: webUrl.optional(),
            video: webUrl.optional(),
          })
          .default({}),
        cover: image().optional(),
        coverAlt: text.optional(),
        featured: z.boolean().default(false),
        draft: z.boolean().default(false),
        move: z
          .strictObject({
            from: square,
            to: square,
            notation: localized,
          })
          .refine((move) => move.from !== move.to, {
            message: '`move.to` doit différer de `move.from`',
          })
          .optional(),
      })
      .refine((data) => Boolean(data.cover) === Boolean(data.coverAlt), {
        message: '`cover` et `coverAlt` vont ensemble',
        path: ['coverAlt'],
      })
      .refine((data) => !data.featured || data.move, {
        message: 'un projet `featured` doit porter son `move`',
        path: ['move'],
      }),
});

const projectsEn = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects/en' }),
  schema: z.strictObject({
    title: text,
    summary: text,
    keyMove: text,
    coverAlt: text.optional(),
  }),
});

// `file()` ne fait que journaliser un fichier absent ou illisible (et garde le cache).
function strictFile(path: string): Loader {
  const loader = file(path);
  return {
    ...loader,
    load: (context) => {
      const logger = Object.create(context.logger);
      logger.error = (message: string) => {
        throw new Error(message);
      };
      return loader.load({ ...context, logger });
    },
  };
}

const experience = defineCollection({
  loader: strictFile('src/data/experience.yaml'),
  schema: timelineEntry,
});

const education = defineCollection({
  loader: strictFile('src/data/education.yaml'),
  schema: timelineEntry,
});

// Preuves (projets, étapes du parcours) : existence et brouillon vérifiés par `getSkills`.
const skills = defineCollection({
  loader: strictFile('src/data/skills.yaml'),
  schema: z
    .strictObject({
      name: z.union([text, localized]),
      domain: z.enum(DOMAINS),
      level: z.enum(LEVELS),
      projects: z.array(reference('projects')).default([]),
      background: z.array(text).default([]),
    })
    .refine((skill) => skill.projects.length + skill.background.length > 0, {
      message: 'au moins une preuve : un projet ou une étape du parcours',
      path: ['projects'],
    }),
});

const languages = defineCollection({
  loader: strictFile('src/data/languages.yaml'),
  // `file()` ne garantit pas l'ordre du fichier : le rang le fixe.
  schema: z.strictObject({
    rank: z.number().int().min(1),
    name: localized,
    level: localized,
  }),
});

export const collections = {
  pages,
  projects,
  projectsEn,
  experience,
  education,
  skills,
  languages,
};
