// Retired post slugs → their replacements (served as 301s by server/index.ts from
// both /blog/<slug> and /insights/<slug>)
export const LEGACY_BLOG_REDIRECTS: Record<string, string> = {
  "custom-mobile-app-cost-sydney": "/insights/custom-app-cost-australia",
  "legacy-system-modernization-cloud": "/insights/signs-you-have-outgrown-spreadsheets",
  "healthcare-custom-software-australia": "/insights",
};
