"use client";

import { motion } from "framer-motion";
import { fullGallery } from "@/data/full-gallery";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { siteData } from "@/data/site";

export default function FullGalleryGrid() {
  return (
    <section className="section">
      <div className="container">

        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <motion.h1 variants={fadeUp}>
            Full Project Gallery
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-4 max-w-xl">
            Take a look through all of our recent work. From land clearing and
            drainage to tree work and custom builds.
          </motion.p>

          <a
            href={siteData.socials.facebook}
            target="_blank"
            className="mt-4 inline-block text-sm text-neutral-400 hover:text-[#1877F2] transition"
          >
            See more updates on Facebook →
          </a>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mt-12"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {fullGallery.map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="group relative overflow-hidden rounded-lg"
            >

              {item.type === "video" ? (
                <video
                  src={item.src}
                  controls
                  className="w-full h-[260px] object-cover"
                />
              ) : (
                <img
                  src={item.src}
                  alt={item.category}
                  className="w-full h-[260px] object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition" />

              <div className="absolute bottom-4 left-4 text-sm text-white opacity-0 group-hover:opacity-100 transition">
                {item.category}
              </div>

            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}