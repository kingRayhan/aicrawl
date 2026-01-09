import puppeteer from "@cloudflare/puppeteer";
import type { ExportedHandler } from "@cloudflare/workers-types";
import { Readability } from "@mozilla/readability";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { JSDOM } from "jsdom";
import TurndownService from "turndown";

const app = new Hono<{ Bindings: Env }>();

app.use(logger());

app.post("/crawl", async (c) => {
  const { url } = await c.req.json();

  if (!url) {
    return c.json({ error: "url is required" }, 400);
  }

  const browser = await puppeteer.launch(c.env.CF_BROWSER);
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "networkidle2" });
  const html = await page.content();

  await browser.close();

  const dom = new JSDOM(html, { url });
  const reader = new Readability(dom.window.document);
  const article = reader.parse();

  return c.json({
    title: article?.title,
    content: article?.content,
  });
});

export default app;
