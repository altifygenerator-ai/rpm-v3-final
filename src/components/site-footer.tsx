"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { siteData } from "@/data/site";
import { navLinks } from "@/data/nav";
import { FaFacebookF } from "react-icons/fa";

export default function SiteFooter() {
  return (
    <footer className="bg-[var(--muted)] border-t border-[var(--border)]">
      <div className="container py-12">

        <motion.div
          className="grid md:grid-cols-3 gap-10"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
        >

          {/* Brand */}
          <motion.div variants={fadeUp}>
            <h3>{siteData.name}</h3>
            <p className="mt-3 text-neutral-300 max-w-sm">
              Property work done right. Serving {siteData.location}.
            </p>
          </motion.div>

          {/* Nav */}
          <motion.div variants={fadeUp}>
            <h4 className="text-sm text-neutral-400">Navigation</h4>
            <ul className="mt-4 space-y-2">
              {navLinks.map((link, i) => (
                <li key={i}>
                  <a href={link.href} className="text-neutral-300 hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={fadeUp}>
            <h4 className="text-sm text-neutral-400">Contact</h4>

            <div className="mt-4 space-y-2 text-neutral-300">
              <div>{siteData.phone}</div>
              <div>{siteData.email}</div>
              <div>{siteData.location}</div>
            </div>

            {/* Facebook */}
            <a
              href={siteData.socials.facebook}
              target="_blank"
              className="flex items-center gap-2 mt-4 text-neutral-300 hover:text-[#1877F2] transition"
            >
              <FaFacebookF size={16} />
              <span>View our work on Facebook</span>
            </a>
          </motion.div>

        </motion.div>

        <div className="mt-10 pt-6 border-t border-[var(--border)] text-sm text-neutral-400 flex justify-between">
          <div>© {new Date().getFullYear()} {siteData.name}</div>
          <div>Built by Hometown Web</div>
        </div>

      </div>
    </footer>
  );
}