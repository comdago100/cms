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
  hiddenMenus?: string[]; // 예: ["/ir", "/technology"] 상단 GNB 및 푸터에서 숨길 메뉴 href 목록
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

export interface HomeMiniBanner {
  id: string;
  title: string;
  desc: string;
  btnText: string;
  btnHref: string;
  theme: "slate" | "blue" | "dark";
  active: boolean;
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
  miniBanners?: HomeMiniBanner[];
}

export type PageKey =
  | "home"
  | "about"
  | "facilities"
  | "products"
  | "technology"
  | "ir"
  | "support";

export type CustomBlockType =
  | "text_block"
  | "kpi_stats"
  | "link_board"
  | "file_download"
  | "image_grid"
  | "mini_banner"
  | "card_grid"
  | "image_box"
  | "timeline_steps"
  | "faq_accordion"
  | "video_embed";

export type ImageGridPreset = "1x1" | "2x1" | "3x1" | "4x1" | "2x2" | "3x2";

export interface CustomAttachmentItem {
  id: string;
  category: string;
  title: string;
  desc?: string;
  fileName: string;
  fileSize?: string;
  fileUrl: string;
  date?: string;
}

export interface CustomCardItem {
  id: string;
  badge?: string;
  title: string;
  desc: string;
  imageUrl?: string;
  linkUrl?: string;
  attachmentUrl?: string;
  attachmentName?: string;
}

export interface CustomKpiStatItem {
  id: string;
  label: string;
  value: string;
  note: string;
  color?: "blue" | "emerald" | "indigo" | "slate";
}

export interface CustomBoardRowItem {
  id: string;
  category: string;
  title: string;
  source: string;
  date: string;
  linkUrl: string;
  attachmentUrl?: string;
  attachmentName?: string;
}

export interface CustomImageGridItem {
  id: string;
  url: string;
  title?: string;
  caption?: string;
  linkUrl?: string;
}

export interface CustomTimelineStepItem {
  id: string;
  stepOrYear: string;
  title: string;
  desc: string;
}

export interface CustomFaqItem {
  id: string;
  q: string;
  a: string;
}

export interface CustomPageBlock {
  id: string;
  page: PageKey;
  subTab?: string; // "ALL" (또는 미지정)이면 해당 메뉴 모든 탭에 표시, 특정 탭 ID/이름이면 그 하위 탭에서만 표시
  position: "top" | "bottom";
  type: CustomBlockType;
  bannerTheme?: "blue" | "dark" | "light" | "transparent";
  badge?: string;
  title: string;
  subtitle?: string;
  btnText?: string;
  btnHref?: string;
  btnNewTab?: boolean;
  imageUrl?: string;
  attachmentUrl?: string;
  attachmentName?: string;
  // 텍스트 블록 전용
  textAlign?: "left" | "center" | "two_col";
  calloutText?: string;
  // 카드# 그룹 전용
  gridCols?: 2 | 3 | 4;
  cards?: CustomCardItem[];
  // 주요 경영·재무지표(KPI) 전용
  stats?: CustomKpiStatItem[];
  // 링크 연동 게시판 전용
  boardHeaders?: {
    col1: string;
    col2: string;
    col3: string;
    col4: string;
  };
  boardRows?: CustomBoardRowItem[];
  // 첨부파일 다운로드 자료실 전용
  attachments?: CustomAttachmentItem[];
  // 멀티 이미지 그리드(1x1, 2x1, 3x1, 4x1) 전용
  gridPreset?: ImageGridPreset;
  imageAspect?: "video" | "square" | "wide" | "auto";
  images?: CustomImageGridItem[];
  // 타임라인/공정 스텝 전용
  steps?: CustomTimelineStepItem[];
  // FAQ 아코디언 전용
  faqs?: CustomFaqItem[];
  // 동영상/유튜브 전용
  videoUrl?: string;
}

export interface SkeletonSectionDef {
  id: string;
  label: string;
  desc: string;
}

export const SKELETON_SECTIONS_BY_PAGE: Record<PageKey, SkeletonSectionDef[]> = {
  home: [
    { id: "home_hero", label: "메인 히어로 배너 슬라이드", desc: "상단 영상/이미지 멀티 배너 영역" },
    { id: "home_cores", label: "핵심 사업 분야 카드 섹션", desc: "주물·정밀가공·품질보증 카드 영역" },
    { id: "home_mini_banners", label: "하단 바로가기 작은 배너 섹션", desc: "설비현황·견적문의 하단 배너 영역" },
  ],
  about: [
    { id: "about_subtabs", label: "회사소개 기본 뼈대 전체", desc: "CEO인사말·개요·비전·연혁·오시는길 전체 영역" },
    { id: "about_tab_greeting", label: "탭 1: CEO 인사말", desc: "대표이사 인사말 탭" },
    { id: "about_tab_overview", label: "탭 2: 회사개요", desc: "기업 정보 및 핵심 수치 4종 탭" },
    { id: "about_tab_vision", label: "탭 3: 비전·핵심가치", desc: "VISION 2030 및 3대 핵심가치 탭" },
    { id: "about_tab_history", label: "탭 4: 기업연혁", desc: "창립 이래 주요 연혁 타임라인 탭" },
    { id: "about_tab_location", label: "탭 5: 오시는 길", desc: "구글 지도 및 교통편 안내 탭" },
  ],
  facilities: [
    { id: "fac_subtabs", label: "상단 설비 분류 탭 바", desc: "전체설비·가공·주조·검사 탭 네비게이션" },
    { id: "fac_cards", label: "기본 설비 사진 카드 그리드", desc: "보유 설비 이미지 카드 목록" },
    { id: "fac_table", label: "하단 전체 보유설비 총괄표", desc: "설비명·규격·수량·제조사 요약 표" },
  ],
  products: [
    { id: "prod_subtabs", label: "상단 제품 분류 탭 바", desc: "전체제품·선박·중장비 등 탭 네비게이션" },
    { id: "prod_cards", label: "기본 제품 사진 카드 그리드", desc: "주요 생산 제품 이미지 카드 목록" },
  ],
  technology: [
    { id: "tech_subtabs", label: "상단 기술·인증 분류 탭 바", desc: "전체인증·ISO·특허·선급 탭 네비게이션" },
    { id: "tech_cards", label: "기본 인증서·특허 카드 그리드", desc: "인증서 및 특허 이미지 카드 목록" },
  ],
  ir: [
    { id: "ir_highlights", label: "기본 주요 재무 하이라이트 (3대 지표)", desc: "매출액·영업이익률·신용등급 기본 카드" },
    { id: "ir_board", label: "기본 공시 및 IR 자료실 게시판", desc: "DART 공시 및 주주총회 목록 표" },
  ],
  support: [
    { id: "sup_subtabs", label: "고객지원 상단 탭 바", desc: "온라인 문의·자료실 등 상단 탭 네비게이션" },
    { id: "sup_contact", label: "좌측 연락처·소재지 안내 박스", desc: "대표전화·팩스·이메일·영업시간 안내" },
    { id: "sup_form", label: "우측 온라인 견적·상담 문의 폼", desc: "고객 문의 접수 양식" },
    { id: "sup_downloads", label: "자료실 · 양식 첨부파일 다운로드 섹션", desc: "이력서 양식·참고자료 다운로드 목록" },
  ],
};

export interface AboutSubTabItem {
  id: string;
  label: string;
}

export interface AboutStatItem {
  id: string;
  label: string;
  value: string;
  desc: string;
}

export interface AboutOverviewRowItem {
  id: string;
  label: string;
  value: string;
}

export interface AboutVisionPillarItem {
  id: string;
  step: string;
  title: string;
  desc: string;
}

export interface AboutHistoryEventItem {
  id: string;
  year: string;
  text: string;
}

export interface AboutHistoryBlockItem {
  id: string;
  period: string;
  phase: string;
  events: AboutHistoryEventItem[];
}

export interface AboutDirectionItem {
  id: string;
  title: string;
  desc: string;
}

export interface AboutConfig {
  tabs: AboutSubTabItem[];
  overviewStats: AboutStatItem[];
  extraOverviewRows: AboutOverviewRowItem[];
  visionBadge: string;
  visionPillars: AboutVisionPillarItem[];
  historyBlocks: AboutHistoryBlockItem[];
  directions: AboutDirectionItem[];
}

export interface FacilityTabsConfig {
  allLabel: string; // 예: "전체 설비"
  tabs: string[];   // 예: ["가공설비", "주조설비", "검사설비"]
}

const STORAGE_KEY_PREFIX = "noksan_cms_items_v2_";
const SETTINGS_KEY_PREFIX = "noksan_site_settings_v2_";
const INQUIRIES_KEY_PREFIX = "noksan_inquiries_v2_";
const HOME_CONFIG_KEY_PREFIX = "noksan_home_config_v2_";
const ABOUT_CONFIG_KEY_PREFIX = "noksan_about_config_v1_";
const FACILITY_TABS_KEY_PREFIX = "noksan_facility_tabs_v2_";
const CATEGORY_TABS_KEY_PREFIX = "noksan_category_tabs_v2_";
const CUSTOM_BLOCKS_KEY_PREFIX = "noksan_custom_blocks_v1_";
const HIDDEN_SKELETON_KEY_PREFIX = "noksan_hidden_skeleton_v1_";

export const defaultAboutConfig: AboutConfig = {
  tabs: [
    { id: "greeting", label: "CEO 인사말" },
    { id: "overview", label: "회사개요" },
    { id: "vision", label: "비전·핵심가치" },
    { id: "history", label: "기업연혁" },
    { id: "location", label: "오시는 길" },
  ],
  overviewStats: [
    { id: "ast_1", label: "업력 및 노하우", value: "28년+", desc: "1998년 창립 이래 무결점 생산" },
    { id: "ast_2", label: "가공 정밀도", value: "±0.005mm", desc: "3차원 측정 기반 초정밀 공차" },
    { id: "ast_3", label: "납기 준수율", value: "99.4%", desc: "체계적인 공정·생산 일정 관리" },
    { id: "ast_4", label: "보유 생산설비", value: "20대+", desc: "MCT·CNC선반·대형보링·유도로" },
  ],
  extraOverviewRows: [],
  visionBadge: "VISION 2030",
  visionPillars: [
    {
      id: "vp_1",
      step: "01",
      title: "초정밀 품질주의 (Zero-Defect)",
      desc: "원자재 성분 분석부터 3차원 측정 검사까지 전 공정 데이터 기반 품질 보증 체계를 실천합니다.",
    },
    {
      id: "vp_2",
      step: "02",
      title: "스마트 공정 혁신 (Smart Factory)",
      desc: "대형·복합 CNC 설비 자동화와 가공 지그 독자 개발로 생산성과 정밀도를 동시에 극대화합니다.",
    },
    {
      id: "vp_3",
      step: "03",
      title: "고객 가치 동반성장 (Partnership)",
      desc: "단순 외주 가공을 넘어 도면 검토·소재 제안부터 납기까지 책임지는 기술 파트너가 됩니다.",
    },
  ],
  historyBlocks: [
    {
      id: "hb_1",
      period: "2020 ~ 현재",
      phase: "스마트 정밀가공 고도화 및 글로벌 수출 확대기",
      events: [
        { id: "he_1", year: "2025. 11", text: "녹산 제2공장 대형 CNC 문형 보링기 및 복합가공 라인 증설" },
        { id: "he_2", year: "2024. 02", text: "중소벤처기업부 기술혁신형 중소기업(Inno-Biz) 인증 획득" },
        { id: "he_3", year: "2023. 04", text: "국내 주요 중공업·방산 대기업 1차 우수협력사(SQ) 인증" },
        { id: "he_4", year: "2021. 11", text: "고내압 밸브 바디 정밀 주조 및 복합 가공 지그 장치 특허 등록" },
      ],
    },
    {
      id: "hb_2",
      period: "2010 ~ 2019",
      phase: "국제 품질·선급 인증 획득 및 사업 다각화기",
      events: [
        { id: "he_5", year: "2018. 03", text: "한국선급(KR) 및 노르웨이선급(DNV) 선박 부품 공장승인 획득" },
        { id: "he_6", year: "2015. 09", text: "ISO 14001 환경경영시스템 국제 인증 획득" },
        { id: "he_7", year: "2012. 06", text: "ISO 9001 품질경영시스템 인증 및 3차원 측정실(CMM) 구축" },
      ],
    },
    {
      id: "hb_3",
      period: "1998 ~ 2009",
      phase: "창립 및 부산 녹산국가산업단지 기반 구축기",
      events: [
        { id: "he_8", year: "2005. 08", text: "부산 녹산국가산업단지 현 본사 및 제1공장 신축 이전" },
        { id: "he_9", year: "2001. 04", text: "선박용 밸브 및 중장비 유압 부품 정밀가공 사업부 출범" },
        { id: "he_10", year: "1998. 05", text: "(주)녹산정밀기공 법인 설립 (특수·일반 주물 및 기계부품 제조)" },
      ],
    },
  ],
  directions: [
    {
      id: "dir_1",
      title: "승용차·화물차 이용 시",
      desc: "남해고속도로 가락IC 또는 부산신항 배후도로 → 녹산국가산업단지 진입 → 녹산산단382로 14번길 방면 (대형 화물차 진·출입 가능)",
    },
    {
      id: "dir_2",
      title: "대중교통 이용 시",
      desc: "부산 도시철도 1호선 하단역 환승 → 급행 1009번 또는 강서구 마을버스 이용 → '녹산산단 중소기업단지' 정류장 하차 도보 5분",
    },
    {
      id: "dir_3",
      title: "김해국제공항 / 부산역 출발 시",
      desc: "김해국제공항에서 차량 약 25분 소요 / KTX 부산역에서 차량 약 40분 소요",
    },
  ],
};

export function getAboutConfig(slug = "noksan"): AboutConfig {
  if (typeof window === "undefined") return defaultAboutConfig;
  try {
    const raw = localStorage.getItem(`${ABOUT_CONFIG_KEY_PREFIX}${slug}`);
    if (!raw) return defaultAboutConfig;
    const parsed = JSON.parse(raw);
    return {
      ...defaultAboutConfig,
      ...parsed,
      tabs:
        Array.isArray(parsed.tabs) && parsed.tabs.length > 0
          ? parsed.tabs
          : defaultAboutConfig.tabs,
      overviewStats: Array.isArray(parsed.overviewStats)
        ? parsed.overviewStats
        : defaultAboutConfig.overviewStats,
      extraOverviewRows: Array.isArray(parsed.extraOverviewRows)
        ? parsed.extraOverviewRows
        : defaultAboutConfig.extraOverviewRows,
      visionPillars: Array.isArray(parsed.visionPillars)
        ? parsed.visionPillars
        : defaultAboutConfig.visionPillars,
      historyBlocks: Array.isArray(parsed.historyBlocks)
        ? parsed.historyBlocks
        : defaultAboutConfig.historyBlocks,
      directions: Array.isArray(parsed.directions)
        ? parsed.directions
        : defaultAboutConfig.directions,
    };
  } catch {
    return defaultAboutConfig;
  }
}

export function saveAboutConfig(slug: string, config: AboutConfig): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${ABOUT_CONFIG_KEY_PREFIX}${slug}`, JSON.stringify(config));
  window.dispatchEvent(new Event("cms-updated"));
}

export function resetAboutConfig(slug = "noksan"): AboutConfig {
  if (typeof window !== "undefined") {
    localStorage.removeItem(`${ABOUT_CONFIG_KEY_PREFIX}${slug}`);
    window.dispatchEvent(new Event("cms-updated"));
  }
  return defaultAboutConfig;
}

export interface SupportSubTabItem {
  id: string;
  label: string;
}

export interface SupportConfig {
  tabs: SupportSubTabItem[];
  attachments: CustomAttachmentItem[];
}

const SUPPORT_CONFIG_KEY_PREFIX = "noksan_support_config_v1_";

function createSampleTextDataUrl(content: string): string {
  return `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`;
}

export const defaultSupportConfig: SupportConfig = {
  tabs: [
    { id: "inquiry", label: "온라인 견적·상담 문의" },
    { id: "downloads", label: "자료실 · 양식 다운로드" },
  ],
  attachments: [
    {
      id: "att_default_1",
      category: "이력서 양식",
      title: "(주)녹산정밀기공 표준 입사지원서 및 자기소개서 양식",
      desc: "당사 채용 지원 시 사용하는 표준 이력서 및 자기소개서 양식 파일입니다. 다운로드 후 작성하여 이메일로 제출해 주세요.",
      fileName: "녹산정밀기공_표준_입사지원서_양식.txt",
      fileSize: "12 KB",
      fileUrl: createSampleTextDataUrl(
        "====================================================\n" +
          "        (주)녹산정밀기공 표준 입사지원서 양식\n" +
          "====================================================\n\n" +
          "1. 인적사항\n" +
          " - 성명 (한글/영문): \n" +
          " - 연락처 (휴대폰): \n" +
          " - 이메일: \n" +
          " - 지원분야 (정밀가공 / 주조 / 품질검사 / 기술영업 / 관리): \n\n" +
          "2. 학력 및 경력사항\n" +
          " - 주요 경력 및 보유 자격증: \n\n" +
          "3. 자기소개 및 지원동기\n" +
          " - 내용을 작성해 주세요.\n\n" +
          "※ 작성 완료 후 대표 이메일(info@noksan-precision.co.kr)로 제출 바랍니다.\n"
      ),
      date: "2026-10-29",
    },
    {
      id: "att_default_2",
      category: "참고자료",
      title: "(주)녹산정밀기공 회사소개서 및 보유 생산설비 총괄 참고자료",
      desc: "주요 생산 주물·정밀가공 품목, 5축 MCT 및 3차원 측정기 제원 등이 수록된 공식 참고자료입니다.",
      fileName: "녹산정밀기공_회사소개_및_설비현황_참고자료.txt",
      fileSize: "18 KB",
      fileUrl: createSampleTextDataUrl(
        "====================================================\n" +
          "   (주)녹산정밀기공 회사소개 및 보유설비 참고자료\n" +
          "====================================================\n\n" +
          "■ 기업 개요\n" +
          " - 회사명: (주)녹산정밀기공 (Noksan Precision Co., Ltd.)\n" +
          " - 소재지: 부산광역시 강서구 녹산산단382로 14번길 55\n" +
          " - 주요사업: 특수·일반 주물(GC/GCD/합금강) 및 CNC 초정밀 기계가공\n\n" +
          "■ 주요 보유 설비\n" +
          " - 5축 복합 머시닝센터(MCT), 대형 문형 보링기, CNC 선반\n" +
          " - 3차원 정밀 측정기(CMM), 금속 성분 분석기, 비파괴 검사기\n"
      ),
      date: "2026-10-29",
    },
  ],
};

export function getSupportConfig(slug = "noksan"): SupportConfig {
  if (typeof window === "undefined") return defaultSupportConfig;
  try {
    const raw = localStorage.getItem(`${SUPPORT_CONFIG_KEY_PREFIX}${slug}`);
    if (!raw) return defaultSupportConfig;
    const parsed = JSON.parse(raw);
    return {
      tabs:
        Array.isArray(parsed.tabs) && parsed.tabs.length > 0
          ? parsed.tabs
          : defaultSupportConfig.tabs,
      attachments: Array.isArray(parsed.attachments)
        ? parsed.attachments
        : defaultSupportConfig.attachments,
    };
  } catch {
    return defaultSupportConfig;
  }
}

export function saveSupportConfig(slug: string, config: SupportConfig): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${SUPPORT_CONFIG_KEY_PREFIX}${slug}`, JSON.stringify(config));
  window.dispatchEvent(new Event("cms-updated"));
}

export function resetSupportConfig(slug = "noksan"): SupportConfig {
  if (typeof window !== "undefined") {
    localStorage.removeItem(`${SUPPORT_CONFIG_KEY_PREFIX}${slug}`);
    window.dispatchEvent(new Event("cms-updated"));
  }
  return defaultSupportConfig;
}

export function formatFileSize(bytes: number): string {
  if (!bytes || bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

export async function triggerBrowserDownload(
  fileUrl: string,
  fileName?: string
): Promise<void> {
  if (typeof window === "undefined" || !fileUrl) return;
  const safeName = (fileName || "첨부파일_다운로드").trim();

  try {
    if (fileUrl.startsWith("data:")) {
      const res = await fetch(fileUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = safeName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);
      return;
    }

    // 일반 URL인 경우 fetch blob 시도 후 실패 시 a 태그 다운로드
    try {
      const res = await fetch(fileUrl);
      if (res.ok) {
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = safeName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);
        return;
      }
    } catch {
      // cross-origin 등에서는 아래 직접 링크 다운로드로 폴백
    }

    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = safeName;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch {
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  }
}

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
  hiddenMenus: [],
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
  miniBanners: [
    {
      id: "mb_1",
      title: "보유 설비 현황",
      desc: "생산 설비 및 정밀 측정 장비 리스트를 확인하실 수 있습니다.",
      btnText: "설비현황 자세히 보기 →",
      btnHref: "/facilities",
      theme: "slate",
      active: true,
    },
    {
      id: "mb_2",
      title: "고객지원 및 견적문의",
      desc: "도면 검토 및 가공 견적 문의를 남겨주시면 신속히 답변드리겠습니다.",
      btnText: "온라인 문의하기 →",
      btnHref: "/support",
      theme: "blue",
      active: true,
    },
  ],
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
      miniBanners:
        Array.isArray(parsed.miniBanners) && parsed.miniBanners.length > 0
          ? parsed.miniBanners
          : defaultHomeConfig.miniBanners,
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

export function getCustomPageBlocks(
  slug = "noksan",
  page?: PageKey
): CustomPageBlock[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`${CUSTOM_BLOCKS_KEY_PREFIX}${slug}`);
    if (!raw) return [];
    const parsed: CustomPageBlock[] = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return page ? parsed.filter((b) => b.page === page) : parsed;
  } catch {
    return [];
  }
}

export function saveCustomPageBlocks(
  slug: string,
  page: PageKey,
  pageBlocks: CustomPageBlock[]
): void {
  if (typeof window === "undefined") return;
  const all = getCustomPageBlocks(slug);
  const others = all.filter((b) => b.page !== page);
  const merged = [...others, ...pageBlocks];
  localStorage.setItem(`${CUSTOM_BLOCKS_KEY_PREFIX}${slug}`, JSON.stringify(merged));
  window.dispatchEvent(new Event("cms-updated"));
}

export function resetCustomPageBlocks(slug: string, page: PageKey): void {
  saveCustomPageBlocks(slug, page, []);
}

export function getHiddenSkeletonSections(slug = "noksan"): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`${HIDDEN_SKELETON_KEY_PREFIX}${slug}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveHiddenSkeletonSections(
  slug: string,
  hiddenIds: string[]
): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    `${HIDDEN_SKELETON_KEY_PREFIX}${slug}`,
    JSON.stringify(hiddenIds)
  );
  window.dispatchEvent(new Event("cms-updated"));
}

export function toggleSkeletonSection(
  slug: string,
  sectionId: string
): string[] {
  const current = getHiddenSkeletonSections(slug);
  const next = current.includes(sectionId)
    ? current.filter((id) => id !== sectionId)
    : [...current, sectionId];
  saveHiddenSkeletonSections(slug, next);
  return next;
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
