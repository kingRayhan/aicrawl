import { Hono } from "hono";
import { chromium } from "playwright";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import { logger } from "hono/logger";
import TurndownService from "turndown";

const app = new Hono();

app.use(logger());

app.post("/crawl", async (c) => {
  const { url } = await c.req.json();

  if (!url) {
    return c.json({ error: "url is required" }, 400);
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "networkidle" });
  const html = await page.content();

  await browser.close();

  const dom = new JSDOM(html, { url });
  const reader = new Readability(dom.window.document);
  const article = reader.parse();

  if (!article) {
    return c.json({ error: "Failed to parse article" }, 500);
  }

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

  const markdown = turndownService.turndown(dom.window.document);

  const output = `# ${article.title || "Untitled"}

${article.byline ? `*${article.byline}*\n` : ""}${
    article.excerpt ? `> ${article.excerpt}\n` : ""
  }
---

${markdown}
`;

  return c.text(output, 200, {
    "Content-Type": "text/markdown; charset=utf-8",
  });
});

export default app;
