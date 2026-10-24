import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import tailwindcss from "@tailwindcss/vite";
import rehypeUrls from "rehype-urls";

import expressiveCode from "astro-expressive-code";

const base = "/Ad-Astra";

function getNodeText(node) {
    if (!node) return "";
    if (node.type === "text") return node.value;
    if (node.children) return node.children.map(getNodeText).join("");
    return "";
}

function rehypeStripSignoff() {
    return (tree) => {
        if (!tree || !Array.isArray(tree.children)) return;
        for (let i = tree.children.length - 1; i >= 0; i--) {
            const child = tree.children[i];
            if (child && child.type === "element" && child.tagName === "p") {
                const text = getNodeText(child).trim();
                if (/Ad astra per aspera\.?\s*$/i.test(text)) {
                    tree.children.splice(i, 1);
                    break;
                }
            }
        }
    };
}

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
                rehypeStripSignoff,
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


