// Site-wide singletons (identity, contact, social, navigation).
// Kept here rather than in a content collection so layout components can
// import them directly.

export interface NavItem {
  label: string;
  href: string;
}

export interface SiteConfig {
  name: string;
  shortName: string;
  pi: string;
  institution: string;
  university: string;
  url: string;
  description: string;
  email: string;
  phone?: string;
  address: string[];
  mapQuery: string;
  social: {
    scholar?: string;
    website?: string;
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  nav: NavItem[];
}

export const site: SiteConfig = {
  name: "Thermal Management and Process Safety Research Expertise Group",
  shortName: "TMPS",
  pi: "Delphine Laboureur, PhD",
  institution: "von Karman Institute for Fluid Dynamics",
  university: "Environmental and Applied Fluid Dynamics Department",
  // Project page at delphinelaboureur.github.io/TMPS (see astro.config.mjs `base`).
  url: "https://delphinelaboureur.github.io/TMPS",
  description:
    "The Thermal Management and Process Safety (TMPS) group aims to improve global safety and " +
    "sustainability by deepening our understanding of catastrophic events and pioneering " +
    "innovations in thermal management. The REG combines a unique two-headed expertise, " +
    "specializing in thermal management in aeronautics, as well as process safety, mainly " +
    "dispersion and explosion research.",
  email: "delphine.laboureur@vki.ac.be",
  address: [
    "Thermal Management and Process Safety Research Expertise Group",
    "Environmental and Applied Fluid Dynamics Department",
    "von Karman Institute",
    "72 Chaussée de Waterloo",
    "1640 Rhode-Saint-Genèse, Belgium",
  ],
  mapQuery: "72 Chaussee de Waterloo, 1640 Rhode-Saint-Genese, Belgium",
  social: {
    scholar: "https://scholar.google.com/citations?user=kU0VsS4AAAAJ&hl=fr",
    website: "https://www.vki.ac.be",
    linkedin: "https://www.linkedin.com/in/dlaboureur/",
  },
  nav: [
    { label: "People", href: "/people" },
    { label: "Research", href: "/research" },
    { label: "Publications", href: "/publications" },
    { label: "Lab Life", href: "/lab-life" },
    { label: "Contact", href: "/contact" },
  ],
};
