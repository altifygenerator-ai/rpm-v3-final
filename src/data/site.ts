export const siteData = {
  name: "Arkansas Land Pros",
  shortName: "ALP",
  tagline: "Land clearing, dirt work, drainage & more across Arkansas.",
  description:
    "Arkansas Land Pros helps Arkansas property owners connect with land-service professionals for clearing, dirt work, grading, drainage, driveways, cleanup, hauling, and more.",
  coverageLine:
    "Serving property owners across Arkansas, with detailed coverage around Southwest Arkansas, Hot Springs, the Ouachitas, Greers Ferry Lake, and Central Arkansas.",
  disclosure:
    "Arkansas Land Pros helps property owners connect with independent service providers. Project details may be shared with a provider that may be able to help. The contractor performing the work is responsible for estimates, licensing, insurance, permits, scheduling, and completed work.",
  primaryServices: [
    "Land clearing",
    "Forestry mulching",
    "Dirt work",
    "Grading",
    "Drainage",
    "Driveway work",
    "Culverts",
    "Brush clearing",
    "Property cleanup",
    "Hauling",
  ],
} as const;

export const leadDestinationEmail =
  process.env.LEAD_TO_EMAIL || "reddirtpropertyservicesar@gmail.com";

export const resendFrom =
  process.env.RESEND_FROM_EMAIL ||
  "Arkansas Land Pros <leads@hometownwebservicesar.cc>";
