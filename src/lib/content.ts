import { getCollection, type CollectionEntry } from "astro:content";

export type Person = CollectionEntry<"people">;
export type Publication = CollectionEntry<"publications">;

// Tag vocabulary (must match the `areas` enum in content.config.ts). A paper may
// carry several — a research topic plus a publication-type facet.
export type AreaSlug =
  | "heat-exchangers-am"
  | "multiphase-heat-transfer"
  | "dispersion-research"
  | "ionic-propulsion"
  | "review"
  | "letter";

export const AREA_LABELS: Record<AreaSlug, string> = {
  "heat-exchangers-am": "Characterization of heat exchangers in additive manufacturing",
  "multiphase-heat-transfer": "Multiphase heat transfer",
  "dispersion-research": "Dispersion research",
  "ionic-propulsion": "Ionic propulsion",
  review: "Review",
  letter: "Letter / commentary",
};

// Research-page sections, grouped, with blurbs.
export const RESEARCH_GROUPS: { title: string; areas: { slug: AreaSlug; blurb: string }[] }[] = [
  {
    title: "Research topics",
    areas: [
      {
        slug: "heat-exchangers-am",
        blurb:
          "Experimental characterization of heat exchangers produced by additive manufacturing, " +
          "combining advanced diagnostics with performance and reliability assessment.",
      },
      {
        slug: "multiphase-heat-transfer",
        blurb:
          "Numerical and experimental study of single- and multiphase heat transfer, in strong " +
          "collaboration with the Liquid Metal and Industrial Flow REG.",
      },
      {
        slug: "dispersion-research",
        blurb:
          "Dispersion and explosion research aimed at improving process safety and understanding " +
          "catastrophic release events.",
      },
      {
        slug: "ionic-propulsion",
        blurb: "Investigation of ionic propulsion concepts and their underlying physical mechanisms.",
      },
    ],
  },
];

// Publications filter chips, grouped (slugs reference AREA_LABELS).
export const FILTER_GROUPS: { title: string; slugs: AreaSlug[] }[] = [
  {
    title: "Topic",
    slugs: [
      "heat-exchangers-am",
      "multiphase-heat-transfer",
      "dispersion-research",
      "ionic-propulsion",
    ],
  },
  { title: "Type", slugs: ["review", "letter"] },
];

/** Research-page groups → each area with its most-recent pubs (capped) + total count. Areas
 * always appear, even with zero publications, so the page reads as a topic overview. */
export async function getResearchGroups(limit = 4) {
  const pubs = await getPublications();
  return RESEARCH_GROUPS.map((g) => ({
    title: g.title,
    areas: g.areas.map((a) => {
      const all = pubs.filter((p) => p.data.areas.includes(a.slug));
      return { slug: a.slug, label: AREA_LABELS[a.slug], blurb: a.blurb, pubs: all.slice(0, limit), total: all.length };
    }),
  }));
}

/** Count of publications per area slug (for filter-chip labels). */
export async function getAreaCounts() {
  const pubs = await getPublications();
  const counts: Partial<Record<AreaSlug, number>> = {};
  for (const p of pubs) for (const a of p.data.areas as AreaSlug[]) counts[a] = (counts[a] || 0) + 1;
  return counts;
}

// Display order of groups within the People page.
export const GROUP_ORDER = [
  "Faculty",
  "Project Office",
  "PhD Students",
  "Collaborative PhD Students",
  "Alumni",
] as const;

const byOrder = (a: Person, b: Person) => a.data.order - b.data.order;

/** People grouped and ordered: current groups first, then Alumni. */
export async function getGroupedPeople() {
  const people = await getCollection("people");
  return GROUP_ORDER.map((group) => ({
    group,
    people: people.filter((p) => p.data.group === group).sort(byOrder),
  })).filter((g) => g.people.length > 0);
}

/** Publications newest-first. */
export async function getPublications() {
  const pubs = await getCollection("publications");
  return pubs.sort(
    (a, b) => b.data.year - a.data.year || a.data.title.localeCompare(b.data.title),
  );
}

// --- author <-> person matching (best-effort, for profile pages) -----------

const normAlpha = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[^a-z]/g, "");

export interface PersonKey {
  initial: string;
  last: string;
}

export function personKey(name: string): PersonKey {
  const base = name.split(",")[0].trim(); // drop trailing credentials
  const toks = base.split(/\s+/);
  return {
    initial: (normAlpha(toks[0])[0] || ""),
    last: normAlpha(toks[toks.length - 1] || ""),
  };
}

/** Does a CV-style author string ("Miller GN", "Ortega-Marquez J") name this person? */
export function authorIsPerson(author: string, pk: PersonKey): boolean {
  if (!pk.last) return false;
  const m = author.trim().match(/^(.*?)\s+([A-Za-z]{1,4})$/);
  const wholeLast = normAlpha(m ? m[1] : author);
  const initials = m ? m[2].toLowerCase() : "";
  const lastOk = wholeLast.includes(pk.last);
  const initialOk = !pk.initial || !initials || initials[0] === pk.initial;
  return lastOk && initialOk;
}

/** Publications authored by a person, newest-first (best-effort name match). */
export function publicationsForPerson(person: Person, pubs: Publication[]) {
  const pk = personKey(person.data.name);
  return pubs.filter((p) => p.data.authors.some((a) => authorIsPerson(a, pk)));
}

// Everyone profiled is treated as a "mentee" for the publication badges EXCEPT
// the people listed here (typically the PI and senior faculty/collaborators).
// Use each person's slug = their markdown filename without ".md".
export const NON_MENTEE_SLUGS = new Set(["d-laboureur"]);

/** Build an `isMentee(authorString)` predicate from the people collection. */
export function menteeMatcher(people: Person[]) {
  const dir = people.map((p) => ({ slug: p.id, key: personKey(p.data.name) }));
  return (author: string) => {
    const d = dir.find((x) => authorIsPerson(author, x.key));
    return !!d && !NON_MENTEE_SLUGS.has(d.slug);
  };
}

const menteeLed = (p: Publication, isMentee: (a: string) => boolean) =>
  isMentee(p.data.authors[0] ?? "");

/**
 * Featured predicate: a mentee-led paper, or a PI first/senior paper from
 * 2019 on. Mentee status is membership-derived (see menteeMatcher).
 */
export function featuredMatcher(people: Person[]) {
  const isMentee = menteeMatcher(people);
  return (p: Publication) => {
    // Letters and reviews aren't "featured" primary research on the homepage.
    if (p.data.areas.includes("letter") || p.data.areas.includes("review")) return false;
    return menteeLed(p, isMentee) || (p.data.piFirstOrSenior && p.data.year >= 2019);
  };
}

/** Sort featured papers: mentee-led first, then most recent. */
export function featuredSorter(people: Person[]) {
  const isMentee = menteeMatcher(people);
  return (a: Publication, b: Publication) => {
    const diff = Number(menteeLed(b, isMentee)) - Number(menteeLed(a, isMentee));
    return diff || b.data.year - a.data.year;
  };
}
