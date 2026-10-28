"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";
import { useLanguage } from "@/context/LanguageContext";

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div>
      {/* 히어로 섹션 */}
      <section className="bg-slate-900 py-20 text-white sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <span className="inline-block rounded-full bg-blue-600/20 px-3 py-1 text-xs font-semibold text-blue-400 border border-blue-500/30">
            {t.home.badge}
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl leading-tight">
            {t.home.heroTitle1}
            <br />
            {t.home.heroTitle2} <span className="text-blue-400">{t.company.name}</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base text-slate-300 sm:text-lg">
            {t.company.description}. {t.home.heroDesc}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/products"
              className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
            >
              {t.home.btnProducts}
            </Link>
            <Link
              href="/support"
              className="rounded-md border border-slate-600 bg-slate-800 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700 transition-colors"
            >
              {t.home.btnSupport}
            </Link>
          </div>
        </div>
      </section>

      {/* 핵심 역량 섹션 */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {t.home.coreTitle}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {t.home.coreSubtitle}
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {t.home.cores.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs"
              >
                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 바로가기 배너 섹션 */}
      <section className="border-t border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col justify-between rounded-xl bg-slate-100 p-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{t.home.bannerFacilitiesTitle}</h3>
                <p className="mt-2 text-sm text-slate-600">
                  {t.home.bannerFacilitiesDesc}
                </p>
              </div>
              <Link
                href="/facilities"
                className="mt-6 inline-flex items-center text-sm font-semibold text-blue-700 hover:underline"
              >
                {t.home.bannerFacilitiesLink}
              </Link>
            </div>

            <div className="flex flex-col justify-between rounded-xl bg-blue-50 p-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{t.home.bannerSupportTitle}</h3>
                <p className="mt-2 text-sm text-slate-600">
                  {t.home.bannerSupportDesc}
                </p>
                <p className="mt-3 text-base font-bold text-blue-800">
                  {t.home.bannerSupportPhone}: {siteConfig.phone}
                </p>
              </div>
              <Link
                href="/support"
                className="mt-6 inline-flex items-center text-sm font-semibold text-blue-700 hover:underline"
              >
                {t.home.bannerSupportLink}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
