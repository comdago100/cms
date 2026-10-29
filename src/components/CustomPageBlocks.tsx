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

function toYoutubeEmbedUrl(url: string): string | null {
  try {
    const trimmed = url.trim();
    if (!trimmed) return null;
    if (trimmed.includes("youtube.com/embed/")) return trimmed;
    const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);
    if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
    const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{6,})/);
    if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
    return null;
  } catch {
    return null;
  }
}

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
  const [openFaqIds, setOpenFaqIds] = useState<Record<string, boolean>>({});
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
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 space-y-10">
      {blocks.map((block) => {
        // 1) 자유 텍스트 / 인사말·소개글 블록 (text_block)
        if (block.type === "text_block") {
          const theme = block.bannerTheme || "light";
          const boxClasses =
            theme === "dark"
              ? "rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-10 text-white shadow-sm"
              : theme === "blue"
              ? "rounded-2xl border border-blue-200 bg-blue-50/70 p-6 sm:p-10 text-slate-900 shadow-xs"
              : theme === "transparent"
              ? "py-2 text-slate-900"
              : "rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 text-slate-900 shadow-xs";

          const alignCenter = block.textAlign === "center";
          const isTwoCol = block.textAlign === "two_col";
          const paragraphs = (block.subtitle || "")
            .split(/\n+/)
            .map((p) => p.trim())
            .filter(Boolean);

          return (
            <div
              key={block.id}
              className={`${boxClasses} ${alignCenter ? "text-center" : ""}`}
            >
              {block.badge && (
                <span
                  className={`inline-block rounded-full px-3 py-0.5 text-xs font-bold mb-2.5 ${
                    theme === "dark"
                      ? "bg-blue-500/20 text-blue-300"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {block.badge}
                </span>
              )}
              {block.title && (
                <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {block.title}
                </h3>
              )}
              {paragraphs.length > 0 && (
                <div
                  className={`mt-4 gap-6 ${
                    isTwoCol
                      ? "grid sm:grid-cols-2 text-left"
                      : alignCenter
                      ? "mx-auto max-w-3xl space-y-3"
                      : "space-y-3"
                  }`}
                >
                  {paragraphs.map((para, i) => (
                    <p
                      key={i}
                      className={`text-sm sm:text-base leading-relaxed ${
                        theme === "dark" ? "text-slate-300" : "text-slate-600"
                      }`}
                    >
                      {para}
                    </p>
                  ))}
                </div>
              )}
              {block.calloutText && (
                <div
                  className={`mt-6 rounded-xl border-l-4 border-blue-600 p-4 text-left text-sm font-semibold ${
                    theme === "dark"
                      ? "bg-slate-800/80 text-blue-200"
                      : "bg-slate-50 text-slate-800"
                  }`}
                >
                  {block.calloutText}
                </div>
              )}
            </div>
          );
        }

        // 2) 주요 경영·재무지표 하이라이트 블록 (kpi_stats)
        if (block.type === "kpi_stats") {
          const stats = block.stats || [];
          const cols = block.gridCols || 3;
          const gridClass =
            cols === 2
              ? "sm:grid-cols-2"
              : cols === 4
              ? "sm:grid-cols-2 lg:grid-cols-4"
              : "sm:grid-cols-3";

          return (
            <section key={block.id} className="space-y-4">
              {(block.title || block.subtitle || block.badge) && (
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
                    <p className="mt-1 text-sm text-slate-600">
                      {block.subtitle}
                    </p>
                  )}
                </div>
              )}

              <div className={`grid gap-6 ${gridClass}`}>
                {stats.map((st) => {
                  const valColor =
                    st.color === "emerald"
                      ? "text-emerald-600"
                      : st.color === "indigo"
                      ? "text-indigo-700"
                      : st.color === "slate"
                      ? "text-slate-900"
                      : "text-blue-700";
                  return (
                    <div
                      key={st.id}
                      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-shadow hover:shadow-md"
                    >
                      <p className="text-xs font-semibold text-slate-500">
                        {st.label}
                      </p>
                      <p className={`mt-2 text-2xl sm:text-3xl font-extrabold ${valColor}`}>
                        {st.value}
                      </p>
                      {st.note && (
                        <p className="mt-1.5 text-xs text-slate-600">{st.note}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        }

        // 3) 링크 연동 게시판 / 공시·자료실 표 블록 (link_board)
        if (block.type === "link_board") {
          const headers = block.boardHeaders || {
            col1: "구분",
            col2: "제목",
            col3: "출처 / 비고",
            col4: "등록일",
          };
          const rows = block.boardRows || [];
          const topHref = block.btnHref
            ? block.btnHref.startsWith("/")
              ? block.btnHref
              : normalizeExternalUrl(block.btnHref)
            : "";

          return (
            <section key={block.id} className="space-y-4">
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
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
                    <p className="mt-1 text-sm text-slate-600">
                      {block.subtitle}
                    </p>
                  )}
                </div>
                {block.btnText && topHref && (
                  <a
                    href={topHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs font-semibold text-blue-700 hover:underline"
                  >
                    {block.btnText} ↗
                  </a>
                )}
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-100 text-slate-700">
                    <tr>
                      <th className="px-6 py-3.5 font-semibold">{headers.col1}</th>
                      <th className="px-6 py-3.5 font-semibold">{headers.col2}</th>
                      <th className="px-6 py-3.5 font-semibold">{headers.col3}</th>
                      <th className="px-6 py-3.5 font-semibold">{headers.col4}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {rows.map((row) => {
                      const rowLink = row.linkUrl
                        ? row.linkUrl.startsWith("/")
                          ? row.linkUrl
                          : normalizeExternalUrl(row.linkUrl)
                        : "";
                      return (
                        <tr
                          key={row.id}
                          onClick={() => {
                            if (rowLink) {
                              window.open(rowLink, "_blank", "noopener,noreferrer");
                            }
                          }}
                          className={`transition-colors ${
                            rowLink
                              ? "cursor-pointer hover:bg-blue-50/60 group"
                              : "hover:bg-slate-50"
                          }`}
                        >
                          <td className="px-6 py-4">
                            <span className="inline-block rounded bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                              {row.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-semibold text-slate-900">
                            {rowLink ? (
                              <a
                                href={rowLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-2 text-slate-900 group-hover:text-blue-600 group-hover:underline transition-colors"
                              >
                                <span>{row.title}</span>
                                <span className="inline-flex items-center rounded bg-blue-50 px-1.5 py-0.5 text-[11px] font-semibold text-blue-600">
                                  새창 ↗
                                </span>
                              </a>
                            ) : (
                              row.title
                            )}
                          </td>
                          <td className="px-6 py-4 text-slate-600">{row.source}</td>
                          <td className="px-6 py-4 text-slate-500">{row.date}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          );
        }

        // 4) 멀티 레이아웃 이미지 그리드 블록 (1x1, 2x1, 3x1, 4x1, 2x2, 3x2) (image_grid)
        if (block.type === "image_grid") {
          const preset = block.gridPreset || "3x1";
          const images = block.images || [];
          const gridClass =
            preset === "1x1"
              ? "grid-cols-1"
              : preset === "2x1" || preset === "2x2"
              ? "grid-cols-1 sm:grid-cols-2"
              : preset === "4x1"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

          const aspectClass =
            block.imageAspect === "square"
              ? "aspect-square"
              : block.imageAspect === "wide"
              ? "h-64 sm:h-80"
              : block.imageAspect === "auto"
              ? "max-h-[540px]"
              : "aspect-video";

          return (
            <section key={block.id} className="space-y-4">
              {(block.title || block.subtitle || block.badge) && (
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
                    <p className="mt-1 text-sm text-slate-600">
                      {block.subtitle}
                    </p>
                  )}
                </div>
              )}

              <div className={`grid gap-5 ${gridClass}`}>
                {images.map((img) => {
                  const link = img.linkUrl
                    ? img.linkUrl.startsWith("/")
                      ? img.linkUrl
                      : normalizeExternalUrl(img.linkUrl)
                    : "";
                  return (
                    <div
                      key={img.id}
                      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-shadow hover:shadow-md flex flex-col"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          if (link) {
                            window.open(link, "_blank", "noopener,noreferrer");
                          } else if (img.url) {
                            setZoomImage({
                              src: img.url,
                              alt: img.title || block.title || "이미지",
                              caption: img.caption || img.title,
                            });
                          }
                        }}
                        className={`relative block w-full overflow-hidden bg-slate-900 text-left ${aspectClass} ${
                          link ? "cursor-pointer" : "cursor-zoom-in"
                        }`}
                      >
                        {img.url && (
                          <img
                            src={img.url}
                            alt={img.title || "이미지"}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/35 group-hover:opacity-100">
                          <span className="rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-bold text-slate-900 shadow">
                            {link ? "🔗 링크 열기 ↗" : "🔍 클릭하여 크게 보기"}
                          </span>
                        </div>
                      </button>

                      {(img.title || img.caption) && (
                        <div className="p-4">
                          {img.title && (
                            <h4 className="text-sm font-bold text-slate-900">
                              {img.title}
                            </h4>
                          )}
                          {img.caption && (
                            <p className="mt-1 text-xs text-slate-600">
                              {img.caption}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        }

        // 5) 작은 배너 (mini_banner)
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

        // 6) 카드# 섹션 (card_grid)
        if (block.type === "card_grid") {
          const cards = block.cards || [];
          const cols = block.gridCols || 3;
          const gridClass =
            cols === 2
              ? "sm:grid-cols-2"
              : cols === 4
              ? "sm:grid-cols-2 lg:grid-cols-4"
              : "sm:grid-cols-2 lg:grid-cols-3";

          return (
            <div key={block.id} className="space-y-4">
              {(block.title || block.subtitle || block.badge) && (
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

              <div className={`grid gap-6 ${gridClass}`}>
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

        // 7) 연혁 / 공정 순서 타임라인 블록 (timeline_steps)
        if (block.type === "timeline_steps") {
          const steps = block.steps || [];
          return (
            <section
              key={block.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs"
            >
              {(block.title || block.subtitle || block.badge) && (
                <div className="mb-6">
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
                    <p className="mt-1 text-sm text-slate-600">
                      {block.subtitle}
                    </p>
                  )}
                </div>
              )}

              <div className="relative border-l-2 border-blue-200 ml-3 pl-6 space-y-6">
                {steps.map((st) => (
                  <div key={st.id} className="relative">
                    <span className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-4 border-white bg-blue-600 shadow-xs" />
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                      <span className="inline-block shrink-0 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-extrabold text-blue-700">
                        {st.stepOrYear}
                      </span>
                      <div>
                        <h4 className="text-base font-bold text-slate-900">
                          {st.title}
                        </h4>
                        {st.desc && (
                          <p className="mt-1 text-sm text-slate-600 whitespace-pre-line">
                            {st.desc}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        // 8) 자주 묻는 질문 FAQ 아코디언 블록 (faq_accordion)
        if (block.type === "faq_accordion") {
          const faqs = block.faqs || [];
          return (
            <section
              key={block.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs"
            >
              {(block.title || block.subtitle || block.badge) && (
                <div className="mb-6">
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
                    <p className="mt-1 text-sm text-slate-600">
                      {block.subtitle}
                    </p>
                  )}
                </div>
              )}

              <div className="divide-y divide-slate-200 rounded-xl border border-slate-200">
                {faqs.map((faq) => {
                  const isOpen = openFaqIds[faq.id] ?? true;
                  return (
                    <div key={faq.id} className="bg-white">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenFaqIds((prev) => ({
                            ...prev,
                            [faq.id]: !isOpen,
                          }))
                        }
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-bold text-slate-900 hover:bg-slate-50 cursor-pointer"
                      >
                        <span className="flex items-center gap-2.5 text-sm sm:text-base">
                          <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-extrabold text-white">
                            Q
                          </span>
                          <span>{faq.q}</span>
                        </span>
                        <span className="text-xs font-bold text-slate-400">
                          {isOpen ? "▲ 접기" : "▼ 펼치기"}
                        </span>
                      </button>
                      {isOpen && (
                        <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-4 text-sm leading-relaxed text-slate-700 whitespace-pre-line">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        }

        // 9) 동영상 / 유튜브 임베드 블록 (video_embed)
        if (block.type === "video_embed") {
          const rawUrl = block.videoUrl || block.imageUrl || "";
          const ytEmbed = toYoutubeEmbedUrl(rawUrl);

          return (
            <section
              key={block.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs"
            >
              {(block.title || block.subtitle || block.badge) && (
                <div className="p-6 pb-4">
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
                    <p className="mt-1 text-sm text-slate-600">
                      {block.subtitle}
                    </p>
                  )}
                </div>
              )}

              <div className="aspect-video w-full bg-slate-950">
                {ytEmbed ? (
                  <iframe
                    src={ytEmbed}
                    title={block.title || "Video"}
                    className="h-full w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : rawUrl ? (
                  <video
                    src={rawUrl}
                    controls
                    playsInline
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
                    동영상 URL 또는 파일을 등록해 주세요.
                  </div>
                )}
              </div>
            </section>
          );
        }

        // 10) 기존 단일 이미지 블록 호환 (image_box)
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
