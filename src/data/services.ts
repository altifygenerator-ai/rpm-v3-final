import { stockImages } from "@/data/stock-images";

export type ServiceFaq = {
  q: string;
  a: string;
};

export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  summary: string;
  description: string;
  image: string;
  requests: string[];
  related: string[];
  faqs: ServiceFaq[];
};

export const services: Service[] = [
  {
    slug: "land-clearing",
    title: "Land Clearing in Arkansas",
    shortTitle: "Land Clearing",
    summary: "Clear overgrown, wooded, or neglected ground so the property can be used again.",
    description:
      "Need land cleared? Arkansas Land Pros helps property owners get help with rural property, lake lots, homesites, trails, fence lines, acreage, and other projects where brush, small trees, debris, or overgrowth are in the way.",
    image: stockImages.landClearing.src,
    requests: ["Acreage clearing", "Homesite preparation", "Fence-line clearing", "Trail and access clearing", "Overgrown lot cleanup"],
    related: ["forestry-mulching", "brush-clearing", "site-prep", "hauling"],
    faqs: [
      { q: "Can I request land clearing for rural property?", a: "Yes. The request form is built for rural acreage, residential lots, lake property, hunting land, access routes, and similar Arkansas properties." },
      { q: "Do I need to know the exact acreage?", a: "No. An estimate is helpful, but photos, the property location, and a short description are enough to start." },
      { q: "Can I send photos with the request?", a: "Yes. The site is designed around quick project details. If photo upload is not available on the form you use, mention that you have photos and the follow-up can collect them." },
    ],
  },
  {
    slug: "forestry-mulching",
    title: "Forestry Mulching Across Arkansas",
    shortTitle: "Forestry Mulching",
    summary: "A practical option for knocking back brush, saplings, undergrowth, and wooded edges.",
    description:
      "Forestry mulching can be a good fit for overgrown acreage, trails, fence lines, hunting property, lake lots, and other land where vegetation needs to be brought back under control.",
    image: stockImages.forestryMulching.src,
    requests: ["Undergrowth removal", "Trail opening", "Fence-line clearing", "Hunting property access", "Wooded-edge cleanup"],
    related: ["land-clearing", "brush-clearing", "rural-property-prep"],
    faqs: [
      { q: "Is forestry mulching the same as full land clearing?", a: "Not always. Mulching is often used for vegetation and smaller growth, while full clearing may involve heavier removal, hauling, grading, or site preparation." },
      { q: "Can I request forestry mulching for hunting land?", a: "Yes. Hunting property, trails, access lanes, and overgrown acreage are common reasons people submit a request." },
      { q: "What should I include in the request?", a: "Send the property area, a rough size, what is growing there, what you want the land used for, and how soon you want to start." },
    ],
  },
  {
    slug: "brush-clearing",
    title: "Brush Clearing & Overgrowth Removal in Arkansas",
    shortTitle: "Brush Clearing",
    summary: "Open up property edges, lots, fields, trails, and areas that have grown in.",
    description:
      "Brush clearing can cover thick weeds, vines, saplings, briars, overgrown fence lines, trail edges, neglected lots, and rural property that needs to be made usable again.",
    image: stockImages.brushClearing.src,
    requests: ["Briar and vine removal", "Fence-line cleanup", "Field-edge clearing", "Trail clearing", "Overgrown yard or lot cleanup"],
    related: ["land-clearing", "forestry-mulching", "cleanup"],
    faqs: [
      { q: "Can brush clearing be requested without full land clearing?", a: "Yes. Many jobs only need overgrowth cut back or access reopened rather than the property fully cleared." },
      { q: "Can I request brush clearing around a cabin or lake property?", a: "Yes. Cabin, lake-lot, driveway-edge, and rural residential requests are welcome." },
      { q: "Will the request include hauling?", a: "Tell us whether material needs to stay on site, be piled, mulched, or hauled. That helps route the job correctly." },
    ],
  },
  {
    slug: "lot-clearing",
    title: "Lot Clearing for Homes, Cabins & Rural Property",
    shortTitle: "Lot Clearing",
    summary: "Get a residential, cabin, or rural lot ready for the next use.",
    description:
      "Lot clearing can help when a property needs brush, small trees, debris, or overgrowth removed before a build, sale, driveway project, cleanup, or general property improvement.",
    image: stockImages.lotClearing.src,
    requests: ["Residential lots", "Cabin lots", "Lake lots", "Future homesites", "Property-sale cleanup"],
    related: ["land-clearing", "site-prep", "cleanup", "grading-leveling"],
    faqs: [
      { q: "Can I request lot clearing before a home or cabin project?", a: "Yes. Tell us what the property is being prepared for so the request can be routed with the right context." },
      { q: "Can debris removal be included?", a: "Yes. Mention any old material, storm debris, brush piles, or haul-off needs in the project notes." },
      { q: "Do you accept small lot requests?", a: "Yes. The form can be used for small residential lots as well as larger rural property." },
    ],
  },
  {
    slug: "dirt-work",
    title: "Dirt Work & Small Excavation in Arkansas",
    shortTitle: "Dirt Work",
    summary: "For rough grading, drainage cuts, driveway work, pads, access, and practical earthwork.",
    description:
      "Dirt work can include rough grading, washouts, driveway shaping, ditches, culvert areas, small excavation, property access, and other projects where moving or shaping soil is part of the job.",
    image: stockImages.dirtWork.src,
    requests: ["Rough grading", "Small excavation", "Driveway shaping", "Ditch work", "Pad and access preparation"],
    related: ["grading-leveling", "driveway-repair", "culvert-installation", "drainage-erosion"],
    faqs: [
      { q: "What counts as dirt work?", a: "The category can include rough grading, small excavation, driveway shaping, ditches, washout repair, pad work, and similar earth-moving jobs." },
      { q: "Can I request dirt or rock to be brought in?", a: "Yes. Mention any material needs in the request so the provider can account for hauling and material costs." },
      { q: "Should I send measurements?", a: "Approximate length, width, slope, or area is useful, but you can still start a request without exact measurements." },
    ],
  },
  {
    slug: "grading-leveling",
    title: "Grading & Leveling in Arkansas",
    shortTitle: "Grading & Leveling",
    summary: "Shape rough ground, improve runoff, prepare access, or get an area closer to usable grade.",
    description:
      "Grading and leveling can help with rough property areas, driveways, building approaches, drainage corrections, low spots, and other projects where slope and surface shape matter.",
    image: stockImages.grading.src,
    requests: ["Rough leveling", "Slope correction", "Driveway grading", "Low-spot correction", "Pad preparation"],
    related: ["dirt-work", "drainage-erosion", "driveway-repair", "site-prep"],
    faqs: [
      { q: "Can grading help with drainage?", a: "Sometimes. Grade and drainage are closely related, but the right solution depends on where water enters, where it needs to go, soil conditions, and the surrounding property." },
      { q: "Can I request leveling for a mobile-home or building area?", a: "Yes. Include the approximate footprint, current ground condition, and whether fill or rock may be needed." },
      { q: "Do I need a survey before submitting?", a: "Not to submit a request. Some projects may later require professional layout, engineering, or permits depending on the scope." },
    ],
  },
  {
    slug: "driveway-repair",
    title: "Gravel Driveway Repair & Washout Help in Arkansas",
    shortTitle: "Driveway Repair",
    summary: "Fix rough spots, washouts, ruts, soft areas, drainage trouble, and gravel access problems.",
    description:
      "Driveway work can include regrading, smoothing, washout repair, ditch cleanup, low spots, gravel refresh, entrance work, and drainage-related problems on rural Arkansas property.",
    image: stockImages.drivewayRepair.src,
    requests: ["Washout repair", "Ruts and potholes", "Regrading", "Drainage along driveways", "Gravel refresh"],
    related: ["gravel-driveways", "dirt-work", "culvert-installation", "drainage-erosion"],
    faqs: [
      { q: "Can I request help for a washed-out gravel driveway?", a: "Yes. Include photos after rain if possible and describe where water crosses or runs alongside the driveway." },
      { q: "Can rock be added as part of the job?", a: "That can be included in a request. Material type, quantity, delivery access, and local pricing will affect the estimate." },
      { q: "What if the driveway problem is really drainage?", a: "That is common. Describe the water path and the provider can determine whether grading, ditch work, a culvert, or another drainage correction should be considered." },
    ],
  },
  {
    slug: "gravel-driveways",
    title: "Gravel Driveway Work in Arkansas",
    shortTitle: "Gravel Driveways",
    summary: "New gravel access, resurfacing, spreading, shaping, and rural driveway improvements.",
    description:
      "Get help with gravel driveways for existing access roads, cabin drives, rural homes, property entrances, parking areas, and other places that need stone placed and shaped for practical access.",
    image: stockImages.gravelDriveways.src,
    requests: ["Gravel refresh", "New rural access", "Driveway shaping", "Parking areas", "Cabin and lake-property drives"],
    related: ["driveway-repair", "grading-leveling", "culvert-installation", "hauling"],
    faqs: [
      { q: "Can I request both gravel and grading?", a: "Yes. Most gravel-driveway requests should explain the current surface, drainage issues, desired finish, and whether material needs to be delivered." },
      { q: "Do I need to choose a gravel size first?", a: "No. You can describe how the driveway is used and the provider can discuss suitable material options." },
      { q: "Can rural access roads be submitted?", a: "Yes. Include approximate length, width, slope, and any soft or washed-out areas." },
    ],
  },
  {
    slug: "culvert-installation",
    title: "Culvert Installation & Replacement in Arkansas",
    shortTitle: "Culvert Work",
    summary: "For driveway entrances, drainage crossings, washed areas, and water moving under access routes.",
    description:
      "Culvert work can include installation, replacement, resets, ditch tie-ins, entrance drainage, and the grading needed around rural driveways and property access.",
    image: stockImages.culvert.src,
    requests: ["New culvert installation", "Culvert replacement", "Driveway entrance drainage", "Ditch tie-ins", "Washout repair around culverts"],
    related: ["drainage-erosion", "driveway-repair", "dirt-work"],
    faqs: [
      { q: "Can I request a new driveway culvert?", a: "Yes. Include the road or property location and describe where water normally flows." },
      { q: "Do culverts require permits?", a: "Requirements vary by road, county, city, drainage authority, and project. The contractor or property owner should verify any permit or right-of-way requirements before work begins." },
      { q: "Can grading around the culvert be included?", a: "Yes. Culvert work often involves ditch shaping, entrance grading, fill, rock, or washout repair." },
    ],
  },
  {
    slug: "drainage-erosion",
    title: "Drainage & Erosion Control in Arkansas",
    shortTitle: "Drainage & Erosion",
    summary: "Get help with runoff, standing water, washouts, ditches, slopes, and water moving where it should not.",
    description:
      "Drainage and erosion work can address standing water, driveway washouts, ditch problems, slope erosion, runoff near buildings, soft access areas, culverts, and other water-related property issues.",
    image: stockImages.drainage.src,
    requests: ["Runoff correction", "Standing-water problems", "Ditch shaping", "Erosion repair", "Driveway drainage"],
    related: ["culvert-installation", "grading-leveling", "driveway-repair", "retaining-walls"],
    faqs: [
      { q: "Can I submit a drainage request after a storm?", a: "Yes. Photos taken while water is flowing or shortly after rain can be especially useful for understanding the problem." },
      { q: "Can drainage work include grading?", a: "Yes. Many drainage problems involve grade, ditches, culverts, surface shaping, rock, or erosion protection." },
      { q: "Can you guarantee a drainage fix from photos?", a: "No. Photos help start the conversation, but many drainage problems need an on-site look before a responsible solution can be proposed." },
    ],
  },
  {
    slug: "tree-work",
    title: "Tree & Brush Work in Arkansas",
    shortTitle: "Tree & Brush Work",
    summary: "For brush, small-tree clearing, limbs, storm debris, property edges, and access cleanup.",
    description:
      "Tree and brush work can help with land management, cleanup, access, storm recovery, and rural property improvement.",
    image: stockImages.treeWork.src,
    requests: ["Small-tree clearing", "Limb cleanup", "Storm debris", "Wooded-edge cleanup", "Access clearing"],
    related: ["brush-clearing", "storm-cleanup", "land-clearing", "cleanup"],
    faqs: [
      { q: "Can I request hazardous tree removal?", a: "You can describe the job, but dangerous trees near structures, power lines, or tight hazards should only be handled by a properly equipped and insured tree professional." },
      { q: "Can brush and tree cleanup be combined?", a: "Yes. Many rural-property requests involve a mix of limbs, small trees, brush, and debris." },
      { q: "Can I submit storm-damaged tree work?", a: "Yes. Mention whether access is blocked or structures/utilities are involved so the request can be treated appropriately." },
    ],
  },
  {
    slug: "storm-cleanup",
    title: "Storm Cleanup & Property Debris Removal in Arkansas",
    shortTitle: "Storm Cleanup",
    summary: "Clean up limbs, brush, scattered debris, blocked access, and rough property areas after bad weather.",
    description:
      "Storm cleanup can include downed limbs, brush piles, access cleanup, scattered debris, rural property mess, and hauling after Arkansas weather moves through.",
    image: stockImages.stormCleanup.src,
    requests: ["Limb and brush cleanup", "Blocked-access cleanup", "Storm debris hauling", "Property cleanup after wind", "Rural cleanup"],
    related: ["tree-work", "cleanup", "hauling"],
    faqs: [
      { q: "Can I request storm cleanup even if I am not at the property?", a: "Yes. Give the property location, your contact information, and any photos or information you have." },
      { q: "Can storm debris be hauled away?", a: "Include haul-off needs in the request. Disposal and travel may affect the estimate." },
      { q: "What if power lines are involved?", a: "Stay clear and contact the utility or emergency services as appropriate. Do not approach or move material near downed or damaged power lines." },
    ],
  },
  {
    slug: "cleanup",
    title: "Property Cleanup & Land Cleanup in Arkansas",
    shortTitle: "Property Cleanup",
    summary: "For neglected lots, brush piles, debris, old material, rural cleanup, and properties that need to be brought back under control.",
    description:
      "Property cleanup can combine brush, debris, hauling, light tear-out, old material, storm mess, rental or cabin cleanup, and general outdoor property work.",
    image: stockImages.cleanup.src,
    requests: ["Rural property cleanup", "Brush piles", "Old materials", "Cabin and rental exterior cleanup", "Neglected lots"],
    related: ["hauling", "brush-clearing", "storm-cleanup", "light-demolition"],
    faqs: [
      { q: "Can one request include several cleanup needs?", a: "Yes. Describe the whole property issue instead of trying to split it into separate jobs." },
      { q: "Can cleanup include hauling?", a: "Yes. Mention what needs removed and, if possible, include photos showing the volume." },
      { q: "Can inherited or vacant properties be submitted?", a: "Yes. Property owners, families, landlords, real-estate professionals, and managers can use the request form." },
    ],
  },
  {
    slug: "hauling",
    title: "Debris & Material Hauling in Arkansas",
    shortTitle: "Hauling",
    summary: "Move debris, brush, rock, gravel, old material, and project loads tied to property work.",
    description:
      "Hauling can be handled on its own or as part of land clearing, cleanup, driveway, dirt, drainage, and property-improvement work.",
    image: stockImages.hauling.src,
    requests: ["Debris haul-off", "Brush hauling", "Material delivery", "Rock and gravel hauling", "Jobsite cleanup"],
    related: ["cleanup", "gravel-driveways", "land-clearing", "dirt-work"],
    faqs: [
      { q: "Can I request rock or gravel delivery?", a: "Yes. Include the delivery location, approximate quantity if known, and what the material will be used for." },
      { q: "Can hauling be part of another land job?", a: "Yes. Many clearing, cleanup, driveway, and dirt-work projects need material hauled in or debris hauled out." },
      { q: "Do dump fees affect pricing?", a: "They can. Disposal type, load size, travel distance, and local facility fees are common cost factors." },
    ],
  },
  {
    slug: "rural-property-prep",
    title: "Rural Property Preparation in Arkansas",
    shortTitle: "Rural Property Prep",
    summary: "Coordinate clearing, access, cleanup, grading, and practical site work before the next use.",
    description:
      "Rural property prep can combine clearing, access work, cleanup, rough grading, drainage attention, or other practical preparation.",
    image: stockImages.ruralPropertyPrep.src,
    requests: ["Cabin-property preparation", "Hunting land access", "Rural homesite cleanup", "Acreage access", "Mixed-scope property work"],
    related: ["land-clearing", "site-prep", "dirt-work", "cleanup"],
    faqs: [
      { q: "What if my project needs several different services?", a: "That is exactly what this category is for. Describe the end goal and the visible problems instead of trying to diagnose every service yourself." },
      { q: "Can I submit remote or lake property?", a: "Yes. Include access details, the closest town, and whether the property is occupied." },
      { q: "Can this include driveway and drainage work?", a: "Yes. Access and drainage are often part of preparing rural property for regular use." },
    ],
  },
  {
    slug: "retaining-walls",
    title: "Retaining Walls & Slope Work in Arkansas",
    shortTitle: "Retaining Walls",
    summary: "For slopes, grade changes, erosion trouble, rock work, and property areas that need support.",
    description:
      "Retaining-wall and slope work can involve slope support, grade transitions, erosion trouble, rock placement, drainage around walls, and outdoor areas on uneven Arkansas property.",
    image: stockImages.retaining.src,
    requests: ["Slope support", "Retaining walls", "Rock work", "Grade transitions", "Drainage around retaining areas"],
    related: ["drainage-erosion", "grading-leveling", "outdoor-builds"],
    faqs: [
      { q: "Does a retaining wall need drainage?", a: "Proper drainage is an important part of many retaining-wall systems. The final design depends on wall height, soil, slope, water, and local requirements." },
      { q: "Can rock work be requested with a retaining wall?", a: "Yes. Describe the desired function and appearance in the project notes." },
      { q: "Do larger walls require engineering or permits?", a: "They may. Requirements vary by location and project. The property owner and contractor should verify applicable codes, permits, and engineering needs." },
    ],
  },
  {
    slug: "site-prep",
    title: "Site Preparation Across Arkansas",
    shortTitle: "Site Preparation",
    summary: "Start a project with clearing, rough grade, access, drainage, and a cleaner working area.",
    description:
      "Site preparation can cover clearing, rough grading, access, debris removal, initial drainage work, and other early property tasks before a home, shop, cabin, driveway, or outdoor project.",
    image: stockImages.sitePrep.src,
    requests: ["Homesite preparation", "Cabin-site preparation", "Shop-site cleanup", "Access preparation", "Pre-construction clearing"],
    related: ["land-clearing", "grading-leveling", "dirt-work", "drainage-erosion"],
    faqs: [
      { q: "Can I request site prep before I have a final builder?", a: "Yes. Explain the project stage and what needs to happen first. Some work may need to wait for plans, layout, permits, or builder requirements." },
      { q: "Can site prep include clearing and grading?", a: "Yes. Those are common parts of early site work." },
      { q: "Should utilities be marked first?", a: "Before excavation or digging begins, underground utilities should be located through the appropriate service and any private utilities should also be identified." },
    ],
  },
  {
    slug: "light-demolition",
    title: "Light Demolition & Tear-Out in Arkansas",
    shortTitle: "Light Demolition",
    summary: "Small structures, sheds, decks, fencing, and outdoor tear-out tied to property cleanup.",
    description:
      "Light demolition can include small sheds, damaged outdoor structures, old fencing, small decks, and tear-out where cleanup and haul-off are part of the project.",
    image: stockImages.lightDemolition.src,
    requests: ["Small shed removal", "Fence tear-out", "Small deck removal", "Outdoor structure cleanup", "Demolition debris hauling"],
    related: ["cleanup", "hauling", "rural-property-prep"],
    faqs: [
      { q: "What does light demolition mean here?", a: "The category is intended for smaller property tear-out and cleanup rather than major structural demolition." },
      { q: "Can debris removal be included?", a: "Yes. Include photos and describe access so haul-off needs can be considered." },
      { q: "What about utilities or hazardous materials?", a: "Those require extra care and may need specialists, permits, or testing. Include any known concerns in the request." },
    ],
  },
  {
    slug: "airbnb",
    title: "Cabin & Short-Term Rental Exterior Work",
    shortTitle: "Cabin & Rental Property",
    summary: "Exterior cleanup, access, drainage, brush, hauling, and practical property work for rentals and cabins.",
    description:
      "Cabin and short-term-rental owners can get exterior property help with access, cleanup, drainage, brush, storm debris, driveway issues, and related outdoor work.",
    image: stockImages.cabinProperty.src,
    requests: ["Exterior cleanup", "Driveway and access issues", "Storm cleanup", "Brush work", "Drainage concerns"],
    related: ["cleanup", "driveway-repair", "drainage-erosion", "tree-work"],
    faqs: [
      { q: "Can an out-of-town owner submit a request?", a: "Yes. Include the property address or area, your contact information, and any photos you have." },
      { q: "Can I request several exterior tasks at once?", a: "Yes. Describe the property as a whole and what needs attention." },
      { q: "Do you handle interior turnover cleaning?", a: "Arkansas Land Pros focuses on land and exterior property work. Interior turnover cleaning is not one of the main services handled through this request system." },
    ],
  },
  {
    slug: "water-features",
    title: "Pond, Water Feature & Property Water Work",
    shortTitle: "Pond & Water Features",
    summary: "For property projects involving ponds, rock, water movement, and outdoor water features.",
    description:
      "Property work can include small ponds, outdoor water features, rock placement, drainage-aware water projects, and related site work.",
    image: stockImages.waterFeatures.src,
    requests: ["Small pond concepts", "Outdoor water features", "Rock placement", "Water-flow improvements", "Site preparation around water features"],
    related: ["drainage-erosion", "retaining-walls", "dirt-work"],
    faqs: [
      { q: "Can I submit a pond request?", a: "Yes. Describe the property, intended use, approximate area, access, and any known drainage or soil concerns." },
      { q: "Are permits sometimes required?", a: "Yes. Water-related excavation can be subject to local, state, federal, drainage, or environmental requirements depending on the project." },
      { q: "Can rock and grading be part of the request?", a: "Yes. Include the full project goal so related work can be considered together." },
    ],
  },
  {
    slug: "outdoor-builds",
    title: "Outdoor Property Projects in Arkansas",
    shortTitle: "Outdoor Property Projects",
    summary: "For practical outdoor builds tied to land, access, grade, rock, steps, and rural property use.",
    description:
      "Outdoor property projects may combine grade, rock, steps, small gathering areas, access improvements, or other land-related outdoor projects.",
    image: stockImages.outdoorBuilds.src,
    requests: ["Outdoor steps", "Rock features", "Property access improvements", "Small gathering areas", "Terrain-based outdoor work"],
    related: ["retaining-walls", "rural-property-prep", "grading-leveling"],
    faqs: [
      { q: "Can I submit an outdoor project that does not fit another category?", a: "Yes. Explain the end result you want and the property conditions." },
      { q: "Can drainage be considered with an outdoor project?", a: "Yes. Water flow and grade should be considered when they affect the project area." },
      { q: "Can I send sketches or photos later?", a: "Yes. Start with the basics and include that supporting images or sketches are available." },
    ],
  },
  {
    slug: "general",
    title: "General Land & Property Work",
    shortTitle: "General Property Work",
    summary: "For the Arkansas property job that does not fit neatly into one service label.",
    description:
      "For mixed rural-property jobs, help may include cleanup, dirt, access, brush, hauling, repairs, drainage, or other practical outdoor needs.",
    image: stockImages.generalProperty.src,
    requests: ["Mixed-scope rural work", "Access improvement", "Cleanup plus dirt work", "Property problem solving", "Small equipment work"],
    related: ["rural-property-prep", "dirt-work", "cleanup", "hauling"],
    faqs: [
      { q: "What if I am not sure which service I need?", a: "Use General Property Work and describe the problem in plain language. The request can be sorted after it is reviewed." },
      { q: "Can multiple problems go in one request?", a: "Yes. That is often more useful than splitting one property project into several forms." },
      { q: "Can I request work outside the listed towns?", a: "Yes. Arkansas Land Pros accepts requests from anywhere in Arkansas." },
    ],
  },
  {
    slug: "welding",
    title: "Property Welding & Fabrication in Arkansas",
    shortTitle: "Property Welding",
    summary: "For gates, brackets, repairs, and property-related metal work.",
    description:
      "Property-related welding and fabrication can help when metal repair, gates, brackets, small fabrication, or similar work is part of a land or outdoor property project.",
    image: stockImages.welding.src,
    requests: ["Gate repair", "Property brackets", "Small fabrication", "Outdoor metal repair", "Project support welding"],
    related: ["general", "outdoor-builds", "rural-property-prep"],
    faqs: [
      { q: "Can I submit a small welding repair?", a: "Yes. Add photos and dimensions when possible." },
      { q: "Is automotive welding the focus?", a: "No. This page is intended for property, gate, outdoor, and land-project related welding requests." },
      { q: "Can welding be part of a larger property request?", a: "Yes. Mention the other work so the whole job can be reviewed together." },
    ],
  },
];

export const serviceBySlug = new Map(services.map((service) => [service.slug, service]));

export const coreServiceSlugs = [
  "land-clearing",
  "forestry-mulching",
  "brush-clearing",
  "dirt-work",
  "grading-leveling",
  "driveway-repair",
  "culvert-installation",
  "drainage-erosion",
  "cleanup",
  "hauling",
  "site-prep",
] as const;
