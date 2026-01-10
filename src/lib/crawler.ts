import { Readability } from "@mozilla/readability";
import { parseHTML } from "linkedom";
import TurndownService from "turndown";

export function extractMetaTags(document: Document) {
  const metadata: Array<{ key: string; content: string | any }> = [];

  document.querySelectorAll("meta").forEach((tag) => {
    const key = tag.getAttribute("property") || tag.getAttribute("name");
    const content = tag.getAttribute("content");
    if (key && content) metadata.push({ key, content });
  });

  document.querySelectorAll('script[type="application/ld+json"]').forEach((script, index) => {
    try {
      metadata.push({ key: `json-ld:${index}`, content: JSON.parse(script.textContent || "{}") });
    } catch {}
  });

  return metadata;
}

function createTurndownService() {
  const service = new TurndownService({ codeBlockStyle: "fenced", emDelimiter: "*", strongDelimiter: "**" });
  
  service.addRule("removeScripts", { filter: ["script", "style", "noscript"], replacement: () => "" });
  service.addRule("fencedCodeBlock", {
    filter: (node) => node.nodeName === "PRE" && node.firstChild?.nodeName === "CODE",
    replacement: (_, node) => `\n\n\`\`\`\n${node.textContent || ""}\n\`\`\`\n\n`,
  });
  service.addRule("tables", {
    filter: ["table"],
    replacement: (_, node) => `\n\n${(node as HTMLElement).outerHTML}\n\n`,
  });
  
  return service;
}

export function htmlToMarkdown(htmlContent: string): string {
  try {
    const { document: doc } = parseHTML(`<html><body>${htmlContent}</body></html>`);
    const service = createTurndownService();
    return service.turndown(doc.body || doc.documentElement);
  } catch {
    return "";
  }
}

export async function fetchAndParse(url: string) {
  const html = await (await fetch(url)).text();
  const { document } = parseHTML(html);
  const article = new Readability(document).parse();

  if (!article) throw new Error("Failed to parse article");

  const metadata: Record<string, any> = {
    ...(article.title && { title: article.title }),
    ...(article.excerpt && { excerpt: article.excerpt }),
    ...(article.byline && { byline: article.byline }),
    ...(article.siteName && { siteName: article.siteName }),
    ...(article.publishedTime && { publishedTime: article.publishedTime }),
    ...(article.dir && { dir: article.dir }),
    ...(article.length && { length: article.length }),
  };

  extractMetaTags(document).forEach(({ key, content }) => {
    metadata[key] = content;
  });

  return { html, article, metadata };
}

export const handleError = (error: unknown) => ({
  error: "Failed to parse article",
  message: error instanceof Error ? error.message : String(error),
});
