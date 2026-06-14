"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaBars, FaChevronDown, FaFacebookF, FaTimes } from "react-icons/fa";
import { siteData } from "@/data/site";

const serviceLinks = [
  { label: "Land Clearing", href: "/services/land-clearing" },
  { label: "Tree Work", href: "/services/tree-work" },
  { label: "Drainage & Erosion", href: "/services/drainage-erosion" },
  { label: "Retaining Walls", href: "/services/retaining-walls" },
  { label: "Cleanup & Hauling", href: "/services/cleanup" },
];

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobile = () => setMobileOpen(false);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${
        scrolled || mobileOpen
          ? "border-b border-white/10 bg-[var(--green)]/95 backdrop-blur"
          : "bg-transparent"
      }`}
    >
      <div className="container flex h-[80px] items-center justify-between gap-4">
        <Link
          href="/"
          aria-label={`${siteData.name} home`}
          className="min-w-0 leading-tight"
          onClick={closeMobile}
        >
          <span className="block truncate text-base font-semibold text-white md:text-lg">
            {siteData.name}
          </span>
          <span className="hidden text-xs uppercase tracking-[0.18em] text-white/60 sm:block">
            Greers Ferry Lake • Central Arkansas
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          <Link href="/" className="text-sm text-white/75 transition hover:text-white">
            Home
          </Link>

          <div className="group relative">
            <button
              type="button"
              className="flex items-center gap-2 text-sm text-white/75 transition hover:text-white"
            >
              Services
              <FaChevronDown className="text-[10px]" />
            </button>
            <div className="pointer-events-none absolute left-0 top-full pt-4 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
              <div className="min-w-[270px] rounded-xl border border-white/10 bg-[#0b1f18] p-3 shadow-2xl">
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

          <Link href="/gallery" className="text-sm text-white/75 transition hover:text-white">
            Gallery
          </Link>
          <Link href="/#contact" className="text-sm text-white/75 transition hover:text-white">
            Contact
          </Link>
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <a
            href={siteData.socials.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Richards Property Management on Facebook"
            className="text-white/70 transition hover:text-[#1877F2]"
          >
            <FaFacebookF size={16} />
          </a>
          <a href={siteData.phoneHref} className="text-sm text-white/75 transition hover:text-white">
            {siteData.phone}
          </a>
          <Link href="/#contact" className="btn-primary text-sm">
            Get Free Estimate
          </Link>
        </div>

        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/15 text-white md:hidden"
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#0b1f18] md:hidden">
          <nav className="container grid gap-2 py-5" aria-label="Mobile navigation">
            <Link onClick={closeMobile} href="/" className="rounded-md px-3 py-3 text-white/85 hover:bg-white/5">
              Home
            </Link>
            <div className="px-3 pt-2 text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
              Services
            </div>
            {serviceLinks.map((service) => (
              <Link
                key={service.href}
                onClick={closeMobile}
                href={service.href}
                className="rounded-md px-3 py-3 text-white/75 hover:bg-white/5 hover:text-white"
              >
                {service.label}
              </Link>
            ))}
            <Link onClick={closeMobile} href="/gallery" className="rounded-md px-3 py-3 text-white/85 hover:bg-white/5">
              Gallery
            </Link>
            <Link onClick={closeMobile} href="/#contact" className="rounded-md px-3 py-3 text-white/85 hover:bg-white/5">
              Contact
            </Link>
            <a onClick={closeMobile} href={siteData.phoneHref} className="btn-primary mt-2 w-full">
              Call {siteData.phone}
            </a>
          </nav>
        </div>
      )}
    </motion.header>
  );
}
