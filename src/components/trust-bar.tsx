"use client";

import { motion } from "framer-motion";
import { siteData } from "@/data/site";
import { fadeUp, staggerContainer } from "@/lib/animations";

export default function TrustBar() {
  return (
    <section className="relative z-10 w-full border-y border-[var(--border)] bg-[var(--muted)]/95">
      <div className="container py-7 md:py-8">
        <motion.div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {siteData.highlights.map((item) => (
            <motion.div
              key={item}
              variants={fadeUp}
              className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.025] px-4 py-3 text-sm text-neutral-200 md:text-base"
            >
              <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" />
              <span>{item}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
