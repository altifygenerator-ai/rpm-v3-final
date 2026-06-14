"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaFacebookF } from "react-icons/fa";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { navLinks } from "@/data/nav";
import { siteData } from "@/data/site";

const serviceLinks = [
  { label: "Land Clearing", href: "/services/land-clearing" },
  { label: "Tree Work", href: "/services/tree-work" },
  { label: "Drainage & Erosion", href: "/services/drainage-erosion" },
  { label: "Retaining Walls", href: "/services/retaining-walls" },
  { label: "Cleanup & Hauling", href: "/services/cleanup" },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--muted)]">
      <div className="container py-12">
        <motion.div
          className="grid gap-10 md:grid-cols-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <motion.div variants={fadeUp}>
            <h3>{siteData.name}</h3>
            <p className="mt-3 max-w-sm text-neutral-300">
              Property work done right. Proudly serving {siteData.location}.
            </p>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h4 className="text-sm text-neutral-400">Navigation</h4>
            <ul className="mt-4 space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a className="text-neutral-300 hover:text-white" href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h4 className="text-sm text-neutral-400">Services</h4>
            <ul className="mt-4 space-y-2">
              {serviceLinks.map((service) => (
                <li key={service.href}>
                  <Link className="text-neutral-300 hover:text-white" href={service.href}>
                    {service.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link className="text-neutral-300 hover:text-white" href="/#services">
                  View All Services
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h4 className="text-sm text-neutral-400">Contact</h4>
            <div className="mt-4 space-y-2 text-neutral-300">
              <a className="block hover:text-white" href={siteData.phoneHref}>
                {siteData.phone}
              </a>
              <a className="block hover:text-white" href={siteData.emailHref}>
                {siteData.email}
              </a>
              <div>{siteData.location}</div>
            </div>

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

        <div className="mt-10 flex flex-col gap-4 border-t border-[var(--border)] pt-6 text-sm text-neutral-400 sm:flex-row sm:items-center sm:justify-between">
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

          <a
            href="https://www.hometownwebservicesar.cc"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-white"
          >
            Built by Hometown Web
          </a>
        </div>
      </div>
    </footer>
  );
}
