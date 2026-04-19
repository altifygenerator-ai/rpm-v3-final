"use client";

import { motion } from "framer-motion";
import { services } from "@/data/services";
import { fadeUp, staggerContainer } from "@/lib/animations";

export default function ServicesGrid() {
  return (
    <section className="section" id="services">
      <div className="container">

        {/* Section Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <motion.h2 variants={fadeUp}>
            Our Services
          </motion.h2>

          <motion.p variants={fadeUp} className="mt-4 max-w-xl">
            We handle everything from land clearing and drainage to tree work
            and custom outdoor builds. If it involves your property, we can take
            care of it.
          </motion.p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 mt-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {services.map((service, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="card group cursor-pointer"
            >
              {/* Optional Image Placeholder */}
              <div className="w-full h-[160px] bg-[#0f2f24] mb-4 overflow-hidden rounded-md">
                <img
                  src={`/images/services/${service.slug}.jpg`}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Title */}
              <h3>{service.title}</h3>

              {/* Description */}
              <p className="mt-2 text-neutral-300">
                {service.description}
              </p>

              {/* Subtle CTA */}
              <div className="mt-4 text-sm text-[var(--accent)]">
                Get a quote →
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}