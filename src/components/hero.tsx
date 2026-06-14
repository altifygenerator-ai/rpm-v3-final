"use client";

import { motion } from "framer-motion";
import { heroData } from "@/data/hero";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { siteData } from "@/data/site";

export default function Hero() {
  return (
    <section className="relative flex min-h-[92vh] w-full items-center overflow-hidden pt-24">
      <div className="absolute inset-0">
        <img
          src={heroData.backgroundImage}
          alt="Land clearing and property work near Greers Ferry Arkansas"
          className="h-full w-full scale-[1.04] object-cover object-[center_30%]"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#081812] via-transparent to-black/25" />
      </div>

      <motion.div
        className="container relative z-10 pb-16 pt-10"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        <motion.p
          variants={fadeUp}
          className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]"
        >
          Greers Ferry Lake • Central Arkansas
        </motion.p>

        <motion.h1 variants={fadeUp} className="max-w-3xl text-white">
          {heroData.heading}
        </motion.h1>

        <motion.p variants={fadeUp} className="mt-5 max-w-2xl text-neutral-200">
          {heroData.subheading}
        </motion.p>

        <motion.div variants={fadeUp} className="mt-7 flex flex-wrap gap-4">
          <a href={siteData.phoneHref} className="btn-primary">
            {heroData.ctaPrimary}
          </a>
          <a href="#contact" className="btn-secondary">
            {heroData.ctaSecondary}
          </a>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="mt-5 max-w-2xl text-sm text-neutral-300"
        >
          Free estimates for land clearing, drainage, erosion control, tree work,
          retaining walls, hauling, and property maintenance.
        </motion.div>
      </motion.div>
    </section>
  );
}
