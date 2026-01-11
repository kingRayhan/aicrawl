# Landing Page Guidelines

This document provides guidelines for creating an effective landing page for GraphCrawl, a web crawling API service similar to Firecrawl.

## Page Structure

### 1. Hero Section

**Purpose:** Immediately communicate value proposition and primary CTA

**Elements:**
- **Headline:** Clear, benefit-focused (max 10 words)
  - ✅ "Extract Clean Content from Any Website"
  - ✅ "Web Crawling API for Developers"
  - ❌ "GraphCrawl - A Web Crawling Service"
  
- **Subheadline:** Explain what it does (1-2 sentences)
  - "Get metadata, markdown, and clean HTML from any URL. Built on Cloudflare Workers for global edge performance."

- **Primary CTA Button:** 
  - Text: "Get Started" or "Start Crawling"
  - Link: Sign up or API documentation
  - Style: Prominent, contrasting color

- **Secondary CTA:**
  - Text: "View Documentation" or "See Examples"
  - Link: `/docs`

- **Visual Element:**
  - Code snippet showing API usage
  - Terminal output example
  - Animated demo GIF/video

**Example:**

```html
<h1>Extract Clean Content from Any Website</h1>
<p>Get metadata, markdown, and readable HTML with a simple API call. 
   Built on Cloudflare Workers for instant global performance.</p>
<button>Get Started Free</button>
<button secondary>View Docs</button>
```

---

### 2. Features Section

**Purpose:** Highlight key differentiators

**Layout:** 3-column grid or feature cards

**Features to Highlight:**

1. **Lightning Fast**
   - Icon: ⚡
   - Title: "Edge Computing"
   - Description: "Runs on Cloudflare's global network for sub-100ms response times worldwide"

2. **Rich Metadata**
   - Icon: 📊
   - Title: "Complete Metadata Extraction"
   - Description: "Open Graph, Twitter Cards, JSON-LD, and all standard meta tags"

3. **Clean Content**
   - Icon: 🧹
   - Title: "Readability-Powered"
   - Description: "Get article-focused content without navigation, ads, or scripts"

4. **Multiple Formats**
   - Icon: 📝
   - Title: "Markdown & HTML"
   - Description: "Get content in markdown, HTML, or both formats"

5. **Developer Friendly**
   - Icon: 💻
   - Title: "RESTful API"
   - Description: "Simple HTTP endpoints with HATEOAS support and comprehensive docs"

6. **No Infrastructure**
   - Icon: 🚀
   - Title: "Serverless"
   - Description: "No servers to manage. Scales automatically with your traffic"

**Design Tips:**
- Use icons or illustrations
- Keep descriptions concise (1-2 sentences)
- Use consistent card styling
- Add hover effects for interactivity

---

### 3. How It Works

**Purpose:** Show the simplicity of the API

**Layout:** 3-step process or code example

**Steps:**

1. **Send Request**
   ```bash
   curl "https://api.graphcrawl.dev/crawl?url=https://example.com"
   ```

2. **Get Response**
   ```json
   {
     "metadata": { ... },
     "fullContent": { "html": "...", "markdown": "..." },
     "readableArticle": { ... }
   }
   ```

3. **Use Content**
   - Build your app
   - Generate content
   - Analyze websites

**Visual:** 
- Code blocks with syntax highlighting
- Animated flow diagram
- Before/after comparison

---

### 4. Use Cases

**Purpose:** Show real-world applications

**Layout:** Cards or tabs

**Use Cases:**

1. **Content Aggregation**
   - Build RSS readers
   - Create news aggregators
   - Content curation platforms

2. **SEO Tools**
   - Meta tag analysis
   - Content auditing
   - Competitor research

3. **Documentation Generators**
   - Convert web pages to markdown
   - Generate static site content
   - Documentation migration

4. **AI/ML Applications**
   - Training data collection
   - Content preprocessing
   - Web scraping for ML

5. **Blog Platforms**
   - Import articles
   - Content migration
   - Markdown conversion

**Design:**
- Include icons for each use case
- Add brief descriptions
- Link to example implementations

---

### 5. Code Examples

**Purpose:** Show developers how easy it is to use

**Layout:** Tabs for different languages

**Languages to Include:**
- JavaScript/TypeScript
- Python
- cURL
- Go
- Ruby

**Example:**

```javascript
// Get metadata
const response = await fetch(
  'https://api.graphcrawl.dev/crawl/meta?url=https://example.com'
);
const { metadata } = await response.json();
console.log(metadata.title);
```

**Features:**
- Copy-to-clipboard buttons
- Syntax highlighting
- Language switcher
- Live code editor (optional)

---

### 6. API Showcase

**Purpose:** Demonstrate API capabilities

**Interactive Demo:**
- Input field for URL
- "Crawl" button
- Loading state
- Results display (tabs for metadata/markdown/HTML)
- Code snippet showing the request

**Example Response Preview:**
- Collapsible JSON viewer
- Formatted markdown preview
- HTML preview

---

### 7. Pricing Section

**Purpose:** Clear pricing tiers

**Layout:** 3-column pricing cards

**Tiers:**

**Free Tier:**
- 100 requests/day
- Basic metadata
- Community support
- Perfect for testing

**Pro Tier:**
- 10,000 requests/day
- All features
- Priority support
- $29/month

**Enterprise:**
- Unlimited requests
- Custom rate limits
- Dedicated support
- Custom pricing

**Design:**
- Highlight recommended tier
- Feature comparison table
- "Most Popular" badge
- Clear CTA buttons

---

### 8. Comparison Table

**Purpose:** Show advantages over alternatives

**Compare with:**
- Manual scraping
- Other crawling services
- Self-hosted solutions

**Comparison Points:**
- Setup time
- Cost
- Performance
- Maintenance
- Features

---

### 9. Testimonials / Social Proof

**Purpose:** Build trust

**Elements:**
- User testimonials
- Company logos (if applicable)
- GitHub stars
- Usage statistics
- Case studies

**Format:**
- Quote cards
- Avatar + name + company
- Star ratings
- Specific use cases

---

### 10. FAQ Section

**Purpose:** Address common questions

**Questions to Include:**

1. **How does it work?**
   - Explain the crawling process
   - Mention Readability and metadata extraction

2. **Is it legal to crawl websites?**
   - Respect robots.txt
   - Rate limiting
   - Terms of service

3. **What's the difference between /crawl and /crawl/meta?**
   - Performance differences
   - Use case recommendations

4. **How fast is it?**
   - Typical response times
   - Edge computing benefits

5. **Can I crawl authenticated pages?**
   - Current limitations
   - Future features

6. **What about rate limits?**
   - Free tier limits
   - Pro tier limits
   - How to upgrade

---

### 11. Final CTA Section

**Purpose:** Convert visitors

**Elements:**
- Strong headline: "Ready to Start Crawling?"
- Benefits recap (3-4 bullet points)
- Primary CTA button
- Secondary link to docs
- Trust indicators (security badges, uptime stats)

---

## Design Principles

### Color Scheme
- **Primary:** Professional blue or green
- **Secondary:** Complementary accent color
- **Background:** Light gray or white
- **Text:** Dark gray/black for readability

### Typography
- **Headings:** Bold, sans-serif (Inter, Poppins, or similar)
- **Body:** Readable sans-serif
- **Code:** Monospace (Fira Code, JetBrains Mono)

### Spacing
- Generous whitespace
- Consistent padding/margins
- Clear visual hierarchy

### Responsive Design
- Mobile-first approach
- Breakpoints: 768px, 1024px, 1280px
- Touch-friendly buttons (min 44x44px)

---

## Content Guidelines

### Tone
- **Professional but approachable**
- **Developer-focused**
- **Clear and concise**
- **Benefit-oriented**

### Writing Style
- Use active voice
- Avoid jargon (or explain it)
- Focus on benefits, not features
- Include specific numbers/metrics

### CTAs
- Action-oriented verbs
- Clear value proposition
- Create urgency (optional): "Start Free Trial"

---

## Technical Requirements

### Performance
- Lighthouse score: 90+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Optimize images (WebP, lazy loading)

### SEO
- Meta tags (title, description, OG tags)
- Structured data (JSON-LD)
- Semantic HTML
- Sitemap.xml
- robots.txt

### Analytics
- Track conversions
- Monitor user behavior
- A/B test CTAs
- Heatmaps

---

## Sections Checklist

- [ ] Hero section with clear value prop
- [ ] Features grid (6 key features)
- [ ] How it works (3-step process)
- [ ] Use cases (5+ examples)
- [ ] Code examples (multiple languages)
- [ ] Interactive API demo
- [ ] Pricing tiers (3 options)
- [ ] Comparison table
- [ ] Testimonials/social proof
- [ ] FAQ section (6+ questions)
- [ ] Final CTA section
- [ ] Footer with links

---

## Example Landing Page Flow

```
┌─────────────────────────────────────┐
│         Hero Section                │
│  Headline + CTA + Demo             │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│         Features (6 cards)          │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│      How It Works (3 steps)        │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│      Use Cases (5 examples)         │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│    Code Examples (tabs)            │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│      Interactive API Demo           │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│         Pricing (3 tiers)           │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│      Comparison Table               │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│      Testimonials                   │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│            FAQ                      │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│        Final CTA                    │
└─────────────────────────────────────┘
```

---

## Key Metrics to Track

- **Conversion Rate:** Visitors → Sign ups
- **Time on Page:** Engagement indicator
- **Scroll Depth:** Content effectiveness
- **CTA Click Rate:** Button effectiveness
- **Bounce Rate:** First impression quality

---

## A/B Testing Ideas

- Headline variations
- CTA button colors/text
- Pricing presentation
- Feature order
- Social proof placement
- Demo vs. static examples

---

## Resources

- [Firecrawl Landing Page](https://firecrawl.dev) - Reference
- [Stripe's Landing Page](https://stripe.com) - Clean design
- [Vercel's Landing Page](https://vercel.com) - Developer-focused
- [Cloudflare's Landing Page](https://cloudflare.com) - Technical but clear

---

## Implementation Notes

- Use a modern framework (Next.js, Remix, or Astro)
- Implement dark mode toggle
- Add smooth scroll animations
- Include loading states
- Optimize for Core Web Vitals
- Test on multiple devices/browsers
- Ensure accessibility (WCAG 2.1 AA)
