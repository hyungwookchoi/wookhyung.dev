# wookhyung.dev

https://wookhyung.dev

Personal blog and portfolio site featuring tech articles and personal notes written in MDX.

## Features

- **MDX-based Content**: Type-safe content management with Contentlayer2
- **Dual Content Types**: Tech blog (`/tech`) and personal notes (`/notes`)
- **Syntax Highlighting**: Code highlighting with Prism
- **Dark Mode**: Theme switching with next-themes
- **RSS Feed**: Subscribe to blog posts
- **Analytics**: Integrated with Vercel Analytics and Google Analytics

## Tech Stack

- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4, Motion (Framer Motion)
- **Content**: Contentlayer2, MDX, remark-gfm
- **Code Quality**: ESLint, Prettier, Husky, lint-staged

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (home)/            # Home page
│   ├── tech/              # Tech blog posts
│   ├── notes/             # Personal notes
│   ├── about/             # About page
│   └── feed/              # RSS feed
└── shared/                # Shared utilities and components
    ├── config/            # Site configuration
    ├── ui/                # Reusable UI components
    ├── lib/               # Utility libraries
    └── fonts/             # Font definitions

posts/
├── tech/                  # Tech blog posts (MDX)
└── notes/                 # Personal notes (MDX)
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+

### Installation

```bash
# Install dependencies
pnpm install

# Build Contentlayer content
pnpm build:content

# Start development server
pnpm dev
```

### Scripts

```bash
pnpm dev              # Development server with Turbopack
pnpm build            # Production build
pnpm build:content    # Build Contentlayer content only
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm prettier         # Format code with Prettier
pnpm eslint:fix       # Fix ESLint issues
```

### Adding New Posts

1. Create a new MDX file in `posts/tech/` or `posts/notes/`
2. Add frontmatter:
   ```yaml
   ---
   title: "Post Title"
   date: "2024-01-01"
   summary: "Post summary"
   tags: ["tag1", "tag2"]
   draft: false
   ---
   ```
3. Run `pnpm build:content` to process the content
