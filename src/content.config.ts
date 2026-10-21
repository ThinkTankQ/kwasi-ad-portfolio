import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    discipline: z.string(),
    client: z.string(),
    year: z.string(),
    role: z.string(),
    summary: z.string(),
    cover: z.string(),
    gallery: z.array(z.string()),
    videoUrl: z.string().optional(),
    credits: z.array(z.string()),
    externalUrl: z.string().url().optional(),
    accent: z.string(),
    featuredOrder: z.number()
  })
});

export const collections = { projects };
