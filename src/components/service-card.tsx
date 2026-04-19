"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";

export default function ServiceCard({ service }: any) {
  return (
    <motion.div variants={fadeUp} className="card group cursor-pointer">
      <div className="w-full h-[160px] mb-4 overflow-hidden rounded-md">
        <img
          src={`/images/services/${service.slug}.jpg`}
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <h3>{service.title}</h3>
      <p className="mt-2 text-neutral-300">
        {service.description}
      </p>

      <div className="mt-4 text-sm text-[var(--accent)]">
        Get a quote →
      </div>
    </motion.div>
  );
}