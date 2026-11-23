declare module "virtual:blog-posts" {
  import type { BlogPost } from "@shared/blog";
  /** Published posts, newest first (drafts are included in dev only) */
  const posts: BlogPost[];
  export default posts;
}
