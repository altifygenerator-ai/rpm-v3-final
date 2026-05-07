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
          <motion.h2 variants={fadeUp}>Our Services</motion.h2>

          <motion.p variants={fadeUp} className="mt-4 max-w-xl">
            We handle everything from land clearing and drainage to tree work
            and custom outdoor builds. If it involves your property, we can take
            care of it.
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