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
    metaTitle: "Land Clearing in Greers Ferry, AR | Richards Property Management",
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
    metaTitle: "Tree Work & Removal in Greers Ferry, AR | Richards Property Management",
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
    image: "/images/services/drainage-erosion.jpg",
    galleryImages: [
      "/images/services/drainage-erosion.jpg",
      "/images/work/dirtwork.jpg",
      "/images/services/retaining-walls.jpg",
    ],
    metaTitle: "Drainage & Erosion Control in Greers Ferry, AR | Richards Property Management",
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
  {
    slug: "retaining-walls",
    layoutVariant: "processTerrain",
    title: "Retaining Walls & Rock Work in Greers Ferry, AR",
    shortTitle: "Retaining Walls & Rock Work",
    eyebrow: "Slope Control • Rock Work • Terrain Support",
    image: "/images/services/retaining-walls.jpg",
    galleryImages: [
      "/images/services/retaining-walls.jpg",
      "/images/work/retainingwallstair.jpg",
      "/images/work/stair.jpg",
    ],
    metaTitle: "Retaining Walls & Rock Work in Greers Ferry, AR | Richards Property Management",
    metaDescription:
      "Retaining walls, rock work, slope support, drainage support, landscape walls, and terrain solutions near Greers Ferry Lake, Heber Springs, Fairfield Bay, and Central Arkansas.",
    intro:
      "Steep land, washed out slopes, and uneven lots are common around Greers Ferry Lake. We build practical retaining wall and rock work solutions that help support outdoor spaces, control grade changes, and improve the way the property functions.",
    primaryCta: "Plan Retaining Wall Work",
    sections: [
      {
        eyebrow: "Support",
        heading: "Steep lots need more than a quick fix",
        text:
          "Retaining walls and rock work can help hold usable space, support slopes, reduce erosion, and make outdoor areas safer and easier to maintain.",
      },
      {
        eyebrow: "Drainage",
        heading: "Water control matters behind the wall",
        text:
          "Good wall work considers drainage, runoff, slope pressure, soil conditions, and how water moves across the property. That is especially important in Arkansas terrain.",
      },
      {
        eyebrow: "Finish",
        heading: "Built to fit the property, not fight it",
        text:
          "Every wall, rock edge, and slope project needs to match the land. We focus on practical layouts that work with existing grades, driveways, walkways, and outdoor areas.",
      },
    ],
    bulletsTitle: "Retaining wall and rock work can include:",
    bullets: [
      "Retaining walls",
      "Rock borders",
      "Slope support",
      "Drainage support",
      "Landscape wall work",
      "Steps and access areas",
      "Outdoor space support",
      "Washout repair support",
    ],
    process: [
      "Look at the slope, grade, and water flow",
      "Plan the wall or rock work around the property use",
      "Prepare the area and base",
      "Build the support feature",
      "Clean up the surrounding work area",
    ],
    faqs: [
      {
        q: "Do retaining walls help with erosion?",
        a: "They can. Retaining walls and rock work often help support slopes and slow erosion, especially when paired with good drainage.",
      },
      {
        q: "Can you add rock work around outdoor spaces?",
        a: "Yes. We can help with rock borders, outdoor areas, wall support, and practical landscape rock work.",
      },
      {
        q: "Do drainage and retaining walls go together?",
        a: "Often, yes. Drainage should be considered so water pressure does not create more issues behind or around the wall.",
      },
    ],
    related: ["drainage-erosion", "outdoor-builds", "general"],
  },
  {
    slug: "cleanup",
    layoutVariant: "safetyCleanup",
    title: "Property Cleanup & Hauling in Greers Ferry, AR",
    shortTitle: "Cleanup & Hauling",
    eyebrow: "Debris Removal • Storm Cleanup • Property Cleanup",
    image: "/images/services/cleanup.jpg",
    galleryImages: [
      "/images/services/cleanup.jpg",
      "/images/services/clean-up.jpg",
      "/images/work/cleanrock.jpg",
    ],
    metaTitle: "Property Cleanup & Hauling in Greers Ferry, AR | Richards Property Management",
    metaDescription:
      "Property cleanup, debris hauling, storm cleanup, brush cleanup, jobsite cleanup, and removal help near Greers Ferry Lake, Heber Springs, Fairfield Bay, Clinton, and Central Arkansas.",
    intro:
      "From storm debris and brush piles to leftover material and general property messes, Richards Property Management helps clean up land, lake lots, driveways, work areas, rentals, and rural properties.",
    primaryCta: "Get Cleanup Help",
    sections: [
      {
        eyebrow: "Mess",
        heading: "Cleanup work can hold up the whole property",
        text:
          "Piles of limbs, brush, old material, construction debris, and storm mess can make a property look rough and harder to use. Cleanup helps get the place back under control.",
      },
      {
        eyebrow: "Hauling",
        heading: "We can remove what the job leaves behind",
        text:
          "Many land and property jobs create debris. We can help haul off material, clean around the work area, and leave the property more usable than when we started.",
      },
      {
        eyebrow: "Uses",
        heading: "Good for homes, cabins, rentals, and rural land",
        text:
          "Cleanup and hauling can help homeowners, cabin owners, landlords, short-term rental owners, and property owners who need a reliable hand with the heavy cleanup.",
      },
    ],
    bulletsTitle: "Cleanup and hauling services include:",
    bullets: [
      "Storm debris cleanup",
      "Brush pile cleanup",
      "Jobsite cleanup",
      "Property cleanup",
      "Light demolition cleanup",
      "Lake lot cleanup",
      "Rental property cleanup",
      "Material hauling",
      "Debris hauling",
    ],
    faqs: [
      {
        q: "Can you haul off brush and limbs?",
        a: "Yes. Brush, limbs, storm debris, and similar material can usually be cleaned up and hauled depending on the project.",
      },
      {
        q: "Do you clean up after land clearing or tree work?",
        a: "Yes. Cleanup can be included with land clearing, tree work, drainage repair, and other property projects.",
      },
      {
        q: "Do you help with lake cabin cleanup?",
        a: "Yes. We help with cleanup needs around cabins, lake lots, rental properties, driveways, and outdoor areas.",
      },
    ],
    related: ["hauling", "land-clearing", "tree-work"],
  },
  {
    slug: "hauling",
    layoutVariant: "problemSolution",
    title: "Hauling Services in Greers Ferry & Central Arkansas",
    shortTitle: "Hauling Services",
    eyebrow: "Debris • Materials • Jobsite Support",
    image: "/images/services/hauling.jpg",
    galleryImages: [
      "/images/services/hauling.jpg",
      "/images/work/services.jpg",
      "/images/work/work1.jpg",
    ],
    metaTitle: "Hauling Services in Greers Ferry, AR | Richards Property Management",
    metaDescription:
      "Hauling services for debris, brush, materials, cleanup jobs, property projects, rock, gravel, and jobsite support near Greers Ferry Lake and Central Arkansas.",
    intro:
      "When the job needs material moved, debris removed, or a property cleaned up, Richards Property Management provides practical hauling support for homes, lake lots, cabins, rural land, and work areas.",
    primaryCta: "Get Hauling Help",
    sections: [
      {
        eyebrow: "Materials",
        heading: "Property projects usually need something moved",
        text:
          "Rock, gravel, brush, limbs, debris, old material, and cleanup loads can slow down a project if there is no plan to move it.",
      },
      {
        eyebrow: "Support",
        heading: "Hauling that fits the job",
        text:
          "We can help with hauling tied to cleanup, drainage, clearing, outdoor builds, retaining walls, and general property work around the Greers Ferry Lake area.",
      },
      {
        eyebrow: "Local",
        heading: "Useful for lake lots and rural access",
        text:
          "Rural properties and lake lots often have tight access, rough driveways, slopes, and mixed terrain. We look at what needs moved and what the property can handle.",
      },
    ],
    bulletsTitle: "Hauling services can include:",
    bullets: [
      "Debris hauling",
      "Brush hauling",
      "Storm cleanup hauling",
      "Jobsite cleanup hauling",
      "Rock and gravel hauling support",
      "Material transport",
      "Property cleanup loads",
      "Outdoor project support",
    ],
    faqs: [
      {
        q: "Do you haul debris after a project?",
        a: "Yes. Debris hauling can be part of cleanup, tree work, land clearing, drainage, or general property jobs.",
      },
      {
        q: "Can hauling be combined with other services?",
        a: "Yes. Hauling is often combined with cleanup, land clearing, retaining wall work, drainage repair, and outdoor projects.",
      },
      {
        q: "Do you haul around Greers Ferry Lake?",
        a: "Yes. We serve the Greers Ferry Lake area and surrounding Central Arkansas communities.",
      },
    ],
    related: ["cleanup", "land-clearing", "general"],
  },
  {
    slug: "airbnb",
    layoutVariant: "problemSolution",
    title: "Airbnb & Lake Property Maintenance in Greers Ferry, AR",
    shortTitle: "Airbnb & Property Maintenance",
    eyebrow: "Cabins • Short-Term Rentals • Lake Properties",
    image: "/images/services/airbnb.jpg",
    galleryImages: [
      "/images/services/airbnb.jpg",
      "/images/work/card.jpg",
      "/images/work/card2.jpg",
    ],
    metaTitle: "Airbnb Property Maintenance in Greers Ferry, AR | Richards Property Management",
    metaDescription:
      "Airbnb property maintenance, cabin cleanup, outdoor repairs, hauling, drainage help, tree work, and property support for rentals around Greers Ferry Lake and Central Arkansas.",
    intro:
      "Short-term rentals and lake cabins need dependable outside help. Richards Property Management helps owners keep driveways, outdoor areas, drainage, cleanup, and property issues from becoming guest problems.",
    primaryCta: "Talk About Rental Help",
    sections: [
      {
        eyebrow: "Guest Ready",
        heading: "Small property issues can turn into guest complaints",
        text:
          "Washed out driveways, fallen limbs, messy outdoor spaces, poor drainage, and neglected maintenance can hurt the guest experience and create stress for owners.",
      },
      {
        eyebrow: "Support",
        heading: "A local hand for outside property needs",
        text:
          "We can help with cleanup, hauling, drainage issues, tree work, outdoor repairs, and general property projects that keep rentals safer, cleaner, and easier to manage.",
      },
      {
        eyebrow: "Lake Area",
        heading: "Built around Greers Ferry Lake property needs",
        text:
          "Lake cabins and rentals deal with slopes, gravel, trees, water runoff, and seasonal traffic. We focus on practical property work that helps owners stay ahead of those issues.",
      },
    ],
    bulletsTitle: "Rental property support can include:",
    bullets: [
      "Outdoor cleanup",
      "Driveway washout help",
      "Tree limb cleanup",
      "Storm cleanup",
      "Drainage repair support",
      "Hauling",
      "Small outdoor repairs",
      "General property maintenance",
    ],
    faqs: [
      {
        q: "Do you help with Airbnb properties around Greers Ferry Lake?",
        a: "Yes. We can help short-term rental owners with outdoor cleanup, property maintenance, drainage, hauling, and other exterior property needs.",
      },
      {
        q: "Can you help between guest stays?",
        a: "Depending on timing and the job, yes. Reach out with the property need and schedule so we can see what makes sense.",
      },
      {
        q: "Do you handle emergency storm cleanup?",
        a: "We can help with storm cleanup when available, especially for fallen limbs, blocked access, and outdoor messes that affect the property.",
      },
    ],
    related: ["cleanup", "tree-work", "drainage-erosion"],
  },
  {
    slug: "water-features",
    layoutVariant: "processTerrain",
    title: "Custom Water Features in Greers Ferry & Central Arkansas",
    shortTitle: "Custom Water Features",
    eyebrow: "Ponds • Waterfalls • Natural Outdoor Features",
    image: "/images/services/water-features.jpg",
    galleryImages: [
      "/images/services/water-features.jpg",
      "/images/work/brick.jpg",
      "/images/work/buildingandwork.jpg",
    ],
    metaTitle: "Custom Water Features in Greers Ferry, AR | Richards Property Management",
    metaDescription:
      "Custom ponds, waterfalls, water features, rock work, outdoor builds, drainage-aware landscaping, and natural property features near Greers Ferry Lake and Central Arkansas.",
    intro:
      "Custom water features can turn a plain outdoor area into something useful and memorable. We plan ponds, waterfalls, and natural features around the grade, drainage, rock, access, and the way the property is actually used.",
    primaryCta: "Plan a Water Feature",
    sections: [
      {
        eyebrow: "Design",
        heading: "A water feature has to fit the land",
        text:
          "The best water features work with the property instead of fighting the grade, soil, rock, and drainage. That planning matters around Greers Ferry Lake terrain.",
      },
      {
        eyebrow: "Build",
        heading: "Rock, water, grade, and access all matter",
        text:
          "Water feature work often ties together dirt work, rock placement, drainage awareness, and outdoor build details. The goal is something that looks good and functions well.",
      },
      {
        eyebrow: "Use",
        heading: "Built for homes, cabins, and outdoor gathering areas",
        text:
          "A pond, waterfall, or custom water feature can improve a yard, rental property, cabin area, patio, or outdoor hangout space.",
      },
    ],
    bulletsTitle: "Water feature work can include:",
    bullets: [
      "Custom ponds",
      "Waterfalls",
      "Natural rock features",
      "Outdoor water feature planning",
      "Rock placement",
      "Drainage-aware layout",
      "Outdoor space support",
      "Property feature upgrades",
    ],
    process: [
      "Walk the area and look at grade, access, and drainage",
      "Plan the feature around the property layout",
      "Prepare the area for rock, water flow, and outdoor use",
      "Build the feature with practical long-term use in mind",
      "Clean up and finish the surrounding space",
    ],
    faqs: [
      {
        q: "Can you build water features on lake properties?",
        a: "Yes. We can look at the property, grade, access, and drainage to see what type of water feature fits the space.",
      },
      {
        q: "Do water features need drainage planning?",
        a: "Yes. Water flow, runoff, soil, and slope should all be considered before building a custom feature.",
      },
      {
        q: "Can water features be combined with rock work?",
        a: "Yes. Rock work, retaining features, steps, and outdoor builds often pair well with water feature projects.",
      },
    ],
    related: ["outdoor-builds", "retaining-walls", "drainage-erosion"],
  },
  {
    slug: "outdoor-builds",
    layoutVariant: "processTerrain",
    title: "Outdoor Builds in Greers Ferry & Central Arkansas",
    shortTitle: "Outdoor Builds",
    eyebrow: "Fire Pits • Patios • Steps • Outdoor Spaces",
    image: "/images/services/outdoor-builds.jpg",
    galleryImages: [
      "/images/services/outdoor-builds.jpg",
      "/images/work/stair.png",
      "/images/work/buildingandwork2.jpg",
    ],
    metaTitle: "Outdoor Builds in Greers Ferry, AR | Richards Property Management",
    metaDescription:
      "Outdoor builds, fire pits, patios, steps, terraces, rock features, cabin upgrades, and custom outdoor spaces near Greers Ferry Lake and Central Arkansas.",
    intro:
      "Outdoor spaces around homes, cabins, and lake properties should be useful, durable, and built for the land they sit on. We help with custom outdoor builds that make the property easier to enjoy and maintain.",
    primaryCta: "Plan an Outdoor Build",
    sections: [
      {
        eyebrow: "Function",
        heading: "Outdoor spaces need to work with the property",
        text:
          "A good outdoor build considers grade, drainage, access, foot traffic, and how people actually use the space. That is especially important on sloped lake properties.",
      },
      {
        eyebrow: "Details",
        heading: "Practical builds with a cleaner finish",
        text:
          "Fire pits, steps, patios, terraces, and outdoor features should look right, hold up, and solve a real use problem on the property.",
      },
      {
        eyebrow: "Value",
        heading: "Useful upgrades for homes, cabins, and rentals",
        text:
          "Outdoor builds can make a property more usable for family, guests, renters, and long-term maintenance.",
      },
    ],
    bulletsTitle: "Outdoor build services can include:",
    bullets: [
      "Fire pits",
      "Patios",
      "Outdoor steps",
      "Terraces",
      "Rock features",
      "Cabin outdoor upgrades",
      "Gathering areas",
      "Custom property features",
    ],
    process: [
      "Talk through how the space will be used",
      "Look at grade, access, drainage, and existing features",
      "Plan a practical build that fits the property",
      "Build the feature with a clean finish",
      "Clean up the work area when complete",
    ],
    faqs: [
      {
        q: "Do you build outdoor features for cabins?",
        a: "Yes. We can help with outdoor spaces, steps, fire pits, patios, and practical upgrades for cabins and lake properties.",
      },
      {
        q: "Can outdoor builds include rock work?",
        a: "Yes. Rock work, retaining features, steps, and drainage-aware builds often go together.",
      },
      {
        q: "Do you help plan the layout?",
        a: "Yes. We look at the property and talk through the use, grade, access, and practical layout before the work starts.",
      },
    ],
    related: ["retaining-walls", "water-features", "general"],
  },
  {
    slug: "general",
    layoutVariant: "problemSolution",
    title: "General Property Work in Greers Ferry & Central Arkansas",
    shortTitle: "General Property Work",
    eyebrow: "Backhoe Work • Repairs • Custom Property Help",
    image: "/images/services/general.jpg",
    galleryImages: [
      "/images/services/general.jpg",
      "/images/work/dirtwork.jpg",
      "/images/work/buildingandwork3.jpg",
    ],
    metaTitle: "General Property Work in Greers Ferry, AR | Richards Property Management",
    metaDescription:
      "General property work, backhoe help, rural property maintenance, grading support, repairs, cleanup, hauling, and custom land solutions near Greers Ferry Lake and Central Arkansas.",
    intro:
      "Not every property project fits neatly into one category. Richards Property Management helps with practical land, repair, cleanup, grading, backhoe, and outdoor work for rural properties, homes, cabins, and lake lots.",
    primaryCta: "Ask About Property Work",
    sections: [
      {
        eyebrow: "Flexible",
        heading: "Some jobs need a practical problem solver",
        text:
          "Rural property work can include a little bit of dirt work, cleanup, repairs, hauling, drainage help, and access improvement all in the same project.",
      },
      {
        eyebrow: "Local Terrain",
        heading: "Built for Arkansas land and lake properties",
        text:
          "Greers Ferry Lake area properties often involve slopes, gravel, trees, washed areas, rock, clay, and access issues. We help find a practical way to handle the work.",
      },
      {
        eyebrow: "Help",
        heading: "Reach out even if the job does not fit a box",
        text:
          "If you are not sure what service the project falls under, send the details. We can tell you if it is something we can help with or point you in the right direction.",
      },
    ],
    bulletsTitle: "General property work can include:",
    bullets: [
      "Backhoe work",
      "Small grading projects",
      "Property repairs",
      "Access improvements",
      "Outdoor maintenance",
      "Cleanup support",
      "Hauling support",
      "Custom property solutions",
    ],
    faqs: [
      {
        q: "Can I ask about a job that is not listed?",
        a: "Yes. Send the project details and we can let you know if it is a fit.",
      },
      {
        q: "Do you work on rural properties?",
        a: "Yes. Rural property work, lake lots, cabins, driveways, acreage, and general property needs are a big part of what we do.",
      },
      {
        q: "Can general work be combined with cleanup or hauling?",
        a: "Yes. Many general property jobs include cleanup, hauling, grading support, or drainage-related work.",
      },
    ],
    related: ["hauling", "cleanup", "drainage-erosion"],
  },
  {
    slug: "welding",
    layoutVariant: "safetyCleanup",
    title: "Welding & Fabrication in Greers Ferry & Central Arkansas",
    shortTitle: "Welding & Fabrication",
    eyebrow: "Repairs • Gates • Brackets • Custom Metal Work",
    image: "/images/services/welding.jpg",
    galleryImages: [
      "/images/services/welding.jpg",
      "/images/work/welding.jpg",
      "/images/work/bng5.jpg",
    ],
    metaTitle: "Welding & Fabrication in Greers Ferry, AR | Richards Property Management",
    metaDescription:
      "Welding, fabrication, metal repairs, gates, brackets, outdoor metal work, property repair welding, and custom fabrication support near Greers Ferry Lake and Central Arkansas.",
    intro:
      "Some property jobs need metal work, repairs, brackets, gates, or custom fabrication. Richards Property Management can help with practical welding and fabrication needs connected to outdoor, property, and repair projects.",
    primaryCta: "Ask About Welding",
    sections: [
      {
        eyebrow: "Repair",
        heading: "Property repairs sometimes need custom metal work",
        text:
          "Gates, brackets, equipment-related repairs, outdoor features, and property projects can require a custom fix instead of an off-the-shelf part.",
      },
      {
        eyebrow: "Fabrication",
        heading: "Built around the job in front of us",
        text:
          "We focus on practical welding and fabrication that fits the property need, whether it is repair work, a small custom build, or support for a larger outdoor project.",
      },
      {
        eyebrow: "Use",
        heading: "Good for repairs, gates, outdoor features, and property work",
        text:
          "Welding can pair with fencing, outdoor builds, retaining features, equipment support, and general property maintenance.",
      },
    ],
    bulletsTitle: "Welding and fabrication can include:",
    bullets: [
      "Repair welding",
      "Custom brackets",
      "Gate repairs",
      "Small fabrication projects",
      "Outdoor metal features",
      "Property repair support",
      "Metal work for outdoor builds",
      "Custom fixes when available",
    ],
    faqs: [
      {
        q: "Do you do custom welding jobs?",
        a: "Yes, depending on the project. Send the details and we can let you know if it is a fit.",
      },
      {
        q: "Can welding be part of a property project?",
        a: "Yes. Welding and fabrication can support gates, outdoor builds, repairs, brackets, and general property work.",
      },
      {
        q: "Do you handle small repair welding?",
        a: "When available, yes. Reach out with photos and details so we can understand the repair.",
      },
    ],
    related: ["general", "outdoor-builds", "retaining-walls"],
  },
];
