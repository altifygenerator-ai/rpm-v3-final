export type ServicePage = {
  slug: string;
  layoutVariant: "problemSolution" | "safetyCleanup" | "processTerrain";
  title: string;
  shortTitle: string;
  eyebrow: string;
  image: string;
  galleryImages: string[];
  metaTitle: string;
  metaDescription: string;
  intro: string;
  primaryCta: string;
  sections: {
    eyebrow?: string;
    heading: string;
    text: string;
  }[];
  bulletsTitle: string;
  bullets: string[];
  process?: string[];
  faqs: {
    q: string;
    a: string;
  }[];
  related: string[];
};

export const servicePages: ServicePage[] = [
  {
    slug: "land-clearing",
    layoutVariant: "problemSolution",
    title: "Land Clearing in Greers Ferry & Central Arkansas",
    shortTitle: "Land Clearing",
    eyebrow: "Overgrown Land • Brush Removal • Site Prep",
    image: "/images/services/land-clearing.jpg",
    galleryImages: [
      "/images/services/land-clearing.jpg",
      "/images/work/work3.jpg",
      "/images/work/excavator.jpg",
    ],
    metaTitle:
      "Land Clearing in Greers Ferry, AR | Richards Property Management",
    metaDescription:
      "Land clearing, brush removal, site prep, overgrown property cleanup, trail clearing, and acreage clearing near Greers Ferry, Heber Springs, Fairfield Bay, Clinton, and Central Arkansas.",
    intro:
      "Richards Property Management helps property owners clear overgrown land, open up usable space, clean up brush, and prepare rural properties, lake lots, hunting land, and building sites across the Greers Ferry Lake area.",
    primaryCta: "Get Land Cleared",
    sections: [
      {
        eyebrow: "Problem",
        heading: "Overgrown land can get out of hand fast",
        text:
          "Brush, saplings, vines, fallen limbs, and rough terrain can make a property hard to use, hard to maintain, and difficult to access. Around Greers Ferry Lake and Central Arkansas, wooded land can thicken up quickly if it has not been maintained.",
      },
      {
        eyebrow: "Solution",
        heading: "We clear the land so it can actually be used",
        text:
          "Whether you need a home site opened up, trails cleared, fence lines cleaned, brush removed, or a rural property brought back under control, we can help make the land more open, cleaner, and easier to manage.",
      },
      {
        eyebrow: "Best Fit",
        heading: "Good for acreage, lake lots, trails, and build sites",
        text:
          "Land clearing can help with hunting property, cabin lots, residential lots, new construction prep, driveway access, storm cleanup, and neglected land that needs a fresh start.",
      },
    ],
    bulletsTitle: "Land clearing services include:",
    bullets: [
      "Brush clearing",
      "Small tree and sapling removal",
      "Overgrown lot cleanup",
      "Trail clearing",
      "Fence line clearing",
      "Access path clearing",
      "Hunting property cleanup",
      "Site prep cleanup",
      "Storm debris cleanup",
    ],
    faqs: [
      {
        q: "Do you clear overgrown land near Greers Ferry?",
        a: "Yes. We handle land clearing, brush removal, and property cleanup around Greers Ferry, Heber Springs, Fairfield Bay, Clinton, Quitman, and surrounding Central Arkansas areas.",
      },
      {
        q: "Can you clear trails or hunting land?",
        a: "Yes. We can open trails, access paths, shooting lanes, fence lines, and overgrown sections of rural or hunting property.",
      },
      {
        q: "Do you haul off debris after clearing?",
        a: "Yes. Cleanup and hauling can be included depending on the job and what needs to be removed from the property.",
      },
    ],
    related: ["tree-work", "drainage-erosion", "cleanup"],
  },

  {
    slug: "tree-work",
    layoutVariant: "safetyCleanup",
    title: "Tree Work & Removal in Greers Ferry & Central Arkansas",
    shortTitle: "Tree Work & Removal",
    eyebrow: "Tree Removal • Trimming • Storm Cleanup",
    image: "/images/services/tree-work.jpg",
    galleryImages: [
      "/images/work/treework.jpg",
      "/images/work/work6.jpg",
      "/images/services/cleanup.jpg",
    ],
    metaTitle:
      "Tree Work & Removal in Greers Ferry, AR | Richards Property Management",
    metaDescription:
      "Tree trimming, tree removal, storm cleanup, brush cleanup, and property clearing near Greers Ferry, Heber Springs, Fairfield Bay, Clinton, Quitman, and Central Arkansas.",
    intro:
      "Richards Property Management helps with tree trimming, tree removal, storm cleanup, fallen limbs, brush cleanup, and clearing around homes, driveways, cabins, lake properties, and rural land.",
    primaryCta: "Get Tree Work Help",
    sections: [
      {
        eyebrow: "Safety",
        heading: "Problem trees can create real property issues",
        text:
          "Trees around driveways, homes, lake lots, outbuildings, and steep land can become a problem after storms, heavy rain, or years of overgrowth. We help remove unwanted growth and clean up problem areas before they cause bigger damage.",
      },
      {
        eyebrow: "Cleanup",
        heading: "The cleanup matters as much as the cutting",
        text:
          "Tree work is not just about getting branches or trees down. The finished property needs to be clean, accessible, and usable. We can help with limb cleanup, brush removal, debris hauling, and clearing around the work area.",
      },
      {
        eyebrow: "Access",
        heading: "Clear driveways, trails, and tight property areas",
        text:
          "We can help open up blocked access, clean around driveways, remove fallen limbs, improve trail access, and clean up tree-related messes around homes, rentals, cabins, and rural properties.",
      },
    ],
    bulletsTitle: "Tree work services include:",
    bullets: [
      "Tree trimming",
      "Tree removal",
      "Storm cleanup",
      "Fallen limb cleanup",
      "Brush cleanup",
      "Driveway clearing",
      "Trail access clearing",
      "Lake property cleanup",
      "Debris hauling",
    ],
    faqs: [
      {
        q: "Do you handle storm cleanup?",
        a: "Yes. We help clean up fallen limbs, storm debris, damaged trees, and blocked access areas after storms.",
      },
      {
        q: "Can you clear trees around driveways or buildings?",
        a: "Yes. We handle tree and brush work around driveways, homes, outbuildings, trails, and other access areas.",
      },
      {
        q: "Do you clean up brush after tree work?",
        a: "Yes. Brush cleanup and hauling can be part of the job depending on what the property needs.",
      },
    ],
    related: ["land-clearing", "cleanup", "hauling"],
  },

  {
    slug: "drainage-erosion",
    layoutVariant: "processTerrain",
    title: "Drainage & Erosion Control in Greers Ferry & Central Arkansas",
    shortTitle: "Drainage & Erosion Control",
    eyebrow: "Drainage Repair • Runoff Control • Erosion Solutions",
    image: "/images/services/drainage.jpg",
    galleryImages: [
      "/images/services/drainage.jpg",
      "/images/work/dirtwork.jpg",
      "/images/services/retaining-walls.jpg",
    ],
    metaTitle:
      "Drainage & Erosion Control in Greers Ferry, AR | Richards Property Management",
    metaDescription:
      "Drainage repair, erosion control, runoff control, culvert work, grading, slope repair, and retaining wall support near Greers Ferry, Heber Springs, Fairfield Bay, and Central Arkansas.",
    intro:
      "Drainage problems can wash out driveways, damage slopes, create standing water, and cause long-term property issues. Richards Property Management builds practical drainage and erosion solutions for lake properties, rural land, cabins, homes, and steep Arkansas terrain.",
    primaryCta: "Fix Drainage Issues",
    sections: [
      {
        eyebrow: "Terrain",
        heading: "Arkansas rain and steep land can move water fast",
        text:
          "Properties around Greers Ferry Lake and Central Arkansas often deal with hills, rock, clay soil, heavy runoff, and uneven grades. When water does not have a proper path, it can cut ruts, wash out gravel, damage landscaping, and weaken slopes.",
      },
      {
        eyebrow: "Protection",
        heading: "Good drainage protects the rest of the property",
        text:
          "Drainage work can help protect driveways, retaining walls, outdoor areas, trails, foundations, and landscaped areas. The goal is to move water where it needs to go instead of letting it destroy the same areas every time it rains.",
      },
      {
        eyebrow: "Repair",
        heading: "Fix the cause, not just the mess",
        text:
          "A good drainage repair looks at the grade, runoff direction, soil, slope, rock, culverts, ditches, and low areas. We look at how water is actually moving across the property and build around that.",
      },
    ],
    bulletsTitle: "Drainage and erosion services include:",
    bullets: [
      "Drainage correction",
      "Runoff control",
      "Culvert work",
      "Erosion repair",
      "Grading",
      "Ditch cleanup",
      "Slope control",
      "Rock work",
      "Retaining wall support",
    ],
    process: [
      "Look at where water is coming from",
      "Find the low spots, washouts, and problem grades",
      "Decide whether the property needs grading, rock, culvert work, ditch work, or erosion control",
      "Build a practical solution that fits the land",
      "Clean up the area so the property is usable again",
    ],
    faqs: [
      {
        q: "Can you fix water washing out my driveway?",
        a: "Yes. We can look at the grade, runoff path, ditching, culverts, and surrounding land to help control water and reduce washout problems.",
      },
      {
        q: "Do you work on lake properties?",
        a: "Yes. We work around Greers Ferry Lake and surrounding areas where steep lots, runoff, and erosion are common issues.",
      },
      {
        q: "Can drainage work be combined with retaining walls?",
        a: "Yes. Drainage and retaining wall work often go together because water pressure and runoff can cause wall and slope problems over time.",
      },
    ],
    related: ["retaining-walls", "land-clearing", "general"],
  },
];