"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CmsCategory,
  CmsItem,
  SiteSettings,
  SupportInquiry,
  defaultSiteSettings,
  getSiteSettings,
  saveSiteSettings,
  resetSiteSettings,
  fetchCmsItems,
  createCmsItem,
  updateCmsItem,
  deleteCmsItem,
  resetAllCmsItemsToDefault,
  getSupportInquiries,
  toggleInquiryStatus,
  deleteSupportInquiry,
  HomeConfig,
  HomeBannerSlide,
  defaultHomeConfig,
  getHomeConfig,
  saveHomeConfig,
  resetHomeConfig,
  uploadMediaFileToUrl,
} from "@/lib/cms";

type AdminMainTab = "home" | "settings" | CmsCategory | "inquiries";

const CATEGORY_TABS: {
  id: CmsCategory;
  label: string;
  pageHref: string;
  subCategoryPlaceholder: string;
  titleLabel: string;
  titlePlaceholder: string;
  specLabel: string;
  specPlaceholder: string;
  qtyLabel: string;
  qtyPlaceholder: string;
  showMaker?: boolean;
  showImage?: boolean;
}[] = [
  {
    id: "facilities",
    label: "🏭 설비현황 관리",
    pageHref: "/facilities",
    subCategoryPlaceholder: "예: 가공설비 / 주조설비 / 검사설비",
    titleLabel: "설비명 *",
    titlePlaceholder: "예: 5축 복합 머시닝센터 (MCT)",
    specLabel: "규격 / 사양",
    specPlaceholder: "예: 1,200 × 2,000 / 12,000rpm",
    qtyLabel: "보유 수량",
    qtyPlaceholder: "예: 2대",
    showMaker: true,
    showImage: true,
  },
  {
    id: "products",
    label: "⚙️ 제품소개 관리",
    pageHref: "/products",
    subCategoryPlaceholder: "예: 선박·해양 부품 / 중장비 부품 / 산업기계 부품",
    titleLabel: "제품명 *",
    titlePlaceholder: "예: 고압 유압 실린더 블록",
    specLabel: "주요 재질",
    specPlaceholder: "예: GCD450 / 합금강",
    qtyLabel: "모델/구분",
    qtyPlaceholder: "예: 주문제작(OEM)",
    showMaker: false,
    showImage: true,
  },
  {
    id: "technology",
    label: "📜 기술·인증서 관리",
    pageHref: "/technology",
    subCategoryPlaceholder: "예: 품질·환경 경영인증 / 특허·지식재산권 / 선급인증",
    titleLabel: "인증서 / 특허명 *",
    titlePlaceholder: "예: IATF 16949 품질경영시스템 인증",
    specLabel: "발급기관",
    specPlaceholder: "예: 한국품질재단 / 특허청",
    qtyLabel: "취득년월",
    qtyPlaceholder: "예: 2026. 05",
    showMaker: false,
    showImage: true,
  },
  {
    id: "ir",
    label: "📊 투자·공시 관리",
    pageHref: "/ir",
    subCategoryPlaceholder: "예: 정기공시 / 주주총회 / IR자료",
    titleLabel: "공시 / 게시글 제목 *",
    titlePlaceholder: "예: 제29기 정기주주총회 결과 공고",
    specLabel: "출처 / 공시구분",
    specPlaceholder: "예: DART 전자공시 / 회사공고",
    qtyLabel: "등록일",
    qtyPlaceholder: "예: 2026-10-28",
    showMaker: false,
    showImage: false,
  },
];

export default function AdminClient({ slug }: { slug: string }) {
  const companySlug = slug || "noksan";

  const [activeTab, setActiveTab] = useState<AdminMainTab>("home");
  const [homeForm, setHomeForm] = useState<HomeConfig>(defaultHomeConfig);
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(defaultSiteSettings);
  const [items, setItems] = useState<CmsItem[]>([]);
  const [inquiries, setInquiries] = useState<SupportInquiry[]>([]);
  const [loading, setLoading] = useState(false);

  // 게시판/목록 항목 입력 폼 상태
  const [editingId, setEditingId] = useState<string | null>(null);
  const [subCategory, setSubCategory] = useState("");
  const [title, setTitle] = useState("");
  const [specOrMaterial, setSpecOrMaterial] = useState("");
  const [qtyOrDate, setQtyOrDate] = useState("");
  const [maker, setMaker] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab") as AdminMainTab | null;
      if (
        tabParam &&
        ["home", "settings", "facilities", "products", "technology", "ir", "inquiries"].includes(
          tabParam
        )
      ) {
        setActiveTab(tabParam);
      }
    }
    setHomeForm(getHomeConfig(companySlug));
    setSettingsForm(getSiteSettings(companySlug));
    setInquiries(getSupportInquiries(companySlug));
  }, [companySlug]);

  const isCmsCategory = (tab: AdminMainTab): tab is CmsCategory =>
    ["facilities", "products", "technology", "ir"].includes(tab);

  const currentTabConfig =
    CATEGORY_TABS.find((t) => t.id === activeTab) || CATEGORY_TABS[0];

  const loadCategoryData = async () => {
    if (isCmsCategory(activeTab)) {
      const data = await fetchCmsItems(companySlug, activeTab);
      setItems(data);
    } else if (activeTab === "inquiries") {
      setInquiries(getSupportInquiries(companySlug));
    } else if (activeTab === "settings") {
      setSettingsForm(getSiteSettings(companySlug));
    } else if (activeTab === "home") {
      setHomeForm(getHomeConfig(companySlug));
    }
  };

  useEffect(() => {
    resetForm();
    loadCategoryData();
  }, [companySlug, activeTab]);

  const resetForm = () => {
    setEditingId(null);
    setSubCategory("");
    setTitle("");
    setSpecOrMaterial("");
    setQtyOrDate("");
    setMaker("");
    setDescription("");
    setImageUrl("");
    setFile(null);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveSiteSettings(companySlug, settingsForm);
    alert(
      "회사소개, 대표 주소(구글지도 연동), 재무지표, 고객지원 연락처 설정이 모두 저장되었습니다!"
    );
  };

  const handleResetSettings = () => {
    if (!confirm("기업 기본 설정을 초기값으로 되돌리시겠습니까?")) return;
    const reset = resetSiteSettings(companySlug);
    setSettingsForm(reset);
    alert("초기 설정으로 복원되었습니다.");
  };

  const handleEditClick = (item: CmsItem) => {
    setEditingId(item.id);
    setSubCategory(item.subCategory || "");
    setTitle(item.title || "");
    setSpecOrMaterial(item.specOrMaterial || "");
    setQtyOrDate(item.qtyOrDate || "");
    setMaker(item.maker || "");
    setDescription(item.description || "");
    setImageUrl(item.imageUrl?.startsWith("data:image/svg") ? "" : item.imageUrl || "");
    setFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmitCmsItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCmsCategory(activeTab)) return;
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        category: activeTab,
        subCategory: subCategory.trim() || "일반",
        title: title.trim(),
        specOrMaterial: specOrMaterial.trim(),
        qtyOrDate: qtyOrDate.trim(),
        maker: maker.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim(),
      };

      if (editingId) {
        await updateCmsItem(companySlug, editingId, payload, file);
        alert("성공적으로 수정되었습니다! 해당 메뉴 페이지에 즉시 반영됩니다.");
      } else {
        await createCmsItem(companySlug, payload, file);
        alert("성공적으로 등록되었습니다! 해당 메뉴 페이지에 자동 삽입됩니다.");
      }

      resetForm();
      await loadCategoryData();
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCmsItem = async (id: string) => {
    if (!confirm("이 항목을 삭제하시겠습니까?")) return;
    await deleteCmsItem(companySlug, id);
    await loadCategoryData();
  };

  const handleResetCategoryDefaults = async () => {
    if (
      !confirm(
        "기본 샘플 항목을 포함한 전체 목록(설비·제품·인증서·공시)을 초기 상태로 복원하시겠습니까?"
      )
    )
      return;
    resetAllCmsItemsToDefault(companySlug);
    await loadCategoryData();
    alert("기본 항목들이 초기 상태로 복원되었습니다.");
  };

  const handleSaveHomeConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveHomeConfig(companySlug, homeForm);
    alert("홈 화면(배너 영상/이미지 슬라이드, 핵심 역량, 하단 배너) 설정이 모두 저장되었습니다!");
  };

  const handleResetHomeConfig = () => {
    if (!confirm("홈 화면 배너와 섹션 설정을 초기 상태로 되돌리시겠습니까?")) return;
    const reset = resetHomeConfig(companySlug);
    setHomeForm(reset);
    alert("홈 화면 설정이 초기값으로 복원되었습니다.");
  };

  const updateSlideField = (idx: number, patch: Partial<HomeBannerSlide>) => {
    const nextSlides = homeForm.slides.map((s, i) => (i === idx ? { ...s, ...patch } : s));
    setHomeForm({ ...homeForm, slides: nextSlides });
  };

  const handleAddSlide = () => {
    const newSlide: HomeBannerSlide = {
      id: `slide_${Date.now()}`,
      badge: "NEW PROMOTION BANNER",
      title1: "신규 설비 및 기술 역량 안내,",
      title2: "최고의 품질로 보답하는",
      highlightName: settingsForm.name,
      description: "배너 설명 문구를 입력해 주세요. 배경으로 이미지 또는 영상(MP4)을 넣을 수 있습니다.",
      mediaType: "default",
      mediaUrl: "",
      primaryBtnText: "제품소개 보러가기",
      primaryBtnHref: "/products",
      secondaryBtnText: "견적 및 제작 문의",
      secondaryBtnHref: "/support",
      active: true,
    };
    setHomeForm({ ...homeForm, slides: [...homeForm.slides, newSlide] });
  };

  const handleRemoveSlide = (idx: number) => {
    if (homeForm.slides.length <= 1) {
      alert("최소 1개의 배너 슬라이드는 유지되어야 합니다.");
      return;
    }
    if (!confirm(`배너 #${idx + 1} 슬라이드를 삭제하시겠습니까?`)) return;
    setHomeForm({
      ...homeForm,
      slides: homeForm.slides.filter((_, i) => i !== idx),
    });
  };

  const handleSlideMediaUpload = async (idx: number, mediaFile: File | null) => {
    if (!mediaFile) return;
    setLoading(true);
    try {
      const url = await uploadMediaFileToUrl(companySlug, mediaFile);
      const isVideo = mediaFile.type.startsWith("video/");
      updateSlideField(idx, {
        mediaType: isVideo ? "video" : "image",
        mediaUrl: url,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCoreImageUpload = async (idx: number, imgFile: File | null) => {
    if (!imgFile) return;
    setLoading(true);
    try {
      const url = await uploadMediaFileToUrl(companySlug, imgFile);
      const nextCores = homeForm.cores.map((c, i) =>
        i === idx ? { ...c, imageUrl: url } : c
      );
      setHomeForm({ ...homeForm, cores: nextCores });
    } finally {
      setLoading(false);
    }
  };

  const previewHref =
    activeTab === "home"
      ? "/"
      : activeTab === "settings"
      ? "/about"
      : activeTab === "inquiries"
      ? "/support"
      : currentTabConfig.pageHref;

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* 상단 헤더 배너 */}
        <div className="flex flex-col justify-between gap-4 rounded-2xl bg-slate-900 p-6 text-white sm:flex-row sm:items-center sm:p-8">
          <div>
            <span className="inline-block rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300">
              ALL-IN-ONE CMS DASHBOARD
            </span>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
              🛠️ {settingsForm.name} 통합 관리자 페이지
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              홈 화면(멀티 배너 영상·이미지 슬라이드), 회사소개, 설비현황, 제품소개, 기술정보, 투자정보, 고객지원의 모든 기능을 관리자에서 컨트롤할 수 있습니다.
            </p>
          </div>
          <Link
            href={previewHref}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-500 transition-colors shrink-0"
          >
            현재 메뉴 화면 보러가기 ({previewHref}) ↗
          </Link>
        </div>

        {/* 7대 전체 메뉴 관리 탭 */}
        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          <button
            type="button"
            onClick={() => setActiveTab("home")}
            className={`rounded-xl px-3 py-3.5 text-xs font-bold transition-all cursor-pointer ${
              activeTab === "home"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            🏠 홈 화면·배너관리
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            className={`rounded-xl px-3 py-3.5 text-xs font-bold transition-all cursor-pointer ${
              activeTab === "settings"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            🏢 회사소개·기본정보
          </button>

          {CATEGORY_TABS.map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-xl px-3 py-3.5 text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {tab.label}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setActiveTab("inquiries")}
            className={`rounded-xl px-3 py-3.5 text-xs font-bold transition-all cursor-pointer ${
              activeTab === "inquiries"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            📞 고객지원·문의내역
          </button>
        </div>

        {/* 0) 홈 화면 · 멀티 배너(영상/이미지/기본화면) · 핵심역량 컨트롤 탭 */}
        {activeTab === "home" && (
          <form
            onSubmit={handleSaveHomeConfig}
            className="mt-6 space-y-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  🏠 홈 화면 멀티 배너(영상·이미지·기본화면) 및 기능별 섹션 관리
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  메인 배너를 2~3개 이상 자유롭게 구성하고, 각 슬라이드마다 동영상(MP4/URL), 고화질 이미지, 또는 깔끔한 기본 배경 중 원하는 방식을 선택해 교체할 수 있습니다.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddSlide}
                  className="rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
                >
                  + 배너 슬라이드 추가
                </button>
                <button
                  type="button"
                  onClick={handleResetHomeConfig}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  초기값 복원
                </button>
              </div>
            </div>

            {/* 배너 자동 롤링 간격 설정 */}
            <div className="flex flex-wrap items-center gap-4 rounded-xl bg-slate-50 p-4 border border-slate-200">
              <label className="text-xs font-bold text-slate-700">
                ⏱️ 배너 자동 전환 간격 (밀리초, 1000 = 1초):
              </label>
              <input
                type="number"
                min={2500}
                step={500}
                value={homeForm.autoPlayIntervalMs}
                onChange={(e) =>
                  setHomeForm({
                    ...homeForm,
                    autoPlayIntervalMs: Number(e.target.value) || 5000,
                  })
                }
                className="w-32 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-bold text-blue-700"
              />
              <span className="text-xs text-slate-500">
                현재 {(homeForm.autoPlayIntervalMs / 1000).toFixed(1)}초마다 다음 배너로 자동 전환됩니다.
              </span>
            </div>

            {/* 슬라이드별 상세 편집 카드 리스트 */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-blue-700">
                1. 메인 히어로 배너 슬라이드 목록 (총 {homeForm.slides.length}개)
              </h3>

              {homeForm.slides.map((slide, idx) => (
                <div
                  key={slide.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 sm:p-6 space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-extrabold text-white">
                        배너 #{idx + 1}
                      </span>
                      <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={slide.active !== false}
                          onChange={(e) =>
                            updateSlideField(idx, { active: e.target.checked })
                          }
                          className="h-4 w-4 rounded border-slate-300 text-blue-600"
                        />
                        홈 화면에 이 배너 노출하기
                      </label>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveSlide(idx)}
                      className="text-xs font-semibold text-red-600 hover:underline cursor-pointer"
                    >
                      이 배너 삭제
                    </button>
                  </div>

                  {/* 배경 타입 선택 (기본 화면 / 이미지 배너 / 동영상 배너) */}
                  <div className="grid gap-4 lg:grid-cols-12 items-start">
                    <div className="lg:col-span-5 space-y-3 rounded-xl border border-slate-200 bg-white p-4">
                      <label className="block text-xs font-bold text-slate-800">
                        배경 화면 방식 선택 (기본화면 / 이미지 / 동영상)
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(
                          [
                            { type: "default", label: "🎨 기본 화면" },
                            { type: "image", label: "🖼️ 이미지 배너" },
                            { type: "video", label: "🎬 동영상 배너" },
                          ] as const
                        ).map((opt) => (
                          <button
                            key={opt.type}
                            type="button"
                            onClick={() =>
                              updateSlideField(idx, { mediaType: opt.type })
                            }
                            className={`rounded-lg py-2 px-2 text-xs font-bold border transition-all cursor-pointer ${
                              slide.mediaType === opt.type
                                ? "border-blue-600 bg-blue-50 text-blue-700"
                                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>

                      {slide.mediaType !== "default" && (
                        <div className="space-y-2 pt-2">
                          <label className="block text-[11px] font-semibold text-slate-600">
                            {slide.mediaType === "video"
                              ? "동영상 파일(.mp4, .webm) 업로드 또는 영상 URL 입력"
                              : "배너 이미지 파일 업로드 또는 이미지 URL 입력"}
                          </label>
                          <input
                            type="file"
                            accept={
                              slide.mediaType === "video" ? "video/*" : "image/*"
                            }
                            onChange={(e) =>
                              handleSlideMediaUpload(idx, e.target.files?.[0] || null)
                            }
                            className="w-full text-xs text-slate-600 file:mr-2 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-blue-500"
                          />
                          <input
                            type="text"
                            value={
                              slide.mediaUrl.startsWith("data:")
                                ? ""
                                : slide.mediaUrl
                            }
                            onChange={(e) =>
                              updateSlideField(idx, { mediaUrl: e.target.value })
                            }
                            placeholder={
                              slide.mediaType === "video"
                                ? "https://.../factory-video.mp4"
                                : "https://.../banner-image.jpg"
                            }
                            className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                          />
                        </div>
                      )}

                      {/* 실시간 미니 프리뷰 */}
                      <div className="relative h-32 w-full overflow-hidden rounded-lg bg-slate-950 flex items-center justify-center text-white">
                        {slide.mediaType === "video" && slide.mediaUrl ? (
                          <video
                            src={slide.mediaUrl}
                            muted
                            loop
                            autoPlay
                            playsInline
                            className="h-full w-full object-cover opacity-65"
                          />
                        ) : slide.mediaType === "image" && slide.mediaUrl ? (
                          <img
                            src={slide.mediaUrl}
                            alt={slide.title1}
                            className="h-full w-full object-cover opacity-65"
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900" />
                        )}
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/35 p-3 text-center">
                          <span className="text-[10px] text-blue-300 font-semibold">
                            {slide.badge}
                          </span>
                          <p className="mt-1 text-xs font-bold line-clamp-1">
                            {slide.title1} {slide.highlightName}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 배너 문구 및 버튼 링크 편집 */}
                    <div className="lg:col-span-7 grid gap-3 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          상단 뱃지 문구
                        </label>
                        <input
                          type="text"
                          value={slide.badge}
                          onChange={(e) =>
                            updateSlideField(idx, { badge: e.target.value })
                          }
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          메인 타이틀 첫째 줄
                        </label>
                        <input
                          type="text"
                          value={slide.title1}
                          onChange={(e) =>
                            updateSlideField(idx, { title1: e.target.value })
                          }
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          메인 타이틀 둘째 줄 + 강조문구(파란색)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={slide.title2}
                            onChange={(e) =>
                              updateSlideField(idx, { title2: e.target.value })
                            }
                            placeholder="신뢰할 수 있는 파트너"
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                          />
                          <input
                            type="text"
                            value={slide.highlightName}
                            onChange={(e) =>
                              updateSlideField(idx, {
                                highlightName: e.target.value,
                              })
                            }
                            placeholder="강조 텍스트"
                            className="w-40 shrink-0 rounded-lg border border-blue-300 bg-blue-50/40 px-3 py-2 text-sm font-bold text-blue-700"
                          />
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          배너 서브 설명 문구
                        </label>
                        <textarea
                          rows={2}
                          value={slide.description}
                          onChange={(e) =>
                            updateSlideField(idx, { description: e.target.value })
                          }
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          버튼 1 텍스트 및 이동 경로
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={slide.primaryBtnText}
                            onChange={(e) =>
                              updateSlideField(idx, {
                                primaryBtnText: e.target.value,
                              })
                            }
                            className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs"
                          />
                          <input
                            type="text"
                            value={slide.primaryBtnHref}
                            onChange={(e) =>
                              updateSlideField(idx, {
                                primaryBtnHref: e.target.value,
                              })
                            }
                            className="w-28 shrink-0 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-mono"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          버튼 2 텍스트 및 이동 경로
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={slide.secondaryBtnText}
                            onChange={(e) =>
                              updateSlideField(idx, {
                                secondaryBtnText: e.target.value,
                              })
                            }
                            className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs"
                          />
                          <input
                            type="text"
                            value={slide.secondaryBtnHref}
                            onChange={(e) =>
                              updateSlideField(idx, {
                                secondaryBtnHref: e.target.value,
                              })
                            }
                            className="w-28 shrink-0 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 2. 홈 화면 핵심 사업 분야 카드 관리 */}
            <div className="border-t border-slate-200 pt-6 space-y-4">
              <h3 className="text-sm font-bold text-blue-700">
                2. 홈 화면 [핵심 사업 분야] 섹션 제목 · 카드 3종 수정
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    섹션 메인 제목
                  </label>
                  <input
                    type="text"
                    value={homeForm.coreSectionTitle}
                    onChange={(e) =>
                      setHomeForm({ ...homeForm, coreSectionTitle: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    섹션 서브 설명
                  </label>
                  <input
                    type="text"
                    value={homeForm.coreSectionSubtitle}
                    onChange={(e) =>
                      setHomeForm({
                        ...homeForm,
                        coreSectionSubtitle: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {homeForm.cores.map((core, idx) => (
                  <div
                    key={core.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3"
                  >
                    <span className="text-xs font-bold text-blue-700">
                      핵심역량 카드 #{idx + 1}
                    </span>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        카드 제목
                      </label>
                      <input
                        type="text"
                        value={core.title}
                        onChange={(e) => {
                          const next = homeForm.cores.map((c, i) =>
                            i === idx ? { ...c, title: e.target.value } : c
                          );
                          setHomeForm({ ...homeForm, cores: next });
                        }}
                        className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-sm font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        카드 설명
                      </label>
                      <textarea
                        rows={3}
                        value={core.desc}
                        onChange={(e) => {
                          const next = homeForm.cores.map((c, i) =>
                            i === idx ? { ...c, desc: e.target.value } : c
                          );
                          setHomeForm({ ...homeForm, cores: next });
                        }}
                        className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        카드 썸네일 사진 교체 (선택)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleCoreImageUpload(idx, e.target.files?.[0] || null)
                        }
                        className="w-full text-[11px] text-slate-600 file:mr-2 file:rounded file:border-0 file:bg-blue-600 file:px-2.5 file:py-1 file:text-[11px] file:font-semibold file:text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. 홈 하단 바로가기 배너 2종 컨트롤 */}
            <div className="border-t border-slate-200 pt-6 space-y-4">
              <h3 className="text-sm font-bold text-blue-700">
                3. 홈 하단 바로가기 배너 2종 (설비현황 / 견적문의) 노출 및 문구 설정
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-4 space-y-2">
                  <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={homeForm.showFacilitiesBanner}
                      onChange={(e) =>
                        setHomeForm({
                          ...homeForm,
                          showFacilitiesBanner: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded text-blue-600"
                    />
                    좌측 [보유 설비 현황] 배너 노출
                  </label>
                  <input
                    type="text"
                    value={homeForm.facilitiesBannerTitle}
                    onChange={(e) =>
                      setHomeForm({
                        ...homeForm,
                        facilitiesBannerTitle: e.target.value,
                      })
                    }
                    className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm font-bold"
                  />
                  <input
                    type="text"
                    value={homeForm.facilitiesBannerDesc}
                    onChange={(e) =>
                      setHomeForm({
                        ...homeForm,
                        facilitiesBannerDesc: e.target.value,
                      })
                    }
                    className="w-full rounded border border-slate-300 px-3 py-1.5 text-xs"
                  />
                </div>

                <div className="rounded-xl border border-slate-200 p-4 space-y-2">
                  <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={homeForm.showSupportBanner}
                      onChange={(e) =>
                        setHomeForm({
                          ...homeForm,
                          showSupportBanner: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded text-blue-600"
                    />
                    우측 [고객지원 및 견적문의] 배너 노출
                  </label>
                  <input
                    type="text"
                    value={homeForm.supportBannerTitle}
                    onChange={(e) =>
                      setHomeForm({
                        ...homeForm,
                        supportBannerTitle: e.target.value,
                      })
                    }
                    className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm font-bold"
                  />
                  <input
                    type="text"
                    value={homeForm.supportBannerDesc}
                    onChange={(e) =>
                      setHomeForm({
                        ...homeForm,
                        supportBannerDesc: e.target.value,
                      })
                    }
                    className="w-full rounded border border-slate-300 px-3 py-1.5 text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-bold text-white hover:bg-blue-500 transition-colors cursor-pointer"
              >
                💾 홈 화면·배너 설정 모두 저장하기
              </button>
            </div>
          </form>
        )}

        {/* 1) 회사소개 · 주소(구글지도) · 재무지표 · 연락처 통합 수정 탭 */}
        {activeTab === "settings" && (
          <form
            onSubmit={handleSaveSettings}
            className="mt-6 space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  🏢 회사소개 · 오시는 길(구글지도 주소) · 투자지표 · 고객지원 연락처 수정
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  여기서 수정한 내용은 상단 헤더, 하단 푸터, 회사소개, 오시는 길 구글지도, 투자정보, 고객지원 페이지에 즉시 반영됩니다.
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetSettings}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                기본값으로 복원
              </button>
            </div>

            {/* 기업 기본 개요 및 주소(구글 지도 연동) */}
            <div>
              <h3 className="text-sm font-bold text-blue-700 mb-3">
                1. 기업 개요 및 오시는 길(구글 지도) 주소
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    상호명 (국문)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.name}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, name: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    상호명 (영문)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.englishName}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, englishName: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    대표이사 성함
                  </label>
                  <input
                    type="text"
                    value={settingsForm.ceo}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, ceo: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    사업자등록번호
                  </label>
                  <input
                    type="text"
                    value={settingsForm.businessNumber}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        businessNumber: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    설립일
                  </label>
                  <input
                    type="text"
                    value={settingsForm.established}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, established: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    주요 사업 한줄 소개
                  </label>
                  <input
                    type="text"
                    value={settingsForm.description}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, description: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    📍 회사 주소 (입력한 주소 위치가 회사소개 &gt; 오시는 길 구글 지도에 자동 표시됩니다)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.address}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, address: e.target.value })
                    }
                    className="w-full rounded-lg border border-blue-400 bg-blue-50/30 px-3.5 py-2.5 text-sm font-medium text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* CEO 인사말 및 비전 */}
            <div className="border-t border-slate-100 pt-5">
              <h3 className="text-sm font-bold text-blue-700 mb-3">
                2. CEO 인사말 및 비전 슬로건
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    CEO 인사말 헤드라인 문구
                  </label>
                  <input
                    type="text"
                    value={settingsForm.ceoGreetingLead}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        ceoGreetingLead: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    CEO 인사말 본문 (줄바꿈으로 문단이 나뉩니다)
                  </label>
                  <textarea
                    rows={4}
                    value={settingsForm.ceoGreetingBody}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        ceoGreetingBody: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      VISION 2030 메인 슬로건
                    </label>
                    <input
                      type="text"
                      value={settingsForm.visionSlogan}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          visionSlogan: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      비전 서브 설명
                    </label>
                    <input
                      type="text"
                      value={settingsForm.visionSubSlogan}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          visionSubSlogan: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 투자정보 재무지표 */}
            <div className="border-t border-slate-100 pt-5">
              <h3 className="text-sm font-bold text-blue-700 mb-3">
                3. 투자정보 주요 경영·재무 하이라이트 수치
              </h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 p-3.5">
                  <label className="block text-xs font-bold text-slate-700">
                    매출액 표시값 / 보조설명
                  </label>
                  <input
                    type="text"
                    value={settingsForm.irRevenue}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, irRevenue: e.target.value })
                    }
                    className="mt-1.5 w-full rounded border border-slate-300 px-2.5 py-1.5 text-sm font-bold text-blue-700"
                  />
                  <input
                    type="text"
                    value={settingsForm.irRevenueNote}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        irRevenueNote: e.target.value,
                      })
                    }
                    className="mt-1.5 w-full rounded border border-slate-200 px-2.5 py-1 text-xs text-slate-600"
                  />
                </div>
                <div className="rounded-xl border border-slate-200 p-3.5">
                  <label className="block text-xs font-bold text-slate-700">
                    영업이익률 표시값 / 보조설명
                  </label>
                  <input
                    type="text"
                    value={settingsForm.irMargin}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, irMargin: e.target.value })
                    }
                    className="mt-1.5 w-full rounded border border-slate-300 px-2.5 py-1.5 text-sm font-bold text-blue-700"
                  />
                  <input
                    type="text"
                    value={settingsForm.irMarginNote}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, irMarginNote: e.target.value })
                    }
                    className="mt-1.5 w-full rounded border border-slate-200 px-2.5 py-1 text-xs text-slate-600"
                  />
                </div>
                <div className="rounded-xl border border-slate-200 p-3.5">
                  <label className="block text-xs font-bold text-slate-700">
                    신용등급 표시값 / 보조설명
                  </label>
                  <input
                    type="text"
                    value={settingsForm.irCredit}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, irCredit: e.target.value })
                    }
                    className="mt-1.5 w-full rounded border border-slate-300 px-2.5 py-1.5 text-sm font-bold text-blue-700"
                  />
                  <input
                    type="text"
                    value={settingsForm.irCreditNote}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, irCreditNote: e.target.value })
                    }
                    className="mt-1.5 w-full rounded border border-slate-200 px-2.5 py-1 text-xs text-slate-600"
                  />
                </div>
              </div>
            </div>

            {/* 고객지원 연락처 정보 */}
            <div className="border-t border-slate-100 pt-5">
              <h3 className="text-sm font-bold text-blue-700 mb-3">
                4. 고객지원 연락처 및 업무시간 안내
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    대표전화
                  </label>
                  <input
                    type="text"
                    value={settingsForm.phone}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, phone: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    팩스번호
                  </label>
                  <input
                    type="text"
                    value={settingsForm.fax}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, fax: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    이메일
                  </label>
                  <input
                    type="text"
                    value={settingsForm.email}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, email: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    업무시간 안내
                  </label>
                  <input
                    type="text"
                    value={settingsForm.operatingHours}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        operatingHours: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-bold text-white hover:bg-blue-500 transition-colors cursor-pointer"
              >
                💾 전체 기본정보 설정 저장하기
              </button>
            </div>
          </form>
        )}

        {/* 2) 설비현황 / 제품소개 / 기술인증서 / 투자공시 관리 탭 */}
        {isCmsCategory(activeTab) && (
          <>
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900">
                  {editingId
                    ? `✏️ 선택한 항목 수정하기 (${currentTabConfig.label})`
                    : `➕ 신규 항목 등록 (${currentTabConfig.label})`}
                </h2>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                  >
                    + 신규 등록 모드로 전환
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmitCmsItem} className="mt-6 space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      분류 / 카테고리
                    </label>
                    <input
                      type="text"
                      value={subCategory}
                      onChange={(e) => setSubCategory(e.target.value)}
                      placeholder={currentTabConfig.subCategoryPlaceholder}
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {currentTabConfig.titleLabel}
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={currentTabConfig.titlePlaceholder}
                      required
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {currentTabConfig.specLabel}
                    </label>
                    <input
                      type="text"
                      value={specOrMaterial}
                      onChange={(e) => setSpecOrMaterial(e.target.value)}
                      placeholder={currentTabConfig.specPlaceholder}
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {currentTabConfig.qtyLabel}
                    </label>
                    <input
                      type="text"
                      value={qtyOrDate}
                      onChange={(e) => setQtyOrDate(e.target.value)}
                      placeholder={currentTabConfig.qtyPlaceholder}
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  {currentTabConfig.showMaker && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        제조사
                      </label>
                      <input
                        type="text"
                        value={maker}
                        onChange={(e) => setMaker(e.target.value)}
                        placeholder="예: 두산공작기계 / 현대위아"
                        className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    상세 설명
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="특징, 가공 사양 또는 상세 설명을 입력해 주세요."
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                </div>

                {currentTabConfig.showImage && (
                  <div className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        사진 파일 업로드 (내 PC에서 선택)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-600 file:px-3.5 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        또는 외부 이미지 주소(URL) 직접 입력
                      </label>
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-500 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {loading
                      ? "저장 중..."
                      : editingId
                      ? "💾 수정 내용 저장하기"
                      : "➕ 홈페이지에 등록하기"}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                      취소
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* 기존 항목 + 신규 항목 전체 목록 (모두 수정/삭제 가능) */}
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    현재 홈페이지에 표시 중인 전체 목록 ({items.length}건)
                  </h2>
                  <p className="text-xs text-slate-500">
                    기존 기본 항목들도 [수정] 버튼을 눌러 이름, 규격, 사진 등을 자유롭게 변경하거나 [삭제]할 수 있습니다.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetCategoryDefaults}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  기본 샘플 목록으로 초기화
                </button>
              </div>

              <div className="divide-y divide-slate-200">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col justify-between gap-4 py-4 sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center gap-4">
                      {currentTabConfig.showImage && (
                        <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-900">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[11px] text-slate-400">
                              이미지 없음
                            </div>
                          )}
                        </div>
                      )}
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                            {item.subCategory}
                          </span>
                          <h3 className="font-bold text-slate-900">{item.title}</h3>
                        </div>
                        <p className="mt-1 text-xs text-slate-600">
                          {item.specOrMaterial && `${currentTabConfig.specLabel}: ${item.specOrMaterial}`}
                          {item.qtyOrDate && ` | ${currentTabConfig.qtyLabel}: ${item.qtyOrDate}`}
                          {item.maker && ` | 제조사: ${item.maker}`}
                        </p>
                        {item.description && (
                          <p className="mt-1 text-xs text-slate-500 line-clamp-1">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEditClick(item)}
                        className="rounded-lg border border-blue-600 bg-blue-50 px-3.5 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
                      >
                        ✏️ 수정
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCmsItem(item.id)}
                        className="rounded-lg bg-red-500 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-600 transition-colors cursor-pointer"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* 3) 고객지원 (온라인 문의 접수 내역 및 연락처 관리) 탭 */}
        {activeTab === "inquiries" && (
          <div className="mt-6 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    📞 고객지원 온라인 견적·상담 문의 접수 내역 ({inquiries.length}건)
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    고객지원(문의하기) 페이지에서 고객이 등록한 문의 내역입니다. 답변 상태 변경 및 삭제가 가능합니다.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("settings")}
                  className="rounded-lg border border-blue-200 bg-blue-50 px-3.5 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 cursor-pointer"
                >
                  대표전화·팩스·이메일·주소 수정하러 가기 →
                </button>
              </div>

              {inquiries.length === 0 ? (
                <div className="py-12 text-center text-sm text-slate-500">
                  접수된 고객 문의가 없습니다.
                </div>
              ) : (
                <div className="mt-4 divide-y divide-slate-200">
                  {inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="flex flex-col justify-between gap-4 py-5 sm:flex-row sm:items-start"
                    >
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                              inq.status === "답변완료"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {inq.status}
                          </span>
                          <span className="text-xs text-slate-400">{inq.createdAt}</span>
                          <h3 className="text-base font-bold text-slate-900">
                            {inq.subject}
                          </h3>
                        </div>
                        <p className="text-xs font-semibold text-slate-700">
                          업체/성함: {inq.companyAndName} | 연락처: {inq.phone}{" "}
                          {inq.email && `| 이메일: ${inq.email}`}
                        </p>
                        <p className="rounded-lg bg-slate-50 p-3 text-xs leading-relaxed text-slate-700">
                          {inq.message}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            toggleInquiryStatus(companySlug, inq.id);
                            setInquiries(getSupportInquiries(companySlug));
                          }}
                          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                        >
                          {inq.status === "대기중" ? "답변완료로 표시" : "대기중으로 변경"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!confirm("이 문의 내역을 삭제하시겠습니까?")) return;
                            deleteSupportInquiry(companySlug, inq.id);
                            setInquiries(getSupportInquiries(companySlug));
                          }}
                          className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600 cursor-pointer"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
