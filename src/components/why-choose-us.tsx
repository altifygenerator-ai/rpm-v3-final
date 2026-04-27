"use client";

import { motion } from "framer-motion";
import { whyChooseUs } from "@/data/why";
import { fadeUp, staggerContainer } from "@/lib/animations";

export default function WhyChooseUs() {
  return (
    <section className="section bg-[var(--muted)] border-y border-[var(--border)]">
      <div className="container">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.p
              variants={fadeUp}
              className="text-sm uppercase tracking-[0.25em] text-[var(--accent)]"
            >
              Local property services
            </motion.p>

            <motion.h2 variants={fadeUp} className="mt-3">
              Reliable land clearing, drainage, and tree work in Central Arkansas
            </motion.h2>

            <motion.p variants={fadeUp} className="mt-4 max-w-md">
              We help property owners around the Greers Ferry Lake area with land
              clearing, erosion control, tree work, hauling, and outdoor property
              projects done right the first time.
            </motion.p>

            <motion.div className="mt-6 space-y-4">
              {whyChooseUs.map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="flex items-start gap-3"
                >
                  <span className="mt-1 text-[var(--accent)]">•</span>
                  <span className="text-neutral-200">{item}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="h-[350px] w-full overflow-hidden rounded-lg"
          >
            <img
              src="/images/work/work1.jpg"
              alt="Land clearing and property work near Greers Ferry Lake in Central Arkansas"
              className="h-full w-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}