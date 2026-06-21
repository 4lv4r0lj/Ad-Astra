import { defineCollection, type CollectionEntry } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const posts = defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
    // Type-check frontmatter using a schema
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            description: z.string(),
            authors: z.array(z.string()),
            tags: z.array(z.string()),
            pubDate: z.coerce.date(), // Transform string to Date object
            updatedDate: z.coerce.date().optional(),
            image: image().optional(),
        }),
});

const contributors = defineCollection({
    loader: glob({ pattern: "**/*.json", base: "./src/content/contributors" }),
    schema: z
        .object({
            name: z.string().optional(),
            nick: z.string().optional(),
            picture: z.string().optional(),
            socials: z
                .object({
                    github: z.string().optional(),
                    linkedin: z.string().optional(),
                    twitter: z.string().optional(),
                    instagram: z.string().optional(),
                    youtube: z.string().optional(),
                })
                .optional(),
        })
        .refine((data) => data.name || data.nick, {
            message: "Must have at least a name or a nickname (name or nick)",
            path: ["name"],
        }),
});

export const collections = { posts, contributors };
export type Post = CollectionEntry<"posts">;
