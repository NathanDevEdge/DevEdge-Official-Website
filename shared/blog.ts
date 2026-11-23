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

/** A dark panel with the post's answer in big type. Wrap words in *stars* to colour them. */
export interface Takeaway {
  label: string;
  headline: string;
  answer?: string;
}

/** A simple left-to-right process picture, 2 to 5 steps */
export interface Flow {
  caption?: string;
  steps: { label: string; text: string }[];
}

/** The messy "now" next to the tidy result */
export interface BeforeAfter {
  before: { items: string[]; caption: string };
  after: { items: string[]; caption: string };
}

/** The article body: Markdown HTML, with the visual blocks placed where the post asks */
export type BodyPart =
  | { type: "html"; html: string }
  | { type: "takeaway" }
  | { type: "flow" }
  | { type: "beforeAfter" };

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
  takeaway?: Takeaway;
  flow?: Flow;
  beforeAfter?: BeforeAfter;
  /** Rendered article body */
  body: BodyPart[];
}
