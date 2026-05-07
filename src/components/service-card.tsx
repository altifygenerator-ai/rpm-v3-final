"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";

export default function ServiceCard({ service }: any) {
  const activePages = ["land-clearing", "tree-work", "drainage-erosion"];
  const href = activePages.includes(service.slug)
    ? `/services/${service.slug}`
    : "#contact";

  return (
    <motion.div variants={fadeUp}>
      <Link href={href} className="card group block cursor-pointer">
        <div className="mb-4 h-[160px] w-full overflow-hidden rounded-md">
          <img
            src={`/images/services/${service.slug}.jpg`}
            alt={`${service.title} near Greers Ferry Arkansas`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <h3>{service.title}</h3>

        <p className="mt-2 text-neutral-300">{service.description}</p>

        <div className="mt-4 text-sm text-[var(--accent)]">
          {activePages.includes(service.slug) ? "Learn more →" : "Get a quote →"}
        </div>
      </Link>
    </motion.div>
  );
}