import { defineConfig } from 'astro/config';
import rehypeSlug from 'rehype-slug';

// SpinWheelJoy blog prototype.
// The existing static site (homepage, tools, Wheel Engine) lives in ./public/
// verbatim and is copied to dist/ untouched. Astro only generates /blog/**.
export default defineConfig({
  site: 'https://spinwheeljoy.com',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  markdown: {
    rehypePlugins: [rehypeSlug],
  },
});
