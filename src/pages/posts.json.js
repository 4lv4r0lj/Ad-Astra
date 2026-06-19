import { getCollection } from "astro:content";

async function getPosts() {
    const posts = (await getCollection("posts")).sort(
        (a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf(),
    );
    return posts.map((post) => ({
        title: post.data.title,
        slug: post.id,
        description: post.data.description,
        tags: post.data.tags,
        pubDate: post.data.pubDate,
        updatedDate: post.data.updatedDate,
        image: post.data.image,
    }));
}

export async function GET() {
    return new Response(JSON.stringify(await getPosts()), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}
