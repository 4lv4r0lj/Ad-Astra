import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import tailwindcss from "@tailwindcss/vite";
import rehypeUrls from "rehype-urls";

import expressiveCode from "astro-expressive-code";

const base = "/Ad-Astra";

// https://astro.build/config
export default defineConfig({
    site: "https://4lv4r0lj.github.io",
    base,
    markdown: {
        processor: unified({
            rehypePlugins: [
                [
                    rehypeUrls,
                    (url) => {
                        if (
                            url.href.startsWith("/") &&
                            !url.href.startsWith(base)
                        ) {
                            return `${base}${url.href}`;
                        }
                    },
                ],
            ],
        }),
    },
    vite: {
        plugins: [tailwindcss()],
    },
    integrations: [
        expressiveCode({
            themes: ["dracula-soft"],
            styleOverrides: {
                codeBackground: "transparent",
                borderColor: "white",
            },
        }),
        mdx(),
        sitemap(),
    ],
});
