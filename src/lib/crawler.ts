import { Readability } from "@mozilla/readability";
import { parseHTML } from "linkedom";
import TurndownService from "turndown";

/**
 * Fetch HTML from a URL
 * @param url
 * @returns
 */
export const fetchHtml = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }

  return response.text();
};

export function extractMetaTags(document: Document) {
  const metadata: Array<{ key: string; content: string | any }> = [];

  document.querySelectorAll("meta").forEach((tag) => {
    const key = tag.getAttribute("property") || tag.getAttribute("name");
    const content = tag.getAttribute("content");
    if (key && content) metadata.push({ key, content });
  });

  document
    .querySelectorAll('script[type="application/ld+json"]')
    .forEach((script, index) => {
      try {
        metadata.push({
          key: `json-ld:${index}`,
          content: JSON.parse(script.textContent || "{}"),
        });
      } catch {}
    });

  return metadata;
}

function createTurndownService() {
  const service = new TurndownService({
    codeBlockStyle: "fenced",
    emDelimiter: "*",
    strongDelimiter: "**",
  });

  service.addRule("removeScripts", {
    filter: ["script", "style", "noscript"],
    replacement: () => "",
  });
  service.addRule("fencedCodeBlock", {
    filter: (node) =>
      node.nodeName === "PRE" && node.firstChild?.nodeName === "CODE",
    replacement: (_, node) =>
      `\n\n\`\`\`\n${node.textContent || ""}\n\`\`\`\n\n`,
  });
  service.addRule("tables", {
    filter: ["table"],
    replacement: (_, node) => `\n\n${(node as HTMLElement).outerHTML}\n\n`,
  });

  return service;
}

export function htmlToMarkdown(htmlContent: string): string {
  try {
    const { document } = parseHTML(htmlContent);
    const service = createTurndownService();
    return service.turndown(document.body || document.documentElement);
  } catch {
    return "";
  }
}

export async function getMetadata(url: string): Promise<Record<string, any>> {
  const html = await fetchHtml(url);
  const { document } = parseHTML(html);

  const metadata: Record<string, any> = {};

  // Extract title from <title> tag
  const titleTag = document.querySelector("title");
  if (titleTag?.textContent) {
    metadata.title = titleTag.textContent;
  }

  // Extract all meta tags (OG, Twitter, standard meta, JSON-LD)
  extractMetaTags(document).forEach(({ key, content }) => {
    metadata[key] = content;
  });

  return metadata;
}

export async function fetchAndParse(url: string) {
  const html = await fetchHtml(url);
  const { document } = parseHTML(html);
  const article = new Readability(document).parse();

  if (!article) throw new Error("Failed to parse article");

  const metadata = await getMetadata(url);

  return { html, article, metadata };
}

export const handleError = (error: unknown) => ({
  error: "Failed to crawl URL",
  message: error instanceof Error ? error.message : String(error),
});
