"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  PageKey,
  CustomPageBlock,
  getCustomPageBlocks,
  normalizeExternalUrl,
} from "@/lib/cms";
import { ImageLightbox } from "@/components/ImageLightbox";

export function CustomPageBlocks({
  page,
  position,
  slug = "noksan",
}: {
  page: PageKey;
  position: "top" | "bottom";
  slug?: string;
}) {
  const [blocks, setBlocks] = useState<CustomPageBlock[]>([]);
  const [zoomImage, setZoomImage] = useState<{
    src: string;
    alt: string;
    caption?: string;
  } | null>(null);

  useEffect(() => {
    const load = () => {
      const all = getCustomPageBlocks(slug, page);
      setBlocks(all.filter((b) => (b.position || "bottom") === position));
    };
    load();
    window.addEventListener("cms-updated", load);
    return () => window.removeEventListener("cms-updated", load);
  }, [slug, page, position]);

  if (blocks.length === 0) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 space-y-8">
      {blocks.map((block) => {
        // 1) 작은 배너 (mini_banner)
        if (block.type === "mini_banner") {
          const theme = block.bannerTheme || "blue";
          const themeClasses =
            theme === "dark"
              ? "bg-slate-900 text-white border-slate-800"
              : theme === "light"
              ? "bg-white text-slate-900 border-slate-200 shadow-xs"
              : "bg-gradient-to-r from-blue-700 to-indigo-800 text-white border-blue-600 shadow-sm";

          const subTextClasses =
            theme === "light" ? "text-slate-600" : "text-blue-100";

          const btnClasses =
            theme === "light"
              ? "bg-blue-600 text-white hover:bg-blue-500"
              : "bg-white text-slate-900 hover:bg-blue-50";

          const rawHref = block.btnHref?.trim() || "";
          const isExternal =
            rawHref.startsWith("http://") ||
            rawHref.startsWith("https://") ||
            block.btnNewTab;
          const finalHref = rawHref
            ? rawHref.startsWith("/")
              ? rawHref
              : normalizeExternalUrl(rawHref)
            : "";

          return (
            <div
              key={block.id}
              className={`relative overflow-hidden rounded-2xl border p-6 sm:p-8 ${themeClasses}`}
            >
              {block.imageUrl && (
                <img
                  src={block.imageUrl}
                  alt={block.title}
                  className="absolute inset-0 h-full w-full object-cover opacity-20 pointer-events-none"
                />
              )}
              <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  {block.badge && (
                    <span
                      className={`inline-block rounded-full px-3 py-0.5 text-[11px] font-bold mb-2 ${
                        theme === "light"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-white/15 text-white"
                      }`}
                    >
                      {block.badge}
                    </span>
                  )}
                  <h3 className="text-xl font-bold sm:text-2xl">{block.title}</h3>
                  {block.subtitle && (
                    <p className={`mt-1.5 text-sm ${subTextClasses}`}>
                      {block.subtitle}
                    </p>
                  )}
                </div>

                {block.btnText && finalHref && (
                  <div className="shrink-0">
                    {isExternal ? (
                      <a
                        href={finalHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1.5 rounded-xl px-5 py-3 text-xs font-bold transition-colors ${btnClasses}`}
                      >
                        <span>{block.btnText}</span>
                        <span>↗</span>
                      </a>
                    ) : (
                      <Link
                        href={finalHref}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-5 py-3 text-xs font-bold transition-colors ${btnClasses}`}
                      >
                        <span>{block.btnText}</span>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        }

        // 2) 카드# 섹션 (card_grid)
        if (block.type === "card_grid") {
          const cards = block.cards || [];
          return (
            <div key={block.id} className="space-y-4">
              {(block.title || block.subtitle) && (
                <div>
                  {block.badge && (
                    <span className="inline-block rounded bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 mb-1">
                      {block.badge}
                    </span>
                  )}
                  {block.title && (
                    <h3 className="text-xl font-bold text-slate-900">
                      {block.title}
                    </h3>
                  )}
                  {block.subtitle && (
                    <p className="mt-1 text-sm text-slate-600">{block.subtitle}</p>
                  )}
                </div>
              )}

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {cards.map((card) => {
                  const link = card.linkUrl?.trim()
                    ? card.linkUrl.trim().startsWith("/")
                      ? card.linkUrl.trim()
                      : normalizeExternalUrl(card.linkUrl)
                    : "";

                  return (
                    <div
                      key={card.id}
                      className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-shadow hover:shadow-md"
                    >
                      <div>
                        {card.imageUrl && (
                          <button
                            type="button"
                            onClick={() =>
                              setZoomImage({
                                src: card.imageUrl!,
                                alt: card.title,
                                caption: card.desc,
                              })
                            }
                            className="relative block h-48 w-full overflow-hidden bg-slate-900 text-left cursor-zoom-in"
                          >
                            <img
                              src={card.imageUrl}
                              alt={card.title}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/35 group-hover:opacity-100">
                              <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-slate-900 shadow">
                                🔍 클릭하여 확대
                              </span>
                            </div>
                          </button>
                        )}
                        <div className="p-6">
                          {card.badge && (
                            <span className="inline-block rounded bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 mb-2">
                              {card.badge}
                            </span>
                          )}
                          <h4 className="text-lg font-bold text-slate-900">
                            {card.title}
                          </h4>
                          {card.desc && (
                            <p className="mt-2 text-sm leading-relaxed text-slate-600 whitespace-pre-line">
                              {card.desc}
                            </p>
                          )}
                        </div>
                      </div>

                      {link && (
                        <div className="border-t border-slate-100 bg-slate-50/70 px-6 py-3">
                          <a
                            href={link}
                            target={link.startsWith("/") ? undefined : "_blank"}
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:underline"
                          >
                            <span>바로가기</span>
                            <span>↗</span>
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }

        // 3) 이미지 블록 (image_box)
        if (block.type === "image_box") {
          return (
            <div
              key={block.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs"
            >
              {block.imageUrl && (
                <button
                  type="button"
                  onClick={() =>
                    setZoomImage({
                      src: block.imageUrl!,
                      alt: block.title || "추가 이미지",
                      caption: block.subtitle || block.title,
                    })
                  }
                  className="group relative block w-full overflow-hidden bg-slate-900 cursor-zoom-in"
                >
                  <img
                    src={block.imageUrl}
                    alt={block.title || "추가 이미지"}
                    className="max-h-[520px] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/35 group-hover:opacity-100">
                    <span className="rounded-full bg-white/95 px-4 py-1.5 text-xs font-bold text-slate-900 shadow">
                      🔍 이미지 클릭 시 크게 보기
                    </span>
                  </div>
                </button>
              )}
              {(block.title || block.subtitle || block.badge) && (
                <div className="p-6">
                  {block.badge && (
                    <span className="inline-block rounded bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 mb-1.5">
                      {block.badge}
                    </span>
                  )}
                  {block.title && (
                    <h3 className="text-lg font-bold text-slate-900">
                      {block.title}
                    </h3>
                  )}
                  {block.subtitle && (
                    <p className="mt-1.5 text-sm text-slate-600 whitespace-pre-line">
                      {block.subtitle}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        }

        return null;
      })}

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
