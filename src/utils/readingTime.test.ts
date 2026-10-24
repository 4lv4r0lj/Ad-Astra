import { describe, it, expect } from "vitest";
import { getReadingStats } from "./readingTime";

describe("readingTime utility", () => {
    it("should return at least 1 min read for empty or very short content", () => {
        const statsEmpty = getReadingStats("");
        expect(statsEmpty.minutes).toBe(1);
        expect(statsEmpty.words).toBe(0);
        expect(statsEmpty.text).toBe("1 min read");

        const statsShort = getReadingStats("Hello world!");
        expect(statsShort.minutes).toBe(1);
        expect(statsShort.words).toBe(2);
        expect(statsShort.text).toBe("1 min read");
    });

    it("should calculate reading time accurately based on 200 wpm", () => {
        // 450 words should take ceil(450 / 200) = 3 minutes
        const prose = Array(450).fill("concept").join(" ");
        const stats = getReadingStats(prose);
        expect(stats.words).toBe(450);
        expect(stats.minutes).toBe(3);
        expect(stats.text).toBe("3 min read");
    });

    it("should strip code blocks and HTML tags from word count", () => {
        const content = `
            Here is some introduction text with ten words exactly in total.
            \`\`\`python
            # This is code that should not be counted as reading prose
            def calculate_heavy_stuff():
                return 42
            \`\`\`
            <div class="alert"><p>HTML tags should be stripped completely.</p></div>
        `;
        const stats = getReadingStats(content);
        // 12 words in intro + 5 words in HTML text = 17 words
        expect(stats.words).toBe(17);
        expect(stats.minutes).toBe(1);
    });
});
