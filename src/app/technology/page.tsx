"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
  fetchCmsItems,
  CmsItem,
  makeSvgDataUrl,
  getCategoryTabsConfig,
  defaultCategoryTabsConfig,
  FacilityTabsConfig,
} from "@/lib/cms";
import { ImageLightbox } from "@/components/ImageLightbox";

export default function TechnologyPage() {
  const { locale, t } = useLanguage();
  const [cmsTech, setCmsTech] = useState<CmsItem[]>([]);
  const [tabsConfig, setTabsConfig] = useState<FacilityTabsConfig>(
    defaultCategoryTabsConfig.technology
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [zoomImage, setZoomImage] = useState<{ src: string; alt: string; caption?: string } | null>(
    null
  );

  useEffect(() => {
    const load = () => {
      fetchCmsItems("noksan", "technology").then(setCmsTech);
      setTabsConfig(getCategoryTabsConfig("noksan", "technology"));
    };
    load();
    window.addEventListener("cms-updated", load);
    return () => window.removeEventListener("cms-updated", load);
  }, []);

  const displayItems = cmsTech.map((c) => {
    const seedMatch = c.id.startsWith("seed_tech_")
      ? t.technology.items[Number(c.id.replace("seed_tech_", ""))]
      : null;

    const useTranslated = locale !== "KR" && seedMatch;
    const title = useTranslated ? seedMatch.title : c.title;
    const validKrCat =
      c.subCategory && tabsConfig.tabs.includes(c.subCategory)
        ? c.subCategory
        : tabsConfig.tabs[0] || "품질·환경 경영인증";
    const category = useTranslated ? seedMatch.category : validKrCat;
    const issuer = useTranslated ? seedMatch.issuer : c.specOrMaterial || "-";
    const date = useTranslated ? seedMatch.date : c.qtyOrDate || "-";
    const desc = useTranslated ? seedMatch.desc : c.description || "";
    const imgSrc =
      c.imageUrl || makeSvgDataUrl(title, `${issuer} (${date})`, "indigo");

    return {
      id: c.id,
      category,
      title,
      issuer,
      date,
      desc,
      imageUrl: imgSrc,
    };
  });

  const baseCategories =
    locale === "KR"
      ? tabsConfig.tabs
      : Array.from(new Set(t.technology.items.map((i) => i.category)));

  const categories = ["ALL", ...baseCategories];

  const filteredItems =
    selectedCategory === "ALL"
      ? displayItems
      : displayItems.filter((item) => item.category === selectedCategory);

  const allLabel =
    locale === "KR"
      ? tabsConfig.allLabel || "전체 기술·인증"
      : locale === "EN"
      ? "All Certifications"
      : locale === "CN"
      ? "全部技术·认证"
      : "全技術・認証";

  const zoomHint =
    locale === "KR"
      ? "🔍 인증서·특허 확대보기"
      : locale === "EN"
      ? "🔍 Click to Enlarge"
      : locale === "CN"
      ? "🔍 点击放大证书"
      : "🔍 クリックで拡大";

  return (
    <div className="bg-slate-50">
      <section className="bg-slate-900 py-14 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
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
      </section>

      {/* 서브 탭 네비게이션 (회사소개·설비현황과 통일된 상단 탭 바) */}
      <div className="sticky top-16 z-40 border-b border-slate-200 bg-white shadow-2xs">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex overflow-x-auto no-scrollbar">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`relative whitespace-nowrap px-5 py-4 text-sm font-semibold transition-colors cursor-pointer ${
                    isSelected
                      ? "text-blue-700"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {cat === "ALL" ? allLabel : cat}
                  {isSelected && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        {filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-500">
            해당 탭({selectedCategory})에 등록된 기술·인증서 항목이 없습니다.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-shadow hover:shadow-md"
            >
              <div>
                <button
                  type="button"
                  onClick={() =>
                    setZoomImage({
                      src: item.imageUrl,
                      alt: item.title,
                      caption: `${item.category} | ${t.technology.issuerLabel}: ${item.issuer} (${item.date})`,
                    })
                  }
                  className="relative block h-52 w-full overflow-hidden border-b border-slate-100 bg-slate-900 text-left cursor-zoom-in"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
                    <span className="rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-bold text-slate-900 shadow-md">
                      {zoomHint}
                    </span>
                  </div>
                </button>
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
        )}
      </div>

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
