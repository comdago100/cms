"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";
import { localeLabels } from "@/lib/i18n";
import { useLanguage } from "@/context/LanguageContext";

export function Header() {
  const { locale, setLocale, t } = useLanguage();

  const navItems = [
    { label: t.nav.home, href: "/" },
    { label: t.nav.about, href: "/about" },
    { label: t.nav.facilities, href: "/facilities" },
    { label: t.nav.products, href: "/products" },
    { label: t.nav.technology, href: "/technology" },
    { label: t.nav.ir, href: "/ir" },
    { label: t.nav.support, href: "/support" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-2 sm:px-6">
        <Link href="/" className="flex flex-col">
          <span className="text-lg font-bold tracking-tight text-slate-900">
            {t.company.name}
          </span>
          <span className="text-[10px] font-medium tracking-wider text-slate-500">
            {siteConfig.englishName}
          </span>
        </Link>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <nav className="flex flex-wrap items-center gap-3 sm:gap-5 text-sm font-medium text-slate-700">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap transition-colors hover:text-blue-700"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* 다국어 전환 버튼 (KR | EN | CN | JP) */}
          <div
            className="flex items-center rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs font-semibold"
            role="group"
            aria-label="Language Switcher"
          >
            {localeLabels.map((lang) => {
              const isActive = locale === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLocale(lang.code)}
                  title={lang.name}
                  className={`rounded-md px-2 py-1 transition-all cursor-pointer ${
                    isActive
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {lang.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  const { t } = useLanguage();

  const navItems = [
    { label: t.nav.home, href: "/" },
    { label: t.nav.about, href: "/about" },
    { label: t.nav.facilities, href: "/facilities" },
    { label: t.nav.products, href: "/products" },
    { label: t.nav.technology, href: "/technology" },
    { label: t.nav.ir, href: "/ir" },
    { label: t.nav.support, href: "/support" },
  ];

  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-400">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="text-base font-bold text-white">{t.company.name}</p>
            <p className="mt-1 text-sm text-slate-400">{t.company.description}</p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-6 border-t border-slate-800 pt-6 text-xs leading-6 text-slate-400">
          <p>
            {t.footer.ceo}: {t.company.ceo} | {t.footer.bizNum}: {siteConfig.businessNumber} | {t.footer.address}: {t.company.address}
          </p>
          <p>
            {t.footer.phone}: {siteConfig.phone} | {t.footer.fax}: {siteConfig.fax} | {t.footer.email}: {siteConfig.email}
          </p>
          <p className="mt-2 text-slate-500">
            Copyright © {siteConfig.copyrightYear} {siteConfig.englishName} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
