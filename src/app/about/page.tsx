"use client";

import { siteConfig } from "@/config/site";
import { useLanguage } from "@/context/LanguageContext";

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t.about.title}</h1>
        <p className="mt-2 text-sm text-slate-600">{t.about.subtitle}</p>
      </div>

      {/* CEO 인사말 */}
      <section className="mt-10 rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-900">{t.about.ceoGreetingTitle}</h2>
        <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
          {t.about.ceoParagraphs.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
          <p className="pt-2 font-semibold text-slate-900">
            {t.company.name} {t.about.ceoSign}
          </p>
        </div>
      </section>

      {/* 기업 개요 */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">{t.about.overviewTitle}</h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <dl className="divide-y divide-slate-200 text-sm">
            <div className="grid grid-cols-3 px-6 py-4">
              <dt className="font-semibold text-slate-700">{t.about.labels.companyName}</dt>
              <dd className="col-span-2 text-slate-900">
                {t.company.name} ({siteConfig.englishName})
              </dd>
            </div>
            <div className="grid grid-cols-3 px-6 py-4">
              <dt className="font-semibold text-slate-700">{t.about.labels.ceo}</dt>
              <dd className="col-span-2 text-slate-900">{t.company.ceo}</dd>
            </div>
            <div className="grid grid-cols-3 px-6 py-4">
              <dt className="font-semibold text-slate-700">{t.about.labels.established}</dt>
              <dd className="col-span-2 text-slate-900">{t.company.established}</dd>
            </div>
            <div className="grid grid-cols-3 px-6 py-4">
              <dt className="font-semibold text-slate-700">{t.about.labels.business}</dt>
              <dd className="col-span-2 text-slate-900">{t.company.description}</dd>
            </div>
            <div className="grid grid-cols-3 px-6 py-4">
              <dt className="font-semibold text-slate-700">{t.about.labels.address}</dt>
              <dd className="col-span-2 text-slate-900">{t.company.address}</dd>
            </div>
            <div className="grid grid-cols-3 px-6 py-4">
              <dt className="font-semibold text-slate-700">{t.about.labels.contact}</dt>
              <dd className="col-span-2 text-slate-900">
                TEL: {siteConfig.phone} / FAX: {siteConfig.fax}
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  );
}
