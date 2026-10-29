import { supabase } from "@/lib/supabase";
import { siteConfig } from "@/config/site";
import { translations } from "@/lib/i18n";

export type CmsCategory = "facilities" | "products" | "technology" | "ir";

export interface CmsItem {
  id: string;
  category: CmsCategory;
  subCategory: string;
  title: string;
  specOrMaterial?: string;
  qtyOrDate?: string;
  maker?: string;
  description?: string;
  imageUrl?: string;
  linkUrl?: string;
  createdAt: string;
}

export interface SiteSettings {
  name: string;
  englishName: string;
  description: string;
  ceo: string;
  businessNumber: string;
  established: string;
  address: string;
  phone: string;
  fax: string;
  email: string;
  operatingHours: string;
  ceoGreetingLead: string;
  ceoGreetingBody: string; // 줄바꿈(\n)으로 문단 구분
  visionSlogan: string;
  visionSubSlogan: string;
  irRevenue: string;
  irRevenueNote: string;
  irMargin: string;
  irMarginNote: string;
  irCredit: string;
  irCreditNote: string;
}

export interface SupportInquiry {
  id: string;
  companyAndName: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  status: "대기중" | "답변완료";
  createdAt: string;
}

export type HeroMediaType = "default" | "image" | "video";

export interface HomeBannerSlide {
  id: string;
  badge: string;
  title1: string;
  title2: string;
  highlightName: string;
  description: string;
  mediaType: HeroMediaType;
  mediaUrl: string; // 이미지 URL/DataURL 또는 동영상(.mp4 등) URL/DataURL
  primaryBtnText: string;
  primaryBtnHref: string;
  secondaryBtnText: string;
  secondaryBtnHref: string;
  active: boolean;
}

export interface HomeCoreItem {
  id: string;
  title: string;
  desc: string;
  imageUrl?: string;
}

export interface HomeConfig {
  autoPlayIntervalMs: number;
  slides: HomeBannerSlide[];
  coreSectionTitle: string;
  coreSectionSubtitle: string;
  cores: HomeCoreItem[];
  showFacilitiesBanner: boolean;
  facilitiesBannerTitle: string;
  facilitiesBannerDesc: string;
  showSupportBanner: boolean;
  supportBannerTitle: string;
  supportBannerDesc: string;
}

export interface FacilityTabsConfig {
  allLabel: string; // 예: "전체 설비"
  tabs: string[];   // 예: ["가공설비", "주조설비", "검사설비"]
}

const STORAGE_KEY_PREFIX = "noksan_cms_items_v2_";
const SETTINGS_KEY_PREFIX = "noksan_site_settings_v2_";
const INQUIRIES_KEY_PREFIX = "noksan_inquiries_v2_";
const HOME_CONFIG_KEY_PREFIX = "noksan_home_config_v2_";
const FACILITY_TABS_KEY_PREFIX = "noksan_facility_tabs_v2_";
const CATEGORY_TABS_KEY_PREFIX = "noksan_category_tabs_v2_";

export const defaultFacilityTabsConfig: FacilityTabsConfig = {
  allLabel: "전체 설비",
  tabs: ["가공설비", "주조설비", "검사설비"],
};

export const defaultCategoryTabsConfig: Record<CmsCategory, FacilityTabsConfig> = {
  facilities: defaultFacilityTabsConfig,
  products: {
    allLabel: "전체 제품",
    tabs: [
      "선박·해양 부품",
      "중장비 부품",
      "산업기계 부품",
      "펌프·컴프레서",
      "자동차·방산 부품",
      "주문제작(OEM)",
    ],
  },
  technology: {
    allLabel: "전체 기술·인증",
    tabs: [
      "품질·환경 경영인증",
      "선급·해양 인증",
      "특허·지식재산권",
      "고객사 인증",
      "기업부설연구소·기술인증",
    ],
  },
  ir: {
    allLabel: "전체 공시·IR",
    tabs: ["정기공시", "주주총회", "IR자료"],
  },
};

export function normalizeExternalUrl(raw?: string): string {
  if (!raw) return "";
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/")
  ) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export const defaultSiteSettings: SiteSettings = {
  name: siteConfig.name,
  englishName: siteConfig.englishName,
  description: siteConfig.description,
  ceo: siteConfig.ceo,
  businessNumber: siteConfig.businessNumber,
  established: siteConfig.established,
  address: siteConfig.address,
  phone: siteConfig.phone,
  fax: siteConfig.fax,
  email: siteConfig.email,
  operatingHours: siteConfig.operatingHours,
  ceoGreetingLead: "“정밀 기술과 신뢰를 바탕으로 글로벌 제조 산업의 내일을 열어갑니다.”",
  ceoGreetingBody: translations.KR.about.ceoParagraphs.join("\n\n"),
  visionSlogan: "글로벌 핵심 기계부품 시장을 선도하는 초정밀 제조 파트너",
  visionSubSlogan:
    "원소재 주조 기술과 첨단 CNC 복합가공 역량을 융합하여 고객에게 가장 완벽한 품질 솔루션을 제공합니다.",
  irRevenue: "185억 원",
  irRevenueNote: "전년 대비 +12.4% 성장",
  irMargin: "9.8%",
  irMarginNote: "고부가 정밀가공 비중 확대",
  irCredit: "BB+ (안정적)",
  irCreditNote: "기업신용평가 기준",
};

/**
 * SVG 썸네일 생성기 (기본 항목들도 클릭 시 고해상도 라이트박스 확대가 가능하도록 Data URL 제공)
 */
export function makeSvgDataUrl(title: string, subtitle: string, theme: "blue" | "slate" | "indigo" = "blue"): string {
  const bg1 = theme === "blue" ? "#0f172a" : theme === "indigo" ? "#1e1b4b" : "#18181b";
  const bg2 = theme === "blue" ? "#1d4ed8" : theme === "indigo" ? "#4338ca" : "#334155";
  const safeTitle = title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const safeSub = subtitle.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="640" viewBox="0 0 960 640">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bg1}"/>
        <stop offset="100%" stop-color="${bg2}"/>
      </linearGradient>
    </defs>
    <rect width="960" height="640" fill="url(#g)"/>
    <g stroke="rgba(255,255,255,0.08)" stroke-width="1">
      <line x1="0" y1="160" x2="960" y2="160"/>
      <line x1="0" y1="320" x2="960" y2="320"/>
      <line x1="0" y1="480" x2="960" y2="480"/>
      <line x1="240" y1="0" x2="240" y2="640"/>
      <line x1="480" y1="0" x2="480" y2="640"/>
      <line x1="720" y1="0" x2="720" y2="640"/>
    </g>
    <circle cx="480" cy="240" r="76" fill="rgba(59,130,246,0.18)" stroke="rgba(147,197,253,0.5)" stroke-width="3"/>
    <circle cx="480" cy="240" r="34" fill="none" stroke="#93c5fd" stroke-width="4" stroke-dasharray="12 8"/>
    <text x="480" y="385" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="32" font-weight="bold">${safeTitle}</text>
    <text x="480" y="435" text-anchor="middle" fill="#93c5fd" font-family="sans-serif" font-size="22">${safeSub}</text>
    <text x="480" y="575" text-anchor="middle" fill="rgba(255,255,255,0.45)" font-family="sans-serif" font-size="16">NOKSAN PRECISION MFG CO., LTD.</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function getSeedItems(): CmsItem[] {
  const now = "2026-01-01T00:00:00.000Z";
  const facilities: CmsItem[] = translations.KR.facilities.items.map((item, idx) => ({
    id: `seed_fac_${idx}`,
    category: "facilities",
    subCategory: item.category,
    title: item.name,
    specOrMaterial: item.spec,
    qtyOrDate: item.qty,
    maker: item.maker,
    description: `${item.maker} 정밀 ${item.category} (${item.spec})`,
    imageUrl: makeSvgDataUrl(item.name, `${item.maker} | ${item.spec}`, "blue"),
    createdAt: now,
  }));

  const products: CmsItem[] = translations.KR.products.items.map((item, idx) => ({
    id: `seed_prod_${idx}`,
    category: "products",
    subCategory: item.category,
    title: item.name,
    specOrMaterial: item.material,
    qtyOrDate: "주문제작(OEM)",
    description: item.desc,
    imageUrl: makeSvgDataUrl(item.name, `${item.category} | ${item.material}`, "slate"),
    createdAt: now,
  }));

  const tech: CmsItem[] = translations.KR.technology.items.map((item, idx) => ({
    id: `seed_tech_${idx}`,
    category: "technology",
    subCategory: item.category,
    title: item.title,
    specOrMaterial: item.issuer,
    qtyOrDate: item.date,
    description: item.desc,
    imageUrl: makeSvgDataUrl(item.title, `${item.issuer} (${item.date})`, "indigo"),
    createdAt: now,
  }));

  const ir: CmsItem[] = translations.KR.ir.disclosures.map((item, idx) => ({
    id: `seed_ir_${idx}`,
    category: "ir",
    subCategory: item.category,
    title: item.title,
    specOrMaterial: item.source,
    qtyOrDate: item.date,
    description: `${item.source} 등록 자료`,
    imageUrl: "",
    linkUrl: "https://dart.fss.or.kr",
    createdAt: now,
  }));

  return [...facilities, ...products, ...tech, ...ir];
}

function getLocalItems(slug: string): CmsItem[] {
  if (typeof window === "undefined") return getSeedItems();
  try {
    const key = `${STORAGE_KEY_PREFIX}${slug}`;
    const raw = localStorage.getItem(key);
    if (!raw) {
      const seeded = getSeedItems();
      localStorage.setItem(key, JSON.stringify(seeded));
      return seeded;
    }
    return JSON.parse(raw);
  } catch {
    return getSeedItems();
  }
}

function saveLocalItems(slug: string, items: CmsItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${STORAGE_KEY_PREFIX}${slug}`, JSON.stringify(items));
  window.dispatchEvent(new Event("cms-updated"));
}

export function getSiteSettings(slug = "noksan"): SiteSettings {
  if (typeof window === "undefined") return defaultSiteSettings;
  try {
    const raw = localStorage.getItem(`${SETTINGS_KEY_PREFIX}${slug}`);
    if (!raw) return defaultSiteSettings;
    return { ...defaultSiteSettings, ...JSON.parse(raw) };
  } catch {
    return defaultSiteSettings;
  }
}

export function saveSiteSettings(slug: string, settings: SiteSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${SETTINGS_KEY_PREFIX}${slug}`, JSON.stringify(settings));
  window.dispatchEvent(new Event("cms-updated"));
}

export function resetSiteSettings(slug = "noksan"): SiteSettings {
  if (typeof window !== "undefined") {
    localStorage.removeItem(`${SETTINGS_KEY_PREFIX}${slug}`);
    window.dispatchEvent(new Event("cms-updated"));
  }
  return defaultSiteSettings;
}

export function getFacilityTabsConfig(slug = "noksan"): FacilityTabsConfig {
  if (typeof window === "undefined") return defaultFacilityTabsConfig;
  try {
    const raw = localStorage.getItem(`${FACILITY_TABS_KEY_PREFIX}${slug}`);
    if (!raw) return defaultFacilityTabsConfig;
    const parsed = JSON.parse(raw);
    return {
      allLabel: parsed.allLabel || defaultFacilityTabsConfig.allLabel,
      tabs: Array.isArray(parsed.tabs) && parsed.tabs.length > 0
        ? parsed.tabs
        : defaultFacilityTabsConfig.tabs,
    };
  } catch {
    return defaultFacilityTabsConfig;
  }
}

export function saveFacilityTabsConfig(slug: string, config: FacilityTabsConfig): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${FACILITY_TABS_KEY_PREFIX}${slug}`, JSON.stringify(config));
  window.dispatchEvent(new Event("cms-updated"));
}

export function resetFacilityTabsConfig(slug = "noksan"): FacilityTabsConfig {
  if (typeof window !== "undefined") {
    localStorage.removeItem(`${FACILITY_TABS_KEY_PREFIX}${slug}`);
    window.dispatchEvent(new Event("cms-updated"));
  }
  return defaultFacilityTabsConfig;
}

export function renameFacilityTabCategory(
  slug: string,
  oldName: string,
  newName: string
): void {
  renameCategoryTab(slug, "facilities", oldName, newName);
}

export function getCategoryTabsConfig(
  slug = "noksan",
  category: CmsCategory
): FacilityTabsConfig {
  if (category === "facilities") {
    return getFacilityTabsConfig(slug);
  }
  const fallback = defaultCategoryTabsConfig[category];
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(`${CATEGORY_TABS_KEY_PREFIX}${slug}_${category}`);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return {
      allLabel: parsed.allLabel || fallback.allLabel,
      tabs:
        Array.isArray(parsed.tabs) && parsed.tabs.length > 0
          ? parsed.tabs
          : fallback.tabs,
    };
  } catch {
    return fallback;
  }
}

export function saveCategoryTabsConfig(
  slug: string,
  category: CmsCategory,
  config: FacilityTabsConfig
): void {
  if (category === "facilities") {
    saveFacilityTabsConfig(slug, config);
    return;
  }
  if (typeof window === "undefined") return;
  localStorage.setItem(
    `${CATEGORY_TABS_KEY_PREFIX}${slug}_${category}`,
    JSON.stringify(config)
  );
  window.dispatchEvent(new Event("cms-updated"));
}

export function resetCategoryTabsConfig(
  slug = "noksan",
  category: CmsCategory
): FacilityTabsConfig {
  if (category === "facilities") {
    return resetFacilityTabsConfig(slug);
  }
  if (typeof window !== "undefined") {
    localStorage.removeItem(`${CATEGORY_TABS_KEY_PREFIX}${slug}_${category}`);
    window.dispatchEvent(new Event("cms-updated"));
  }
  return defaultCategoryTabsConfig[category];
}

export function renameCategoryTab(
  slug: string,
  category: CmsCategory,
  oldName: string,
  newName: string
): void {
  if (typeof window === "undefined") return;
  const trimmedNew = newName.trim();
  if (!trimmedNew || oldName === trimmedNew) return;
  const current = getLocalItems(slug);
  const updated = current.map((item) =>
    item.category === category && item.subCategory === oldName
      ? { ...item, subCategory: trimmedNew }
      : item
  );
  saveLocalItems(slug, updated);
}

export function updateCmsItemLink(
  slug: string,
  id: string,
  rawLinkUrl: string
): void {
  if (typeof window === "undefined") return;
  const normalized = normalizeExternalUrl(rawLinkUrl);
  const current = getLocalItems(slug);
  const updated = current.map((item) =>
    item.id === id ? { ...item, linkUrl: normalized } : item
  );
  saveLocalItems(slug, updated);
}

export const defaultHomeConfig: HomeConfig = {
  autoPlayIntervalMs: 5500,
  slides: [
    {
      id: "slide_1",
      badge: "부산 녹산국가산업단지 강소기업",
      title1: "정밀 주물부터 초정밀 가공까지,",
      title2: "신뢰할 수 있는 제조 파트너",
      highlightName: siteConfig.name,
      description:
        "축적된 기술력과 최신 CNC 설비를 바탕으로 선박, 중장비, 산업기계 핵심 부품을 최고의 품질로 생산합니다.",
      mediaType: "image",
      mediaUrl: makeSvgDataUrl(
        "SMART FOUNDRY & CNC MACHINING",
        "주물 원소재부터 초정밀 5축 가공까지 원스톱 생산",
        "blue"
      ),
      primaryBtnText: "제품소개 보러가기",
      primaryBtnHref: "/products",
      secondaryBtnText: "견적 및 제작 문의",
      secondaryBtnHref: "/support",
      active: true,
    },
    {
      id: "slide_2",
      badge: "HIGH-PRECISION CNC FACILITIES",
      title1: "대형 문형 보링기 · 5축 머시닝센터 가동,",
      title2: "고난도 대형·복합 부품 완벽 대응",
      highlightName: "±0.005mm 정밀보증",
      description:
        "수직·수평 머시닝센터(MCT), CNC 선반, 3차원 측정기(CMM)를 통해 엄격한 치수 정밀도와 납기를 보장합니다.",
      mediaType: "image",
      mediaUrl: makeSvgDataUrl(
        "ULTRA-PRECISION CNC & 3D CMM",
        "머시닝센터 · 대형 보링기 · 3차원 정밀 측정 시스템",
        "indigo"
      ),
      primaryBtnText: "설비현황 확인하기",
      primaryBtnHref: "/facilities",
      secondaryBtnText: "기술·인증서 보기",
      secondaryBtnHref: "/technology",
      active: true,
    },
    {
      id: "slide_3",
      badge: "GLOBAL QUALITY & MARINE CERTIFIED",
      title1: "ISO 9001/14001 · 국제 선급(KR/DNV) 승인,",
      title2: "글로벌 시장을 선도하는 기술 경쟁력",
      highlightName: "수출 유망 파트너",
      description:
        "회주철(GC), 구상흑연주철(GCD), 특수 합금강 주물부터 완제품 가공까지 글로벌 고객사가 신뢰하는 파트너입니다.",
      mediaType: "video",
      mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-automated-industrial-machinery-in-action-42632-large.mp4",
      primaryBtnText: "회사소개 바로가기",
      primaryBtnHref: "/about",
      secondaryBtnText: "온라인 견적문의",
      secondaryBtnHref: "/support",
      active: true,
    },
  ],
  coreSectionTitle: "핵심 사업 분야",
  coreSectionSubtitle:
    "원소재 주조부터 정밀 가공, 품질 검사까지 원스톱 생산 체계를 갖추고 있습니다.",
  cores: [
    {
      id: "core_1",
      title: "특수·일반 주물 생산",
      desc: "회주철(GC), 구상흑연주철(GCD) 및 합금강 주물 등 고객사 요구 사양에 맞춘 고품질 주물 소재 제작",
      imageUrl: makeSvgDataUrl("특수·일반 주물 생산", "GC / GCD / 특수 합금강 주조", "slate"),
    },
    {
      id: "core_2",
      title: "CNC 정밀 기계가공",
      desc: "머시닝센터(MCT), CNC 선반, 대형 보링기 등을 활용한 고난도·초정밀 부품 가공",
      imageUrl: makeSvgDataUrl("CNC 정밀 기계가공", "MCT / CNC 선반 / 대형 문형 보링", "blue"),
    },
    {
      id: "core_3",
      title: "철저한 품질 보증",
      desc: "3차원 측정기 및 비파괴 검사 설비를 통한 엄격한 치수 관리 및 납기 준수",
      imageUrl: makeSvgDataUrl("철저한 품질 보증", "3차원 측정기(CMM) 및 성분·경도 분석", "indigo"),
    },
  ],
  showFacilitiesBanner: true,
  facilitiesBannerTitle: "보유 설비 현황",
  facilitiesBannerDesc: "생산 설비 및 정밀 측정 장비 리스트를 확인하실 수 있습니다.",
  showSupportBanner: true,
  supportBannerTitle: "고객지원 및 견적문의",
  supportBannerDesc: "도면 검토 및 가공 견적 문의를 남겨주시면 신속히 답변드리겠습니다.",
};

export function getHomeConfig(slug = "noksan"): HomeConfig {
  if (typeof window === "undefined") return defaultHomeConfig;
  try {
    const raw = localStorage.getItem(`${HOME_CONFIG_KEY_PREFIX}${slug}`);
    if (!raw) return defaultHomeConfig;
    const parsed = JSON.parse(raw);
    return {
      ...defaultHomeConfig,
      ...parsed,
      slides: Array.isArray(parsed.slides) && parsed.slides.length > 0 ? parsed.slides : defaultHomeConfig.slides,
      cores: Array.isArray(parsed.cores) && parsed.cores.length > 0 ? parsed.cores : defaultHomeConfig.cores,
    };
  } catch {
    return defaultHomeConfig;
  }
}

export function saveHomeConfig(slug: string, config: HomeConfig): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${HOME_CONFIG_KEY_PREFIX}${slug}`, JSON.stringify(config));
  window.dispatchEvent(new Event("cms-updated"));
}

export function resetHomeConfig(slug = "noksan"): HomeConfig {
  if (typeof window !== "undefined") {
    localStorage.removeItem(`${HOME_CONFIG_KEY_PREFIX}${slug}`);
    window.dispatchEvent(new Event("cms-updated"));
  }
  return defaultHomeConfig;
}

export async function uploadMediaFileToUrl(slug: string, file: File): Promise<string> {
  if (isSupabaseConfigured()) {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${slug}_banner_${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, file);

      if (!uploadError) {
        const { data: publicURLData } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);
        return publicURLData.publicUrl;
      }
    } catch {
      // fallback to DataURL below
    }
  }
  return fileToDataUrl(file);
}

export function getSupportInquiries(slug = "noksan"): SupportInquiry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`${INQUIRIES_KEY_PREFIX}${slug}`);
    if (!raw) {
      const sample: SupportInquiry[] = [
        {
          id: "inq_sample_1",
          companyAndName: "대양조선기자재 / 박민수 부장",
          phone: "010-5544-0000",
          email: "park@daeyang-marine.co.kr",
          subject: "선박용 밸브 바디(GCD450) 주물 및 황·정삭 가공 견적 문의",
          message: "도면 3종 첨부 예정입니다. 월 150EA 기준 단가 및 초도 샘플 납기 확인 부탁드립니다.",
          status: "대기중",
          createdAt: "2026-10-27 14:30",
        },
      ];
      localStorage.setItem(`${INQUIRIES_KEY_PREFIX}${slug}`, JSON.stringify(sample));
      return sample;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function addSupportInquiry(
  slug: string,
  input: Omit<SupportInquiry, "id" | "status" | "createdAt">
): SupportInquiry {
  const current = getSupportInquiries(slug);
  const now = new Date();
  const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}`;

  const created: SupportInquiry = {
    ...input,
    id: `inq_${Date.now()}`,
    status: "대기중",
    createdAt: formattedDate,
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(
      `${INQUIRIES_KEY_PREFIX}${slug}`,
      JSON.stringify([created, ...current])
    );
    window.dispatchEvent(new Event("cms-updated"));
  }
  return created;
}

export function toggleInquiryStatus(slug: string, id: string): void {
  const current = getSupportInquiries(slug);
  const updated = current.map((item) =>
    item.id === id
      ? { ...item, status: (item.status === "대기중" ? "답변완료" : "대기중") as "대기중" | "답변완료" }
      : item
  );
  if (typeof window !== "undefined") {
    localStorage.setItem(`${INQUIRIES_KEY_PREFIX}${slug}`, JSON.stringify(updated));
    window.dispatchEvent(new Event("cms-updated"));
  }
}

export function deleteSupportInquiry(slug: string, id: string): void {
  const current = getSupportInquiries(slug);
  if (typeof window !== "undefined") {
    localStorage.setItem(
      `${INQUIRIES_KEY_PREFIX}${slug}`,
      JSON.stringify(current.filter((i) => i.id !== id))
    );
    window.dispatchEvent(new Event("cms-updated"));
  }
}

const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return Boolean(url && !url.includes("placeholder.supabase.co"));
};

function encodeMeta(item: Omit<CmsItem, "id" | "createdAt">): string {
  return JSON.stringify({
    __cms_v1: true,
    category: item.category,
    subCategory: item.subCategory,
    specOrMaterial: item.specOrMaterial || "",
    qtyOrDate: item.qtyOrDate || "",
    maker: item.maker || "",
    description: item.description || "",
    linkUrl: item.linkUrl || "",
  });
}

function decodeRow(row: any): CmsItem {
  try {
    if (row.description && row.description.startsWith('{"__cms_v1":true')) {
      const parsed = JSON.parse(row.description);
      return {
        id: String(row.id),
        category: parsed.category || "products",
        subCategory: parsed.subCategory || "일반",
        title: row.title,
        specOrMaterial: parsed.specOrMaterial || "",
        qtyOrDate: parsed.qtyOrDate || "",
        maker: parsed.maker || "",
        description: parsed.description || "",
        imageUrl: row.image_url || "",
        linkUrl: parsed.linkUrl || "",
        createdAt: row.created_at || new Date().toISOString(),
      };
    }
  } catch {
    // fallback
  }
  return {
    id: String(row.id),
    category: "products",
    subCategory: "주요 제품",
    title: row.title,
    specOrMaterial: "고객사 맞춤 재질",
    description: row.description || "",
    imageUrl: row.image_url || "",
    createdAt: row.created_at || new Date().toISOString(),
  };
}

export async function fetchCmsItems(slug = "noksan", category?: CmsCategory): Promise<CmsItem[]> {
  const localItems = getLocalItems(slug);
  let remoteItems: CmsItem[] = [];

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("company_slug", slug)
        .order("created_at", { ascending: false });

      if (!error && data) {
        remoteItems = data.map(decodeRow);
      }
    } catch {
      // ignore
    }
  }

  const mergedMap = new Map<string, CmsItem>();
  for (const item of [...remoteItems, ...localItems]) {
    mergedMap.set(item.id, item);
  }
  const all = Array.from(mergedMap.values());
  return category ? all.filter((i) => i.category === category) : all;
}

export async function createCmsItem(
  slug: string,
  input: Omit<CmsItem, "id" | "createdAt">,
  file?: File | null
): Promise<CmsItem> {
  let imageUrl = input.imageUrl || "";

  if (file) {
    if (isSupabaseConfigured()) {
      try {
        const fileExt = file.name.split(".").pop();
        const fileName = `${slug}_${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(fileName, file);

        if (!uploadError) {
          const { data: publicURLData } = supabase.storage
            .from("product-images")
            .getPublicUrl(fileName);
          imageUrl = publicURLData.publicUrl;
        }
      } catch {
        // fallback below
      }
    }
    if (!imageUrl) {
      imageUrl = await fileToDataUrl(file);
    }
  }

  if (!imageUrl && input.category !== "ir") {
    imageUrl = makeSvgDataUrl(
      input.title,
      `${input.subCategory} | ${input.specOrMaterial || ""}`,
      input.category === "facilities" ? "blue" : input.category === "technology" ? "indigo" : "slate"
    );
  }

  const newItem: CmsItem = {
    ...input,
    linkUrl: input.linkUrl !== undefined ? normalizeExternalUrl(input.linkUrl) : undefined,
    id: `local_${Date.now()}`,
    imageUrl,
    createdAt: new Date().toISOString(),
  };

  const current = getLocalItems(slug);
  saveLocalItems(slug, [newItem, ...current]);
  return newItem;
}

export async function updateCmsItem(
  slug: string,
  id: string,
  input: Omit<CmsItem, "id" | "createdAt">,
  file?: File | null
): Promise<void> {
  let imageUrl = input.imageUrl || "";
  if (file) {
    imageUrl = await fileToDataUrl(file);
  }

  const current = getLocalItems(slug);
  const updated = current.map((item) =>
    item.id === id
      ? {
          ...item,
          ...input,
          linkUrl: input.linkUrl !== undefined ? normalizeExternalUrl(input.linkUrl) : item.linkUrl,
          imageUrl: imageUrl || item.imageUrl,
        }
      : item
  );
  saveLocalItems(slug, updated);
}

export async function deleteCmsItem(slug: string, id: string): Promise<void> {
  const current = getLocalItems(slug);
  saveLocalItems(
    slug,
    current.filter((item) => item.id !== id)
  );
}

export function resetAllCmsItemsToDefault(slug = "noksan"): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${STORAGE_KEY_PREFIX}${slug}`, JSON.stringify(getSeedItems()));
  window.dispatchEvent(new Event("cms-updated"));
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
