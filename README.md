# GraphCrawl

A powerful, fast web crawling API built on Cloudflare Workers that extracts metadata, markdown, and clean HTML from any URL.

## Features

- 🚀 **Lightning Fast** - Built on Cloudflare's edge network for global low latency
- 📊 **Rich Metadata** - Extract Open Graph, Twitter Cards, JSON-LD, and standard meta tags
- 📝 **Markdown Conversion** - Convert web pages to clean markdown format
- 🧹 **Clean HTML** - Get Readability-extracted, article-focused HTML content
- 🔗 **HATEOAS API** - Self-documenting REST API with hypermedia links
- ⚡ **Edge Computing** - Runs on Cloudflare Workers for instant response times

## Quick Start

### Get Metadata

```bash
curl "https://your-api.workers.dev/crawl/meta?url=https://example.com"
```

### Get Markdown

```bash
curl "https://your-api.workers.dev/crawl/markdown?url=https://example.com"
```

### Get HTML (via /crawl endpoint)

```bash
curl "https://your-api.workers.dev/crawl?url=https://example.com"
# Returns JSON with fullContent.html and readableArticle.html
```

### Get Everything

```bash
curl "https://your-api.workers.dev/crawl?url=https://example.com"
```

## API Endpoints

| Endpoint | Description | Response Format |
|----------|-------------|-----------------|
| `GET /` | API discovery with HATEOAS links | JSON |
| `GET /crawl` | Get metadata, full content, and readable article | JSON |
| `GET /crawl/meta` | Extract metadata only | JSON |
| `GET /crawl/markdown` | Get markdown content | Markdown |

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/graphcrawl.git
cd graphcrawl

# Install dependencies
bun install

# Run development server
bun run dev

# Deploy to Cloudflare Workers
bun run deploy
```

## Documentation

- [API Reference](./docs/api.md)
- [Getting Started](./docs/getting-started.md)
- [Examples](./docs/examples.md)

## License

ISC
