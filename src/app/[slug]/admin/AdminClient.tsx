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
  HomeCoreItem,
  HomeMiniBanner,
  PageKey,
  defaultHomeConfig,
  getHomeConfig,
  saveHomeConfig,
  resetHomeConfig,
  uploadMediaFileToUrl,
  makeSvgDataUrl,
  FacilityTabsConfig,
  defaultFacilityTabsConfig,
  defaultCategoryTabsConfig,
  getCategoryTabsConfig,
  saveCategoryTabsConfig,
  resetCategoryTabsConfig,
  renameCategoryTab,
  updateCmsItemLink,
  normalizeExternalUrl,
  AboutConfig,
  defaultAboutConfig,
  getAboutConfig,
  saveAboutConfig,
  resetAboutConfig,
  SupportConfig,
  defaultSupportConfig,
  getSupportConfig,
  saveSupportConfig,
  resetSupportConfig,
  formatFileSize,
  triggerBrowserDownload,
} from "@/lib/cms";
import { AdminPageBlockBuilder } from "@/components/AdminPageBlockBuilder";

type AdminMainTab = "home" | "settings" | CmsCategory | "inquiries";

const GNB_MENU_ITEMS: { href: string; label: string; note?: string }[] = [
  { href: "/about", label: "회사소개" },
  { href: "/facilities", label: "설비현황" },
  { href: "/products", label: "제품소개" },
  { href: "/technology", label: "기술정보" },
  { href: "/ir", label: "투자정보", note: "비상장 기업 등 불필요 시 사용안함 가능" },
  { href: "/support", label: "고객지원" },
];

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
  const [aboutForm, setAboutForm] = useState<AboutConfig>(defaultAboutConfig);
  const [selectedAboutSubTab, setSelectedAboutSubTab] = useState<string>("greeting");
  const [newAboutTabLabel, setNewAboutTabLabel] = useState<string>("");
  const [supportForm, setSupportForm] = useState<SupportConfig>(defaultSupportConfig);
  const [selectedSupportSubTab, setSelectedSupportSubTab] = useState<string>("inquiry");
  const [newSupportTabLabel, setNewSupportTabLabel] = useState<string>("");
  const [facilityTabsForm, setFacilityTabsForm] = useState<FacilityTabsConfig>(
    defaultFacilityTabsConfig
  );
  const [newFacilityTabName, setNewFacilityTabName] = useState("");
  const [inlineLinks, setInlineLinks] = useState<Record<string, string>>({});
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
  const [linkUrl, setLinkUrl] = useState("");
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
    setAboutForm(getAboutConfig(companySlug));
    setSupportForm(getSupportConfig(companySlug));
    setFacilityTabsForm(getCategoryTabsConfig(companySlug, "facilities"));
    setInquiries(getSupportInquiries(companySlug));
  }, [companySlug]);

  const isCmsCategory = (tab: AdminMainTab): tab is CmsCategory =>
    ["facilities", "products", "technology", "ir"].includes(tab);

  const hasSubTabsManager = (
    tab: AdminMainTab
  ): tab is "facilities" | "products" | "technology" =>
    tab === "facilities" || tab === "products" || tab === "technology";

  const currentTabConfig =
    CATEGORY_TABS.find((t) => t.id === activeTab) || CATEGORY_TABS[0];

  const loadCategoryData = async () => {
    if (isCmsCategory(activeTab)) {
      const data = await fetchCmsItems(companySlug, activeTab);
      setItems(data);
      const nextLinks: Record<string, string> = {};
      for (const item of data) {
        nextLinks[item.id] =
          item.linkUrl !== undefined
            ? item.linkUrl
            : item.id.startsWith("seed_ir_")
            ? "https://dart.fss.or.kr"
            : "";
      }
      setInlineLinks(nextLinks);
      const tabCfg = getCategoryTabsConfig(companySlug, activeTab);
      setFacilityTabsForm(tabCfg);
      setNewFacilityTabName("");
      if (!editingId && tabCfg.tabs.length > 0) {
        setSubCategory(tabCfg.tabs[0]);
      }
    } else if (activeTab === "inquiries") {
      setInquiries(getSupportInquiries(companySlug));
      setSupportForm(getSupportConfig(companySlug));
    } else if (activeTab === "settings") {
      setSettingsForm(getSiteSettings(companySlug));
      setAboutForm(getAboutConfig(companySlug));
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
    const defaultCat = isCmsCategory(activeTab)
      ? getCategoryTabsConfig(companySlug, activeTab).tabs[0] || ""
      : "";
    setSubCategory(defaultCat);
    setTitle("");
    setSpecOrMaterial("");
    setQtyOrDate("");
    setMaker("");
    setDescription("");
    setImageUrl("");
    setLinkUrl("");
    setFile(null);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveSiteSettings(companySlug, settingsForm);
    saveAboutConfig(companySlug, aboutForm);
    window.dispatchEvent(new Event("cms-save-all-drafts"));
    alert(
      "회사소개(모든 탭별 상세 내용), 대표 주소(구글지도 연동), 재무지표, 고객지원 연락처 설정이 모두 저장되었습니다!"
    );
  };

  const handleSaveSupportConfig = () => {
    saveSupportConfig(companySlug, supportForm);
    window.dispatchEvent(new Event("cms-save-all-drafts"));
    alert("고객지원 상단 탭 메뉴 및 첨부파일 다운로드 자료실 설정이 저장되었습니다!");
  };

  const handleResetSupportConfig = () => {
    if (!confirm("고객지원 상단 탭 구성과 첨부파일 목록을 초기값으로 되돌리시겠습니까?")) return;
    const reset = resetSupportConfig(companySlug);
    setSupportForm(reset);
    setSelectedSupportSubTab("inquiry");
    alert("고객지원 탭 및 자료실이 초기 상태로 복원되었습니다.");
  };

  const handleResetSettings = () => {
    if (!confirm("기업 기본 설정과 회사소개 탭 구성을 초기값으로 되돌리시겠습니까?")) return;
    const reset = resetSiteSettings(companySlug);
    const resetAbout = resetAboutConfig(companySlug);
    setSettingsForm(reset);
    setAboutForm(resetAbout);
    setSelectedAboutSubTab("greeting");
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
    setLinkUrl(
      item.linkUrl !== undefined
        ? item.linkUrl
        : item.id.startsWith("seed_ir_")
        ? "https://dart.fss.or.kr"
        : ""
    );
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
      const resolvedSubCategory =
        hasSubTabsManager(activeTab)
          ? facilityTabsForm.tabs.includes(subCategory.trim())
            ? subCategory.trim()
            : facilityTabsForm.tabs[0] || "일반"
          : subCategory.trim() || "일반";

      const payload = {
        category: activeTab,
        subCategory: resolvedSubCategory,
        title: title.trim(),
        specOrMaterial: specOrMaterial.trim(),
        qtyOrDate: qtyOrDate.trim(),
        maker: maker.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim(),
        linkUrl: linkUrl.trim(),
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

  // 설비현황 / 제품소개 / 기술정보 상단 탭 메뉴 관리 핸들러 ('상단 탭 메뉴 설정 저장' 버튼을 눌러야 실제 반영)
  const handleAddFacilityTab = () => {
    if (!isCmsCategory(activeTab)) return;
    const trimmed = newFacilityTabName.trim();
    if (!trimmed) {
      alert("추가할 상단 탭 이름을 입력해주세요.");
      return;
    }
    if (facilityTabsForm.tabs.includes(trimmed)) {
      alert("이미 존재하는 탭 이름입니다.");
      return;
    }
    const updated: FacilityTabsConfig = {
      ...facilityTabsForm,
      tabs: [...facilityTabsForm.tabs, trimmed],
    };
    setFacilityTabsForm(updated);
    setNewFacilityTabName("");
    alert(`'${trimmed}' 탭이 목록에 추가되었습니다. 우측 하단의 '💾 상단 탭 메뉴 설정 저장' 버튼을 눌러야 실제 홈페이지에 반영됩니다.`);
  };

  const handleUpdateFacilityTabName = (idx: number, newValue: string) => {
    const nextTabs = facilityTabsForm.tabs.map((t, i) => (i === idx ? newValue : t));
    setFacilityTabsForm({ ...facilityTabsForm, tabs: nextTabs });
  };

  const handleMoveFacilityTab = (idx: number, direction: -1 | 1) => {
    if (!isCmsCategory(activeTab)) return;
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= facilityTabsForm.tabs.length) return;
    const nextTabs = [...facilityTabsForm.tabs];
    const temp = nextTabs[idx];
    nextTabs[idx] = nextTabs[targetIdx];
    nextTabs[targetIdx] = temp;
    const updated = { ...facilityTabsForm, tabs: nextTabs };
    setFacilityTabsForm(updated);
  };

  const handleDeleteFacilityTab = (idx: number) => {
    if (!isCmsCategory(activeTab)) return;
    const tabName = facilityTabsForm.tabs[idx];
    if (facilityTabsForm.tabs.length <= 1) {
      alert("최소 1개 이상의 분류 탭이 필요합니다.");
      return;
    }
    if (!confirm(`'${tabName}' 탭을 목록에서 삭제하시겠습니까? (삭제 후 '💾 상단 탭 메뉴 설정 저장'을 눌러주세요)`)) return;
    const nextTabs = facilityTabsForm.tabs.filter((_, i) => i !== idx);
    const updated = { ...facilityTabsForm, tabs: nextTabs };
    setFacilityTabsForm(updated);
  };

  const handleSaveFacilityTabs = async () => {
    if (!isCmsCategory(activeTab)) return;
    const prevConfig = getCategoryTabsConfig(companySlug, activeTab);
    const cleanedTabs = facilityTabsForm.tabs.map((t) => t.trim()).filter(Boolean);
    if (cleanedTabs.length === 0) {
      alert("최소 1개 이상의 탭 이름을 입력해주세요.");
      return;
    }
    // 탭 이름이 변경된 경우 기존 항목들의 subCategory도 함께 변경
    prevConfig.tabs.forEach((oldName, idx) => {
      const newName = facilityTabsForm.tabs[idx]?.trim();
      if (newName && oldName !== newName) {
        renameCategoryTab(companySlug, activeTab, oldName, newName);
      }
    });
    const updated: FacilityTabsConfig = {
      allLabel:
        facilityTabsForm.allLabel.trim() ||
        defaultCategoryTabsConfig[activeTab].allLabel,
      tabs: cleanedTabs,
    };
    setFacilityTabsForm(updated);
    saveCategoryTabsConfig(companySlug, activeTab, updated);
    await loadCategoryData();
    alert(`${currentTabConfig.label} 상단 탭 메뉴 설정이 저장되었습니다!`);
  };

  const handleResetFacilityTabs = async () => {
    if (!isCmsCategory(activeTab)) return;
    if (
      !confirm(
        `${currentTabConfig.label}의 상단 탭 메뉴를 기본값으로 초기화하시겠습니까?`
      )
    )
      return;
    const reset = resetCategoryTabsConfig(companySlug, activeTab);
    setFacilityTabsForm(reset);
    await loadCategoryData();
    alert("상단 탭 메뉴가 기본값으로 초기화되었습니다.");
  };

  const handleInlineLinkSave = async (item: CmsItem) => {
    const rawUrl = inlineLinks[item.id] ?? "";
    updateCmsItemLink(companySlug, item.id, rawUrl);
    await loadCategoryData();
    alert(
      rawUrl.trim()
        ? `🔗 '${item.title}' 항목에 링크가 적용되었습니다!\n이제 목록을 클릭하면 새 창으로 이동합니다.`
        : `🔗 '${item.title}' 항목의 링크가 해제되었습니다.`
    );
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

  const handleAddCoreCard = () => {
    const nextNum = homeForm.cores.length + 1;
    const newCore: HomeCoreItem = {
      id: `core_${Date.now()}`,
      title: `신규 핵심 역량 #${nextNum}`,
      desc: "핵심 역량 또는 주요 사업 분야에 대한 상세 설명을 입력해 주세요.",
      imageUrl: makeSvgDataUrl(
        `신규 핵심 역량 #${nextNum}`,
        "PRECISION MANUFACTURING SOLUTION",
        nextNum % 2 === 0 ? "indigo" : "blue"
      ),
    };
    setHomeForm({
      ...homeForm,
      cores: [...homeForm.cores, newCore],
    });
  };

  const handleRemoveCoreCard = (idx: number) => {
    if (homeForm.cores.length <= 1) {
      alert("최소 1개의 핵심역량 카드는 유지되어야 합니다.");
      return;
    }
    if (!confirm(`핵심역량 카드 #${idx + 1} 항목을 삭제하시겠습니까?`)) return;
    setHomeForm({
      ...homeForm,
      cores: homeForm.cores.filter((_, i) => i !== idx),
    });
  };

  const handleMoveCoreCard = (idx: number, direction: -1 | 1) => {
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= homeForm.cores.length) return;
    const nextCores = [...homeForm.cores];
    const temp = nextCores[idx];
    nextCores[idx] = nextCores[targetIdx];
    nextCores[targetIdx] = temp;
    setHomeForm({ ...homeForm, cores: nextCores });
  };

  // 홈 하단 작은 배너 추가/삭제 핸들러
  const currentMiniBanners =
    homeForm.miniBanners && homeForm.miniBanners.length > 0
      ? homeForm.miniBanners
      : defaultHomeConfig.miniBanners || [];

  const handleAddHomeMiniBanner = () => {
    const nextNum = currentMiniBanners.length + 1;
    const newBanner: HomeMiniBanner = {
      id: `mb_${Date.now()}`,
      title: `신규 하단 작은 배너 #${nextNum}`,
      desc: "배너 설명 문구를 입력해 주세요.",
      btnText: "자세히 보기 →",
      btnHref: "/support",
      theme: nextNum % 2 === 0 ? "blue" : "slate",
      active: true,
    };
    setHomeForm({
      ...homeForm,
      miniBanners: [...currentMiniBanners, newBanner],
    });
  };

  const handleUpdateHomeMiniBanner = (
    idx: number,
    patch: Partial<HomeMiniBanner>
  ) => {
    const next = currentMiniBanners.map((b, i) =>
      i === idx ? { ...b, ...patch } : b
    );
    setHomeForm({ ...homeForm, miniBanners: next });
  };

  const handleRemoveHomeMiniBanner = (idx: number) => {
    if (!confirm(`하단 작은 배너 #${idx + 1} 항목을 삭제하시겠습니까?`)) return;
    const next = currentMiniBanners.filter((_, i) => i !== idx);
    setHomeForm({ ...homeForm, miniBanners: next });
  };

  const handleToggleMenuVisibility = (href: string) => {
    const currentHidden = settingsForm.hiddenMenus || [];
    const isCurrentlyHidden = currentHidden.includes(href);
    const nextHidden = isCurrentlyHidden
      ? currentHidden.filter((h) => h !== href)
      : [...currentHidden, href];
    const updatedSettings: SiteSettings = {
      ...settingsForm,
      hiddenMenus: nextHidden,
    };
    setSettingsForm(updatedSettings);
    saveSiteSettings(companySlug, updatedSettings);
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
    <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6 xl:pr-[350px] 2xl:pr-[370px]">
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

        {/* 최상단 메뉴(GNB) 사용함 / 사용안함(숨기기) 원클릭 컨트롤 바 */}
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                🧭 홈페이지 최상단 메뉴(GNB) 표시 / 숨김(사용안함) 설정
              </h2>
              <p className="text-xs text-slate-500">
                비상장 기업이라 <strong>투자정보</strong>가 필요 없거나 특정 메뉴를 숨기고 싶을 때 버튼을 눌러 <strong>[🚫 사용안함(숨김)]</strong>으로 전환하면 상단·하단 메뉴에서 즉시 숨겨집니다.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
            {GNB_MENU_ITEMS.map((menu) => {
              const isHidden = (settingsForm.hiddenMenus || []).includes(menu.href);
              return (
                <div
                  key={menu.href}
                  className={`flex flex-col justify-between rounded-xl border p-3 transition-all ${
                    isHidden
                      ? "border-slate-200 bg-slate-100/80 opacity-75"
                      : "border-blue-200 bg-blue-50/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-xs font-bold ${
                        isHidden ? "text-slate-500 line-through" : "text-slate-900"
                      }`}
                    >
                      {menu.label}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isHidden
                          ? "bg-slate-200 text-slate-600"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {isHidden ? "숨김중" : "표시중"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleMenuVisibility(menu.href)}
                    className={`mt-2.5 w-full rounded-lg py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                      isHidden
                        ? "border border-slate-300 bg-white text-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600"
                        : "bg-blue-600 text-white hover:bg-slate-700"
                    }`}
                  >
                    {isHidden ? "🚫 사용안함 (클릭시 켜기)" : "✅ 사용함 (클릭시 숨김)"}
                  </button>
                </div>
              );
            })}
          </div>
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

            {/* 2. 홈 화면 핵심 사업 분야 카드 관리 (추가 / 수정 / 순서변경 / 삭제) */}
            <div className="border-t border-slate-200 pt-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-blue-700">
                    2. 홈 화면 [핵심 사업 분야] 섹션 제목 · 핵심역량 카드 관리 (총 {homeForm.cores.length}개)
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    핵심역량 카드를 4개, 5개 이상 자유롭게 추가하고 각 카드의 제목, 설명, 썸네일 사진을 입력할 수 있습니다.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddCoreCard}
                  className="rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-500 transition-colors cursor-pointer"
                >
                  ➕ 핵심역량 카드 추가
                </button>
              </div>

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

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {homeForm.cores.map((core, idx) => (
                  <div
                    key={core.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2">
                        <span className="rounded bg-blue-600 px-2.5 py-0.5 text-xs font-bold text-white">
                          핵심역량 카드 #{idx + 1}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveCoreCard(idx, -1)}
                            disabled={idx === 0}
                            className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                            title="앞으로 이동"
                          >
                            ◀
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveCoreCard(idx, 1)}
                            disabled={idx === homeForm.cores.length - 1}
                            className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                            title="뒤로 이동"
                          >
                            ▶
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveCoreCard(idx)}
                            className="rounded bg-red-50 px-2 py-0.5 text-[11px] font-bold text-red-600 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                          >
                            삭제
                          </button>
                        </div>
                      </div>

                      {core.imageUrl && (
                        <div className="h-28 w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-900">
                          <img
                            src={core.imageUrl}
                            alt={core.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}

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
                          placeholder="예: 특수·일반 주물 소재 생산"
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
                          placeholder="카드 상세 설명을 입력해 주세요."
                          className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-semibold text-slate-600">
                          카드 썸네일 사진 업로드 또는 이미지 URL
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleCoreImageUpload(idx, e.target.files?.[0] || null)
                          }
                          className="w-full text-[11px] text-slate-600 file:mr-2 file:rounded file:border-0 file:bg-blue-600 file:px-2.5 file:py-1 file:text-[11px] file:font-semibold file:text-white"
                        />
                        <input
                          type="text"
                          value={
                            core.imageUrl?.startsWith("data:") ? "" : core.imageUrl || ""
                          }
                          onChange={(e) => {
                            const next = homeForm.cores.map((c, i) =>
                              i === idx ? { ...c, imageUrl: e.target.value } : c
                            );
                            setHomeForm({ ...homeForm, cores: next });
                          }}
                          placeholder="또는 외부 이미지 주소(URL) 입력"
                          className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-[11px]"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {/* 새 핵심역량 카드 추가 버튼 박스 */}
                <button
                  type="button"
                  onClick={handleAddCoreCard}
                  className="flex min-h-[260px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50/30 p-6 text-blue-700 hover:bg-blue-50 hover:border-blue-500 transition-all cursor-pointer"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white shadow-xs">
                    +
                  </span>
                  <span className="text-sm font-bold">
                    핵심역량 카드 #{homeForm.cores.length + 1} 추가하기
                  </span>
                  <span className="text-xs text-slate-500 text-center">
                    클릭하면 카드 제목·카드 설명·사진을 입력할 수 있는 새 카드가 생성됩니다.
                  </span>
                </button>
              </div>
            </div>

            {/* 3. 홈 하단 바로가기 작은 배너 자유 추가·삭제 컨트롤 */}
            <div className="border-t border-slate-200 pt-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-blue-700">
                    3. 홈 하단 바로가기 작은 배너 관리 (총 {currentMiniBanners.length}개)
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    설비현황·견적문의 등 홈 화면 하단에 들어가는 작은 배너를 원하는 만큼 추가하거나 삭제할 수 있습니다.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddHomeMiniBanner}
                  className="rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
                >
                  ➕ 하단 작은 배너 추가
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {currentMiniBanners.map((mb, idx) => (
                  <div
                    key={mb.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2.5"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={mb.active !== false}
                          onChange={(e) =>
                            handleUpdateHomeMiniBanner(idx, {
                              active: e.target.checked,
                            })
                          }
                          className="h-4 w-4 rounded text-blue-600"
                        />
                        작은 배너 #{idx + 1} 노출
                      </label>
                      <div className="flex items-center gap-2">
                        <select
                          value={mb.theme}
                          onChange={(e) =>
                            handleUpdateHomeMiniBanner(idx, {
                              theme: e.target.value as "slate" | "blue" | "dark",
                            })
                          }
                          className="rounded border border-slate-300 bg-white px-2 py-0.5 text-[11px] font-semibold"
                        >
                          <option value="slate">라이트 그레이</option>
                          <option value="blue">라이트 블루</option>
                          <option value="dark">다크 네이비</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleRemoveHomeMiniBanner(idx)}
                          className="rounded bg-red-50 px-2 py-0.5 text-[11px] font-bold text-red-600 hover:bg-red-500 hover:text-white cursor-pointer"
                        >
                          삭제
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                        배너 제목
                      </label>
                      <input
                        type="text"
                        value={mb.title}
                        onChange={(e) =>
                          handleUpdateHomeMiniBanner(idx, { title: e.target.value })
                        }
                        className="w-full rounded border border-slate-300 bg-white px-3 py-1.5 text-sm font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                        배너 설명
                      </label>
                      <input
                        type="text"
                        value={mb.desc}
                        onChange={(e) =>
                          handleUpdateHomeMiniBanner(idx, { desc: e.target.value })
                        }
                        className="w-full rounded border border-slate-300 bg-white px-3 py-1.5 text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                          버튼 문구
                        </label>
                        <input
                          type="text"
                          value={mb.btnText}
                          onChange={(e) =>
                            handleUpdateHomeMiniBanner(idx, {
                              btnText: e.target.value,
                            })
                          }
                          className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                          이동 경로 (URL)
                        </label>
                        <input
                          type="text"
                          value={mb.btnHref}
                          onChange={(e) =>
                            handleUpdateHomeMiniBanner(idx, {
                              btnHref: e.target.value,
                            })
                          }
                          className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))}
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

            {/* CEO 인사말 및 비전 -> 회사소개 탭별(인사말·회사개요·비전·기업연혁·오시는길·신규탭) 상세 추가·수정 관리 */}
            <div className="border-t-2 border-blue-100 pt-6 space-y-5">
              <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="inline-block rounded-full bg-blue-600 px-3 py-0.5 text-[11px] font-extrabold text-white">
                      회사소개 하위 탭별 개별 컨트롤
                    </span>
                    <h3 className="mt-1 text-base font-extrabold text-slate-900">
                      2. 회사소개 내부 탭(CEO 인사말 · 회사개요 · 비전 · 기업연혁 · 오시는 길) 개별 추가·수정 관리
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-600">
                      회사소개 안의 각 탭 이름을 수정하거나 새 탭을 추가할 수 있으며, 탭을 클릭하면 <strong>그 탭 안의 세부 항목(핵심 수치, 비전 카드, 연혁, 교통편)</strong>을 별도로 추가·수정한 뒤 <strong>&lsquo;💾 회사소개 탭 설정 저장하기&rsquo;</strong>를 눌러 반영하세요.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      saveSiteSettings(companySlug, settingsForm);
                      saveAboutConfig(companySlug, aboutForm);
                      window.dispatchEvent(new Event("cms-save-all-drafts"));
                      alert("회사소개 탭 구성 및 각 탭 내부 상세 설정이 모두 저장되었습니다!");
                    }}
                    className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-xs hover:bg-blue-500 cursor-pointer shrink-0"
                  >
                    💾 회사소개 탭 설정 저장하기
                  </button>
                </div>

                {/* 회사소개 상단 탭 목록 (클릭 시 해당 탭 편집 + 이름 수정 + 삭제 + 새 탭 추가) */}
                <div className="flex flex-wrap items-center gap-2">
                  {aboutForm.tabs.map((tab, tIdx) => {
                    const isSelected = selectedAboutSubTab === tab.id;
                    return (
                      <div
                        key={tab.id}
                        onClick={() => setSelectedAboutSubTab(tab.id)}
                        className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 transition-all cursor-pointer ${
                          isSelected
                            ? "border-blue-600 bg-blue-600 text-white shadow-sm ring-2 ring-blue-200"
                            : "border-slate-200 bg-white text-slate-800 hover:border-blue-300"
                        }`}
                      >
                        <span className="text-xs font-extrabold">#{tIdx + 1}</span>
                        <input
                          type="text"
                          value={tab.label}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            const nextTabs = aboutForm.tabs.map((tItem) =>
                              tItem.id === tab.id ? { ...tItem, label: e.target.value } : tItem
                            );
                            const nextCfg = { ...aboutForm, tabs: nextTabs };
                            setAboutForm(nextCfg);
                          }}
                          className={`w-28 rounded px-1.5 py-0.5 text-xs font-extrabold focus:outline-none ${
                            isSelected
                              ? "bg-blue-700 text-white border border-blue-400"
                              : "bg-slate-50 text-slate-900 border border-slate-200"
                          }`}
                        />
                        {aboutForm.tabs.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!confirm(`'${tab.label}' 탭을 삭제하시겠습니까?`)) return;
                              const nextTabs = aboutForm.tabs.filter((tItem) => tItem.id !== tab.id);
                              const nextCfg = { ...aboutForm, tabs: nextTabs };
                              setAboutForm(nextCfg);
                              if (selectedAboutSubTab === tab.id) {
                                setSelectedAboutSubTab(nextTabs[0]?.id || "greeting");
                              }
                            }}
                            className={`ml-1 rounded px-1.5 py-0.5 text-[11px] font-bold ${
                              isSelected
                                ? "bg-red-500 text-white hover:bg-red-600"
                                : "bg-red-50 text-red-600 hover:bg-red-100"
                            }`}
                          >
                            ×
                          </button>
                        )}
                      </div>
                    );
                  })}

                  {/* 새 회사소개 하위 탭 추가 */}
                  <div className="flex items-center gap-1.5 rounded-xl border border-dashed border-blue-400 bg-white px-2.5 py-1.5">
                    <input
                      type="text"
                      value={newAboutTabLabel}
                      onChange={(e) => setNewAboutTabLabel(e.target.value)}
                      placeholder="새 탭 이름 (예: 조직도)"
                      className="w-32 rounded border border-slate-200 px-2 py-1 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const trimmed = newAboutTabLabel.trim();
                        if (!trimmed) {
                          alert("추가할 탭 이름을 입력해 주세요.");
                          return;
                        }
                        const newTabId = `custom_${Date.now()}`;
                        const nextTabs = [...aboutForm.tabs, { id: newTabId, label: trimmed }];
                        const nextCfg = { ...aboutForm, tabs: nextTabs };
                        setAboutForm(nextCfg);
                        setNewAboutTabLabel("");
                        setSelectedAboutSubTab(newTabId);
                      }}
                      className="rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-extrabold text-white hover:bg-blue-500 cursor-pointer"
                    >
                      + 탭 추가
                    </button>
                  </div>
                </div>

                {/* 선택된 회사소개 하위 탭 내부 편집 패널 */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-5">
                  {/* (1) CEO 인사말 탭 */}
                  {selectedAboutSubTab === "greeting" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h4 className="text-sm font-extrabold text-slate-900">
                          📌 [CEO 인사말] 탭 내부 내용 수정
                        </h4>
                        <span className="text-xs font-semibold text-blue-600">
                          아래 만능 블록 빌더에서도 현재 [CEO 인사말] 탭이 자동 선택되어 있습니다.
                        </span>
                      </div>
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
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          CEO 인사말 본문 (엔터 줄바꿈으로 문단이 나뉩니다)
                        </label>
                        <textarea
                          rows={5}
                          value={settingsForm.ceoGreetingBody}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              ceoGreetingBody: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm leading-relaxed"
                        />
                      </div>
                    </div>
                  )}

                  {/* (2) 회사개요 탭 */}
                  {selectedAboutSubTab === "overview" && (
                    <div className="space-y-5">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div>
                          <h4 className="text-sm font-extrabold text-slate-900">
                            📌 [회사개요] 탭 내부 핵심 수치 카드 & 개요 표 항목 추가·수정
                          </h4>
                          <p className="text-xs text-slate-500">
                            회사개요 탭 상단 4대 핵심 수치 카드와 하단 회사개요 표의 추가 행을 자유롭게 추가·삭제할 수 있습니다.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const nextStats = [
                              ...aboutForm.overviewStats,
                              {
                                id: `ast_${Date.now()}`,
                                label: "신규 핵심지표",
                                value: "100%",
                                desc: "보조 설명 입력",
                              },
                            ];
                            const nextCfg = { ...aboutForm, overviewStats: nextStats };
                            setAboutForm(nextCfg);
                          }}
                          className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-extrabold text-white hover:bg-blue-500 cursor-pointer"
                        >
                          + 핵심 수치 카드 추가
                        </button>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {aboutForm.overviewStats.map((st, idx) => (
                          <div
                            key={st.id}
                            className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-extrabold text-blue-700">
                                수치 카드 #{idx + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const nextStats = aboutForm.overviewStats.filter(
                                    (x) => x.id !== st.id
                                  );
                                  const nextCfg = { ...aboutForm, overviewStats: nextStats };
                                  setAboutForm(nextCfg);
                                }}
                                className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
                              >
                                삭제
                              </button>
                            </div>
                            <input
                              type="text"
                              value={st.label}
                              onChange={(e) => {
                                const nextStats = aboutForm.overviewStats.map((x) =>
                                  x.id === st.id ? { ...x, label: e.target.value } : x
                                );
                                const nextCfg = { ...aboutForm, overviewStats: nextStats };
                                setAboutForm(nextCfg);
                              }}
                              placeholder="라벨 (예: 업력 및 노하우)"
                              className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs font-bold"
                            />
                            <input
                              type="text"
                              value={st.value}
                              onChange={(e) => {
                                const nextStats = aboutForm.overviewStats.map((x) =>
                                  x.id === st.id ? { ...x, value: e.target.value } : x
                                );
                                const nextCfg = { ...aboutForm, overviewStats: nextStats };
                                setAboutForm(nextCfg);
                              }}
                              placeholder="강조 값 (예: 28년+)"
                              className="w-full rounded border border-blue-300 bg-white px-2.5 py-1 text-sm font-extrabold text-blue-700"
                            />
                            <input
                              type="text"
                              value={st.desc}
                              onChange={(e) => {
                                const nextStats = aboutForm.overviewStats.map((x) =>
                                  x.id === st.id ? { ...x, desc: e.target.value } : x
                                );
                                const nextCfg = { ...aboutForm, overviewStats: nextStats };
                                setAboutForm(nextCfg);
                              }}
                              placeholder="보조 설명"
                              className="w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs"
                            />
                          </div>
                        ))}
                      </div>

                      {/* 회사개요 표 추가 행 관리 */}
                      <div className="border-t border-slate-100 pt-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-slate-800">
                            📋 회사개요 표 추가 항목 ({(aboutForm.extraOverviewRows || []).length}개) — 예: 주요 거래처, 공장 면적, 임직원 수 등
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const nextRows = [
                                ...(aboutForm.extraOverviewRows || []),
                                {
                                  id: `orow_${Date.now()}`,
                                  label: "주요 거래처 / 인증현황",
                                  value: "내용을 입력하세요",
                                },
                              ];
                              const nextCfg = { ...aboutForm, extraOverviewRows: nextRows };
                              setAboutForm(nextCfg);
                              saveAboutConfig(companySlug, nextCfg);
                            }}
                            className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-700 cursor-pointer"
                          >
                            + 회사개요 표 항목(행) 추가
                          </button>
                        </div>
                        {(aboutForm.extraOverviewRows || []).map((row) => (
                          <div key={row.id} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={row.label}
                              onChange={(e) => {
                                const nextRows = (aboutForm.extraOverviewRows || []).map((r) =>
                                  r.id === row.id ? { ...r, label: e.target.value } : r
                                );
                                const nextCfg = { ...aboutForm, extraOverviewRows: nextRows };
                                setAboutForm(nextCfg);
                              }}
                              placeholder="항목명 (예: 공장 부지면적)"
                              className="w-48 rounded border border-slate-300 px-3 py-1.5 text-xs font-bold"
                            />
                            <input
                              type="text"
                              value={row.value}
                              onChange={(e) => {
                                const nextRows = (aboutForm.extraOverviewRows || []).map((r) =>
                                  r.id === row.id ? { ...r, value: e.target.value } : r
                                );
                                const nextCfg = { ...aboutForm, extraOverviewRows: nextRows };
                                setAboutForm(nextCfg);
                              }}
                              placeholder="항목 내용 입력"
                              className="flex-1 rounded border border-slate-300 px-3 py-1.5 text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const nextRows = (aboutForm.extraOverviewRows || []).filter(
                                  (r) => r.id !== row.id
                                );
                                const nextCfg = { ...aboutForm, extraOverviewRows: nextRows };
                                setAboutForm(nextCfg);
                              }}
                              className="rounded bg-red-50 px-2.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 cursor-pointer"
                            >
                              삭제
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* (3) 비전·핵심가치 탭 */}
                  {selectedAboutSubTab === "vision" && (
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <h4 className="text-sm font-extrabold text-slate-900">
                          📌 [비전·핵심가치] 탭 슬로건 & 핵심가치 카드 추가·수정
                        </h4>
                        <button
                          type="button"
                          onClick={() => {
                            const nextPillars = [
                              ...aboutForm.visionPillars,
                              {
                                id: `vp_${Date.now()}`,
                                step: `0${aboutForm.visionPillars.length + 1}`,
                                title: "새로운 핵심가치 제목",
                                desc: "핵심가치 상세 설명을 입력하세요.",
                              },
                            ];
                            const nextCfg = { ...aboutForm, visionPillars: nextPillars };
                            setAboutForm(nextCfg);
                          }}
                          className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-extrabold text-white hover:bg-blue-500 cursor-pointer"
                        >
                          + 핵심가치 카드 추가
                        </button>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            비전 상단 배지 (예: VISION 2030)
                          </label>
                          <input
                            type="text"
                            value={aboutForm.visionBadge}
                            onChange={(e) => {
                              const nextCfg = { ...aboutForm, visionBadge: e.target.value };
                              setAboutForm(nextCfg);
                              saveAboutConfig(companySlug, nextCfg);
                            }}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            비전 메인 슬로건
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
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-bold"
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

                      <div className="grid gap-4 sm:grid-cols-3">
                        {aboutForm.visionPillars.map((pillar, pIdx) => (
                          <div
                            key={pillar.id}
                            className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <input
                                type="text"
                                value={pillar.step}
                                onChange={(e) => {
                                  const nextPillars = aboutForm.visionPillars.map((p) =>
                                    p.id === pillar.id ? { ...p, step: e.target.value } : p
                                  );
                                  const nextCfg = { ...aboutForm, visionPillars: nextPillars };
                                  setAboutForm(nextCfg);
                                }}
                                className="w-16 rounded border border-slate-300 bg-white px-2 py-0.5 text-xs font-black text-blue-700"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const nextPillars = aboutForm.visionPillars.filter(
                                    (p) => p.id !== pillar.id
                                  );
                                  const nextCfg = { ...aboutForm, visionPillars: nextPillars };
                                  setAboutForm(nextCfg);
                                }}
                                className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
                              >
                                카드 삭제
                              </button>
                            </div>
                            <input
                              type="text"
                              value={pillar.title}
                              onChange={(e) => {
                                const nextPillars = aboutForm.visionPillars.map((p) =>
                                  p.id === pillar.id ? { ...p, title: e.target.value } : p
                                );
                                const nextCfg = { ...aboutForm, visionPillars: nextPillars };
                                setAboutForm(nextCfg);
                              }}
                              placeholder={`핵심가치 #${pIdx + 1} 제목`}
                              className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-bold"
                            />
                            <textarea
                              rows={3}
                              value={pillar.desc}
                              onChange={(e) => {
                                const nextPillars = aboutForm.visionPillars.map((p) =>
                                  p.id === pillar.id ? { ...p, desc: e.target.value } : p
                                );
                                const nextCfg = { ...aboutForm, visionPillars: nextPillars };
                                setAboutForm(nextCfg);
                              }}
                              placeholder="핵심가치 설명"
                              className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* (4) 기업연혁 탭 */}
                  {selectedAboutSubTab === "history" && (
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div>
                          <h4 className="text-sm font-extrabold text-slate-900">
                            📌 [기업연혁] 탭 시기별 그룹 & 연도별 연혁 추가·수정·삭제
                          </h4>
                          <p className="text-xs text-slate-500">
                            시기 그룹(예: 2020 ~ 현재)을 추가하거나 각 시기 안의 세부 연혁(연월 + 내용)을 자유롭게 추가·삭제하세요.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const nextBlocks = [
                              {
                                id: `hb_${Date.now()}`,
                                period: "2026 ~ 현재",
                                phase: "글로벌 초정밀 제조 혁신기",
                                events: [
                                  {
                                    id: `he_${Date.now()}_1`,
                                    year: "2026. 10",
                                    text: "새로운 주요 연혁 내용을 입력하세요",
                                  },
                                ],
                              },
                              ...aboutForm.historyBlocks,
                            ];
                            const nextCfg = { ...aboutForm, historyBlocks: nextBlocks };
                            setAboutForm(nextCfg);
                          }}
                          className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-extrabold text-white hover:bg-blue-500 cursor-pointer"
                        >
                          + 새 연혁 시기 그룹 추가
                        </button>
                      </div>

                      <div className="space-y-4">
                        {aboutForm.historyBlocks.map((hBlock) => (
                          <div
                            key={hBlock.id}
                            className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                              <div className="flex flex-wrap items-center gap-2 flex-1">
                                <input
                                  type="text"
                                  value={hBlock.period}
                                  onChange={(e) => {
                                    const nextBlocks = aboutForm.historyBlocks.map((b) =>
                                      b.id === hBlock.id ? { ...b, period: e.target.value } : b
                                    );
                                    const nextCfg = { ...aboutForm, historyBlocks: nextBlocks };
                                    setAboutForm(nextCfg);
                                  }}
                                  placeholder="시기 (예: 2020 ~ 현재)"
                                  className="w-40 rounded border border-blue-300 bg-white px-2.5 py-1 text-xs font-extrabold text-blue-700"
                                />
                                <input
                                  type="text"
                                  value={hBlock.phase}
                                  onChange={(e) => {
                                    const nextBlocks = aboutForm.historyBlocks.map((b) =>
                                      b.id === hBlock.id ? { ...b, phase: e.target.value } : b
                                    );
                                    const nextCfg = { ...aboutForm, historyBlocks: nextBlocks };
                                    setAboutForm(nextCfg);
                                  }}
                                  placeholder="시기 설명 (예: 스마트 정밀가공 고도화기)"
                                  className="flex-1 min-w-[200px] rounded border border-slate-300 bg-white px-2.5 py-1 text-xs font-bold"
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextBlocks = aboutForm.historyBlocks.map((b) =>
                                      b.id === hBlock.id
                                        ? {
                                            ...b,
                                            events: [
                                              {
                                                id: `he_${Date.now()}`,
                                                year: "2026. 01",
                                                text: "연혁 내용을 입력하세요",
                                              },
                                              ...b.events,
                                            ],
                                          }
                                        : b
                                    );
                                    const nextCfg = { ...aboutForm, historyBlocks: nextBlocks };
                                    setAboutForm(nextCfg);
                                  }}
                                  className="rounded bg-slate-800 px-2.5 py-1 text-xs font-bold text-white hover:bg-slate-700 cursor-pointer"
                                >
                                  + 연혁 한 줄 추가
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextBlocks = aboutForm.historyBlocks.filter(
                                      (b) => b.id !== hBlock.id
                                    );
                                    const nextCfg = { ...aboutForm, historyBlocks: nextBlocks };
                                    setAboutForm(nextCfg);
                                  }}
                                  className="rounded bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700 hover:bg-red-200 cursor-pointer"
                                >
                                  그룹 삭제
                                </button>
                              </div>
                            </div>

                            <div className="space-y-2">
                              {hBlock.events.map((ev) => (
                                <div key={ev.id} className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={ev.year}
                                    onChange={(e) => {
                                      const nextBlocks = aboutForm.historyBlocks.map((b) =>
                                        b.id === hBlock.id
                                          ? {
                                              ...b,
                                              events: b.events.map((item) =>
                                                item.id === ev.id
                                                  ? { ...item, year: e.target.value }
                                                  : item
                                              ),
                                            }
                                          : b
                                      );
                                      const nextCfg = { ...aboutForm, historyBlocks: nextBlocks };
                                      setAboutForm(nextCfg);
                                    }}
                                    placeholder="2025. 11"
                                    className="w-28 rounded border border-slate-300 bg-white px-2.5 py-1 text-xs font-mono font-bold"
                                  />
                                  <input
                                    type="text"
                                    value={ev.text}
                                    onChange={(e) => {
                                      const nextBlocks = aboutForm.historyBlocks.map((b) =>
                                        b.id === hBlock.id
                                          ? {
                                              ...b,
                                              events: b.events.map((item) =>
                                                item.id === ev.id
                                                  ? { ...item, text: e.target.value }
                                                  : item
                                              ),
                                            }
                                          : b
                                      );
                                      const nextCfg = { ...aboutForm, historyBlocks: nextBlocks };
                                      setAboutForm(nextCfg);
                                    }}
                                    placeholder="연혁 상세 내용"
                                    className="flex-1 rounded border border-slate-300 bg-white px-2.5 py-1 text-xs"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const nextBlocks = aboutForm.historyBlocks.map((b) =>
                                        b.id === hBlock.id
                                          ? {
                                              ...b,
                                              events: b.events.filter(
                                                (item) => item.id !== ev.id
                                              ),
                                            }
                                          : b
                                      );
                                      const nextCfg = { ...aboutForm, historyBlocks: nextBlocks };
                                      setAboutForm(nextCfg);
                                    }}
                                    className="rounded bg-white border border-slate-200 px-2 py-1 text-xs font-bold text-red-600 hover:bg-red-50 cursor-pointer"
                                  >
                                    삭제
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* (5) 오시는 길 탭 */}
                  {selectedAboutSubTab === "location" && (
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div>
                          <h4 className="text-sm font-extrabold text-slate-900">
                            📌 [오시는 길] 탭 교통편 및 방문 안내 항목 추가·수정·삭제
                          </h4>
                          <p className="text-xs text-slate-500">
                            구글 지도 주소는 위 1번 주소 입력란과 자동 연동되며, 우측 교통편 안내 항목을 자유롭게 추가·수정할 수 있습니다.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const nextDirs = [
                              ...aboutForm.directions,
                              {
                                id: `dir_${Date.now()}`,
                                title: "새로운 교통편 안내 제목",
                                desc: "상세 이동 경로 및 안내 설명을 입력하세요.",
                              },
                            ];
                            const nextCfg = { ...aboutForm, directions: nextDirs };
                            setAboutForm(nextCfg);
                          }}
                          className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-extrabold text-white hover:bg-blue-500 cursor-pointer"
                        >
                          + 교통편 안내 항목 추가
                        </button>
                      </div>

                      <div className="space-y-3">
                        {aboutForm.directions.map((dir) => (
                          <div
                            key={dir.id}
                            className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-2"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <input
                                type="text"
                                value={dir.title}
                                onChange={(e) => {
                                  const nextDirs = aboutForm.directions.map((d) =>
                                    d.id === dir.id ? { ...d, title: e.target.value } : d
                                  );
                                  const nextCfg = { ...aboutForm, directions: nextDirs };
                                  setAboutForm(nextCfg);
                                }}
                                placeholder="교통편 제목 (예: 승용차·화물차 이용 시)"
                                className="flex-1 rounded border border-slate-300 bg-white px-2.5 py-1 text-xs font-bold text-blue-700"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const nextDirs = aboutForm.directions.filter(
                                    (d) => d.id !== dir.id
                                  );
                                  const nextCfg = { ...aboutForm, directions: nextDirs };
                                  setAboutForm(nextCfg);
                                }}
                                className="rounded bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600 hover:bg-red-100 cursor-pointer"
                              >
                                삭제
                              </button>
                            </div>
                            <textarea
                              rows={2}
                              value={dir.desc}
                              onChange={(e) => {
                                const nextDirs = aboutForm.directions.map((d) =>
                                  d.id === dir.id ? { ...d, desc: e.target.value } : d
                                );
                                const nextCfg = { ...aboutForm, directions: nextDirs };
                                setAboutForm(nextCfg);
                              }}
                              placeholder="상세 경로 안내"
                              className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* (6) 관리자가 새로 추가한 커스텀 회사소개 탭인 경우 */}
                  {!["greeting", "overview", "vision", "history", "location"].includes(
                    selectedAboutSubTab
                  ) && (
                    <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-4 text-xs text-indigo-950 space-y-1.5">
                      <p className="font-extrabold text-sm">
                        ✨ 신규 생성 탭 [{aboutForm.tabs.find((t) => t.id === selectedAboutSubTab)?.label}] 전용 화면 조립 안내
                      </p>
                      <p>
                        아래 <strong>만능 홈페이지 블록 빌더</strong>에서 현재 탭(<strong>{aboutForm.tabs.find((t) => t.id === selectedAboutSubTab)?.label}</strong>)이 자동 선택되어 있습니다. 텍스트, 멀티 이미지(1x1~4x1), 표, 카드#, 타임라인 등 원하는 블록을 추가하시면 이 탭을 클릭했을 때만 전용으로 표시됩니다!
                      </p>
                    </div>
                  )}
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
            {/* 설비현황 · 제품소개 · 기술정보 공통: 상단 서브 탭 메뉴(수정 · 추가 · 삭제) 카드 */}
            {hasSubTabsManager(activeTab) && (
              <div className="mt-6 rounded-2xl border border-blue-200 bg-white p-6 shadow-xs sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div>
                    <span className="inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700">
                      회사소개 스타일 상단 탭 바 연동
                    </span>
                    <h2 className="mt-1 text-lg font-bold text-slate-900">
                      🗂️ {currentTabConfig.label.replace(" 관리", "")} 상단 탭 메뉴 관리 (수정 · 추가 · 삭제)
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {activeTab === "facilities"
                        ? "설비현황 페이지 상단 탭 바(전체 설비 · 가공설비 · 주조설비 · 검사설비 등)의 이름을 수정하거나 새로운 탭을 추가할 수 있습니다."
                        : activeTab === "products"
                        ? "제품소개 페이지 상단 탭 바(전체 제품 · 선박·해양 부품 · 중장비 부품 · 산업기계 부품 등)의 이름을 수정하거나 새로운 탭을 추가할 수 있습니다."
                        : "기술정보 페이지 상단 탭 바(전체 기술·인증 · 품질·환경 경영인증 · 특허·지식재산권 · 고객사 인증 등)의 이름을 수정하거나 새로운 탭을 추가할 수 있습니다."}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetFacilityTabs}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    기본 탭으로 초기화
                  </button>
                </div>

                {/* 현재 상단 탭 바 미리보기 */}
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="mb-2 text-[11px] font-semibold text-slate-500">
                    👀 홈페이지 상단 탭 바 미리보기 (회사소개와 동일한 디자인)
                  </p>
                  <div className="flex overflow-x-auto rounded-lg border border-slate-200 bg-white px-3">
                    <span className="relative whitespace-nowrap px-4 py-3 text-xs font-bold text-blue-700">
                      {facilityTabsForm.allLabel || defaultCategoryTabsConfig[activeTab].allLabel}
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                    </span>
                    {facilityTabsForm.tabs.map((tab, idx) => (
                      <span
                        key={idx}
                        className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-slate-600"
                      >
                        {tab}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 grid gap-5 lg:grid-cols-12">
                  {/* 전체 보기 탭 이름 */}
                  <div className="lg:col-span-4 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      1. 첫 번째(전체 보기) 탭 이름
                    </label>
                    <input
                      type="text"
                      value={facilityTabsForm.allLabel}
                      onChange={(e) =>
                        setFacilityTabsForm({ ...facilityTabsForm, allLabel: e.target.value })
                      }
                      placeholder={`예: ${defaultCategoryTabsConfig[activeTab].allLabel}`}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                    />
                    <p className="mt-1.5 text-[11px] text-slate-500">
                      모든 항목을 한눈에 보여주는 첫 번째 탭의 명칭입니다.
                    </p>

                    <div className="mt-5 border-t border-slate-200 pt-4">
                      <label className="block text-xs font-bold text-blue-800 mb-1.5">
                        ➕ 새 상단 탭 추가하기
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newFacilityTabName}
                          onChange={(e) => setNewFacilityTabName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddFacilityTab();
                            }
                          }}
                          placeholder={
                            activeTab === "facilities"
                              ? "예: 열처리설비 / 자동화설비"
                              : activeTab === "products"
                              ? "예: 플랜트 부품 / 신제품"
                              : "예: 해외인증 / 시험성적서"
                          }
                          className="flex-1 rounded-lg border border-blue-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleAddFacilityTab}
                          className="shrink-0 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-500 cursor-pointer"
                        >
                          + 탭 추가
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 개별 카테고리 탭 수정/순서/삭제 */}
                  <div className="lg:col-span-8 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      2. 상단 분류 탭 목록 수정 · 순서 변경 · 삭제 ({facilityTabsForm.tabs.length}개)
                    </label>
                    <div className="space-y-2.5">
                      {facilityTabsForm.tabs.map((tabName, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2"
                        >
                          <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded bg-slate-100 text-xs font-bold text-slate-600">
                            {idx + 1}
                          </span>
                          <input
                            type="text"
                            value={tabName}
                            onChange={(e) => handleUpdateFacilityTabName(idx, e.target.value)}
                            placeholder="탭 이름 입력"
                            className="flex-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-900 focus:border-blue-600 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleMoveFacilityTab(idx, -1)}
                            disabled={idx === 0}
                            className="rounded border border-slate-200 px-2 py-1 text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                            title="위로 이동"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveFacilityTab(idx, 1)}
                            disabled={idx === facilityTabsForm.tabs.length - 1}
                            className="rounded border border-slate-200 px-2 py-1 text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                            title="아래로 이동"
                          >
                            ▼
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteFacilityTab(idx)}
                            className="rounded bg-red-50 px-2.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                          >
                            삭제
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-2">
                      <p className="text-[11px] text-slate-500">
                        * 탭 이름을 수정하고 저장하면 해당 탭에 속해 있던 항목들의 분류명도 자동으로 함께 변경됩니다.
                      </p>
                      <button
                        type="button"
                        onClick={handleSaveFacilityTabs}
                        className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-500 transition-colors cursor-pointer"
                      >
                        💾 상단 탭 설정 저장하기
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
                      {hasSubTabsManager(activeTab)
                        ? "소속 상단 탭 선택 (어떤 탭에 표시할지 선택)"
                        : "분류 / 카테고리"}
                    </label>
                    {hasSubTabsManager(activeTab) ? (
                      <>
                        <select
                          value={
                            facilityTabsForm.tabs.includes(subCategory)
                              ? subCategory
                              : facilityTabsForm.tabs[0] || ""
                          }
                          onChange={(e) => setSubCategory(e.target.value)}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-blue-600 focus:outline-none"
                        >
                          {facilityTabsForm.tabs.map((tabName, idx) => (
                            <option key={tabName} value={tabName}>
                              {idx + 1}. {tabName}
                            </option>
                          ))}
                        </select>
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          {facilityTabsForm.tabs.map((tabName, idx) => {
                            const active =
                              (facilityTabsForm.tabs.includes(subCategory)
                                ? subCategory
                                : facilityTabsForm.tabs[0]) === tabName;
                            return (
                              <button
                                key={tabName}
                                type="button"
                                onClick={() => setSubCategory(tabName)}
                                className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                                  active
                                    ? "bg-blue-600 text-white"
                                    : "border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
                                }`}
                              >
                                {idx + 1}. {tabName}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <input
                        type="text"
                        value={subCategory}
                        onChange={(e) => setSubCategory(e.target.value)}
                        placeholder={currentTabConfig.subCategoryPlaceholder}
                        className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                      />
                    )}
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

                {/* 투자·공시 관리 전용: 상단에서 바로 보이는 새창 이동 링크(URL) 입력란 */}
                {activeTab === "ir" && (
                  <div className="rounded-xl border-2 border-blue-300 bg-blue-50/70 p-4">
                    <label className="block text-xs font-bold text-blue-900 mb-1.5">
                      🔗 목록 클릭 시 새 창으로 이동할 링크 주소 (DART 전자공시 / 외부 URL)
                    </label>
                    <input
                      type="text"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="예: https://dart.fss.or.kr/dsaf001/main.do?rcpNo=... (입력 시 목록을 누르면 새 창으로 이동합니다)"
                      className="w-full rounded-lg border border-blue-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                    />
                    <p className="mt-1.5 text-[11px] text-blue-800">
                      * 여기에 DART 공시 링크나 이동할 주소를 입력하면 홈페이지 투자정보 목록과 아래 관리자 목록에서 클릭 시 새 창으로 열립니다. (아래 목록에서도 항목별로 바로 링크를 입력·수정할 수 있습니다!)
                    </p>
                  </div>
                )}

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
                    {activeTab === "ir"
                      ? "목록의 제목을 누르면 적용된 링크가 새 창으로 열립니다. 각 항목 아래 입력칸에 원하는 DART/외부 링크를 넣고 [링크 적용]을 누르세요."
                      : "기존 기본 항목들도 [수정] 버튼을 눌러 이름, 규격, 사진 등을 자유롭게 변경하거나 [삭제]할 수 있습니다."}
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
                {items.map((item) => {
                  const resolvedLink = normalizeExternalUrl(
                    item.linkUrl !== undefined
                      ? item.linkUrl
                      : item.id.startsWith("seed_ir_")
                      ? "https://dart.fss.or.kr"
                      : ""
                  );
                  return (
                    <div key={item.id} className="py-4">
                      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div
                          onClick={() => {
                            if (resolvedLink) {
                              window.open(resolvedLink, "_blank", "noopener,noreferrer");
                            }
                          }}
                          className={`flex items-center gap-4 ${
                            resolvedLink ? "cursor-pointer group" : ""
                          }`}
                        >
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
                              {resolvedLink ? (
                                <a
                                  href={resolvedLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="font-bold text-slate-900 group-hover:text-blue-600 group-hover:underline inline-flex items-center gap-1.5 transition-colors"
                                  title="클릭 시 새 창으로 링크 열기"
                                >
                                  <span>{item.title}</span>
                                  <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[11px] font-bold text-blue-700">
                                    새창 이동 ↗
                                  </span>
                                </a>
                              ) : (
                                <h3 className="font-bold text-slate-900">{item.title}</h3>
                              )}
                            </div>
                            <p className="mt-1 text-xs text-slate-600">
                              {item.specOrMaterial &&
                                `${currentTabConfig.specLabel}: ${item.specOrMaterial}`}
                              {item.qtyOrDate &&
                                ` | ${currentTabConfig.qtyLabel}: ${item.qtyOrDate}`}
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
                          {resolvedLink && (
                            <a
                              href={resolvedLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                            >
                              새창 열기 ↗
                            </a>
                          )}
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

                      {/* 투자·공시 관리(ir) 목록에서 바로 링크를 입력/적용할 수 있는 인라인 링크 설정 바 */}
                      {activeTab === "ir" && (
                        <div className="mt-3 flex flex-col gap-2 rounded-xl border border-blue-200 bg-blue-50/50 p-3 sm:flex-row sm:items-center">
                          <span className="shrink-0 text-xs font-bold text-blue-900">
                            🔗 이동 링크(URL):
                          </span>
                          <input
                            type="text"
                            value={inlineLinks[item.id] ?? ""}
                            onChange={(e) =>
                              setInlineLinks({
                                ...inlineLinks,
                                [item.id]: e.target.value,
                              })
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleInlineLinkSave(item);
                              }
                            }}
                            placeholder="https://dart.fss.or.kr/... (클릭 시 새 창으로 열릴 주소 입력)"
                            className="flex-1 rounded-lg border border-blue-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleInlineLinkSave(item)}
                            className="shrink-0 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-500 transition-colors cursor-pointer"
                          >
                            💾 링크 적용
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* 3) 고객지원 (상단 탭 추가·수정 + 첨부파일 다운로드 자료실 + 온라인 문의 접수 내역) 탭 */}
        {activeTab === "inquiries" && (
          <div className="mt-6 space-y-6">
            {/* (A) 고객지원 상단 탭 메뉴 관리 & 첨부파일(이력서·참고자료) 업로드 관리 */}
            <div className="rounded-2xl border border-blue-200 bg-white p-6 shadow-xs sm:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="inline-block rounded-full bg-blue-600 px-3 py-0.5 text-[11px] font-extrabold text-white">
                    고객지원 상단 탭 추가 · 이력서/참고자료 다운로드 연동
                  </span>
                  <h2 className="mt-1 text-lg font-extrabold text-slate-900">
                    🗂️ 고객지원 상단 탭 메뉴 관리 (탭 추가 · 이름 수정 · 삭제) 및 첨부파일 자료실
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    고객지원 페이지 상단 탭(예: 온라인 견적·상담 문의, 자료실·양식 다운로드 등)을 자유롭게 추가·수정하고, 방문자가 다운로드할 수 있는 <strong>이력서 양식·참고자료 첨부파일</strong>을 등록한 뒤 <strong>&lsquo;💾 고객지원 설정 저장하기&rsquo;</strong>를 눌러주세요.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetSupportConfig}
                    className="rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    기본값 초기화
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveSupportConfig}
                    className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-sm hover:bg-blue-500 cursor-pointer"
                  >
                    💾 고객지원 설정 저장하기
                  </button>
                </div>
              </div>

              {/* 고객지원 상단 탭 목록 (클릭 시 해당 탭 선택 + 이름 수정 + 삭제 + 새 탭 추가) */}
              <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-extrabold text-slate-800">
                    📌 고객지원 상단 탭 목록 ({supportForm.tabs.length}개) — 탭을 클릭하면 해당 탭 전용 내용을 편집할 수 있습니다
                  </span>
                  <span className="text-[11px] font-bold text-blue-700">
                    현재 선택된 탭: [{supportForm.tabs.find((t) => t.id === selectedSupportSubTab)?.label || selectedSupportSubTab}]
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {supportForm.tabs.map((tab, tIdx) => {
                    const isSelected = selectedSupportSubTab === tab.id;
                    return (
                      <div
                        key={tab.id}
                        onClick={() => setSelectedSupportSubTab(tab.id)}
                        className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 transition-all cursor-pointer ${
                          isSelected
                            ? "border-blue-600 bg-blue-600 text-white shadow-sm ring-2 ring-blue-200"
                            : "border-slate-200 bg-white text-slate-800 hover:border-blue-300"
                        }`}
                      >
                        <span className="text-xs font-extrabold">#{tIdx + 1}</span>
                        <input
                          type="text"
                          value={tab.label}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            const nextTabs = supportForm.tabs.map((tItem) =>
                              tItem.id === tab.id ? { ...tItem, label: e.target.value } : tItem
                            );
                            setSupportForm({ ...supportForm, tabs: nextTabs });
                          }}
                          className={`w-36 rounded px-1.5 py-0.5 text-xs font-extrabold focus:outline-none ${
                            isSelected
                              ? "bg-blue-700 text-white border border-blue-400"
                              : "bg-slate-50 text-slate-900 border border-slate-200"
                          }`}
                        />
                        {supportForm.tabs.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!confirm(`'${tab.label}' 탭을 삭제하시겠습니까? (삭제 후 '💾 고객지원 설정 저장하기'를 눌러주세요)`)) return;
                              const nextTabs = supportForm.tabs.filter((tItem) => tItem.id !== tab.id);
                              setSupportForm({ ...supportForm, tabs: nextTabs });
                              if (selectedSupportSubTab === tab.id) {
                                setSelectedSupportSubTab(nextTabs[0]?.id || "inquiry");
                              }
                            }}
                            className={`ml-1 rounded px-1.5 py-0.5 text-[11px] font-bold ${
                              isSelected
                                ? "bg-red-500 text-white hover:bg-red-600"
                                : "bg-red-50 text-red-600 hover:bg-red-100"
                            }`}
                          >
                            ×
                          </button>
                        )}
                      </div>
                    );
                  })}

                  {/* 새 고객지원 상단 탭 추가 */}
                  <div className="flex items-center gap-1.5 rounded-xl border border-dashed border-blue-400 bg-white px-2.5 py-1.5">
                    <input
                      type="text"
                      value={newSupportTabLabel}
                      onChange={(e) => setNewSupportTabLabel(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const trimmed = newSupportTabLabel.trim();
                          if (!trimmed) return;
                          const newTabId = `sup_tab_${Date.now()}`;
                          setSupportForm({
                            ...supportForm,
                            tabs: [...supportForm.tabs, { id: newTabId, label: trimmed }],
                          });
                          setNewSupportTabLabel("");
                          setSelectedSupportSubTab(newTabId);
                        }
                      }}
                      placeholder="새 탭 이름 (예: 채용·이력서)"
                      className="w-36 rounded border border-slate-200 px-2 py-1 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const trimmed = newSupportTabLabel.trim();
                        if (!trimmed) {
                          alert("추가할 고객지원 탭 이름을 입력해 주세요.");
                          return;
                        }
                        const newTabId = `sup_tab_${Date.now()}`;
                        setSupportForm({
                          ...supportForm,
                          tabs: [...supportForm.tabs, { id: newTabId, label: trimmed }],
                        });
                        setNewSupportTabLabel("");
                        setSelectedSupportSubTab(newTabId);
                      }}
                      className="rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-extrabold text-white hover:bg-blue-500 cursor-pointer"
                    >
                      + 탭 추가
                    </button>
                  </div>
                </div>
              </div>

              {/* (B) 이력서 양식 · 참고자료 등 방문자 다운로드용 첨부파일 업로드 관리 */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">
                      📥 방문자 다운로드용 첨부파일 관리 ({supportForm.attachments.length}개) — 이력서 양식, 회사소개서, 참고자료 등
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      내 PC에서 파일(HWP, PDF, DOCX, XLSX, ZIP, 이미지 등)을 올리고 <strong>&lsquo;💾 고객지원 설정 저장하기&rsquo;</strong>를 누르면 방문자가 고객지원 자료실 탭에서 즉시 다운로드할 수 있습니다.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-extrabold text-white shadow-xs cursor-pointer">
                      📎 내 PC에서 첨부파일 바로 올리기 (이력서·참고자료 추가)
                      <input
                        type="file"
                        className="hidden"
                        onChange={async (e) => {
                          const uploadedFile = e.target.files?.[0];
                          if (!uploadedFile) return;
                          const url = await uploadMediaFileToUrl(companySlug, uploadedFile);
                          const today = new Date().toISOString().slice(0, 10);
                          const baseTitle = uploadedFile.name.replace(/\.[^/.]+$/, "");
                          const nextAtts = [
                            ...supportForm.attachments,
                            {
                              id: `att_sup_${Date.now()}`,
                              category: "참고자료/양식",
                              title: baseTitle || "신규 첨부파일 자료",
                              desc: "다운로드 버튼을 클릭하시면 첨부파일이 저장됩니다.",
                              fileName: uploadedFile.name,
                              fileSize: formatFileSize(uploadedFile.size),
                              fileUrl: url,
                              date: today,
                            },
                          ];
                          setSupportForm({ ...supportForm, attachments: nextAtts });
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={handleSaveSupportConfig}
                      className="rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-extrabold text-white shadow-xs cursor-pointer"
                    >
                      💾 첨부파일 변경사항 저장
                    </button>
                  </div>
                </div>

                <div className="grid gap-3.5 sm:grid-cols-2">
                  {supportForm.attachments.map((att, idx) => (
                    <div
                      key={att.id}
                      className="rounded-xl border border-slate-200 bg-white p-4 space-y-2.5 shadow-2xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-extrabold text-blue-700">
                          📎 자료실 첨부파일 #{idx + 1}
                        </span>
                        <div className="flex items-center gap-2">
                          {att.fileUrl && (
                            <button
                              type="button"
                              onClick={() =>
                                triggerBrowserDownload(att.fileUrl, att.fileName || att.title)
                              }
                              className="rounded bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-500 cursor-pointer"
                            >
                              📥 다운로드 테스트
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              const nextAtts = supportForm.attachments.filter(
                                (x) => x.id !== att.id
                              );
                              setSupportForm({ ...supportForm, attachments: nextAtts });
                            }}
                            className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
                          >
                            삭제
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={att.category}
                          onChange={(e) => {
                            const nextAtts = supportForm.attachments.map((x) =>
                              x.id === att.id ? { ...x, category: e.target.value } : x
                            );
                            setSupportForm({ ...supportForm, attachments: nextAtts });
                          }}
                          placeholder="분류 (예: 이력서 양식)"
                          className="rounded border border-slate-300 px-2.5 py-1.5 text-xs font-bold"
                        />
                        <input
                          type="text"
                          value={att.title}
                          onChange={(e) => {
                            const nextAtts = supportForm.attachments.map((x) =>
                              x.id === att.id ? { ...x, title: e.target.value } : x
                            );
                            setSupportForm({ ...supportForm, attachments: nextAtts });
                          }}
                          placeholder="자료 제목 입력"
                          className="col-span-2 rounded border border-slate-300 px-2.5 py-1.5 text-xs font-bold"
                        />
                      </div>

                      <input
                        type="text"
                        value={att.desc || ""}
                        onChange={(e) => {
                          const nextAtts = supportForm.attachments.map((x) =>
                            x.id === att.id ? { ...x, desc: e.target.value } : x
                          );
                          setSupportForm({ ...supportForm, attachments: nextAtts });
                        }}
                        placeholder="자료 설명 입력"
                        className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs"
                      />

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <label className="rounded-lg bg-slate-900 hover:bg-slate-800 px-3 py-1.5 text-xs font-extrabold text-white cursor-pointer shrink-0">
                          📁 파일 변경/업로드
                          <input
                            type="file"
                            className="hidden"
                            onChange={async (e) => {
                              const uploadedFile = e.target.files?.[0];
                              if (!uploadedFile) return;
                              const url = await uploadMediaFileToUrl(companySlug, uploadedFile);
                              const nextAtts = supportForm.attachments.map((x) =>
                                x.id === att.id
                                  ? {
                                      ...x,
                                      fileUrl: url,
                                      fileName: uploadedFile.name,
                                      fileSize: formatFileSize(uploadedFile.size),
                                    }
                                  : x
                              );
                              setSupportForm({ ...supportForm, attachments: nextAtts });
                            }}
                          />
                        </label>
                        <input
                          type="text"
                          value={att.fileName}
                          onChange={(e) => {
                            const nextAtts = supportForm.attachments.map((x) =>
                              x.id === att.id ? { ...x, fileName: e.target.value } : x
                            );
                            setSupportForm({ ...supportForm, attachments: nextAtts });
                          }}
                          placeholder="다운로드될 파일명 (예: 입사지원서.hwp)"
                          className="flex-1 min-w-[140px] rounded border border-slate-300 px-2.5 py-1.5 text-xs font-mono"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* (C) 온라인 견적·상담 문의 접수 내역 */}
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

        {/* 모든 메뉴 공통: 내 입맛대로 자유 블록 추가·제거 빌더 (하위 탭별 개별 추가·수정 연동) */}
        <AdminPageBlockBuilder
          slug={companySlug}
          page={
            activeTab === "settings"
              ? "about"
              : activeTab === "inquiries"
              ? "support"
              : (activeTab as PageKey)
          }
          activeSubTab={
            activeTab === "settings"
              ? selectedAboutSubTab
              : activeTab === "inquiries"
              ? selectedSupportSubTab
              : hasSubTabsManager(activeTab)
              ? subCategory || "ALL"
              : undefined
          }
          onSelectSubTab={(sub) => {
            if (activeTab === "settings" && sub !== "ALL") {
              setSelectedAboutSubTab(sub);
            } else if (activeTab === "inquiries" && sub !== "ALL") {
              setSelectedSupportSubTab(sub);
            }
          }}
        />
      </div>
    </div>
  );
}
