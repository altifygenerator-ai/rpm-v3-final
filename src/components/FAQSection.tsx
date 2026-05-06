"use client";

import { motion } from "framer-motion";

const faqs = [
  {
    question: "What is forestry mulching?",
    answer:
      "Forestry mulching uses specialized equipment to clear brush, small trees, thick undergrowth, and overgrown areas by grinding vegetation into mulch directly on the property.",
  },
  {
    question: "Do you clear hunting property and trails?",
    answer:
      "Yes. Hunting property cleanup, trail clearing, shooting lanes, and overgrown access paths are some of the most common projects around Greers Ferry and surrounding Arkansas areas.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "Richards Land Management LLC serves Greers Ferry, Heber Springs, Fairfield Bay, Quitman, Clinton, and surrounding Arkansas communities.",
  },
  {
    question: "Can you clear heavily overgrown land?",
    answer:
      "Yes. Forestry mulching and land clearing can help open up heavily overgrown property, thick brush, cedar growth, trails, fence lines, and unused acreage.",
  },
];

export default function FAQSection() {
  return (
    <section className="py-28 bg-[var(--bg-alt)]">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm text-[var(--text-soft)] mb-4">
            Common Questions
          </p>

          <h2 className="text-3xl md:text-5xl leading-tight">
            Forestry mulching and land clearing questions
          </h2>
        </motion.div>

        <div className="mt-12 space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <h3 className="text-xl">
                {faq.question}
              </h3>

              <p className="mt-3 text-[var(--text-soft)] leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}