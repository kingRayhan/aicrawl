# API Reference

GraphCrawl provides a RESTful API for web crawling and content extraction.

## Base URL

```
https://your-api.workers.dev
```

## Authentication

Currently, the API does not require authentication. Rate limiting may be applied in production.

## Endpoints

### Get API Information

Discover available endpoints and API information.

```http
GET /
```

**Response:**

```json
{
  "name": "GraphCrawl API",
  "version": "1.0.0",
  "description": "Web crawling API that extracts metadata, markdown, and HTML from URLs",
  "links": [
    {
      "rel": "self",
      "href": "https://your-api.workers.dev/",
      "method": "GET"
    },
    {
      "rel": "meta",
      "href": "https://your-api.workers.dev/crawl/meta",
      "method": "GET",
      "description": "Extract metadata from a URL",
      "parameters": [...]
    }
  ]
}
```

---

### Crawl URL (Complete)

Get comprehensive data including metadata, full content, and readable article.

```http
GET /crawl?url={url}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | string | Yes | The URL to crawl |

**Response:**

```json
{
  "metadata": {
    "title": "Page Title",
    "og:title": "Open Graph Title",
    "description": "Page description",
    ...
  },
  "fullContent": {
    "html": "<html>...</html>",
    "markdown": "# Markdown content..."
  },
  "readableArticle": {
    "text": "Plain text content",
    "html": "<article>...</article>",
    "markdown": "# Article markdown..."
  }
}
```

**Example:**

```bash
curl "https://your-api.workers.dev/crawl?url=https://example.com"
```

---

### Get Metadata

Extract only metadata from a URL (fastest endpoint).

```http
GET /crawl/meta?url={url}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | string | Yes | The URL to crawl |

**Response:**

```json
{
  "metadata": {
    "title": "Page Title",
    "og:title": "Open Graph Title",
    "og:description": "Description",
    "og:image": "https://example.com/image.jpg",
    "twitter:card": "summary_large_image",
    "description": "Meta description",
    "keywords": "tag1, tag2",
    "json-ld:0": { ... }
  }
}
```

**Example:**

```bash
curl "https://your-api.workers.dev/crawl/meta?url=https://example.com"
```

**Metadata Fields:**

- `title` - Page title from `<title>` tag
- `og:*` - Open Graph metadata
- `twitter:*` - Twitter Card metadata
- `description`, `keywords` - Standard meta tags
- `json-ld:*` - JSON-LD structured data

---

### Get Markdown

Convert the full page HTML to markdown format.

```http
GET /crawl/markdown?url={url}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | string | Yes | The URL to crawl |

**Response:**

- **Content-Type:** `text/markdown; charset=utf-8`
- **Body:** Markdown content

**Example:**

```bash
curl "https://your-api.workers.dev/crawl/markdown?url=https://example.com"
```

**Response Headers:**

- `Link` - HATEOAS links for API navigation

---

**Note:** To get HTML content, use the `/crawl` endpoint which returns both full HTML and readable article HTML in the response.

---

## Response Headers

All responses include HATEOAS links in the `Link` header:

```
Link: <https://your-api.workers.dev/>; rel="home", <https://your-api.workers.dev/crawl/meta>; rel="meta", ...
```

## Error Responses

### 400 Bad Request

```json
{
  "error": "url query parameter is required"
}
```

### 500 Internal Server Error

```json
{
  "error": "Failed to crawl URL",
  "message": "Detailed error message"
}
```

## Rate Limits

Rate limiting may be applied. Check response headers for rate limit information:

- `X-RateLimit-Limit` - Request limit per time window
- `X-RateLimit-Remaining` - Remaining requests
- `X-RateLimit-Reset` - Time when limit resets

## Best Practices

1. **Use appropriate endpoints** - Use `/crawl/meta` if you only need metadata (faster)
2. **Handle errors gracefully** - Always check for error responses
3. **Respect rate limits** - Implement exponential backoff if rate limited
4. **Cache responses** - Metadata and content don't change frequently
5. **Follow HATEOAS links** - Use the `Link` header for API discovery
