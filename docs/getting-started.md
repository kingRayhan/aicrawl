# Getting Started

This guide will help you get started with GraphCrawl.

## Prerequisites

- Node.js 18+ or Bun
- Cloudflare account (for deployment)
- Wrangler CLI installed globally (optional)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/graphcrawl.git
cd graphcrawl
```

### 2. Install Dependencies

Using Bun (recommended):

```bash
bun install
```

Or using npm:

```bash
npm install
```

### 3. Configure Cloudflare

Create a `wrangler.toml` file (already included) and update it with your settings:

```toml
name = "graphcrawl"
main = "src/index.ts"
compatibility_date = "2025-12-27"
compatibility_flags = ["nodejs_compat"]

[browser]
binding = "CF_BROWSER"
```

### 4. Authenticate with Cloudflare

```bash
wrangler login
```

## Development

### Run Locally

```bash
bun run dev
```

This starts a local development server at `http://localhost:8787`

### Test the API

```bash
# Get API info
curl http://localhost:8787/

# Get metadata
curl "http://localhost:8787/crawl/meta?url=https://example.com"

# Get markdown
curl "http://localhost:8787/crawl/markdown?url=https://example.com"
```

## Deployment

### Deploy to Cloudflare Workers

```bash
bun run deploy
```

### Environment Variables

No environment variables are required for basic usage. The browser binding is configured in `wrangler.toml`.

## Usage Examples

### JavaScript/TypeScript

```typescript
// Get metadata
const response = await fetch('https://your-api.workers.dev/crawl/meta?url=https://example.com');
const data = await response.json();
console.log(data.metadata);

// Get markdown
const markdownResponse = await fetch('https://your-api.workers.dev/crawl/markdown?url=https://example.com');
const markdown = await markdownResponse.text();
console.log(markdown);
```

### Python

```python
import requests

# Get metadata
response = requests.get('https://your-api.workers.dev/crawl/meta', params={'url': 'https://example.com'})
data = response.json()
print(data['metadata'])

# Get markdown
markdown_response = requests.get('https://your-api.workers.dev/crawl/markdown', params={'url': 'https://example.com'})
print(markdown_response.text)
```

### cURL

```bash
# Get metadata
curl "https://your-api.workers.dev/crawl/meta?url=https://example.com"

# Get markdown
curl "https://your-api.workers.dev/crawl/markdown?url=https://example.com"

# Get HTML
curl "https://your-api.workers.dev/crawl/html?url=https://example.com"
```

## Project Structure

```
graphcrawl/
├── src/
│   ├── index.ts          # Main API routes
│   ├── lib/
│   │   └── crawler.ts    # Crawling utilities
│   └── api.rest          # API test requests
├── docs/                 # Documentation
├── wrangler.toml         # Cloudflare Workers config
└── package.json
```

## Next Steps

- Read the [API Reference](./api.md) for detailed endpoint documentation
- Check out [Examples](./examples.md) for more use cases
- Explore the codebase to understand the implementation
