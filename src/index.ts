// import puppeteer from "@cloudflare/puppeteer";
import { Readability } from "@mozilla/readability";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { parseHTML } from "linkedom";
import TurndownService from "turndown";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.use(logger());

function extractMetaTags(document: Document) {
  const metadata: Array<{ key: string; content: string | any }> = [];

  // Get all meta tags
  const metaTags = document.querySelectorAll("meta");

  metaTags.forEach((tag) => {
    const property = tag.getAttribute("property");
    const name = tag.getAttribute("name");
    const content = tag.getAttribute("content");

    if (!content) return;

    // Use property if available, otherwise use name
    const key = property || name;
    if (key) {
      metadata.push({ key, content });
    }
  });

  // Extract JSON-LD structured data
  const jsonLdScripts = document.querySelectorAll(
    'script[type="application/ld+json"]'
  );
  jsonLdScripts.forEach((script, index) => {
    try {
      const data = JSON.parse(script.textContent || "{}");
      metadata.push({
        key: `json-ld:${index}`,
        content: data,
      });
    } catch (e) {
      // Ignore invalid JSON
    }
  });

  return metadata;
}

app.post("/crawl", async (c) => {
  const { url } = await c.req.json();

  if (!url) {
    return c.json({ error: "url is required" }, 400);
  }

  const http = await fetch(url);
  const html = await http.text();

  // Parse HTML string into a DOM document using linkedom (works in CF Workers)
  const { document } = parseHTML(html);
  const reader = new Readability(document);
  const article = reader.parse();

  if (!article) {
    return c.json({ error: "Failed to parse article" }, 500);
  }

  // Extract meta tags (OG, Twitter, standard meta)
  const metaTags = extractMetaTags(document);

  // Build metadata object (key-value pairs) with Readability fields and meta tags
  const metadata: Record<string, string | number | any> = {};

  // Add Readability-extracted fields
  if (article.title) metadata.title = article.title;
  if (article.excerpt) metadata.excerpt = article.excerpt;
  if (article.byline) metadata.byline = article.byline;
  if (article.siteName) metadata.siteName = article.siteName;
  if (article.publishedTime) metadata.publishedTime = article.publishedTime;
  if (article.dir) metadata.dir = article.dir;
  if (article.length) metadata.length = article.length;

  // Add all meta tags from HTML
  metaTags.forEach((item) => {
    metadata[item.key] = item.content;
  });

  // Helper function to convert HTML to markdown
  function htmlToMarkdown(htmlContent: string): string {
    try {
      const wrappedHtml = `<html><body>${htmlContent}</body></html>`;
      const { document: doc } = parseHTML(wrappedHtml);

      const turndownService = new TurndownService({
        codeBlockStyle: "fenced",
        emDelimiter: "*",
        strongDelimiter: "**",
      });

      // Remove script tags and other noise
      turndownService.addRule("removeScripts", {
        filter: ["script", "style", "noscript"],
        replacement: () => "",
      });

      // Preserve fenced code blocks
      turndownService.addRule("fencedCodeBlock", {
        filter(node) {
          return (
            node.nodeName === "PRE" &&
            node.firstChild &&
            node.firstChild.nodeName === "CODE"
          );
        },
        replacement(content, node) {
          const code = node.textContent || "";
          return `\n\n\`\`\`\n${code}\n\`\`\`\n\n`;
        },
      });

      // Preserve tables as HTML
      turndownService.addRule("tables", {
        filter: ["table"],
        replacement(content, node) {
          return `\n\n${(node as HTMLElement).outerHTML}\n\n`;
        },
      });

      // Convert the body content to markdown
      if (doc.body) {
        return turndownService.turndown(doc.body);
      } else {
        // Fallback: try documentElement
        return turndownService.turndown(doc.documentElement);
      }
    } catch (error) {
      console.error("Markdown conversion error:", error);
      return "";
    }
  }

  // Convert Readability-extracted content to markdown (clean content, no scripts/nav)
  const markdown = htmlToMarkdown(article.content);

  // Return in Firecrawl format
  return c.json({
    markdown,
    metadata,
  });
});

export default app;
