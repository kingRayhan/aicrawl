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

  // Build metadata array with Readability fields and meta tags
  const metadata: Array<{ key: string; content: string | number | any }> = [];

  // Add Readability-extracted fields
  if (article.title) metadata.push({ key: "title", content: article.title });
  if (article.excerpt) metadata.push({ key: "excerpt", content: article.excerpt });
  if (article.byline) metadata.push({ key: "byline", content: article.byline });
  if (article.siteName) metadata.push({ key: "siteName", content: article.siteName });
  if (article.publishedTime) metadata.push({ key: "publishedTime", content: article.publishedTime });
  if (article.dir) metadata.push({ key: "dir", content: article.dir });
  if (article.length) metadata.push({ key: "length", content: article.length });

  // Add all meta tags from HTML
  metadata.push(...metaTags);

  // Convert HTML to markdown
  let markdown = "";
  try {
    // Wrap the article content in a proper HTML structure for parsing
    const wrappedHtml = `<html><body>${article.content}</body></html>`;
    const { document: articleDoc } = parseHTML(wrappedHtml);
    
    const turndownService = new TurndownService({
      codeBlockStyle: "fenced",
      emDelimiter: "*",
      strongDelimiter: "**",
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
    if (articleDoc.body) {
      markdown = turndownService.turndown(articleDoc.body);
    } else {
      // Fallback: try documentElement
      markdown = turndownService.turndown(articleDoc.documentElement);
    }
  } catch (error) {
    // If Turndown fails, log error but don't fail the request
    console.error("Markdown conversion error:", error);
    markdown = "";
  }

  return c.json({
    url,
    metadata,
    html: article.content,
    textContent: article.textContent,
    markdown,
  });
});

export default app;
