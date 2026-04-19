"use client";

import { motion } from "framer-motion";
import { whyChooseUs } from "@/data/why";
import { fadeUp, staggerContainer } from "@/lib/animations";

export default function WhyChooseUs() {
  return (
    <section className="section bg-[var(--muted)] border-y border-[var(--border)]">
      <div className="container">

        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.h2 variants={fadeUp}>
              Why Choose Us
            </motion.h2>

            <motion.p variants={fadeUp} className="mt-4 max-w-md">
              We focus on doing the job right the first time. No shortcuts,
              no guesswork — just reliable work you can count on for your property.
            </motion.p>

            <motion.div className="mt-6 space-y-4">
              {whyChooseUs.map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="flex items-start gap-3"
                >
                  <span className="text-[var(--accent)] mt-1">•</span>
                  <span className="text-neutral-200">{item}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="w-full h-[350px] overflow-hidden rounded-lg"
          >
            <img
              src="/images/work/work1.jpg"
              alt="Property work"
              className="w-full h-full object-cover"
            />
          </motion.div>

        </div>

      </div>
    </section>
  );
}