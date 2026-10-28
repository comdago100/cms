"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { fetchCmsItems, CmsItem, makeSvgDataUrl } from "@/lib/cms";
import { ImageLightbox } from "@/components/ImageLightbox";

export default function TechnologyPage() {
  const { locale, t } = useLanguage();
  const [cmsTech, setCmsTech] = useState<CmsItem[]>([]);
  const [zoomImage, setZoomImage] = useState<{ src: string; alt: string; caption?: string } | null>(
    null
  );

  useEffect(() => {
    const load = () => {
      fetchCmsItems("noksan", "technology").then(setCmsTech);
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
    const category = useTranslated ? seedMatch.category : c.subCategory || "품질·환경 경영인증";
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

  const zoomHint =
    locale === "KR"
      ? "🔍 인증서·특허 확대보기"
      : locale === "EN"
      ? "🔍 Click to Enlarge"
      : locale === "CN"
      ? "🔍 点击放大证书"
      : "🔍 クリックで拡大";

  const adminBtnLabel =
    locale === "KR"
      ? "인증서·특허 등록/수정 (관리자)"
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
          {displayItems.map((item) => (
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
