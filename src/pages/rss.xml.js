import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE_TITLE, SITE_DESCRIPTION } from "../consts";

export async function GET(context) {
    const posts = (await getCollection("posts")).sort(
        (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
    );
    const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");

    return rss({
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        site: new URL(import.meta.env.BASE_URL, context.site),
        items: posts.map((post) => ({
            title: post.data.title,
            description: post.data.description,
            pubDate: post.data.pubDate,
            link: `${baseUrl}/posts/${post.id}/`,
        })),
    });
}


