"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { fetchCmsItems, CmsItem } from "@/lib/cms";

export default function IrPage() {
  const { locale, t } = useLanguage();
  const [cmsIr, setCmsIr] = useState<CmsItem[]>([]);

  useEffect(() => {
    const load = () => {
      fetchCmsItems("noksan", "ir").then(setCmsIr);
    };
    load();
    window.addEventListener("cms-updated", load);
    return () => window.removeEventListener("cms-updated", load);
  }, []);

  const combinedDisclosures = [
    ...cmsIr.map((c) => ({
      id: c.id,
      date: c.qtyOrDate || c.createdAt.slice(0, 10),
      category: c.subCategory || "공시/IR",
      title: c.title,
      source: c.specOrMaterial || "IR 자료실",
    })),
    ...t.ir.disclosures.map((d, idx) => ({
      id: `default_${idx}`,
      ...d,
    })),
  ];

  const adminBtnLabel =
    locale === "KR"
      ? "공시·IR 게시글 관리 (관리자)"
      : locale === "EN"
      ? "Manage IR Posts (Admin)"
      : locale === "CN"
      ? "管理公示与IR (管理员)"
      : "公示・IR管理 (管理者)";

  return (
    <div className="bg-slate-50">
      <section className="bg-slate-900 py-14 text-white">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 px-4 sm:flex-row sm:items-end sm:px-6">
          <div>
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
          <Link
            href="/noksan/admin?tab=ir"
            className="inline-flex items-center gap-1.5 self-start rounded-lg border border-slate-700 bg-slate-800/90 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-blue-600 hover:border-blue-500 hover:text-white transition-colors"
          >
            ⚙️ {adminBtnLabel}
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        {/* 주요 재무 하이라이트 */}
        <section>
          <h2 className="text-xl font-bold text-slate-900">{t.ir.highlightsTitle}</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-3">
            {t.ir.highlights.map((item) => (
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
                {combinedDisclosures.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
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
    </div>
  );
}
