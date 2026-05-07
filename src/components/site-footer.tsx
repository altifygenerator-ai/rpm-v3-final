"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { siteData } from "@/data/site";
import { navLinks } from "@/data/nav";
import { FaFacebookF } from "react-icons/fa";
import Link from "next/link";

const serviceLinks = [
  {
    label: "Land Clearing",
    href: "/services/land-clearing",
  },
  {
    label: "Tree Work",
    href: "/services/tree-work",
  },
  {
    label: "Drainage & Erosion",
    href: "/services/drainage-erosion",
  },
];

export default function SiteFooter() {
  return (
    <footer className="bg-[var(--muted)] border-t border-[var(--border)]">
      <div className="container py-12">

        <motion.div
          className="grid gap-10 md:grid-cols-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
        >

          {/* Brand */}
          <motion.div variants={fadeUp}>
            <h3>{siteData.name}</h3>

            <p className="mt-3 max-w-sm text-neutral-300">
              Property work done right. Proudly serving {siteData.location}.
            </p>
          </motion.div>

          {/* Nav */}
          <motion.div variants={fadeUp}>
            <h4 className="text-sm text-neutral-400">
              Navigation
            </h4>

            <ul className="mt-4 space-y-2">
              {navLinks.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="text-neutral-300 hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div variants={fadeUp}>
            <h4 className="text-sm text-neutral-400">
              Services
            </h4>

            <ul className="mt-4 space-y-2">
              {serviceLinks.map((service) => (
                <li key={service.href}>
                  <Link
                    href={service.href}
                    className="text-neutral-300 hover:text-white"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}

              <li>
                <a
                  href="/#services"
                  className="text-neutral-300 hover:text-white"
                >
                  View All Services
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={fadeUp}>
            <h4 className="text-sm text-neutral-400">
              Contact
            </h4>

            <div className="mt-4 space-y-2 text-neutral-300">
              <div>{siteData.phone}</div>
              <div>{siteData.email}</div>
              <div>{siteData.location}</div>
            </div>

            {/* Facebook */}
            <a
              href={siteData.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center gap-2 text-neutral-300 transition hover:text-[#1877F2]"
            >
              <FaFacebookF size={16} />
              <span>View our work on Facebook</span>
            </a>
          </motion.div>

        </motion.div>

        <div className="mt-10 flex items-center justify-between border-t border-[var(--border)] pt-6 text-sm text-neutral-400">

          <div className="flex items-center gap-2">
            <span>
              © {new Date().getFullYear()} {siteData.name}
            </span>

            <img
              src="/images/razorback.png"
              alt="Arkansas Razorback"
              className="h-auto w-8 opacity-70"
            />
          </div>

          <div>Built by Hometown Web</div>

        </div>

      </div>
    </footer>
  );
}