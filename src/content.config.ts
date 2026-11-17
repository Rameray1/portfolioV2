import { defineCollection } from 'astro:content';
import { file, glob, type Loader } from 'astro/loaders';
import { z } from 'astro/zod';

const text = z.string().trim().min(1);
const webUrl = z.url({ protocol: /^https?$/ });
const square = z.string().regex(/^[a-h][1-8]$/);

const localized = z.strictObject({ fr: text, en: text });
const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'attendu : AAAA-MM');

// Même forme pour les expériences et les formations : le CV les relit telles quelles.
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
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    photoAlt: z.string().min(1),
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
            notation: z.strictObject({ fr: text, en: text }),
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

// `file()` ne fait que journaliser un fichier absent ou illisible, et garde les
// entrées du cache : ici, toute erreur du chargeur arrête le build.
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

export const collections = {
  pages,
  projects,
  projectsEn,
  experience,
  education,
};
