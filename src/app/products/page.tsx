"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { fetchCmsItems, CmsItem } from "@/lib/cms";

export default function ProductsPage() {
  const { locale, t } = useLanguage();
  const [cmsProducts, setCmsProducts] = useState<CmsItem[]>([]);

  useEffect(() => {
    const load = () => {
      fetchCmsItems("noksan", "products").then(setCmsProducts);
    };
    load();
    window.addEventListener("cms-updated", load);
    return () => window.removeEventListener("cms-updated", load);
  }, []);

  const combinedProducts = [
    ...cmsProducts.map((c) => ({
      id: c.id,
      category: c.subCategory || "주문제작(OEM)",
      name: c.title,
      material: c.specOrMaterial || "고객사 지정 재질",
      desc: c.description || "",
      imageUrl: c.imageUrl || "",
    })),
    ...t.products.items.map((item, idx) => ({
      id: `default_${idx}`,
      category: item.category,
      name: item.name,
      material: item.material,
      desc: item.desc,
      imageUrl: "",
    })),
  ];

  const adminBtnLabel =
    locale === "KR"
      ? "제품 등록·수정 (관리자)"
      : locale === "EN"
      ? "Manage Products (Admin)"
      : locale === "CN"
      ? "产品管理 (管理员)"
      : "製品管理 (管理者)";

  return (
    <div className="bg-slate-50">
      <section className="bg-slate-900 py-14 text-white">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 px-4 sm:flex-row sm:items-end sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">
              PRODUCTS & SOLUTIONS
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              {t.products.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              {t.products.subtitle}
            </p>
          </div>
          <Link
            href="/noksan/admin?tab=products"
            className="inline-flex items-center gap-1.5 self-start rounded-lg border border-slate-700 bg-slate-800/90 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-blue-600 hover:border-blue-500 hover:text-white transition-colors"
          >
            ⚙️ {adminBtnLabel}
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {combinedProducts.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-shadow hover:shadow-md"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-xs font-medium text-slate-500">
                      <svg
                        className="mb-2 h-8 w-8 text-slate-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                        />
                      </svg>
                      {t.products.imagePlaceholder}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <span className="inline-block rounded bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                    {product.category}
                  </span>
                  <h2 className="mt-2 text-lg font-bold text-slate-900">
                    {product.name}
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">{product.desc}</p>
                </div>
              </div>
              <div className="border-t border-slate-100 bg-slate-50/60 px-6 py-3 text-xs text-slate-500">
                {t.products.materialLabel}:{" "}
                <span className="font-semibold text-slate-800">{product.material}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
