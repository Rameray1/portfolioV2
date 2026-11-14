import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const text = z.string().trim().min(1);
const webUrl = z.url({ protocol: /^https?$/ });
const square = z.string().regex(/^[a-h][1-8]$/);

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

export const collections = { pages, projects, projectsEn };
