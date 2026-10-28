"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import {
  fetchCmsItems,
  CmsItem,
  getSiteSettings,
  defaultSiteSettings,
  SiteSettings,
} from "@/lib/cms";

export default function IrPage() {
  const { locale, t } = useLanguage();
  const [cmsIr, setCmsIr] = useState<CmsItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);

  useEffect(() => {
    const load = () => {
      fetchCmsItems("noksan", "ir").then(setCmsIr);
      setSettings(getSiteSettings("noksan"));
    };
    load();
    window.addEventListener("cms-updated", load);
    return () => window.removeEventListener("cms-updated", load);
  }, []);

  const highlights =
    locale === "KR"
      ? [
          {
            label: t.ir.highlights[0].label,
            value: settings.irRevenue,
            note: settings.irRevenueNote,
          },
          {
            label: t.ir.highlights[1].label,
            value: settings.irMargin,
            note: settings.irMarginNote,
          },
          {
            label: t.ir.highlights[2].label,
            value: settings.irCredit,
            note: settings.irCreditNote,
          },
        ]
      : t.ir.highlights;

  const displayDisclosures = cmsIr.map((c) => {
    const seedMatch = c.id.startsWith("seed_ir_")
      ? t.ir.disclosures[Number(c.id.replace("seed_ir_", ""))]
      : null;

    const useTranslated = locale !== "KR" && seedMatch;
    return {
      id: c.id,
      date: useTranslated ? seedMatch.date : c.qtyOrDate || c.createdAt.slice(0, 10),
      category: useTranslated ? seedMatch.category : c.subCategory || "공시/IR",
      title: useTranslated ? seedMatch.title : c.title,
      source: useTranslated ? seedMatch.source : c.specOrMaterial || "IR 자료실",
      linkUrl:
        c.linkUrl !== undefined
          ? c.linkUrl
          : c.id.startsWith("seed_ir_")
          ? "https://dart.fss.or.kr"
          : "",
    };
  });

  return (
    <div className="bg-slate-50">
      <section className="bg-slate-900 py-14 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">
            INVESTOR RELATIONS
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            {t.ir.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            {t.ir.subtitle}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        {/* 주요 재무 하이라이트 */}
        <section>
          <h2 className="text-xl font-bold text-slate-900">{t.ir.highlightsTitle}</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-3">
            {highlights.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs"
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

          <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
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
                {displayDisclosures.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <span className="inline-block rounded bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                    {item.linkUrl ? (
                      <a
                        href={item.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-slate-900 hover:text-blue-600 hover:underline transition-colors"
                      >
                        <span>{item.title}</span>
                        <span className="text-xs font-normal text-blue-600">↗</span>
                      </a>
                    ) : (
                      item.title
                    )}
                  </td>
                    <td className="px-6 py-4 text-slate-600">{item.source}</td>
                    <td className="px-6 py-4 text-slate-500">{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
