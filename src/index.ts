import { Readability } from "@mozilla/readability";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { parseHTML } from "linkedom";
import {
  fetchHtml,
  getMetadata,
  handleError,
  htmlToMarkdown,
} from "./lib/crawler";

const app = new Hono();
app.use(logger());

function getBaseUrl(c: any): string {
  const url = new URL(c.req.url);
  return `${url.protocol}//${url.host}`;
}

function getLinks(c: any) {
  const basePath = getBaseUrl(c);
  return [
    { rel: "self", href: c.req.url, method: "GET" },
    { rel: "home", href: basePath, method: "GET" },
    { rel: "meta", href: `${basePath}/crawl/meta`, method: "GET" },
    { rel: "markdown", href: `${basePath}/crawl/markdown`, method: "GET" },
    { rel: "html", href: `${basePath}/crawl/html`, method: "GET" },
  ];
}

app.get("/", (c) => {
  const baseUrl = new URL(c.req.url);
  const basePath = `${baseUrl.protocol}//${baseUrl.host}`;

  return c.json({
    name: "GraphCrawl API",
    version: "1.0.0",
    description:
      "Web crawling API that extracts metadata, markdown, and HTML from URLs",
    links: [
      {
        rel: "self",
        href: c.req.url,
        method: "GET",
      },
      {
        rel: "meta",
        href: `${basePath}/crawl/meta`,
        method: "GET",
        description: "Extract metadata from a URL",
        parameters: [
          {
            name: "url",
            type: "string",
            required: true,
            description: "The URL to crawl",
            example: `${basePath}/crawl/meta?url=https://www.example.com`,
          },
        ],
      },
      {
        rel: "markdown",
        href: `${basePath}/crawl/markdown`,
        method: "GET",
        description: "Get markdown content from a URL",
        parameters: [
          {
            name: "url",
            type: "string",
            required: true,
            description: "The URL to crawl",
            example: `${basePath}/crawl/markdown?url=https://www.example.com`,
          },
        ],
      },
      {
        rel: "html",
        href: `${basePath}/crawl/html`,
        method: "GET",
        description: "Get cleaned HTML content from a URL",
        parameters: [
          {
            name: "url",
            type: "string",
            required: true,
            description: "The URL to crawl",
            example: `${basePath}/crawl/html?url=https://www.example.com`,
          },
        ],
      },
    ],
  });
});

app.get("/crawl", async (c) => {
  const urlParam = c.req.query("url");
  if (!urlParam)
    return c.json({ error: "url query parameter is required" }, 400);
  const url: string = urlParam;

  try {
    const html = await fetchHtml(url);
    const markdown = htmlToMarkdown(html || "");
    const { document } = parseHTML(html || "");
    const article = new Readability(document).parse();
    return c.json(
      {
        metadata: await getMetadata(url),
        fullContent: {
          html,
          markdown,
        },
        readableArticle: {
          text: article?.textContent,
          html: article?.content,
          markdown: htmlToMarkdown(article?.content || ""),
        },
      },
      200,
      {
        "Content-Type": "text/markdown; charset=utf-8",
        Link: getLinks(c)
          .map((link) => `<${link.href}>; rel="${link.rel}"`)
          .join(", "),
      }
    );
  } catch (error) {
    return c.json(handleError(error), 500);
  }
});

app.get("/crawl/meta", async (c) => {
  const urlParam = c.req.query("url");
  if (!urlParam)
    return c.json({ error: "url query parameter is required" }, 400);
  const url: string = urlParam;

  try {
    const metadata = await getMetadata(url);
    return c.json(
      {
        metadata,
      },
      200,
      {
        Link: getLinks(c)
          .map((link) => `<${link.href}>; rel="${link.rel}"`)
          .join(", "),
      }
    );
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
    const html = await fetchHtml(url);
    const markdown = htmlToMarkdown(html || "");

    // Return markdown with HATEOAS links in Link header
    const links = getLinks(c)
      .map((link) => `<${link.href}>; rel="${link.rel}"`)
      .join(", ");
    return c.text(markdown, 200, {
      "Content-Type": "text/markdown; charset=utf-8",
      Link: links,
    });
  } catch (error) {
    return c.json(handleError(error), 500);
  }
});

export default app;
