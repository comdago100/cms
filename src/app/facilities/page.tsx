"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { fetchCmsItems, CmsItem } from "@/lib/cms";

// 기본 설비 일러스트/다이어그램 썸네일 배경 패턴
const facilityVisuals = [
  "from-slate-800 via-blue-950 to-slate-900",
  "from-slate-900 via-indigo-950 to-slate-800",
  "from-blue-950 via-slate-900 to-slate-800",
  "from-slate-800 via-slate-900 to-blue-950",
];

export default function FacilitiesPage() {
  const { locale, t } = useLanguage();
  const [cmsFacilities, setCmsFacilities] = useState<CmsItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  useEffect(() => {
    const load = () => {
      fetchCmsItems("noksan", "facilities").then(setCmsFacilities);
    };
    load();
    window.addEventListener("cms-updated", load);
    return () => window.removeEventListener("cms-updated", load);
  }, []);

  // 관리자 페이지에서 등록한 설비 + 기본 다국어 설비 병합
  const combinedItems = [
    ...cmsFacilities.map((c) => ({
      id: c.id,
      category: c.subCategory || "가공설비",
      name: c.title,
      spec: c.specOrMaterial || "-",
      qty: c.qtyOrDate || "1대",
      maker: c.maker || "-",
      description: c.description || "",
      imageUrl: c.imageUrl || "",
      isCustom: true,
    })),
    ...t.facilities.items.map((item, idx) => ({
      id: `default_${idx}`,
      category: item.category,
      name: item.name,
      spec: item.spec,
      qty: item.qty,
      maker: item.maker,
      description: "",
      imageUrl: "",
      isCustom: false,
    })),
  ];

  const categories = [
    "ALL",
    ...Array.from(new Set(combinedItems.map((i) => i.category))),
  ];

  const filteredItems =
    selectedCategory === "ALL"
      ? combinedItems
      : combinedItems.filter((i) => i.category === selectedCategory);

  const allLabel =
    locale === "KR"
      ? "전체 설비"
      : locale === "EN"
      ? "All Equipment"
      : locale === "CN"
      ? "全部设备"
      : "全設備";

  const adminGuideLabel =
    locale === "KR"
      ? "설비 사진·목록 관리 (관리자)"
      : locale === "EN"
      ? "Manage Equipment (Admin)"
      : locale === "CN"
      ? "管理设备与图片 (管理员)"
      : "設備・画像管理 (管理者)";

  return (
    <div className="bg-slate-50">
      {/* 상단 서브 배너 */}
      <section className="bg-slate-900 py-14 text-white">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 px-4 sm:flex-row sm:items-end sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">
              EQUIPMENT & FACILITIES
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              {t.facilities.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              {t.facilities.subtitle}
            </p>
          </div>
          <Link
            href="/noksan/admin?tab=facilities"
            className="inline-flex items-center gap-1.5 self-start rounded-lg border border-slate-700 bg-slate-800/90 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-blue-600 hover:border-blue-500 hover:text-white transition-colors"
          >
            ⚙️ {adminGuideLabel}
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        {/* 카테고리 필터 버튼 */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                  active
                    ? "bg-blue-600 text-white shadow-xs"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                }`}
              >
                {cat === "ALL" ? allLabel : cat}
              </button>
            );
          })}
        </div>

        {/* 1. 설비 이미지 포토 카드 그리드 */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-shadow hover:shadow-md flex flex-col justify-between"
            >
              <div>
                {/* 설비 이미지 영역 */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-900">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div
                      className={`flex h-full w-full flex-col items-center justify-center bg-gradient-to-br ${
                        facilityVisuals[idx % facilityVisuals.length]
                      } p-6 text-center text-white`}
                    >
                      {/* 산업용 CNC/설비 아이콘 그래픽 */}
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xs">
                        <svg
                          className="h-7 w-7 text-blue-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.6}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
                          />
                        </svg>
                      </div>
                      <p className="mt-3 text-xs font-semibold tracking-wider text-blue-300">
                        {item.maker}
                      </p>
                      <p className="mt-1 text-sm font-bold text-white/95 line-clamp-1">
                        {item.name}
                      </p>
                      <span className="mt-2 rounded bg-black/30 px-2.5 py-0.5 text-[11px] text-slate-300">
                        {item.spec}
                      </span>
                    </div>
                  )}

                  {/* 상단 카테고리 & 보유 수량 뱃지 */}
                  <div className="absolute left-3 top-3 flex items-center gap-1.5">
                    <span className="rounded-md bg-blue-600/95 px-2.5 py-1 text-[11px] font-bold text-white shadow-xs">
                      {item.category}
                    </span>
                  </div>
                  <div className="absolute right-3 top-3">
                    <span className="rounded-md bg-slate-900/85 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-xs">
                      {t.facilities.headers.qty}: {item.qty}
                    </span>
                  </div>
                </div>

                {/* 카드 본문 */}
                <div className="p-5">
                  <h2 className="text-lg font-bold text-slate-900">{item.name}</h2>
                  {item.description && (
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              {/* 하단 스펙/제조사 정보 */}
              <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-3 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>
                    {t.facilities.headers.spec}:{" "}
                    <strong className="font-semibold text-slate-900">{item.spec}</strong>
                  </span>
                  <span>
                    {t.facilities.headers.maker}:{" "}
                    <strong className="font-semibold text-slate-900">{item.maker}</strong>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 2. 한눈에 보는 전체 보유설비 총괄표 */}
        <div className="mt-14">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            📋 {t.facilities.title} ({filteredItems.length})
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-6 py-3.5 font-semibold">{t.facilities.headers.category}</th>
                  <th className="px-6 py-3.5 font-semibold">{t.facilities.headers.name}</th>
                  <th className="px-6 py-3.5 font-semibold">{t.facilities.headers.spec}</th>
                  <th className="px-6 py-3.5 font-semibold">{t.facilities.headers.qty}</th>
                  <th className="px-6 py-3.5 font-semibold">{t.facilities.headers.maker}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-blue-700">{item.category}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{item.name}</td>
                    <td className="px-6 py-4 text-slate-600">{item.spec}</td>
                    <td className="px-6 py-4 text-slate-900">{item.qty}</td>
                    <td className="px-6 py-4 text-slate-600">{item.maker}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
