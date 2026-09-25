export type GuideSection = {
  heading: string;
  body: string[];
};

export type Guide = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  sections: GuideSection[];
};

export const guides: Guide[] = [
  {
    slug: "planning-land-clearing-arkansas",
    title: "Planning a Land-Clearing Project in Arkansas",
    description: "What to gather before asking for a land-clearing quote: access, acreage, vegetation, end use, debris plans, utilities, and property conditions.",
    eyebrow: "Land Clearing Guide",
    sections: [
      { heading: "Start with the end use", body: ["A contractor can quote more responsibly when they know what the property needs to become. Clearing for a driveway, pasture edge, future homesite, hunting access, fence line, and simple cleanup can all call for different equipment and finish work.", "Before asking for a quote, write down what must be usable when the job is done. That keeps the conversation focused on the result instead of only the amount of vegetation on the ground."] },
      { heading: "Access matters as much as acreage", body: ["A small project with tight access can be more complicated than a larger open tract. Gates, narrow driveways, soft ground, steep approaches, overhead limbs, bridges, and turnaround space can affect what equipment can reach the work area.", "Include photos of the entrance and route into the property, not just close-ups of the brush."] },
      { heading: "Know what should happen to the material", body: ["Cleared material may be mulched, piled, chipped, burned where lawful and appropriate, or hauled. The best option depends on the property, local rules, vegetation, access, and what you want the site to look like afterward.", "Tell the provider whether you want a rough working finish or a cleaner area ready for the next phase."] },
      { heading: "Utilities and boundaries should be clear", body: ["Before digging or excavation, underground utilities should be located through the appropriate service, and private utilities should also be identified. Property boundaries, easements, septic systems, wells, and buried lines can change how the work should be approached.", "When boundaries are uncertain, do not rely on a guess from a map screenshot for final clearing limits."] },
    ],
  },
  {
    slug: "forestry-mulching-vs-land-clearing",
    title: "Forestry Mulching vs. Full Land Clearing",
    description: "A practical Arkansas property-owner guide to deciding whether vegetation can be mulched in place or whether the project needs heavier clearing and site work.",
    eyebrow: "Clearing Options",
    sections: [
      { heading: "Forestry mulching is usually about vegetation control", body: ["Mulching can be a strong fit when the main problem is brush, saplings, undergrowth, trail growth, fence lines, or wooded edges. It processes vegetation near ground level and can leave organic material behind.", "That can reduce hauling, but it does not automatically create a construction-ready site or remove every stump and root system."] },
      { heading: "Full clearing is broader", body: ["A full clearing project may include tree or stump removal, debris handling, rough grading, access work, and preparation for another use. Homesites, roads, pads, utilities, and major grade changes often need more than vegetation mulching.", "The right scope depends on what has to happen after the clearing crew leaves."] },
      { heading: "Terrain and access change the answer", body: ["Rock, slope, wet ground, soft access, dense timber, utilities, nearby structures, and limited equipment room can all affect the method. Arkansas properties vary heavily even within the same county.", "Photos and a site walk are often more useful than trying to choose a service label first."] },
    ],
  },
  {
    slug: "gravel-driveway-washout-arkansas",
    title: "What to Look At Before Fixing a Washed-Out Gravel Driveway",
    description: "Why repeated washouts are often a water problem first, and what Arkansas property owners should document before asking for driveway repair.",
    eyebrow: "Driveway & Drainage",
    sections: [
      { heading: "Find where the water comes from", body: ["Adding rock can improve the surface, but repeated washouts usually deserve a look at water movement. Watch where runoff enters the driveway, whether it crosses the surface, and where it leaves.", "Photos during or just after heavy rain can show more than dry-weather pictures."] },
      { heading: "Look at ditches, crowns, and culverts together", body: ["A gravel drive works as a small drainage system. Ditches, cross-drainage, the driveway crown, low spots, culverts, and outlet areas all affect whether water stays controlled or starts moving gravel.", "A useful project description should cover the whole problem, not only the deepest rut."] },
      { heading: "Material cannot compensate for bad water flow forever", body: ["Different stone sizes and base materials have different uses, but no gravel choice fixes every drainage issue. If water is concentrated in the wrong place, the repair may need shaping, ditch work, culvert work, or another correction before finish rock is added.", "That is why it helps to describe the drainage problem as well as the driveway surface."] },
    ],
  },
  {
    slug: "drainage-culvert-property-checklist",
    title: "Drainage & Culvert Checklist for Rural Arkansas Property",
    description: "A simple way to document standing water, runoff, ditches, culverts, soft access, and erosion before reaching out for help.",
    eyebrow: "Water Management",
    sections: [
      { heading: "Document the problem when the ground is wet", body: ["Water problems can disappear visually after a few dry days. Take photos or video during rain, shortly after rain, and again after the water has had time to drain.", "Mark where water enters, where it ponds, and where you believe it should go."] },
      { heading: "Check the outlet, not just the inlet", body: ["A ditch or culvert cannot work well if the outlet is buried, blocked, too high, eroded, or sending water into another problem area. The downstream path matters.", "Include both sides of a driveway crossing or culvert when you send project photos."] },
      { heading: "Keep structures and utilities in the conversation", body: ["Drainage near homes, shops, septic systems, retaining walls, roads, or buried utilities can require more careful planning. Some work may need permits, engineering, or coordination with a road authority.", "Photos and project notes are a starting point, not a substitute for an on-site evaluation when the stakes are high."] },
    ],
  },
  {
    slug: "preparing-rural-property-for-homesite",
    title: "Preparing Rural Arkansas Property for a Future Homesite",
    description: "How clearing, access, drainage, rough grading, utilities, and builder requirements fit together before heavy site work begins.",
    eyebrow: "Site Preparation",
    sections: [
      { heading: "Do not clear blindly before the layout is understood", body: ["It is easy to remove too much before a house, shop, driveway, septic area, utilities, and drainage plan are coordinated. The best early work keeps options open instead of forcing later corrections.", "If plans are still changing, consider starting with access and selective clearing rather than stripping the whole site."] },
      { heading: "Reliable access comes early", body: ["Builders, utility crews, concrete trucks, material deliveries, and equipment all need a way in. Driveway location, culvert needs, slope, soft ground, and turning room can become major schedule issues if they are ignored.", "Document the entrance and the proposed route from the public road to the future work area."] },
      { heading: "Drainage should be planned before finish work", body: ["Temporary construction access and final drainage are not always the same thing, but early grading should avoid creating obvious water traps or sending runoff toward future structures.", "Final site design may require the builder, surveyor, engineer, septic professional, or local authority depending on the project."] },
    ],
  },
  {
    slug: "hunting-property-brush-access",
    title: "Clearing Trails, Brush & Access on Hunting Property",
    description: "A landowner-focused guide to trail access, brush control, fence lines, staging areas, and keeping the work tied to how the property will actually be used.",
    eyebrow: "Rural & Hunting Land",
    sections: [
      { heading: "Start with access routes and use areas", body: ["Instead of treating the whole property the same, identify the roads, trails, fence lines, stand access, staging areas, and overgrown edges that matter most. That can keep the project focused.", "Aerial maps are useful for orientation, but ground photos help show brush density, slope, wet areas, and actual equipment access."] },
      { heading: "Decide how open you really want it", body: ["Hunting-property work is not always about making everything look like a lawn. Some owners want travel corridors opened while keeping cover and screening elsewhere.", "Describe the practical goal so the clearing method and finish are not overbuilt for the property."] },
      { heading: "Plan around season, weather, and ground conditions", body: ["Wet ground can limit equipment access and create unnecessary rutting. Heavy vegetation is also easier to evaluate at some times of year than others.", "If timing is flexible, mention it when you reach out. It can help the provider plan around conditions instead of forcing the job into a bad weather window."] },
    ],
  },
];

export const guideBySlug = new Map(guides.map((guide) => [guide.slug, guide]));
