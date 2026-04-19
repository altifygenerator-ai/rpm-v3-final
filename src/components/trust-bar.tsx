"use client";

import { motion } from "framer-motion";
import { siteData } from "@/data/site";
import { fadeUp, staggerContainer } from "@/lib/animations";

export default function TrustBar() {
  return (
    <section className="relative w-full bg-[var(--muted)] border-t border-[var(--border)]">
      <div className="container py-8">

        <motion.div
          className="flex flex-wrap items-center justify-between gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {siteData.highlights.map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="flex items-center gap-3 text-sm md:text-base text-neutral-200"
            >
              {/* Accent Dot */}
              <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />

              {/* Text */}
              <span>{item}</span>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}