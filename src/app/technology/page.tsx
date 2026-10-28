"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function TechnologyPage() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t.technology.title}</h1>
        <p className="mt-2 text-sm text-slate-600">{t.technology.subtitle}</p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {t.technology.items.map((item) => (
          <div
            key={item.title}
            className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-xs"
          >
            <div>
              <div className="mb-4 flex h-44 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 text-xs font-medium text-slate-400">
                {t.technology.imagePlaceholder}
              </div>
              <span className="inline-block rounded bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                {item.category}
              </span>
              <h2 className="mt-2 text-lg font-bold text-slate-900">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</p>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
              <span>
                {t.technology.issuerLabel}:{" "}
                <strong className="font-medium text-slate-700">{item.issuer}</strong>
              </span>
              <span>
                {t.technology.dateLabel}: {item.date}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
