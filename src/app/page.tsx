"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import {
  getHomeConfig,
  defaultHomeConfig,
  HomeConfig,
  getSiteSettings,
  defaultSiteSettings,
  SiteSettings,
  getHiddenSkeletonSections,
} from "@/lib/cms";
import { ImageLightbox } from "@/components/ImageLightbox";
import { CustomPageBlocks } from "@/components/CustomPageBlocks";

export default function HomePage() {
  const { locale, t } = useLanguage();
  const [homeConfig, setHomeConfig] = useState<HomeConfig>(defaultHomeConfig);
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [hiddenSections, setHiddenSections] = useState<string[]>([]);
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [zoomImage, setZoomImage] = useState<{ src: string; alt: string; caption?: string } | null>(
    null
  );

  useEffect(() => {
    const load = () => {
      setHomeConfig(getHomeConfig("noksan"));
      setSettings(getSiteSettings("noksan"));
      setHiddenSections(getHiddenSkeletonSections("noksan"));
    };
    load();
    window.addEventListener("cms-updated", load);
    return () => window.removeEventListener("cms-updated", load);
  }, []);

  const activeSlides = homeConfig.slides.filter((s) => s.active !== false);
  const safeSlides = activeSlides.length > 0 ? activeSlides : defaultHomeConfig.slides;
  const activeSlide = safeSlides[currentSlideIdx % safeSlides.length] || safeSlides[0];

  // 자동 슬라이드 전환 타이머
  useEffect(() => {
    if (isPaused || safeSlides.length <= 1) return;
    const interval = Math.max(2500, homeConfig.autoPlayIntervalMs || 5500);
    const timer = setInterval(() => {
      setCurrentSlideIdx((prev) => (prev + 1) % safeSlides.length);
    }, interval);
    return () => clearInterval(timer);
  }, [isPaused, safeSlides.length, homeConfig.autoPlayIntervalMs]);

  const handlePrevSlide = () => {
    setCurrentSlideIdx((prev) => (prev - 1 + safeSlides.length) % safeSlides.length);
  };

  const handleNextSlide = () => {
    setCurrentSlideIdx((prev) => (prev + 1) % safeSlides.length);
  };

  // 다국어 연동 (KR일 때는 관리자에서 설정한 슬라이드/핵심역량 텍스트 우선, 외국어일 때는 번역본과 병행)
  const slideBadge = locale === "KR" ? activeSlide.badge : t.home.badge;
  const slideTitle1 = locale === "KR" ? activeSlide.title1 : t.home.heroTitle1;
  const slideTitle2 = locale === "KR" ? activeSlide.title2 : t.home.heroTitle2;
  const slideHighlight = locale === "KR" ? activeSlide.highlightName : t.company.name;
  const slideDesc =
    locale === "KR" ? activeSlide.description : `${t.company.description}. ${t.home.heroDesc}`;
  const primaryBtnText = locale === "KR" ? activeSlide.primaryBtnText : t.home.btnProducts;
  const secondaryBtnText = locale === "KR" ? activeSlide.secondaryBtnText : t.home.btnSupport;

  const coreTitle = locale === "KR" ? homeConfig.coreSectionTitle : t.home.coreTitle;
  const coreSubtitle = locale === "KR" ? homeConfig.coreSectionSubtitle : t.home.coreSubtitle;

  const displayCores = homeConfig.cores.map((c, idx) => {
    const transCore = t.home.cores[idx];
    return {
      id: c.id,
      title: locale === "KR" || !transCore ? c.title : transCore.title,
      desc: locale === "KR" || !transCore ? c.desc : transCore.desc,
      imageUrl: c.imageUrl || "",
    };
  });

  return (
    <div>
      {/* 1. 멀티 슬라이드 히어로 배너 섹션 (영상 / 이미지 / 기본 배경 지원) */}
      {!hiddenSections.includes("home_hero") && (
      <section
        className="relative overflow-hidden bg-slate-950 text-white min-h-[480px] sm:min-h-[540px] flex items-center"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* 배경 미디어 레이어 (영상 or 이미지 or 기본 그라데이션) */}
        <div className="absolute inset-0 z-0">
          {activeSlide.mediaType === "video" && activeSlide.mediaUrl ? (
            <video
              key={activeSlide.mediaUrl}
              src={activeSlide.mediaUrl}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover opacity-45"
            />
          ) : activeSlide.mediaType === "image" && activeSlide.mediaUrl ? (
            <img
              key={activeSlide.mediaUrl}
              src={activeSlide.mediaUrl}
              alt={activeSlide.title1}
              className="h-full w-full object-cover opacity-35 transition-all duration-700"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900" />
          )}
          {/* 가독성을 위한 어두운 오버레이 그라데이션 */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-slate-900/50" />
        </div>

        {/* 배너 텍스트 & CTA 컨텐츠 */}
        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <div className="flex items-center gap-2">
            <span className="inline-block rounded-full bg-blue-600/25 px-3.5 py-1 text-xs font-semibold text-blue-300 border border-blue-400/30">
              {slideBadge}
            </span>
            {activeSlide.mediaType === "video" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-500/20 px-2.5 py-1 text-[11px] font-bold text-red-300 border border-red-400/30">
                ▶ VIDEO
              </span>
            )}
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl leading-tight">
            {slideTitle1}
            <br />
            {slideTitle2}{" "}
            <span className="text-blue-400">{slideHighlight}</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base text-slate-200 sm:text-lg leading-relaxed">
            {slideDesc}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href={activeSlide.primaryBtnHref || "/products"}
              className="rounded-lg bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-blue-500 transition-colors"
            >
              {primaryBtnText}
            </Link>
            <Link
              href={activeSlide.secondaryBtnHref || "/support"}
              className="rounded-lg border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-xs hover:bg-white/20 transition-colors"
            >
              {secondaryBtnText}
            </Link>
          </div>

          {/* 슬라이드 컨트롤 바 (인디케이터 점 + 이전/다음 화살표 + 슬라이드 번호) */}
          {safeSlides.length > 1 && (
            <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-6">
              <div className="flex items-center gap-2.5">
                {safeSlides.map((s, idx) => {
                  const isCurrent = idx === currentSlideIdx % safeSlides.length;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setCurrentSlideIdx(idx)}
                      aria-label={`Slide ${idx + 1}`}
                      className={`h-2.5 rounded-full transition-all cursor-pointer ${
                        isCurrent
                          ? "w-9 bg-blue-500"
                          : "w-2.5 bg-white/35 hover:bg-white/60"
                      }`}
                    />
                  );
                })}
                <span className="ml-2 font-mono text-xs text-slate-400">
                  0{(currentSlideIdx % safeSlides.length) + 1} / 0{safeSlides.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm text-white hover:bg-blue-600 hover:border-blue-500 transition-colors cursor-pointer"
                  aria-label="Previous Slide"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => setIsPaused((p) => !p)}
                  className="flex h-9 px-3 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xs font-semibold text-white hover:bg-white/20 transition-colors cursor-pointer"
                >
                  {isPaused ? "▶ 재생" : "⏸ 일시정지"}
                </button>
                <button
                  type="button"
                  onClick={handleNextSlide}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm text-white hover:bg-blue-600 hover:border-blue-500 transition-colors cursor-pointer"
                  aria-label="Next Slide"
                >
                  →
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
      )}

      {/* 상단 커스텀 블록 (작은 배너 · 카드# · 이미지) */}
      <CustomPageBlocks page="home" position="top" />

      {/* 2. 핵심 사업 분야 섹션 */}
      {!hiddenSections.includes("home_cores") && (
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {coreTitle}
            </h2>
            <p className="mt-2 text-sm text-slate-600">{coreSubtitle}</p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayCores.map((item) => (
              <div
                key={item.id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-shadow hover:shadow-md flex flex-col"
              >
                {item.imageUrl && (
                  <button
                    type="button"
                    onClick={() =>
                      setZoomImage({
                        src: item.imageUrl,
                        alt: item.title,
                        caption: item.desc,
                      })
                    }
                    className="relative block h-44 w-full overflow-hidden bg-slate-900 text-left cursor-zoom-in"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/35 group-hover:opacity-100">
                      <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-slate-900 shadow">
                        🔍 이미지 확대
                      </span>
                    </div>
                  </button>
                )}
                <div className="p-6 flex-1">
                  <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* 3. 하단 바로가기 작은 배너 섹션 (관리자에서 자유롭게 추가/삭제/문구 컨트롤 가능) */}
      {!hiddenSections.includes("home_mini_banners") &&
      (() => {
        const activeMiniBanners = (
          homeConfig.miniBanners && homeConfig.miniBanners.length > 0
            ? homeConfig.miniBanners
            : defaultHomeConfig.miniBanners || []
        ).filter((mb) => mb.active !== false);

        if (activeMiniBanners.length === 0) return null;

        return (
          <section className="border-t border-slate-200 bg-white py-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <div className="grid gap-6 md:grid-cols-2">
                {activeMiniBanners.map((mb) => {
                  const isBlue = mb.theme === "blue";
                  const isDark = mb.theme === "dark";
                  return (
                    <div
                      key={mb.id}
                      className={`flex flex-col justify-between rounded-2xl border p-8 ${
                        isDark
                          ? "border-slate-800 bg-slate-900 text-white"
                          : isBlue
                          ? "border-blue-100 bg-blue-50 text-slate-900"
                          : "border-slate-200 bg-slate-100 text-slate-900"
                      }`}
                    >
                      <div>
                        <h3 className="text-xl font-bold">{mb.title}</h3>
                        <p
                          className={`mt-2 text-sm ${
                            isDark ? "text-slate-300" : "text-slate-600"
                          }`}
                        >
                          {mb.desc}
                        </p>
                        {mb.btnHref === "/support" && (
                          <p
                            className={`mt-3 text-base font-bold ${
                              isDark ? "text-blue-300" : "text-blue-800"
                            }`}
                          >
                            {t.home.bannerSupportPhone}: {settings.phone}
                          </p>
                        )}
                      </div>
                      {mb.btnText && mb.btnHref && (
                        <Link
                          href={mb.btnHref}
                          className={`mt-6 inline-flex items-center text-sm font-semibold hover:underline ${
                            isDark ? "text-blue-300" : "text-blue-700"
                          }`}
                        >
                          {mb.btnText}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })()}

      {/* 하단 커스텀 블록 (작은 배너 · 카드# · 이미지) */}
      <CustomPageBlocks page="home" position="bottom" />

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
