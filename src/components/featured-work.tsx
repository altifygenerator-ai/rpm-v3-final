"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { gallery } from "@/data/gallery";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { siteData } from "@/data/site";
export default function FeaturedWork() {
  return (
    <section className="section" id="work">
      <div className="container">

        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <motion.h2 variants={fadeUp}>
            Recent Work
          </motion.h2>

          <motion.p variants={fadeUp} className="mt-4 max-w-xl">
            Take a look at some of our recent projects. Real work, real results.
          </motion.p>
        </motion.div>
        <a
  href={siteData.socials.facebook}
  target="_blank"
  className="mt-4 inline-block text-sm text-neutral-400 hover:text-[#1877F2] transition"
>
  Want to see even more? Check out our Facebook for recent jobs and updates →
</a>
        {/* Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 mt-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {gallery.map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="group relative overflow-hidden rounded-lg"
            >

              {/* MEDIA SWITCH */}
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

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300" />

              {/* Label */}
              <div className="absolute bottom-4 left-4 text-sm text-white opacity-0 group-hover:opacity-100 transition">
                {item.category}
              </div>

            </motion.div>
          ))}
        </motion.div>
        <div className="mt-10 text-left">
  <Link
    href="/gallery"
    className="text-[var(--accent)] text-sm hover:underline"
  >
    See all our work →
  </Link>
</div>

      </div>
    </section>
  );
}