import { Hono } from "hono";
import { logger } from "hono/logger";
import { fetchAndParse, handleError, htmlToMarkdown } from "./lib/crawler";

const app = new Hono<{ Bindings: CloudflareBindings }>();
app.use(logger());

app.get("/crawl/meta", async (c) => {
  const urlParam = c.req.query("url");
  if (!urlParam)
    return c.json({ error: "url query parameter is required" }, 400);
  const url: string = urlParam;

  try {
    return c.json({ metadata: (await fetchAndParse(url)).metadata });
  } catch (error) {
    return c.json(handleError(error), 500);
  }
});

app.get("/crawl/markdown", async (c) => {
  const urlParam = c.req.query("url");
  if (!urlParam)
    return c.json({ error: "url query parameter is required" }, 400);
  const url: string = urlParam;

  try {
    const { article } = await fetchAndParse(url);
    const markdown = htmlToMarkdown(article.content || "");
    return c.text(markdown, 200, {
      "Content-Type": "text/markdown; charset=utf-8",
    });
  } catch (error) {
    return c.json(handleError(error), 500);
  }
});

app.get("/crawl/html", async (c) => {
  const urlParam = c.req.query("url");
  if (!urlParam)
    return c.json({ error: "url query parameter is required" }, 400);
  const url: string = urlParam;

  try {
    const { article } = await fetchAndParse(url);
    return c.html(article.content || "");
  } catch (error) {
    return c.json(handleError(error), 500);
  }
});

app.post("/crawl/markdown", async (c) => {
  const { url: urlParam } = await c.req.json();
  if (!urlParam) return c.json({ error: "url is required" }, 400);
  const url: string = urlParam;

  try {
    const { article } = await fetchAndParse(url);
    return c.text(htmlToMarkdown(article?.content || ""));
  } catch (error) {
    return c.json(handleError(error), 500);
  }
});

export default app;
