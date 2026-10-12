import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

export const CATEGORIES: Record<string, { name: string; description: string; emoji: string; gradient: string }> = {
  classroom: {
    name: 'Classroom',
    description: 'Fair picks, warm-ups, and calmer classrooms.',
    emoji: '🎓',
    gradient: 'linear-gradient(135deg,#d6fbeb,#a3e5e0)',
  },
  parties: {
    name: 'Parties & Game Night',
    description: 'Icebreakers and games that get everyone playing.',
    emoji: '🎉',
    gradient: 'linear-gradient(135deg,#ffe0e7,#ffc2a5)',
  },
  decisions: {
    name: 'Everyday Decisions',
    description: 'Small choices, decided joyfully.',
    emoji: '🤔',
    gradient: 'linear-gradient(135deg,#fff1cc,#ffca8d)',
  },
  'team-building': {
    name: 'Team Building',
    description: 'Groups, meetings, and workshops without the awkwardness.',
    emoji: '👥',
    gradient: 'linear-gradient(135deg,#f3ddff,#c7beff)',
  },
};

export async function getPosts(): Promise<BlogPost[]> {
  const all = await getCollection('blog', ({ data }) => !data.draft);
  return all.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

export function postUrl(post: BlogPost): string {
  return `blog/${post.data.category}/${post.data.postSlug}/`;
}

export function categoryUrl(category: string): string {
  return `blog/${category}/`;
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Extract h2 headings from raw markdown for the table of contents.
export function extractToc(markdown: string): { id: string; text: string }[] {
  const out: { id: string; text: string }[] = [];
  for (const line of markdown.split('\n')) {
    const m = /^##\s+(.+)$/.exec(line.trim());
    if (m) {
      const text = m[1].replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      out.push({ id, text });
    }
  }
  return out;
}

// Add id anchors to rendered h2s so the TOC links work.
export function anchorHeadings(html: string): string {
  return html.replace(/<h2>(.*?)<\/h2>/g, (_m, inner) => {
    const text = inner.replace(/<[^>]+>/g, '');
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return `<h2 id="${id}">${inner}</h2>`;
  });
}

export function articleJsonLd(post: BlogPost): string {
  const url = `https://spinwheeljoy.com/${postUrl(post)}`;
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.data.title,
    description: post.data.description,
    author: { '@type': 'Organization', name: post.data.author },
    publisher: { '@type': 'Organization', name: 'SpinWheelJoy' },
    datePublished: post.data.pubDate.toISOString().split('T')[0],
    dateModified: (post.data.updatedDate ?? post.data.pubDate).toISOString().split('T')[0],
    mainEntityOfPage: url,
  });
}
