"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const navLinks = [
  { href: "/tours", label: "Tours" },
  { href: "/reviews", label: "Reviews" },
  { href: "/profile", label: "Profile" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#fcf8f8]/80 backdrop-blur-xl border-b border-[#ebe7e7]/20">
      <div className="mx-auto max-w-[1440px] flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center"
        >
          <Image src="/logo.png" alt="EMO Tours CDMX" width={48} height={48} className="h-10 w-auto" />
        </Link>

        {/* Center nav links — hidden on mobile */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="font-heading font-bold tracking-tighter text-[#1c1b1b] opacity-80 hover:text-[#256d00] hover:opacity-100 transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Book Now button + hamburger */}
        <div className="flex items-center gap-4">
          <Link
            href="/tours"
            className="hidden sm:inline-flex items-center bg-[#4cbb17] text-[#1c1b1b] rounded-full px-6 py-2.5 font-heading font-bold text-sm hover:bg-[#3a960e] transition-colors"
          >
            Book Now
          </Link>

          {/* Hamburger — visible on mobile */}
          <button
            type="button"
            aria-label="Toggle menu"
            className="md:hidden flex flex-col gap-1.5"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            <span
              className={`block h-0.5 w-6 bg-[#1c1b1b] transition-transform ${mobileOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block h-0.5 w-6 bg-[#1c1b1b] transition-opacity ${mobileOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-0.5 w-6 bg-[#1c1b1b] transition-transform ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#fcf8f8]/95 backdrop-blur-xl border-t border-[#ebe7e7]/20 px-6 pb-4">
          <ul className="flex flex-col gap-4 pt-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-heading font-bold tracking-tighter text-[#1c1b1b] opacity-80 hover:text-[#256d00] hover:opacity-100 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/tours"
                className="inline-flex items-center bg-[#4cbb17] text-[#1c1b1b] rounded-full px-6 py-2.5 font-heading font-bold text-sm hover:bg-[#3a960e] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Book Now
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
