"use client";

import { motion } from "framer-motion";
import { services } from "@/data/services";
import ServiceCard from "@/components/service-card";
import { fadeUp, staggerContainer } from "@/lib/animations";

export default function ServicesGrid() {
  return (
    <section className="section" id="services">
      <div className="container">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <motion.p
            variants={fadeUp}
            className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]"
          >
            Property Services
          </motion.p>
          <motion.h2 variants={fadeUp}>Our Services</motion.h2>

          <motion.p variants={fadeUp} className="mt-4 max-w-2xl text-neutral-300">
            We handle everything from land clearing and drainage to tree work,
            hauling, welding, and custom outdoor builds. If it involves your
            property, we can help get it cleaned up, protected, or usable again.
          </motion.p>
        </motion.div>

        <motion.div
          className="mt-12 grid gap-6 md:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
