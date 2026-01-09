// import puppeteer from "@cloudflare/puppeteer";
import { Readability } from "@mozilla/readability";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { parseHTML } from "linkedom";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.use(logger());

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

  return c.json({
    url,
    title: article.title,
    content: article.content,
    textContent: article.textContent,
    excerpt: article.excerpt,
    byline: article.byline,
    length: article.length,
  });
});

export default app;
