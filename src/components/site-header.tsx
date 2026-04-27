"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { navLinks } from "@/data/nav";
import { siteData } from "@/data/site";
import { FaFacebookF } from "react-icons/fa";

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
          ? "bg-[var(--green)]/95 backdrop-blur border-b border-white/10"
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
          className="hidden gap-8 md:flex"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-white/75 transition hover:text-white"
            >
              {link.label}
            </Link>
          ))}
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
            href={siteData.phoneHref ?? `tel:${siteData.phone.replace(/\D/g, "")}`}
            className="hidden text-sm text-white/75 transition hover:text-white md:block"
          >
            {siteData.phone}
          </a>

          <a href="#contact" className="btn-primary text-sm">
            Get Free Estimate
          </a>
        </div>
      </div>
    </motion.header>
  );
}