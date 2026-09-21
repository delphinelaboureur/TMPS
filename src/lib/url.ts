// Astro's BASE_URL always has a trailing slash (e.g. "/TMPS/" or "/" with no
// base configured). Root-absolute hrefs/srcs written in markup must go through
// this helper so they resolve correctly when the site is deployed under a
// sub-path (a GitHub Pages project page with no custom domain).
export const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export const withBase = (path: string) => `${BASE}${path}`;
