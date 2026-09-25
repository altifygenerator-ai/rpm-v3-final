export type LocalLanding = {
  area: string;
  service: string;
  angle: string;
};

export const localLandings: LocalLanding[] = [
  { area: "hot-springs", service: "land-clearing", angle: "Wooded lots, rural edges, lake-area property, future build sites, and overgrown ground around the Hot Springs market." },
  { area: "hot-springs", service: "drainage-erosion", angle: "Runoff, sloped lots, driveway washouts, standing water, ditches, and storm-related erosion around Hot Springs property." },
  { area: "hot-springs", service: "grading-leveling", angle: "Rough property areas, driveway shaping, low spots, access, and practical grade correction around Hot Springs." },
  { area: "hot-springs", service: "driveway-repair", angle: "Gravel access, ruts, washouts, drainage trouble, and driveway regrading for homes, cabins, and rural property." },
  { area: "glenwood", service: "land-clearing", angle: "Rural acreage, wooded edges, future homesites, access paths, and neglected ground around Glenwood." },
  { area: "glenwood", service: "dirt-work", angle: "Driveways, ditches, washouts, rough grading, property access, and small excavation around Glenwood." },
  { area: "glenwood", service: "brush-clearing", angle: "Briars, saplings, fence lines, field edges, trails, and overgrown property around Glenwood." },
  { area: "arkadelphia", service: "land-clearing", angle: "Residential lots, rural acreage, access, homesites, and overgrown property in and around Arkadelphia." },
  { area: "arkadelphia", service: "drainage-erosion", angle: "Ditch issues, runoff, driveway washouts, standing water, and erosion around Arkadelphia property." },
  { area: "arkadelphia", service: "driveway-repair", angle: "Gravel driveways, ruts, washouts, low spots, drainage, and access improvements around Arkadelphia." },
  { area: "mount-ida", service: "land-clearing", angle: "Wooded acreage, cabin property, rural access, trails, and future-use land around Mount Ida." },
  { area: "mount-ida", service: "forestry-mulching", angle: "Brush, saplings, undergrowth, wooded edges, and access clearing in the Mount Ida and Ouachita area." },
  { area: "mount-ida", service: "gravel-driveways", angle: "Rural drives, cabin access, steep or rough approaches, resurfacing, and gravel placement around Mount Ida." },
  { area: "greers-ferry", service: "land-clearing", angle: "Lake lots, rural acreage, build sites, trails, and overgrown property in the established Greers Ferry search market." },
  { area: "greers-ferry", service: "drainage-erosion", angle: "Sloped lots, runoff, driveway washouts, ditches, erosion, and water problems around Greers Ferry Lake." },
  { area: "greers-ferry", service: "retaining-walls", angle: "Slope support, grade transitions, rock work, and drainage-aware retaining projects on uneven lake-area property." },
  { area: "greers-ferry", service: "cleanup", angle: "Storm debris, brush piles, lake-lot cleanup, cabin exterior cleanup, and general property cleanup." },
  { area: "heber-springs", service: "land-clearing", angle: "Wooded lots, rural property, access, brush, and site preparation around Heber Springs." },
  { area: "heber-springs", service: "forestry-mulching", angle: "Undergrowth, trail access, fence lines, wooded edges, and overgrown acreage near Heber Springs." },
  { area: "heber-springs", service: "drainage-erosion", angle: "Runoff, slopes, washouts, driveway drainage, and erosion around lake-area and rural property." },
  { area: "hot-springs-village", service: "land-clearing", angle: "Wooded lots, overgrowth, access, storm debris, and property preparation inside the Village area." },
  { area: "hot-springs-village", service: "drainage-erosion", angle: "Sloped property, runoff, driveway water, ditches, erosion, and storm-related drainage concerns." },
  { area: "murfreesboro", service: "land-clearing", angle: "Rural acreage, future-use property, lots, access, and wooded ground around Murfreesboro." },
  { area: "murfreesboro", service: "brush-clearing", angle: "Briars, saplings, overgrown edges, fields, trails, and rural property around Murfreesboro." },
  { area: "malvern", service: "dirt-work", angle: "Driveways, grading, ditches, rough property areas, washouts, and practical earthwork around Malvern." },
  { area: "malvern", service: "driveway-repair", angle: "Gravel drives, ruts, low spots, washouts, drainage, and access work around Malvern." },
  { area: "amity", service: "land-clearing", angle: "Rural acreage, lots, wooded edges, access routes, and overgrown property around Amity." },
  { area: "amity", service: "dirt-work", angle: "Driveway shaping, drainage cuts, rough grading, washouts, and small dirt-work projects around Amity." },
];

export const localLandingKey = (area: string, service: string) =>
  `${area}::${service}`;

export const localLandingMap = new Map(
  localLandings.map((landing) => [
    localLandingKey(landing.area, landing.service),
    landing,
  ])
);
