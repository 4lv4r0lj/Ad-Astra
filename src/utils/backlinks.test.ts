import { describe, it, expect } from "vitest";
import { computeBacklinks } from "./backlinks";
import type { CollectionEntry } from "astro:content";

function createMockPost(
    id: string,
    title: string,
    body: string,
    pubDate: Date,
): CollectionEntry<"posts"> {
    return {
        id,
        body,
        collection: "posts",
        data: {
            title,
            description: `Description of ${title}`,
            authors: ["tester"],
            tags: ["test"],
            pubDate,
        },
    } as unknown as CollectionEntry<"posts">;
}

describe("backlinks utility", () => {
    it("should compute backlinks correctly between posts", () => {
        const postA = createMockPost(
            "post-a",
            "Post A Guide",
            `
## Deep Dive Section
Check out the practical implementation in [/Ad-Astra/posts/post-b](/Ad-Astra/posts/post-b) for more details.
            `,
            new Date("2026-01-01"),
        );

        const postB = createMockPost(
            "post-b",
            "Post B Application",
            "Standalone content without links.",
            new Date("2026-01-02"),
        );

        const map = computeBacklinks([postA, postB]);

        // Post B should have a backlink coming from Post A
        const backlinksForB = map.get("post-b");
        expect(backlinksForB).toBeDefined();
        expect(backlinksForB?.length).toBe(1);
        expect(backlinksForB?.[0].id).toBe("post-a");
        expect(backlinksForB?.[0].title).toBe("Post A Guide");
        expect(backlinksForB?.[0].sections).toEqual([
            { title: "Deep Dive Section", slug: "deep-dive-section" },
        ]);

        // Post A should have no backlinks
        const backlinksForA = map.get("post-a");
        expect(backlinksForA?.length).toBe(0);
    });

    it("should ignore links inside code blocks", () => {
        const postA = createMockPost(
            "post-a",
            "Post A",
            `
## Code Example
\`\`\`bash
curl https://example.com/posts/post-b
cat [/posts/post-b](/posts/post-b)
\`\`\`
            `,
            new Date("2026-01-01"),
        );

        const postB = createMockPost(
            "post-b",
            "Post B",
            "Content",
            new Date("2026-01-02"),
        );

        const map = computeBacklinks([postA, postB]);
        expect(map.get("post-b")?.length).toBe(0);
    });

    it("should ignore self-referential links", () => {
        const postA = createMockPost(
            "post-a",
            "Post A",
            `
## Self Section
See also [/posts/post-a#self-section](/posts/post-a#self-section).
            `,
            new Date("2026-01-01"),
        );

        const map = computeBacklinks([postA]);
        expect(map.get("post-a")?.length).toBe(0);
    });
});
