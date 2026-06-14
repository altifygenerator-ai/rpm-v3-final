"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { services } from "@/data/services";

type Service = (typeof services)[number];

type ServiceCardProps = {
  service: Service;
};

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <motion.div variants={fadeUp}>
      <Link href={`/services/${service.slug}`} className="card group block h-full cursor-pointer">
        <div className="mb-4 h-[160px] w-full overflow-hidden rounded-md">
          <img
            src={service.image ?? `/images/services/${service.slug}.jpg`}
            alt={`${service.title} near Greers Ferry Arkansas`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <h3>{service.title}</h3>
        <p className="mt-2 text-neutral-300">{service.description}</p>
        <div className="mt-4 text-sm text-[var(--accent)]">Learn more →</div>
      </Link>
    </motion.div>
  );
}
