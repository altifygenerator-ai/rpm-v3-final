export const siteData = {
  name: "Arkansas Land Pros",
  shortName: "ALP",
  tagline: "Arkansas land work starts here.",
  description:
    "Arkansas Land Pros helps property owners request land clearing, dirt work, drainage, driveway, cleanup, and related land-service work across Arkansas.",
  coverageLine:
    "Priority coverage across Southwest Arkansas, the Hot Springs area, the Ouachitas, Greers Ferry Lake, and Central Arkansas.",
  disclosure:
    "Arkansas Land Pros is a lead and referral service. Requests may be shared with an independent service provider that may be able to help with the project. The contractor performing the work is responsible for estimates, licensing, insurance, scheduling, and completed work.",
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
