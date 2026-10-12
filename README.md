# SpinWheelJoy blog source (Astro)

This branch holds the blog SOURCE. `main` holds the built site (what Hostinger deploys).

## Workflow: Draft -> Review -> Publish
1. Staff: create a branch from `blog-source`, add/edit ONE markdown file in `src/content/blog/`, open a PR. Frontmatter: title, description, category, tags, author, pubDate, updatedDate, image, imageAlt.
2. Reviewer: review the PR, request changes or approve.
3. On merge: Lyly runs `npm run build` and pushes `dist/blog/**` + assets to `main`. Hostinger auto-deploys.

Images: committed to `main` at `assets/blog/` (binary). Reference them from frontmatter as `/assets/blog/name.svg`.
