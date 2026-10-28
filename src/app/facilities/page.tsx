"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { fetchCmsItems, CmsItem, makeSvgDataUrl } from "@/lib/cms";
import { ImageLightbox } from "@/components/ImageLightbox";

export default function FacilitiesPage() {
  const { locale, t } = useLanguage();
  const [cmsFacilities, setCmsFacilities] = useState<CmsItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [zoomImage, setZoomImage] = useState<{ src: string; alt: string; caption?: string } | null>(
    null
  );

  useEffect(() => {
    const load = () => {
      fetchCmsItems("noksan", "facilities").then(setCmsFacilities);
    };
    load();
    window.addEventListener("cms-updated", load);
    return () => window.removeEventListener("cms-updated", load);
  }, []);

  // KR 모드이거나 관리자가 수정한 항목이 있으면 CMS 목록을 그대로 표시, 외국어 선택 시 시드 항목은 해당 언어 번역과 매칭
  const displayItems = cmsFacilities.map((c) => {
    const seedMatch = c.id.startsWith("seed_fac_")
      ? t.facilities.items[Number(c.id.replace("seed_fac_", ""))]
      : null;

    const useTranslated = locale !== "KR" && seedMatch;
    const name = useTranslated ? seedMatch.name : c.title;
    const category = useTranslated ? seedMatch.category : c.subCategory || "가공설비";
    const spec = useTranslated ? seedMatch.spec : c.specOrMaterial || "-";
    const qty = useTranslated ? seedMatch.qty : c.qtyOrDate || "1대";
    const maker = useTranslated ? seedMatch.maker : c.maker || "-";
    const imgSrc =
      c.imageUrl || makeSvgDataUrl(name, `${maker} | ${spec}`, "blue");

    return {
      id: c.id,
      category,
      name,
      spec,
      qty,
      maker,
      description: c.description || "",
      imageUrl: imgSrc,
    };
  });

  const categories = [
    "ALL",
    ...Array.from(new Set(displayItems.map((i) => i.category))),
  ];

  const filteredItems =
    selectedCategory === "ALL"
      ? displayItems
      : displayItems.filter((i) => i.category === selectedCategory);

  const allLabel =
    locale === "KR"
      ? "전체 설비"
      : locale === "EN"
      ? "All Equipment"
      : locale === "CN"
      ? "全部设备"
      : "全設備";

  const zoomHint =
    locale === "KR"
      ? "🔍 클릭하여 크게 보기"
      : locale === "EN"
      ? "🔍 Click to Enlarge"
      : locale === "CN"
      ? "🔍 点击放大"
      : "🔍 クリックで拡大";

  return (
    <div className="bg-slate-50">
      {/* 상단 서브 배너 */}
      <section className="bg-slate-900 py-14 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
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

        {/* 1. 설비 이미지 포토 카드 그리드 (클릭 시 라이트박스 확대) */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-shadow hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <button
                  type="button"
                  onClick={() =>
                    setZoomImage({
                      src: item.imageUrl,
                      alt: item.name,
                      caption: `${item.category} | ${t.facilities.headers.spec}: ${item.spec} | ${t.facilities.headers.maker}: ${item.maker} (${item.qty})`,
                    })
                  }
                  className="relative block h-52 w-full overflow-hidden bg-slate-900 text-left cursor-zoom-in"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
                    <span className="rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-bold text-slate-900 shadow-md">
                      {zoomHint}
                    </span>
                  </div>

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
                </button>

                <div className="p-5">
                  <h2 className="text-lg font-bold text-slate-900">{item.name}</h2>
                  {item.description && (
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

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

      {/* 이미지 클릭 확대 라이트박스 모달 */}
      {zoomImage && (
        <ImageLightbox
          src={zoomImage.src}
          alt={zoomImage.alt}
          caption={zoomImage.caption}
          onClose={() => setZoomImage(null)}
        />
      )}
    </div>
  );
}
