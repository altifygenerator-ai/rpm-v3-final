export type Region = {
  slug: string;
  name: string;
  summary: string;
  areaSlugs: string[];
  focus: string;
};

export const regions: Region[] = [
  {
    slug: "southwest-arkansas",
    name: "Southwest Arkansas",
    summary: "Coverage centered on Amity, Glenwood, Arkadelphia, Malvern, Murfreesboro, and nearby rural property across Southwest Arkansas.",
    areaSlugs: ["amity", "glenwood", "arkadelphia", "malvern", "bismarck", "kirby", "bonnerdale", "caddo-valley", "murfreesboro", "gurdon"],
    focus: "Land clearing, dirt work, gravel access, brush, drainage, cleanup, hauling, and practical rural-property work.",
  },
  {
    slug: "hot-springs-area",
    name: "Hot Springs & Garland County Area",
    summary: "Wooded lots, lake property, rural edges, driveway problems, drainage, cleanup, and site work around Hot Springs and Garland County.",
    areaSlugs: ["hot-springs", "hot-springs-village", "lake-hamilton", "royal", "pearcy", "mountain-pine"],
    focus: "Land clearing, grading, drainage, driveways, brush, storm cleanup, hauling, and property preparation.",
  },
  {
    slug: "ouachita-mountains",
    name: "Ouachita Mountains",
    summary: "Mountain and rural-property coverage focused on Mount Ida, Norman, Mena, and the surrounding western Arkansas terrain.",
    areaSlugs: ["mount-ida", "norman", "mena"],
    focus: "Wooded-property clearing, forestry mulching, gravel access, drainage, brush control, and rural site preparation.",
  },
  {
    slug: "greers-ferry-lake",
    name: "Greers Ferry Lake",
    summary: "Greers Ferry, Heber Springs, Fairfield Bay, Clinton, Quitman, and nearby lake communities with wooded, sloped, and rural property needs.",
    areaSlugs: ["greers-ferry", "heber-springs", "fairfield-bay", "clinton", "quitman"],
    focus: "Land clearing, drainage, retaining walls, driveways, brush, storm cleanup, hauling, and lake-area property work.",
  },
  {
    slug: "central-arkansas",
    name: "Central Arkansas",
    summary: "Coverage around larger Central Arkansas communities and the rural property surrounding them.",
    areaSlugs: ["benton", "bryant", "little-rock", "conway", "russellville", "searcy", "mountain-view", "sheridan"],
    focus: "Lot clearing, site preparation, grading, drainage, driveways, rural cleanup, hauling, and land-service requests.",
  },
];

export const regionBySlug = new Map(regions.map((region) => [region.slug, region]));
