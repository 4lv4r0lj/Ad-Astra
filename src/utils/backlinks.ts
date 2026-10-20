import GithubSlugger from "github-slugger";
import type { CollectionEntry } from "astro:content";

export interface BacklinkSection {
    title: string;
    slug: string;
}

export interface BacklinkItem {
    id: string;
    title: string;
    pubDate: Date;
    description: string;
    sections: BacklinkSection[];
}

export function computeBacklinks(
    posts: CollectionEntry<"posts">[],
): Map<string, BacklinkItem[]> {
    const postMap = new Map<string, CollectionEntry<"posts">>();
    for (const p of posts) {
        postMap.set(p.id, p);
    }

    const targetToSources = new Map<
        string,
        Map<string, { title: string; slug: string }[]>
    >();

    for (const post of posts) {
        targetToSources.set(post.id, new Map());
    }

    for (const sourcePost of posts) {
        const body = sourcePost.body ?? "";
        const lines = body.split("\n");

        let inCodeBlock = false;
        let currentHeading: string | null = null;
        let currentSlug: string | null = null;
        const slugger = new GithubSlugger();

        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith("```") || trimmed.startsWith("~~~")) {
                inCodeBlock = !inCodeBlock;
                continue;
            }
            if (inCodeBlock) continue;

            const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
            if (headingMatch) {
                const cleanTitle = headingMatch[2]
                    .replace(/[*_`]/g, "")
                    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
                    .trim();
                currentHeading = cleanTitle;
                currentSlug = slugger.slug(cleanTitle);
                continue;
            }

            const linkRegex =
                /\[([^\]]+)\]\((?:\/Ad-Astra)?\/posts\/([a-zA-Z0-9_-]+)(?:\/)?(?:#[^)]+)?\)/g;
            let match: RegExpExecArray | null;
            while ((match = linkRegex.exec(line)) !== null) {
                const targetId = match[2];
                if (
                    targetId &&
                    targetId !== sourcePost.id &&
                    postMap.has(targetId)
                ) {
                    const sources = targetToSources.get(targetId)!;
                    if (!sources.has(sourcePost.id)) {
                        sources.set(sourcePost.id, []);
                    }
                    const sectionList = sources.get(sourcePost.id)!;
                    if (currentHeading && currentSlug) {
                        if (!sectionList.some((s) => s.slug === currentSlug)) {
                            sectionList.push({
                                title: currentHeading,
                                slug: currentSlug,
                            });
                        }
                    }
                }
            }
        }
    }

    const result = new Map<string, BacklinkItem[]>();
    for (const [targetId, sources] of targetToSources.entries()) {
        const items: BacklinkItem[] = [];
        for (const [sourceId, sections] of sources.entries()) {
            const sourcePost = postMap.get(sourceId)!;
            items.push({
                id: sourcePost.id,
                title: sourcePost.data.title,
                pubDate: sourcePost.data.pubDate,
                description: sourcePost.data.description,
                sections,
            });
        }
        items.sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());
        result.set(targetId, items);
    }

    return result;
}
