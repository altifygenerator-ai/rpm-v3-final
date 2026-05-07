"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { siteData } from "@/data/site";
import { FaFacebookF, FaChevronDown } from "react-icons/fa";

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

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-[var(--green)]/95 backdrop-blur"
          : "bg-transparent"
      }`}
    >
      <div className="container flex h-[80px] items-center justify-between">
        <Link
          href="/"
          aria-label={`${siteData.name} home`}
          className="flex items-center gap-3"
        >
          <div className="leading-tight">
            <span className="block text-base font-semibold text-white md:text-lg">
              {siteData.name}
            </span>

            <span className="hidden text-xs uppercase tracking-[0.18em] text-white/60 sm:block">
              Greers Ferry Lake • Central Arkansas
            </span>
          </div>
        </Link>

        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Main navigation"
        >
          <Link
            href="/"
            className="text-sm text-white/75 transition hover:text-white"
          >
            Home
          </Link>

          <div className="group relative">
            <button className="flex items-center gap-2 text-sm text-white/75 transition hover:text-white">
              Services
              <FaChevronDown className="text-[10px]" />
            </button>

            <div className="pointer-events-none absolute left-0 top-full pt-4 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
              <div className="min-w-[260px] rounded-xl border border-white/10 bg-[#0b1f18] p-3 shadow-2xl">
                {serviceLinks.map((service) => (
                  <Link
                    key={service.href}
                    href={service.href}
                    className="block rounded-lg px-4 py-3 text-sm text-white/75 transition hover:bg-white/5 hover:text-white"
                  >
                    {service.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link
            href="/gallery"
            className="text-sm text-white/75 transition hover:text-white"
          >
            Gallery
          </Link>

          <Link
            href="/#contact"
            className="text-sm text-white/75 transition hover:text-white"
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <a
            href={siteData.socials.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Richards Property Management on Facebook"
            className="text-white/70 transition hover:text-[#1877F2]"
          >
            <FaFacebookF size={16} />
          </a>

          <a
            href={
              siteData.phoneHref ??
              `tel:${siteData.phone.replace(/\D/g, "")}`
            }
            className="hidden text-sm text-white/75 transition hover:text-white md:block"
          >
            {siteData.phone}
          </a>

          <a href="/#contact" className="btn-primary text-sm">
            Get Free Estimate
          </a>
        </div>
      </div>
    </motion.header>
  );
}