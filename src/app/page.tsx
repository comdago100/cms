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
} from "@/lib/cms";
import { ImageLightbox } from "@/components/ImageLightbox";

export default function HomePage() {
  const { locale, t } = useLanguage();
  const [homeConfig, setHomeConfig] = useState<HomeConfig>(defaultHomeConfig);
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [zoomImage, setZoomImage] = useState<{ src: string; alt: string; caption?: string } | null>(
    null
  );

  useEffect(() => {
    const load = () => {
      setHomeConfig(getHomeConfig("noksan"));
      setSettings(getSiteSettings("noksan"));
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

  const adminHomeBtnLabel =
    locale === "KR"
      ? "홈 배너(영상/이미지) · 섹션 관리 (관리자)"
      : locale === "EN"
      ? "Manage Home Banners & Sections (Admin)"
      : locale === "CN"
      ? "管理首页轮播图/视频与板块 (管理员)"
      : "ホームバナー(動画/画像)・セクション管理";

  return (
    <div>
      {/* 1. 멀티 슬라이드 히어로 배너 섹션 (영상 / 이미지 / 기본 배경 지원) */}
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

        {/* 우측 상단 관리자 바로가기 플로팅 버튼 */}
        <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
          <Link
            href="/noksan/admin?tab=home"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-black/50 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur-xs hover:bg-blue-600 hover:border-blue-500 transition-colors"
          >
            🎬 {adminHomeBtnLabel}
          </Link>
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

      {/* 2. 핵심 사업 분야 섹션 (이미지 클릭 확대 + 관리자에서 제목/설명/사진 수정 가능) */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {coreTitle}
              </h2>
              <p className="mt-2 text-sm text-slate-600">{coreSubtitle}</p>
            </div>
            <Link
              href="/noksan/admin?tab=home"
              className="text-xs font-semibold text-blue-600 hover:underline shrink-0"
            >
              ⚙️ 핵심 역량 카드 수정 →
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
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

      {/* 3. 하단 바로가기 배너 섹션 (관리자에서 노출 여부 및 문구 컨트롤 가능) */}
      {(homeConfig.showFacilitiesBanner || homeConfig.showSupportBanner) && (
        <section className="border-t border-slate-200 bg-white py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid gap-6 md:grid-cols-2">
              {homeConfig.showFacilitiesBanner && (
                <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-100 p-8">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {locale === "KR"
                        ? homeConfig.facilitiesBannerTitle
                        : t.home.bannerFacilitiesTitle}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                      {locale === "KR"
                        ? homeConfig.facilitiesBannerDesc
                        : t.home.bannerFacilitiesDesc}
                    </p>
                  </div>
                  <Link
                    href="/facilities"
                    className="mt-6 inline-flex items-center text-sm font-semibold text-blue-700 hover:underline"
                  >
                    {t.home.bannerFacilitiesLink}
                  </Link>
                </div>
              )}

              {homeConfig.showSupportBanner && (
                <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-blue-50 p-8">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {locale === "KR"
                        ? homeConfig.supportBannerTitle
                        : t.home.bannerSupportTitle}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                      {locale === "KR"
                        ? homeConfig.supportBannerDesc
                        : t.home.bannerSupportDesc}
                    </p>
                    <p className="mt-3 text-base font-bold text-blue-800">
                      {t.home.bannerSupportPhone}: {settings.phone}
                    </p>
                  </div>
                  <Link
                    href="/support"
                    className="mt-6 inline-flex items-center text-sm font-semibold text-blue-700 hover:underline"
                  >
                    {t.home.bannerSupportLink}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

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
