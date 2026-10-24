export interface ReadingStats {
    minutes: number;
    words: number;
    text: string;
}

/**
 * Calculates reading time and word count for a given markdown/text string.
 * Uses an average reading speed of 200 words per minute.
 */
export function getReadingStats(content: string = ""): ReadingStats {
    // Strip code blocks and HTML tags to get a realistic word count of written prose
    const cleanContent = content
        .replace(/```[\s\S]*?```/g, "")
        .replace(/<[^>]*>/g, "")
        .trim();

    const words = cleanContent.split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 200));

    return {
        minutes,
        words,
        text: `${minutes} min read`,
    };
}
