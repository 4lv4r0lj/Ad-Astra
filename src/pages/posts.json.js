import { getCollection } from "astro:content";

async function getPosts() {
    const posts = (await getCollection("posts")).sort(
        (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
    );
    return posts.map((post) => {
        // Strip code blocks and markdown markers for clean search matching
        const cleanContent = (post.body || "")
            .replace(/```[\s\S]*?```/g, " ")
            .replace(/[#*`_>~\[\]()!]/g, " ")
            .replace(/\s+/g, " ")
            .slice(0, 3000);

        return {
            title: post.data.title,
            slug: post.id,
            description: post.data.description,
            tags: post.data.tags,
            pubDate: post.data.pubDate,
            updatedDate: post.data.updatedDate,
            image: post.data.image,
            content: cleanContent,
        };
    });
}

export async function GET() {
    return new Response(JSON.stringify(await getPosts()), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=3600",
        },
    });
}

