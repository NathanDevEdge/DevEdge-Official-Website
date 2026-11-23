// Shape of a blog post once scripts/blogPlugin.ts has read it from content/blog/*.md.
// The client imports the list from the "virtual:blog-posts" module.

export const BLOG_CATEGORIES = [
  "CRM & ERP",
  "Apps",
  "Websites",
  "Paid Media",
  "SEO",
  "Tracking",
] as const;
export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export interface BlogPost {
  slug: string;
  title: string;
  /** Meta description, listing excerpt and schema description */
  description: string;
  /** Published date, YYYY-MM-DD */
  date: string;
  /** Last meaningful update, YYYY-MM-DD */
  updated?: string;
  author: string;
  /** e.g. "6 min read". Worked out from the word count unless set in frontmatter. */
  readTime: string;
  category?: BlogCategory;
  draft: boolean;
  /** Rendered article body */
  html: string;
}
