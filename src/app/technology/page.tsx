"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { fetchCmsItems, CmsItem } from "@/lib/cms";

export default function TechnologyPage() {
  const { locale, t } = useLanguage();
  const [cmsTech, setCmsTech] = useState<CmsItem[]>([]);

  useEffect(() => {
    const load = () => {
      fetchCmsItems("noksan", "technology").then(setCmsTech);
    };
    load();
    window.addEventListener("cms-updated", load);
    return () => window.removeEventListener("cms-updated", load);
  }, []);

  const combinedItems = [
    ...cmsTech.map((c) => ({
      id: c.id,
      category: c.subCategory || "품질·환경 경영인증",
      title: c.title,
      issuer: c.specOrMaterial || "-",
      date: c.qtyOrDate || "-",
      desc: c.description || "",
      imageUrl: c.imageUrl || "",
    })),
    ...t.technology.items.map((item, idx) => ({
      id: `default_${idx}`,
      category: item.category,
      title: item.title,
      issuer: item.issuer,
      date: item.date,
      desc: item.desc,
      imageUrl: "",
    })),
  ];

  const adminBtnLabel =
    locale === "KR"
      ? "인증서·특허 관리 (관리자)"
      : locale === "EN"
      ? "Manage Certificates (Admin)"
      : locale === "CN"
      ? "管理证书与专利 (管理员)"
      : "認証書・特許管理 (管理者)";

  return (
    <div className="bg-slate-50">
      <section className="bg-slate-900 py-14 text-white">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 px-4 sm:flex-row sm:items-end sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">
              TECHNOLOGY & CERTIFICATIONS
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              {t.technology.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              {t.technology.subtitle}
            </p>
          </div>
          <Link
            href="/noksan/admin?tab=technology"
            className="inline-flex items-center gap-1.5 self-start rounded-lg border border-slate-700 bg-slate-800/90 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-blue-600 hover:border-blue-500 hover:text-white transition-colors"
          >
            ⚙️ {adminBtnLabel}
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {combinedItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-shadow hover:shadow-md"
            >
              <div>
                <div className="relative h-52 w-full overflow-hidden border-b border-slate-100 bg-slate-50">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-full w-full object-contain p-3"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center text-xs font-medium text-slate-400">
                      <svg
                        className="mb-2 h-9 w-9 text-blue-500/60"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                        />
                      </svg>
                      {t.technology.imagePlaceholder}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <span className="inline-block rounded bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                    {item.category}
                  </span>
                  <h2 className="mt-2 text-lg font-bold text-slate-900">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {item.desc}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-6 py-3 text-xs text-slate-500">
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
    </div>
  );
}
