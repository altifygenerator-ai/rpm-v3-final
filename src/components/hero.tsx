"use client";

import { motion } from "framer-motion";
import { heroData } from "@/data/hero";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { siteData } from "@/data/site";

export default function Hero() {
  return (
    <section className="relative h-[90vh] w-full overflow-hidden">

      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroData.backgroundImage}
          alt="Property work"
          className="w-full h-full object-cover object-[center_30%] scale-[1.05]"
        />

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/55" />
      </div>

      {/* Content */}
      <motion.div
        className="container relative z-10 pt-20"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          className="max-w-2xl text-white"
        >
          {heroData.heading}
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={fadeUp}
          className="mt-4 max-w-xl text-neutral-200"
        >
          {heroData.subheading}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeUp}
          className="mt-6 flex flex-wrap gap-4"
        >
          <a
            href={`tel:${siteData.phone.replace(/\D/g, "")}`}
            className="btn-primary"
          >
            {heroData.ctaPrimary}
          </a>

          <a
            href="#contact"
            className="btn-secondary"
          >
            {heroData.ctaSecondary}
          </a>
        </motion.div>

      </motion.div>

    </section>
  );
}