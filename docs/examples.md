# Examples

Practical examples for using GraphCrawl API.

## Basic Usage

### Extract Metadata

```javascript
const url = 'https://example.com';
const response = await fetch(`https://your-api.workers.dev/crawl/meta?url=${encodeURIComponent(url)}`);
const { metadata } = await response.json();

console.log('Title:', metadata.title);
console.log('Description:', metadata.description);
console.log('OG Image:', metadata['og:image']);
```

### Get Markdown Content

```javascript
const url = 'https://example.com';
const response = await fetch(`https://your-api.workers.dev/crawl/markdown?url=${encodeURIComponent(url)}`);
const markdown = await response.text();

// Save to file or process further
console.log(markdown);
```

### Get Clean HTML

```javascript
const url = 'https://example.com';
const response = await fetch(`https://your-api.workers.dev/crawl/html?url=${encodeURIComponent(url)}`);
const html = await response.text();

// Use the cleaned HTML
document.getElementById('content').innerHTML = html;
```

## Advanced Usage

### Get Complete Data

```javascript
const url = 'https://example.com';
const response = await fetch(`https://your-api.workers.dev/crawl?url=${encodeURIComponent(url)}`);
const data = await response.json();

// Access all data
console.log('Metadata:', data.metadata);
console.log('Full HTML:', data.fullContent.html);
console.log('Full Markdown:', data.fullContent.markdown);
console.log('Readable Article HTML:', data.readableArticle.html);
console.log('Readable Article Markdown:', data.readableArticle.markdown);
```

### Follow HATEOAS Links

```javascript
// Start at root
const rootResponse = await fetch('https://your-api.workers.dev/');
const root = await rootResponse.json();

// Find the meta endpoint
const metaLink = root.links.find(link => link.rel === 'meta');
const metaUrl = `${metaLink.href}?url=${encodeURIComponent('https://example.com')}`;

// Use the discovered endpoint
const metaResponse = await fetch(metaUrl);
const meta = await metaResponse.json();
```

### Error Handling

```javascript
async function crawlUrl(url) {
  try {
    const response = await fetch(`https://your-api.workers.dev/crawl/meta?url=${encodeURIComponent(url)}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }
    
    const data = await response.json();
    return data.metadata;
  } catch (error) {
    console.error('Crawl failed:', error.message);
    return null;
  }
}
```

## Use Cases

### Content Aggregation

```javascript
const urls = [
  'https://example.com/article1',
  'https://example.com/article2',
  'https://example.com/article3'
];

const articles = await Promise.all(
  urls.map(async (url) => {
    const response = await fetch(`https://your-api.workers.dev/crawl?url=${encodeURIComponent(url)}`);
    const data = await response.json();
    return {
      url,
      title: data.metadata.title,
      markdown: data.readableArticle.markdown,
      published: data.metadata['article:published_time']
    };
  })
);
```

### SEO Analysis

```javascript
async function analyzeSEO(url) {
  const response = await fetch(`https://your-api.workers.dev/crawl/meta?url=${encodeURIComponent(url)}`);
  const { metadata } = await response.json();
  
  return {
    hasTitle: !!metadata.title,
    hasDescription: !!metadata.description,
    hasOGTags: !!metadata['og:title'],
    hasTwitterCards: !!metadata['twitter:card'],
    hasJSONLD: Object.keys(metadata).some(key => key.startsWith('json-ld:')),
    image: metadata['og:image'] || metadata['twitter:image']
  };
}
```

### Markdown Blog Generator

```javascript
async function generateBlogPost(url) {
  const response = await fetch(`https://your-api.workers.dev/crawl?url=${encodeURIComponent(url)}`);
  const data = await response.json();
  
  const frontmatter = `---
title: "${data.metadata.title}"
description: "${data.metadata.description}"
image: "${data.metadata['og:image']}"
published: "${data.metadata['article:published_time']}"
---

`;
  
  return frontmatter + data.readableArticle.markdown;
}
```

### RSS Feed Generator

```javascript
async function generateRSSFeed(urls) {
  const items = await Promise.all(
    urls.map(async (url) => {
      const response = await fetch(`https://your-api.workers.dev/crawl?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      
      return {
        title: data.metadata.title,
        link: url,
        description: data.metadata.description,
        content: data.readableArticle.html,
        pubDate: data.metadata['article:published_time']
      };
    })
  );
  
  // Generate RSS XML from items
  return generateRSS(items);
}
```

## Integration Examples

### Next.js API Route

```typescript
// app/api/crawl/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  
  if (!url) {
    return NextResponse.json({ error: 'url is required' }, { status: 400 });
  }
  
  const response = await fetch(`https://your-api.workers.dev/crawl?url=${encodeURIComponent(url)}`);
  const data = await response.json();
  
  return NextResponse.json(data);
}
```

### Express.js Middleware

```javascript
app.get('/proxy/crawl', async (req, res) => {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: 'url is required' });
  }
  
  try {
    const response = await fetch(`https://your-api.workers.dev/crawl?url=${encodeURIComponent(url)}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### React Hook

```typescript
import { useState, useEffect } from 'react';

function useCrawl(url: string) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!url) return;
    
    setLoading(true);
    fetch(`https://your-api.workers.dev/crawl?url=${encodeURIComponent(url)}`)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);
  
  return { data, loading, error };
}
```

## Rate Limiting

```javascript
class RateLimitedCrawler {
  constructor(apiUrl, maxRequests = 10, windowMs = 60000) {
    this.apiUrl = apiUrl;
    this.requests = [];
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }
  
  async crawl(url) {
    // Clean old requests
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    
    // Check rate limit
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      const waitTime = this.windowMs - (now - oldestRequest);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    // Make request
    this.requests.push(now);
    const response = await fetch(`${this.apiUrl}/crawl?url=${encodeURIComponent(url)}`);
    return response.json();
  }
}
```
