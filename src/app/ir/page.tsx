"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function IrPage() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t.ir.title}</h1>
        <p className="mt-2 text-sm text-slate-600">{t.ir.subtitle}</p>
      </div>

      {/* 주요 재무 하이라이트 */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">{t.ir.highlightsTitle}</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-3">
          {t.ir.highlights.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs"
            >
              <p className="text-xs font-semibold text-slate-500">{item.label}</p>
              <p className="mt-2 text-2xl font-bold text-blue-700">{item.value}</p>
              <p className="mt-1 text-xs text-slate-600">{item.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 공시 및 IR 자료 게시판 */}
      <section className="mt-12">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <h2 className="text-xl font-bold text-slate-900">{t.ir.tableTitle}</h2>
          <a
            href="https://dart.fss.or.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs font-semibold text-blue-700 hover:underline"
          >
            {t.ir.dartLink}
          </a>
        </div>

        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-100 text-slate-700">
              <tr>
                <th className="px-6 py-3.5 font-semibold">{t.ir.headers.category}</th>
                <th className="px-6 py-3.5 font-semibold">{t.ir.headers.title}</th>
                <th className="px-6 py-3.5 font-semibold">{t.ir.headers.source}</th>
                <th className="px-6 py-3.5 font-semibold">{t.ir.headers.date}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {t.ir.disclosures.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <span className="inline-block rounded bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">{item.title}</td>
                  <td className="px-6 py-4 text-slate-600">{item.source}</td>
                  <td className="px-6 py-4 text-slate-500">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
