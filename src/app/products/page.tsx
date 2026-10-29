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
  getHiddenSkeletonSections,
} from "@/lib/cms";
import { ImageLightbox } from "@/components/ImageLightbox";
import { CustomPageBlocks } from "@/components/CustomPageBlocks";

export default function ProductsPage() {
  const { locale, t } = useLanguage();
  const [cmsProducts, setCmsProducts] = useState<CmsItem[]>([]);
  const [tabsConfig, setTabsConfig] = useState<FacilityTabsConfig>(
    defaultCategoryTabsConfig.products
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [hiddenSections, setHiddenSections] = useState<string[]>([]);
  const [zoomImage, setZoomImage] = useState<{ src: string; alt: string; caption?: string } | null>(
    null
  );

  useEffect(() => {
    const load = () => {
      fetchCmsItems("noksan", "products").then(setCmsProducts);
      setTabsConfig(getCategoryTabsConfig("noksan", "products"));
      setHiddenSections(getHiddenSkeletonSections("noksan"));
    };
    load();
    window.addEventListener("cms-updated", load);
    return () => window.removeEventListener("cms-updated", load);
  }, []);

  const displayProducts = cmsProducts.map((c) => {
    const seedMatch = c.id.startsWith("seed_prod_")
      ? t.products.items[Number(c.id.replace("seed_prod_", ""))]
      : null;

    const useTranslated = locale !== "KR" && seedMatch;
    const name = useTranslated ? seedMatch.name : c.title;
    const validKrCat =
      c.subCategory && tabsConfig.tabs.includes(c.subCategory)
        ? c.subCategory
        : tabsConfig.tabs[0] || "선박·해양 부품";
    const category = useTranslated ? seedMatch.category : validKrCat;
    const material = useTranslated ? seedMatch.material : c.specOrMaterial || "고객사 지정 재질";
    const desc = useTranslated ? seedMatch.desc : c.description || "";
    const imgSrc =
      c.imageUrl || makeSvgDataUrl(name, `${category} | ${material}`, "slate");

    return {
      id: c.id,
      category,
      name,
      material,
      desc,
      imageUrl: imgSrc,
    };
  });

  const baseCategories =
    locale === "KR"
      ? tabsConfig.tabs
      : Array.from(new Set(t.products.items.map((i) => i.category)));

  const categories = ["ALL", ...baseCategories];

  const filteredProducts =
    selectedCategory === "ALL"
      ? displayProducts
      : displayProducts.filter((p) => p.category === selectedCategory);

  const allLabel =
    locale === "KR"
      ? tabsConfig.allLabel || "전체 제품"
      : locale === "EN"
      ? "All Products"
      : locale === "CN"
      ? "全部产品"
      : "全製品";

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
      <section className="bg-slate-900 py-14 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
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
      </section>

      {/* 서브 탭 네비게이션 (회사소개·설비현황과 통일된 상단 탭 바) */}
      {!hiddenSections.includes("prod_subtabs") && (
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
      )}

      {/* 상단 커스텀 블록 (작은 배너 · 카드# · 이미지) */}
      <CustomPageBlocks page="products" position="top" subTab={selectedCategory} />

      {!hiddenSections.includes("prod_cards") && (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        {filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-500">
            해당 탭({selectedCategory})에 등록된 제품 항목이 없습니다.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-shadow hover:shadow-md"
            >
              <div>
                <button
                  type="button"
                  onClick={() =>
                    setZoomImage({
                      src: product.imageUrl,
                      alt: product.name,
                      caption: `${product.category} | ${t.products.materialLabel}: ${product.material}`,
                    })
                  }
                  className="relative block h-48 w-full overflow-hidden bg-slate-900 text-left cursor-zoom-in"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
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
        )}
      </div>
      )}

      {/* 하단 커스텀 블록 (작은 배너 · 카드# · 이미지) */}
      <CustomPageBlocks page="products" position="bottom" subTab={selectedCategory} />

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
