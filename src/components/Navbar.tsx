"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { label: "Tenders", href: "/tenders", live: true },
  { label: "Suppliers", href: "#suppliers" },
  { label: "Projects", href: "#projects" },
  { label: "Insights", href: "#insights" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-5">
      <div className="mx-auto w-full max-w-7xl">
        <nav
          aria-label="Primary"
          className="liquid-glass flex items-center gap-2 rounded-[26px] px-2.5 py-2 sm:gap-3 sm:px-4"
        >
          {/* Brand */}
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-2.5 rounded-2xl px-1 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
          >
            <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl ring-1 ring-white/60 transition-transform duration-300 group-hover:scale-105 dark:ring-white/10">
              <Image
                src="/mkulima-logo.svg"
                alt="MIZANI logo"
                width={36}
                height={36}
                priority
                className="h-9 w-9"
              />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-[15px] font-bold tracking-tight text-stone-900 dark:text-white">
                MIZANI
              </span>
              <span className="mt-1 hidden text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-700/70 sm:block dark:text-emerald-300/70">
                Tender Intelligence
              </span>
            </span>
          </Link>

          <span
            aria-hidden
            className="mx-1 hidden h-7 w-px bg-gradient-to-b from-transparent via-stone-300/70 to-transparent lg:block dark:via-white/15"
          />

          {/* Desktop links */}
          <ul className="hidden items-center gap-0.5 lg:flex">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="nav-link inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium text-stone-600 hover:bg-white/60 hover:text-emerald-800 dark:text-stone-300 dark:hover:bg-white/10 dark:hover:text-emerald-200"
                >
                  {link.live && (
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </span>
                  )}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-2">
            <span className="liquid-pill hidden items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-medium text-stone-600 xl:inline-flex dark:text-stone-300">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              <span className="font-semibold text-emerald-700 dark:text-emerald-300">128</span>
              new tenders today
            </span>

            <ThemeToggle />

            <Link
              href="/login"
              className="hidden rounded-full px-3.5 py-2 text-sm font-semibold text-stone-700 transition-colors hover:text-emerald-800 sm:inline-flex dark:text-stone-200 dark:hover:text-emerald-200"
            >
              Sign in
            </Link>

            <Link
              href="#tenders"
              className="liquid-button hidden items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 sm:inline-flex"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              Find tenders
            </Link>

            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="liquid-pill flex h-9 w-9 items-center justify-center rounded-full text-stone-700 transition-transform active:scale-95 lg:hidden dark:text-stone-200"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="h-4.5 w-4.5"
              >
                {menuOpen ? (
                  <path d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile panel */}
        <div
          id="mobile-menu"
          className={`grid overflow-hidden transition-all duration-300 ease-out lg:hidden ${
            menuOpen ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="min-h-0">
            <div className="liquid-glass-panel rounded-3xl p-3">
              <ul className="flex flex-col gap-0.5">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between rounded-2xl px-3.5 py-3 text-sm font-medium text-stone-700 transition-colors hover:bg-white/60 hover:text-emerald-800 dark:text-stone-200 dark:hover:bg-white/10 dark:hover:text-emerald-200"
                    >
                      <span className="flex items-center gap-2">
                        {link.live && (
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          </span>
                        )}
                        {link.label}
                      </span>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 opacity-40"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-2 flex flex-col gap-2 border-t border-white/60 pt-3 dark:border-white/10">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-2xl px-3.5 py-3 text-center text-sm font-semibold text-stone-700 transition-colors hover:bg-white/60 hover:text-emerald-800 dark:text-stone-200 dark:hover:bg-white/10 dark:hover:text-emerald-200"
                >
                  Sign in
                </Link>
                <Link
                  href="#tenders"
                  onClick={() => setMenuOpen(false)}
                  className="liquid-button flex items-center justify-center gap-1.5 rounded-2xl px-4 py-3 text-sm font-semibold text-white"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                  Find tenders
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
