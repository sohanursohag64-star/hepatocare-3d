"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheck, Languages, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { localeHome, type Dict, type Locale } from "@/i18n/dictionaries";
import { Logo } from "./Logo";
import { buttonClasses } from "./ui/Button";

/** Link to the same page in the other language. */
function LanguageSwitch({ t, className = "" }: { t: Dict; className?: string }) {
  const other: Locale = t.locale === "en" ? "bn" : "en";
  return (
    <a
      href={localeHome[other]}
      hrefLang={other}
      lang={other}
      aria-label={t.common.switchLanguageLabel}
      className={`inline-flex items-center gap-1.5 rounded-full border border-navy-100 bg-white px-3.5 py-2 text-sm font-semibold text-navy-800 shadow-soft transition hover:border-teal-300 hover:text-teal-700 ${className}`}
    >
      <Languages className="h-4 w-4 text-teal-600" aria-hidden />
      {t.common.switchLanguage}
    </a>
  );
}

export function Navbar({ t }: { t: Dict }) {
  const navLinks = t.nav.links;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("#home");

  // Elevate the bar once the page has scrolled.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the link for the section currently in view.
  useEffect(() => {
    const sections = navLinks
      .map((l) => document.querySelector<HTMLElement>(l.href))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActive(`#${visible[0].target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Lock page scroll and allow Escape to close while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Close the menu if the viewport grows to desktop size.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "border-b border-navy-100/80 bg-white/85 shadow-soft backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav aria-label={t.nav.primary} className="container-page flex h-[4.5rem] items-center justify-between gap-3 xl:gap-6">
        <Link href="#home" aria-label={t.nav.backToTop} className="rounded-lg">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-0.5 lg:flex xl:gap-1">
          {navLinks.map((link, i) => {
            const isActive = active === link.href;
            return (
              // "Home" is redundant with the logo; hide it where space is tight.
              <li key={link.href} className={i === 0 ? "hidden xl:block" : undefined}>
                <Link
                  href={link.href}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative rounded-full px-2.5 py-2 text-sm font-medium whitespace-nowrap xl:px-3.5 transition-colors ${
                    isActive ? "text-teal-700" : "text-navy-700 hover:text-teal-600"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-teal-50"
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    />
                  )}
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <LanguageSwitch t={t} />
          <span className="hidden sm:block">
            <Link href="#appointment" className={buttonClasses("primary", "!px-5 !py-2.5")}>
              <CalendarCheck className="h-4 w-4" aria-hidden />
              {t.nav.appointment}
            </Link>
          </span>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-navy-100 bg-white text-navy-800 shadow-soft transition hover:border-teal-300 hover:text-teal-600 lg:hidden"
          >
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-navy-100 bg-white lg:hidden"
          >
            <ul className="container-page flex max-h-[calc(100dvh-4.5rem)] flex-col gap-1 overflow-y-auto py-4">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-medium transition ${
                      active === link.href ? "bg-teal-50 text-teal-700" : "text-navy-800 hover:bg-mist"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
              <li className="pt-3">
                <Link
                  href="#appointment"
                  onClick={() => setOpen(false)}
                  className={buttonClasses("primary", "w-full")}
                >
                  <CalendarCheck className="h-4 w-4" aria-hidden />
                  {t.nav.bookAppointment}
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
