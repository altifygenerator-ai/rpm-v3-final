"use client";

import { motion } from "framer-motion";
import { reviews } from "@/data/reviews";
import { fadeUp, staggerContainer } from "@/lib/animations";

export default function Testimonials() {
  return (
    <section className="section" id="reviews">
      <div className="container">

        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <motion.h2 variants={fadeUp}>
            What customers in the Greers Ferry Lake area are saying
          </motion.h2>

          <motion.p variants={fadeUp} className="mt-4 max-w-xl">
            Real feedback from land clearing, tree work, and drainage jobs across the Greers Ferry Lake area and Central Arkansas.
          </motion.p>
        </motion.div>

        {/* Reviews */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 mt-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="card"
            >
              {/* Stars */}
              <div className="text-[var(--accent)] mb-3">
                {"★★★★★"}
              </div>

              {/* Text */}
              <p className="text-neutral-300">
                “{review.text}”
              </p>

              {/* Name */}
              <div className="mt-4 text-sm text-neutral-400">
                — {review.name}
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}