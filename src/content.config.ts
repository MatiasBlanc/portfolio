import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		status: z.string(),
		tags: z.array(z.string()).optional(),
		image: z.string().optional(),
		imageAlt: z.string().optional().nullable(),
	}),
});

const projects = defineCollection({
	loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		status: z.enum(['en_progreso', 'completado', 'pausado']),
		tags: z.array(z.string()),
		image: z.string(),
		imageAlt: z.string(),
		liveUrl: z.string().optional(),
		githubUrl: z.string().optional(),
	}),
});

export const collections = { blog, projects };
