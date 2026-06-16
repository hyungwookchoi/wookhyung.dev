# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Commands

**Development:**
```bash
pnpm dev              # Start development server with Contentlayer2 build and Turbopack
pnpm build            # Build for production
pnpm build:content    # Build Contentlayer2 content only
pnpm start            # Start production server
```

**Code Quality:**
```bash
pnpm lint             # Run ESLint
pnpm eslint:fix       # Run ESLint with auto-fix
pnpm prettier         # Format code with Prettier
```

**Pre-commit hooks are configured with Husky and lint-staged.**

## Architecture

This is a **Next.js 15 blog** using the App Router with TypeScript and React 19. The site is built in Korean language with a focus on tech and personal notes.

### Content Management
- **Contentlayer2** transforms MDX files in `/posts/` into type-safe data
- Two content types: `TechPost` (`posts/tech/`) and `NotesPost` (`posts/notes/`)
- MDX processing includes: syntax highlighting (Prism), GitHub Flavored Markdown, and minification
- Posts have frontmatter: `title`, `date`, `summary`, `tags`, `draft`

### Directory Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── (home)/            # Home page (grouped route)
│   ├── tech/              # Tech blog posts
│   ├── notes/             # Personal notes
│   ├── about/             # About page
│   ├── study/             # Study page with constants
│   ├── preference/        # Preferences page with constants
│   ├── feed/              # RSS feed functionality
│   └── layout.tsx         # Root layout with analytics
└── shared/                # Shared utilities and components
    ├── config/            # Site configuration
    ├── ui/                # Reusable UI components
    ├── lib/               # Utility libraries
    ├── util/              # Helper utilities
    ├── fonts/             # Font definitions
    └── icon/              # Icon components
```

### Key Technologies
- **Styling:** Tailwind CSS 4 with custom animations
- **Motion:** Framer Motion for animations
- **Content:** Contentlayer2 with MDX support
- **Analytics:** Vercel Analytics + Google Analytics
- **SEO:** Comprehensive metadata, structured data, RSS feeds

### Import Paths
- `@/*` maps to `src/*`
- `contentlayer/generated` maps to `.contentlayer/generated`

### Code Style
- **ESLint:** Next.js + TypeScript rules with import sorting and unused import removal
- **Prettier:** Auto-formatting on save
- **Import sorting:** Automated with `eslint-plugin-simple-import-sort`
- Strict TypeScript configuration

### SVG Handling
- Custom webpack configuration for SVG imports
- SVGR integration for React components
- Support for both component and URL imports

### Development Notes
- Run `pnpm build:content` when adding new MDX posts
- The site uses Korean language (`ko`) as primary locale
- Development server uses Turbopack for faster builds
- Comments system configured for GitHub repository integration