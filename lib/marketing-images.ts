/**
 * Curated marketing photography — Ethiopian & African tech context.
 * Unsplash (free license). Swap URLs here to update all landing/about heroes.
 */

const unsplash = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&q=85&w=${w}`;

export const marketingImages = {
  /** Landing hero — Iwaria (African stock); group collaborating on a laptop */
  landingHero: {
    src: unsplash("photo-1655720357872-ce227e4164ba", 1400),
    alt: "African tech professionals collaborating around a laptop in a modern workspace",
  },
  /** About hero — engineering team collaborating on laptops */
  aboutHero: {
    src: unsplash("photo-1522071820081-009f0129c71c", 1400),
    alt: "Ethiopian tech team collaborating on software at their desks",
  },
  /** About bento — market & data intelligence */
  aboutMarketTrends: {
    src: unsplash("photo-1551288049-bebda4e38f71", 1200),
    alt: "Data analytics and market insights on screen",
  },
} as const;
