"use client";

import React, { useState, useEffect } from "react";
import {
  PageKey,
  CustomPageBlock,
  CustomBlockType,
  ImageGridPreset,
  getCustomPageBlocks,
  saveCustomPageBlocks,
  resetCustomPageBlocks,
  SKELETON_SECTIONS_BY_PAGE,
  getHiddenSkeletonSections,
  toggleSkeletonSection,
  uploadMediaFileToUrl,
} from "@/lib/cms";

export interface AdminPageBlockBuilderProps {
  slug: string;
  page: PageKey;
}

const PAGE_LABELS: Record<PageKey, { label: string; href: string }> = {
  home: { label: "홈 화면 (/)", href: "/" },
  about: { label: "회사소개 (/about)", href: "/about" },
  facilities: { label: "설비현황 (/facilities)", href: "/facilities" },
  products: { label: "제품소개 (/products)", href: "/products" },
  technology: { label: "기술정보 (/technology)", href: "/technology" },
  ir: { label: "투자정보 (/ir)", href: "/ir" },
  support: { label: "고객지원 (/support)", href: "/support" },
};

const GRID_PRESET_SLOTS: Record<
  ImageGridPreset,
  { count: number; label: string; desc: string }
> = {
  "1x1": { count: 1, label: "1 × 1 (단독 와이드)", desc: "가로 전체 1장" },
  "2x1": { count: 2, label: "2 × 1 (가로 2단)", desc: "나란히 2장" },
  "3x1": { count: 3, label: "3 × 1 (가로 3단)", desc: "나란히 3장" },
  "4x1": { count: 4, label: "4 × 1 (가로 4단)", desc: "나란히 4장" },
  "2x2": { count: 4, label: "2 × 2 (2열×2줄=4장)", desc: "2칸씩 2줄 (총 4장)" },
  "3x2": { count: 6, label: "3 × 2 (3열×2줄=6장)", desc: "3칸씩 2줄 (총 6장)" },
};

const BLOCK_TYPE_BADGE: Record<
  CustomBlockType,
  { label: string; colorClass: string; borderClass: string }
> = {
  text_block: {
    label: "📝 자유 텍스트 블록",
    colorClass: "bg-slate-800 text-white",
    borderClass: "border-slate-300 bg-slate-50/40",
  },
  kpi_stats: {
    label: "📊 주요 경영·재무지표",
    colorClass: "bg-indigo-600 text-white",
    borderClass: "border-indigo-200 bg-indigo-50/30",
  },
  link_board: {
    label: "📋 링크 연동 게시판·자료실",
    colorClass: "bg-cyan-700 text-white",
    borderClass: "border-cyan-200 bg-cyan-50/30",
  },
  image_grid: {
    label: "🖼️ 멀티 레이아웃 이미지 (2x1·3x1·2x2·3x2 등)",
    colorClass: "bg-emerald-600 text-white",
    borderClass: "border-emerald-200 bg-emerald-50/30",
  },
  card_grid: {
    label: "🗂️ 카드# 그룹 섹션",
    colorClass: "bg-purple-600 text-white",
    borderClass: "border-purple-200 bg-purple-50/30",
  },
  mini_banner: {
    label: "📢 작은 배너 (띠 배너)",
    colorClass: "bg-blue-600 text-white",
    borderClass: "border-blue-200 bg-blue-50/30",
  },
  timeline_steps: {
    label: "⏱️ 연혁·공정 타임라인",
    colorClass: "bg-amber-600 text-white",
    borderClass: "border-amber-200 bg-amber-50/30",
  },
  faq_accordion: {
    label: "❓ 자주 묻는 질문 (FAQ)",
    colorClass: "bg-teal-600 text-white",
    borderClass: "border-teal-200 bg-teal-50/30",
  },
  video_embed: {
    label: "🎬 유튜브·홍보영상 플레이어",
    colorClass: "bg-rose-600 text-white",
    borderClass: "border-rose-200 bg-rose-50/30",
  },
  image_box: {
    label: "🖼️ 단독 이미지 섹션",
    colorClass: "bg-emerald-600 text-white",
    borderClass: "border-emerald-200 bg-emerald-50/30",
  },
};

export function AdminPageBlockBuilder({ slug, page }: AdminPageBlockBuilderProps) {
  const [blocks, setBlocks] = useState<CustomPageBlock[]>([]);
  const [hiddenSkeletonIds, setHiddenSkeletonIds] = useState<string[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const pageInfo = PAGE_LABELS[page] || { label: page, href: "/" };

  useEffect(() => {
    const load = () => {
      setBlocks(getCustomPageBlocks(slug, page));
      setHiddenSkeletonIds(getHiddenSkeletonSections(slug));
    };
    load();
    window.addEventListener("cms-updated", load);
    return () => window.removeEventListener("cms-updated", load);
  }, [slug, page]);

  const notify = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const commitPageBlocks = (nextPageBlocks: CustomPageBlock[], message?: string) => {
    setBlocks(nextPageBlocks);
    saveCustomPageBlocks(slug, page, nextPageBlocks);
    if (message) notify(message);
  };

  const handleToggleSkeleton = (sectionId: string, label: string, currentlyVisible: boolean) => {
    const nextHidden = toggleSkeletonSection(slug, sectionId);
    setHiddenSkeletonIds(nextHidden);
    notify(
      currentlyVisible
        ? `🗑️ [${pageInfo.label}] '${label}' 기본 뼈대 섹션이 화면에서 제거(숨김)되었습니다.`
        : `✅ [${pageInfo.label}] '${label}' 기본 뼈대 섹션이 다시 복구(표시)되었습니다.`
    );
  };

  const handleAddBlock = (type: CustomBlockType) => {
    const newId = `blk_${page}_${Date.now()}`;
    let newBlock: CustomPageBlock;

    if (type === "text_block") {
      newBlock = {
        id: newId,
        page,
        position: "bottom",
        type: "text_block",
        badge: "HIGHLIGHT",
        title: `${pageInfo.label} 안내 타이틀을 입력하세요`,
        subtitle:
          "여기에 자유롭게 본문 내용을 입력하세요.\n엔터(줄바꿈)를 입력하면 문단이 깔끔하게 나누어져 표시됩니다.",
        textAlign: "left",
        bannerTheme: "light",
        calloutText:
          "핵심 강조 문구나 인용구가 필요하면 여기에 입력하세요 (비워두면 숨겨집니다).",
      };
    } else if (type === "kpi_stats") {
      newBlock = {
        id: newId,
        page,
        position: "bottom",
        type: "kpi_stats",
        badge: "KEY METRICS",
        title: "주요 경영·재무지표 및 핵심 성과",
        subtitle: "투자정보 스타일의 핵심 지표 수치 카드입니다.",
        gridCols: 3,
        stats: [
          {
            id: `kpi_${Date.now()}_1`,
            label: "매출액 / 생산실적",
            value: "320억 원",
            note: "전년 대비 +14.2% 성장",
            color: "blue",
          },
          {
            id: `kpi_${Date.now()}_2`,
            label: "영업이익률 / 품질수율",
            value: "99.8%",
            note: "업계 최고 수준 달성",
            color: "emerald",
          },
          {
            id: `kpi_${Date.now()}_3`,
            label: "기업신용등급 / 수출비중",
            value: "A+ 등급",
            note: "무차입 안정 경영 지속",
            color: "indigo",
          },
        ],
      };
    } else if (type === "link_board") {
      const today = new Date().toISOString().slice(0, 10);
      newBlock = {
        id: newId,
        page,
        position: "bottom",
        type: "link_board",
        badge: "DISCLOSURE & ARCHIVE",
        title: "공시정보 및 주요 자료실 게시판",
        subtitle:
          "제목을 클릭하시면 연결된 외부 링크(DART 전자공시, 보도자료, 첨부문서 등)가 새 창으로 열립니다.",
        btnText: "전자공시시스템(DART) 바로가기",
        btnHref: "https://dart.fss.or.kr",
        boardHeaders: {
          col1: "구분",
          col2: "제목 (클릭 시 새 창 이동)",
          col3: "출처 / 비고",
          col4: "등록일",
        },
        boardRows: [
          {
            id: `row_${Date.now()}_1`,
            category: "공시/IR",
            title: "제26기 정기주주총회 소집공고 및 감사보고서",
            source: "DART 전자공시",
            date: today,
            linkUrl: "https://dart.fss.or.kr",
          },
          {
            id: `row_${Date.now()}_2`,
            category: "보도자료",
            title: "신규 스마트 팩토리 정밀가공 생산라인 증설 안내",
            source: "홍보팀",
            date: today,
            linkUrl: "https://www.naver.com",
          },
        ],
      };
    } else if (type === "image_grid") {
      newBlock = {
        id: newId,
        page,
        position: "bottom",
        type: "image_grid",
        badge: "GALLERY",
        title: "멀티 레이아웃 포토 갤러리",
        subtitle: "이미지를 클릭하면 원본 크기로 크게 확대하여 보실 수 있습니다.",
        gridPreset: "2x1",
        imageAspect: "video",
        images: [
          {
            id: `img_${Date.now()}_1`,
            url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80",
            title: "현장 이미지 #1",
            caption: "설비 및 공정 상세 설명",
            linkUrl: "",
          },
          {
            id: `img_${Date.now()}_2`,
            url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80",
            title: "현장 이미지 #2",
            caption: "초정밀 품질 검사 공정",
            linkUrl: "",
          },
        ],
      };
    } else if (type === "card_grid") {
      newBlock = {
        id: newId,
        page,
        position: "bottom",
        type: "card_grid",
        badge: "CORE FEATURES",
        title: "핵심 역량 카드# 그룹 섹션",
        subtitle: "원하시는 만큼 카드를 추가·삭제하고 열 수를 조절하세요.",
        gridCols: 3,
        cards: [
          {
            id: `crd_${Date.now()}_1`,
            badge: "POINT 01",
            title: "카드 #1 제목",
            desc: "카드 #1에 대한 상세 설명을 자유롭게 입력하세요.",
            imageUrl:
              "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
            linkUrl: "",
          },
          {
            id: `crd_${Date.now()}_2`,
            badge: "POINT 02",
            title: "카드 #2 제목",
            desc: "카드 #2에 대한 상세 설명을 자유롭게 입력하세요.",
            imageUrl:
              "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80",
            linkUrl: "",
          },
          {
            id: `crd_${Date.now()}_3`,
            badge: "POINT 03",
            title: "카드 #3 제목",
            desc: "카드 #3에 대한 상세 설명을 자유롭게 입력하세요.",
            imageUrl:
              "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=800&q=80",
            linkUrl: "",
          },
        ],
      };
    } else if (type === "mini_banner") {
      newBlock = {
        id: newId,
        page,
        position: "bottom",
        type: "mini_banner",
        badge: "NOTICE",
        title: "안내 및 홍보 작은 배너 제목",
        subtitle: "원하시는 설명 문구나 공지 내용을 자유롭게 입력하세요.",
        bannerTheme: "blue",
        btnText: "자세히 보기",
        btnHref: "/support",
      };
    } else if (type === "timeline_steps") {
      newBlock = {
        id: newId,
        page,
        position: "bottom",
        type: "timeline_steps",
        badge: "PROCESS & HISTORY",
        title: "주요 진행 절차 및 연혁 타임라인",
        subtitle: "단계별 생산 공정 또는 주요 연혁을 순서대로 안내합니다.",
        steps: [
          {
            id: `tl_${Date.now()}_1`,
            stepOrYear: "STEP 01",
            title: "기초 설계 및 기술 검토",
            desc: "고객사 요구사항 분석 및 3D 정밀 모델링 설계를 진행합니다.",
          },
          {
            id: `tl_${Date.now()}_2`,
            stepOrYear: "STEP 02",
            title: "정밀 가공 및 시제품 제작",
            desc: "5축 CNC 및 전용 설비를 통해 오차 없는 정밀 가공을 수행합니다.",
          },
          {
            id: `tl_${Date.now()}_3`,
            stepOrYear: "STEP 03",
            title: "3차원 측정 검사 및 납품",
            desc: "전수 품질 검사를 거친 후 안전하게 출하 및 납품합니다.",
          },
        ],
      };
    } else if (type === "faq_accordion") {
      newBlock = {
        id: newId,
        page,
        position: "bottom",
        type: "faq_accordion",
        badge: "FAQ",
        title: "자주 묻는 질문 (FAQ)",
        subtitle: "궁금하신 질문을 클릭하시면 상세 답변을 확인하실 수 있습니다.",
        faqs: [
          {
            id: `faq_${Date.now()}_1`,
            q: "견적 문의 및 도면 검토는 어떻게 진행되나요?",
            a: "고객지원 메뉴 또는 대표 이메일로 도면과 사양서를 보내주시면 담당 엔지니어가 24시간 이내에 상세 견적서를 회신드립니다.",
          },
          {
            id: `faq_${Date.now()}_2`,
            q: "소량 다품종 시제품 제작도 가능한가요?",
            a: "네, 당사는 시제품 단품 제작부터 대량 양산 라인까지 유연하게 대응할 수 있는 전용 가공 설비를 보유하고 있습니다.",
          },
        ],
      };
    } else {
      newBlock = {
        id: newId,
        page,
        position: "bottom",
        type: "video_embed",
        badge: "PROMOTION VIDEO",
        title: "기업 및 현장 홍보 영상",
        subtitle: "유튜브 주소 또는 MP4 영상 주소를 입력하면 자동 재생 플레이어가 표시됩니다.",
        videoUrl: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
      };
    }

    commitPageBlocks(
      [...blocks, newBlock],
      `✅ [${pageInfo.label}] 페이지에 '${BLOCK_TYPE_BADGE[type].label}' 블록이 추가되었습니다!`
    );
  };

  const handleRemoveBlock = (blockId: string) => {
    const next = blocks.filter((b) => b.id !== blockId);
    commitPageBlocks(next, `🗑️ 선택한 커스텀 블록이 삭제되었습니다.`);
  };

  const handleMoveBlock = (index: number, direction: -1 | 1) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= blocks.length) return;
    const copy = [...blocks];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;
    commitPageBlocks(copy, `↕️ 블록 표시 순서가 변경되었습니다.`);
  };

  const handleUpdateBlock = (blockId: string, patch: Partial<CustomPageBlock>) => {
    const next = blocks.map((b) => (b.id === blockId ? { ...b, ...patch } : b));
    commitPageBlocks(next);
  };

  const handleApplyGridPreset = (block: CustomPageBlock, preset: ImageGridPreset) => {
    const targetCount = GRID_PRESET_SLOTS[preset].count;
    const currentImages = [...(block.images || [])];

    if (currentImages.length < targetCount) {
      const sampleUrls = [
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1000&q=80",
      ];
      for (let i = currentImages.length; i < targetCount; i++) {
        currentImages.push({
          id: `img_${Date.now()}_${i + 1}`,
          url: sampleUrls[i % sampleUrls.length],
          title: `이미지 #${i + 1}`,
          caption: `이미지 #${i + 1} 설명`,
          linkUrl: "",
        });
      }
    } else if (currentImages.length > targetCount) {
      currentImages.length = targetCount;
    }

    handleUpdateBlock(block.id, {
      gridPreset: preset,
      images: currentImages,
    });
    notify(
      `🖼️ 이미지 레이아웃이 '${GRID_PRESET_SLOTS[preset].label}' (${targetCount}장 구성)으로 자동 세팅되었습니다.`
    );
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onUploaded: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadMediaFileToUrl(slug, file);
    onUploaded(url);
  };

  const skeletonList = SKELETON_SECTIONS_BY_PAGE[page] || [];

  return (
    <div className="mt-10 border-t-2 border-dashed border-blue-200 pt-8 space-y-8">
      {toastMsg && (
        <div className="rounded-xl border border-blue-300 bg-blue-900 px-4 py-3 text-xs font-extrabold text-white shadow-md">
          {toastMsg}
        </div>
      )}

      {/* 1. 기본 뼈대 섹션 표시/제거 컨트롤 패널 */}
      {skeletonList.length > 0 && (
        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-extrabold mb-2">
                🧱 [{pageInfo.label}] 기존 기본 뼈대 블록 추가 / 제거(숨김) 관리
              </div>
              <h3 className="text-lg font-extrabold text-white">
                기존 뼈대 섹션도 내 입맛대로 제거(숨김)하거나 다시 추가(복구)할 수 있습니다
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                아예 처음부터 내가 홈페이지를 만드는 것처럼 기존 기본 뼈대를 끄고 아래 커스텀 블록들로만 화면을 구성할 수도 있습니다.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            {skeletonList.map((sec) => {
              const isHidden = hiddenSkeletonIds.includes(sec.id);
              const isVisible = !isHidden;
              return (
                <div
                  key={sec.id}
                  className={`flex items-center justify-between gap-3 p-4 rounded-xl border transition-all ${
                    isVisible
                      ? "bg-slate-800/90 border-slate-700"
                      : "bg-slate-950/70 border-red-900/50 opacity-75"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                          isVisible ? "bg-emerald-400" : "bg-red-500"
                        }`}
                      />
                      <span
                        className={`text-sm font-extrabold truncate ${
                          isVisible ? "text-white" : "text-slate-400 line-through"
                        }`}
                      >
                        {sec.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 truncate">{sec.desc}</p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {isVisible ? (
                      <button
                        type="button"
                        onClick={() => handleToggleSkeleton(sec.id, sec.label, true)}
                        className="px-3 py-2 rounded-lg text-xs font-extrabold bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 transition-colors cursor-pointer"
                      >
                        🗑️ 뼈대 제거(숨김)
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleToggleSkeleton(sec.id, sec.label, false)}
                        className="px-3 py-2 rounded-lg text-xs font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors cursor-pointer"
                      >
                        + 뼈대 다시 추가(복구)
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. 만능 페이지 빌더 팔레트 헤더 */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-extrabold mb-2">
              ✨ [{pageInfo.label}] 만능 홈페이지 블록 빌더 (원하는 기능을 무제한 조립)
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">
              원하는 기능 블록을 클릭해 [{pageInfo.label}] 화면에 마음대로 추가·편집·삭제하세요
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              <strong>자유 텍스트 입력</strong>, 투자정보 스타일의 <strong>주요 경영·재무지표</strong>, 클릭 시 새 창 링크로 이동하는 <strong>공시·자료실 게시판</strong>, <strong>2x1·3x1·4x1·2x2·3x2 멀티 이미지</strong> 등 모든 기능을 블록 단위로 조립할 수 있습니다.
            </p>
          </div>
          {blocks.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (!confirm("이 페이지에 추가한 커스텀 블록을 모두 비우시겠습니까?")) return;
                resetCustomPageBlocks(slug, page);
                setBlocks([]);
                notify("모든 커스텀 블록이 초기화되었습니다.");
              }}
              className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 cursor-pointer"
            >
              커스텀 블록 전체 비우기
            </button>
          )}
        </div>

        {/* 블록 추가 버튼 그리드 (9종) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => handleAddBlock("text_block")}
            className="flex items-center gap-3 p-3.5 bg-white hover:bg-slate-900 hover:text-white text-slate-900 border border-slate-300 rounded-xl text-left transition-all shadow-sm group cursor-pointer"
          >
            <span className="text-2xl">📝</span>
            <div>
              <div className="text-sm font-extrabold">+ 자유 텍스트 블록 추가</div>
              <div className="text-[11px] text-slate-500 group-hover:text-slate-300">
                제목·본문·2단 컬럼·강조 인용구 입력
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleAddBlock("kpi_stats")}
            className="flex items-center gap-3 p-3.5 bg-white hover:bg-indigo-600 hover:text-white text-slate-900 border border-indigo-200 rounded-xl text-left transition-all shadow-sm group cursor-pointer"
          >
            <span className="text-2xl">📊</span>
            <div>
              <div className="text-sm font-extrabold">+ 주요 경영·재무지표 추가</div>
              <div className="text-[11px] text-slate-500 group-hover:text-indigo-100">
                투자정보 스타일 핵심 수치·지표 카드
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleAddBlock("link_board")}
            className="flex items-center gap-3 p-3.5 bg-white hover:bg-cyan-700 hover:text-white text-slate-900 border border-cyan-200 rounded-xl text-left transition-all shadow-sm group cursor-pointer"
          >
            <span className="text-2xl">📋</span>
            <div>
              <div className="text-sm font-extrabold">+ 링크 연동 게시판·공시 표 추가</div>
              <div className="text-[11px] text-slate-500 group-hover:text-cyan-100">
                클릭 시 DART·뉴스·외부링크 새 창 이동
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleAddBlock("image_grid")}
            className="flex items-center gap-3 p-3.5 bg-white hover:bg-emerald-600 hover:text-white text-slate-900 border border-emerald-200 rounded-xl text-left transition-all shadow-sm group cursor-pointer"
          >
            <span className="text-2xl">🖼️</span>
            <div>
              <div className="text-sm font-extrabold">+ 멀티 이미지(2x1·3x1·2x2·3x2)</div>
              <div className="text-[11px] text-slate-500 group-hover:text-emerald-100">
                1x1, 2x1, 3x1, 4x1, 2x2, 3x2 배율 선택
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleAddBlock("card_grid")}
            className="flex items-center gap-3 p-3.5 bg-white hover:bg-purple-600 hover:text-white text-slate-900 border border-purple-200 rounded-xl text-left transition-all shadow-sm group cursor-pointer"
          >
            <span className="text-2xl">🗂️</span>
            <div>
              <div className="text-sm font-extrabold">+ 카드# 그룹 섹션 추가</div>
              <div className="text-[11px] text-slate-500 group-hover:text-purple-100">
                사진+뱃지+제목+설명 카드 무제한 추가
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleAddBlock("mini_banner")}
            className="flex items-center gap-3 p-3.5 bg-white hover:bg-blue-600 hover:text-white text-slate-900 border border-blue-200 rounded-xl text-left transition-all shadow-sm group cursor-pointer"
          >
            <span className="text-2xl">📢</span>
            <div>
              <div className="text-sm font-extrabold">+ 작은 배너(띠 배너) 추가</div>
              <div className="text-[11px] text-slate-500 group-hover:text-blue-100">
                공지·홍보 문구 및 바로가기 버튼 배너
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleAddBlock("timeline_steps")}
            className="flex items-center gap-3 p-3.5 bg-white hover:bg-amber-600 hover:text-white text-slate-900 border border-amber-200 rounded-xl text-left transition-all shadow-sm group cursor-pointer"
          >
            <span className="text-2xl">⏱️</span>
            <div>
              <div className="text-sm font-extrabold">+ 연혁·공정 타임라인 추가</div>
              <div className="text-[11px] text-slate-500 group-hover:text-amber-100">
                STEP별 생산 공정이나 연혁 타임라인
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleAddBlock("faq_accordion")}
            className="flex items-center gap-3 p-3.5 bg-white hover:bg-teal-600 hover:text-white text-slate-900 border border-teal-200 rounded-xl text-left transition-all shadow-sm group cursor-pointer"
          >
            <span className="text-2xl">❓</span>
            <div>
              <div className="text-sm font-extrabold">+ 자주 묻는 질문(FAQ) 추가</div>
              <div className="text-[11px] text-slate-500 group-hover:text-teal-100">
                클릭하면 답변이 펼쳐지는 Q&A 아코디언
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleAddBlock("video_embed")}
            className="flex items-center gap-3 p-3.5 bg-white hover:bg-rose-600 hover:text-white text-slate-900 border border-rose-200 rounded-xl text-left transition-all shadow-sm group cursor-pointer"
          >
            <span className="text-2xl">🎬</span>
            <div>
              <div className="text-sm font-extrabold">+ 유튜브·동영상 플레이어 추가</div>
              <div className="text-[11px] text-slate-500 group-hover:text-rose-100">
                유튜브 주소 또는 MP4 홍보 영상 삽입
              </div>
            </div>
          </button>
        </div>

        {/* 현재 추가된 블록 리스트 */}
        {blocks.length === 0 ? (
          <div className="mt-6 bg-white/90 border border-dashed border-slate-300 rounded-xl p-8 text-center text-slate-500 text-sm">
            현재 <strong>[{pageInfo.label}]</strong> 페이지에 추가된 커스텀 블록이 없습니다. 위 9가지 기능 버튼 중 원하는 항목을 눌러 페이지를 직접 조립해 보세요!
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {blocks.map((block, bIdx) => {
              const badgeInfo = BLOCK_TYPE_BADGE[block.type] || {
                label: block.type,
                colorClass: "bg-slate-700 text-white",
                borderClass: "border-slate-200 bg-white",
              };

              return (
                <div
                  key={block.id}
                  className={`rounded-2xl border-2 p-6 shadow-sm transition-all bg-white ${badgeInfo.borderClass}`}
                >
                  {/* 블록 상단 컨트롤 바 */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-5 border-b border-slate-200">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md text-xs font-extrabold bg-slate-900 text-white">
                        블록 #{bIdx + 1}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-extrabold ${badgeInfo.colorClass}`}
                      >
                        {badgeInfo.label}
                      </span>
                      <select
                        value={block.position || "bottom"}
                        onChange={(e) =>
                          handleUpdateBlock(block.id, {
                            position: e.target.value as "top" | "bottom",
                          })
                        }
                        className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-bold text-slate-700"
                      >
                        <option value="top">📍 페이지 상단 영역에 배치</option>
                        <option value="bottom">📍 페이지 하단 영역에 배치</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={bIdx === 0}
                        onClick={() => handleMoveBlock(bIdx, -1)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                      >
                        ▲ 위로
                      </button>
                      <button
                        type="button"
                        disabled={bIdx === blocks.length - 1}
                        onClick={() => handleMoveBlock(bIdx, 1)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                      >
                        ▼ 아래로
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveBlock(block.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-extrabold bg-red-600 text-white hover:bg-red-700 ml-2 shadow-sm cursor-pointer"
                      >
                        🗑️ 블록 삭제
                      </button>
                    </div>
                  </div>

                  {/* (A) 📝 자유 텍스트 입력 블록 */}
                  {block.type === "text_block" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            상단 영문/포인트 뱃지 (선택)
                          </label>
                          <input
                            type="text"
                            value={block.badge || ""}
                            onChange={(e) => handleUpdateBlock(block.id, { badge: e.target.value })}
                            placeholder="예: ABOUT US"
                            className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            블록 큰 제목
                          </label>
                          <input
                            type="text"
                            value={block.title || ""}
                            onChange={(e) => handleUpdateBlock(block.id, { title: e.target.value })}
                            placeholder="예: CEO 핵심 경영 철학"
                            className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white font-bold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            문단 정렬 / 단 구성
                          </label>
                          <select
                            value={block.textAlign || "left"}
                            onChange={(e) =>
                              handleUpdateBlock(block.id, {
                                textAlign: e.target.value as "left" | "center" | "two_col",
                              })
                            }
                            className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white font-semibold"
                          >
                            <option value="left">왼쪽 정렬 (기본 가독성형)</option>
                            <option value="center">가운데 정렬 (슬로건·비전 강조형)</option>
                            <option value="two_col">좌우 2단 컬럼 분할 (잡지·브로셔 스타일)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            배경 테마 색상
                          </label>
                          <select
                            value={block.bannerTheme || "light"}
                            onChange={(e) =>
                              handleUpdateBlock(block.id, {
                                bannerTheme: e.target.value as
                                  | "light"
                                  | "blue"
                                  | "dark"
                                  | "transparent",
                              })
                            }
                            className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white font-semibold"
                          >
                            <option value="light">화이트 카드 박스 (깔끔한 테두리)</option>
                            <option value="blue">블루 포인트 박스</option>
                            <option value="dark">다크 네이비 프리미엄 박스</option>
                            <option value="transparent">배경 없음 (투명 여백)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          본문 텍스트 내용 (엔터 줄바꿈 시 문단이 자동 분리됩니다)
                        </label>
                        <textarea
                          rows={5}
                          value={block.subtitle || ""}
                          onChange={(e) =>
                            handleUpdateBlock(block.id, { subtitle: e.target.value })
                          }
                          placeholder="자유롭게 본문 텍스트를 작성하세요..."
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white leading-relaxed"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          하단 강조 인용구 / 핵심 요약 박스 (비워두면 표시 안 됨)
                        </label>
                        <input
                          type="text"
                          value={block.calloutText || ""}
                          onChange={(e) =>
                            handleUpdateBlock(block.id, { calloutText: e.target.value })
                          }
                          placeholder="예: '오차율 0%를 향한 끊임없는 집념이 우리의 경쟁력입니다.'"
                          className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* (B) 📊 주요 경영·재무지표 블록 */}
                  {block.type === "kpi_stats" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            지표 섹션 제목
                          </label>
                          <input
                            type="text"
                            value={block.title || ""}
                            onChange={(e) => handleUpdateBlock(block.id, { title: e.target.value })}
                            className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            지표 섹션 부제목
                          </label>
                          <input
                            type="text"
                            value={block.subtitle || ""}
                            onChange={(e) =>
                              handleUpdateBlock(block.id, { subtitle: e.target.value })
                            }
                            className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            가로 배치 열 수 (2열 / 3열 / 4열)
                          </label>
                          <select
                            value={block.gridCols || 3}
                            onChange={(e) =>
                              handleUpdateBlock(block.id, {
                                gridCols: Number(e.target.value) as 2 | 3 | 4,
                              })
                            }
                            className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white font-bold"
                          >
                            <option value={2}>가로 2열 (큼직하게)</option>
                            <option value={3}>가로 3열 (투자정보 기본 스타일)</option>
                            <option value={4}>가로 4열 (4개 한 줄 배치)</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs font-extrabold text-indigo-900">
                          📊 지표 카드 목록 ({(block.stats || []).length}개)
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const nextItems = [
                              ...(block.stats || []),
                              {
                                id: `kpi_${Date.now()}`,
                                label: `신규 지표 #${(block.stats || []).length + 1}`,
                                value: "100%",
                                note: "보조 설명 입력",
                                color: "blue" as const,
                              },
                            ];
                            handleUpdateBlock(block.id, { stats: nextItems });
                          }}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-extrabold hover:bg-indigo-700 cursor-pointer"
                        >
                          + 지표 카드 추가
                        </button>
                      </div>

                      <div
                        className="grid gap-3"
                        style={{
                          gridTemplateColumns: `repeat(${block.gridCols || 3}, minmax(0, 1fr))`,
                        }}
                      >
                        {(block.stats || []).map((item, idx) => (
                          <div
                            key={item.id}
                            className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-extrabold text-indigo-700">
                                지표 #{idx + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const next = (block.stats || []).filter((k) => k.id !== item.id);
                                  handleUpdateBlock(block.id, { stats: next });
                                }}
                                className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
                              >
                                삭제
                              </button>
                            </div>
                            <input
                              type="text"
                              value={item.label}
                              onChange={(e) => {
                                const next = (block.stats || []).map((k) =>
                                  k.id === item.id ? { ...k, label: e.target.value } : k
                                );
                                handleUpdateBlock(block.id, { stats: next });
                              }}
                              placeholder="지표명 (예: 2025년 매출액)"
                              className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs font-bold bg-white"
                            />
                            <input
                              type="text"
                              value={item.value}
                              onChange={(e) => {
                                const next = (block.stats || []).map((k) =>
                                  k.id === item.id ? { ...k, value: e.target.value } : k
                                );
                                handleUpdateBlock(block.id, { stats: next });
                              }}
                              placeholder="강조 수치 (예: 342억 원)"
                              className="w-full px-3 py-1.5 rounded border border-indigo-300 text-sm font-extrabold text-indigo-700 bg-white"
                            />
                            <input
                              type="text"
                              value={item.note}
                              onChange={(e) => {
                                const next = (block.stats || []).map((k) =>
                                  k.id === item.id ? { ...k, note: e.target.value } : k
                                );
                                handleUpdateBlock(block.id, { stats: next });
                              }}
                              placeholder="보조 설명 (예: 전년 대비 +15% 성장)"
                              className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs bg-white"
                            />
                            <select
                              value={item.color || "blue"}
                              onChange={(e) => {
                                const next = (block.stats || []).map((k) =>
                                  k.id === item.id
                                    ? {
                                        ...k,
                                        color: e.target.value as
                                          | "blue"
                                          | "emerald"
                                          | "indigo"
                                          | "slate",
                                      }
                                    : k
                                );
                                handleUpdateBlock(block.id, { stats: next });
                              }}
                              className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs bg-white font-semibold"
                            >
                              <option value="blue">블루 포인트</option>
                              <option value="emerald">에메랄드 그린 포인트</option>
                              <option value="indigo">인디고 포인트</option>
                              <option value="slate">다크 슬레이트 포인트</option>
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* (C) 📋 링크 연동 게시판 / 공시·자료실 표 블록 */}
                  {block.type === "link_board" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            게시판 제목
                          </label>
                          <input
                            type="text"
                            value={block.title || ""}
                            onChange={(e) => handleUpdateBlock(block.id, { title: e.target.value })}
                            placeholder="예: 전자공시 및 IR 자료실"
                            className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            게시판 안내 설명
                          </label>
                          <input
                            type="text"
                            value={block.subtitle || ""}
                            onChange={(e) =>
                              handleUpdateBlock(block.id, { subtitle: e.target.value })
                            }
                            placeholder="예: 제목을 클릭하시면 해당 링크(새 창)로 이동합니다."
                            className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                          />
                        </div>
                      </div>

                      {/* 테이블 컬럼명 커스텀 */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            1열 제목 (분류)
                          </label>
                          <input
                            type="text"
                            value={block.boardHeaders?.col1 || "구분"}
                            onChange={(e) =>
                              handleUpdateBlock(block.id, {
                                boardHeaders: {
                                  col1: e.target.value,
                                  col2: block.boardHeaders?.col2 || "제목",
                                  col3: block.boardHeaders?.col3 || "출처 / 비고",
                                  col4: block.boardHeaders?.col4 || "등록일",
                                },
                              })
                            }
                            className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs bg-white font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            2열 제목 (문서 제목)
                          </label>
                          <input
                            type="text"
                            value={block.boardHeaders?.col2 || "제목"}
                            onChange={(e) =>
                              handleUpdateBlock(block.id, {
                                boardHeaders: {
                                  col1: block.boardHeaders?.col1 || "구분",
                                  col2: e.target.value,
                                  col3: block.boardHeaders?.col3 || "출처 / 비고",
                                  col4: block.boardHeaders?.col4 || "등록일",
                                },
                              })
                            }
                            className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs bg-white font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            3열 제목 (출처/비고)
                          </label>
                          <input
                            type="text"
                            value={block.boardHeaders?.col3 || "출처 / 비고"}
                            onChange={(e) =>
                              handleUpdateBlock(block.id, {
                                boardHeaders: {
                                  col1: block.boardHeaders?.col1 || "구분",
                                  col2: block.boardHeaders?.col2 || "제목",
                                  col3: e.target.value,
                                  col4: block.boardHeaders?.col4 || "등록일",
                                },
                              })
                            }
                            className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs bg-white font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            4열 제목 (등록일)
                          </label>
                          <input
                            type="text"
                            value={block.boardHeaders?.col4 || "등록일"}
                            onChange={(e) =>
                              handleUpdateBlock(block.id, {
                                boardHeaders: {
                                  col1: block.boardHeaders?.col1 || "구분",
                                  col2: block.boardHeaders?.col2 || "제목",
                                  col3: block.boardHeaders?.col3 || "출처 / 비고",
                                  col4: e.target.value,
                                },
                              })
                            }
                            className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs bg-white font-bold"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-cyan-900">
                          📋 게시글·링크 목록 ({(block.boardRows || []).length}건) — 방문자가 제목 클릭 시 연결한 URL이 새 창으로 열립니다
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const today = new Date().toISOString().slice(0, 10);
                            const nextRows = [
                              {
                                id: `row_${Date.now()}`,
                                category: "공시/안내",
                                title: "새 게시글 제목을 입력하세요",
                                source: "DART / 자료실",
                                date: today,
                                linkUrl: "https://dart.fss.or.kr",
                              },
                              ...(block.boardRows || []),
                            ];
                            handleUpdateBlock(block.id, { boardRows: nextRows });
                          }}
                          className="px-3 py-1.5 rounded-lg bg-cyan-700 text-white text-xs font-extrabold hover:bg-cyan-800 cursor-pointer"
                        >
                          + 게시글(링크) 행 추가
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {(block.boardRows || []).map((row, rIdx) => (
                          <div
                            key={row.id}
                            className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center bg-slate-50 p-3 rounded-xl border border-slate-200"
                          >
                            <div className="md:col-span-2">
                              <input
                                type="text"
                                value={row.category}
                                onChange={(e) => {
                                  const next = (block.boardRows || []).map((r) =>
                                    r.id === row.id ? { ...r, category: e.target.value } : r
                                  );
                                  handleUpdateBlock(block.id, { boardRows: next });
                                }}
                                placeholder="구분 (예: 공시)"
                                className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-bold bg-white"
                              />
                            </div>
                            <div className="md:col-span-3">
                              <input
                                type="text"
                                value={row.title}
                                onChange={(e) => {
                                  const next = (block.boardRows || []).map((r) =>
                                    r.id === row.id ? { ...r, title: e.target.value } : r
                                  );
                                  handleUpdateBlock(block.id, { boardRows: next });
                                }}
                                placeholder={`#${rIdx + 1} 제목 입력`}
                                className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-bold bg-white"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <input
                                type="text"
                                value={row.source}
                                onChange={(e) => {
                                  const next = (block.boardRows || []).map((r) =>
                                    r.id === row.id ? { ...r, source: e.target.value } : r
                                  );
                                  handleUpdateBlock(block.id, { boardRows: next });
                                }}
                                placeholder="출처/비고"
                                className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs bg-white"
                              />
                            </div>
                            <div className="md:col-span-3">
                              <input
                                type="text"
                                value={row.linkUrl}
                                onChange={(e) => {
                                  const next = (block.boardRows || []).map((r) =>
                                    r.id === row.id ? { ...r, linkUrl: e.target.value } : r
                                  );
                                  handleUpdateBlock(block.id, { boardRows: next });
                                }}
                                placeholder="이동할 링크 URL (예: https://dart.fss.or.kr/...)"
                                className="w-full px-2.5 py-1.5 rounded border border-cyan-400 text-xs bg-white text-blue-700 font-semibold"
                              />
                            </div>
                            <div className="md:col-span-2 flex items-center gap-1.5">
                              <input
                                type="text"
                                value={row.date}
                                onChange={(e) => {
                                  const next = (block.boardRows || []).map((r) =>
                                    r.id === row.id ? { ...r, date: e.target.value } : r
                                  );
                                  handleUpdateBlock(block.id, { boardRows: next });
                                }}
                                placeholder="2026-10-29"
                                className="w-full px-2 py-1.5 rounded border border-slate-300 text-xs bg-white"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const next = (block.boardRows || []).filter(
                                    (r) => r.id !== row.id
                                  );
                                  handleUpdateBlock(block.id, { boardRows: next });
                                }}
                                className="px-2.5 py-1.5 rounded bg-red-100 text-red-700 text-xs font-bold hover:bg-red-200 shrink-0 cursor-pointer"
                              >
                                삭제
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* (D) 🖼️ 멀티 레이아웃 이미지 그리드 블록 (1x1, 2x1, 3x1, 4x1, 2x2, 3x2) */}
                  {block.type === "image_grid" && (
                    <div className="space-y-5">
                      {/* 프리셋 버튼 바 */}
                      <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4">
                        <label className="block text-xs font-extrabold text-emerald-950 mb-2">
                          📐 이미지 배열 프리셋 선택 (클릭 시 1x1, 2x1, 3x1, 4x1, 2x2, 3x2 칸 수에 맞춰 슬롯이 자동 구성됩니다)
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                          {(Object.keys(GRID_PRESET_SLOTS) as ImageGridPreset[]).map((preset) => {
                            const info = GRID_PRESET_SLOTS[preset];
                            const active = (block.gridPreset || "2x1") === preset;
                            return (
                              <button
                                key={preset}
                                type="button"
                                onClick={() => handleApplyGridPreset(block, preset)}
                                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                                  active
                                    ? "bg-emerald-600 text-white border-emerald-700 shadow-sm ring-2 ring-emerald-300"
                                    : "bg-white text-slate-800 border-slate-200 hover:bg-emerald-100/50"
                                }`}
                              >
                                <div className="text-sm font-extrabold">{preset}</div>
                                <div
                                  className={`text-[11px] mt-0.5 ${
                                    active ? "text-emerald-100" : "text-slate-500"
                                  }`}
                                >
                                  {info.desc}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            갤러리 섹션 제목 (선택)
                          </label>
                          <input
                            type="text"
                            value={block.title || ""}
                            onChange={(e) => handleUpdateBlock(block.id, { title: e.target.value })}
                            className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            갤러리 부제목 (선택)
                          </label>
                          <input
                            type="text"
                            value={block.subtitle || ""}
                            onChange={(e) =>
                              handleUpdateBlock(block.id, { subtitle: e.target.value })
                            }
                            className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            이미지 비율 스타일
                          </label>
                          <select
                            value={block.imageAspect || "video"}
                            onChange={(e) =>
                              handleUpdateBlock(block.id, {
                                imageAspect: e.target.value as
                                  | "video"
                                  | "square"
                                  | "wide"
                                  | "auto",
                              })
                            }
                            className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white font-bold"
                          >
                            <option value="video">와이드 표준 비율 (16:9)</option>
                            <option value="square">정사각형 (1:1)</option>
                            <option value="wide">고정 파노라마 높이</option>
                            <option value="auto">원본 비율 그대로 (자동 높이)</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-emerald-900">
                          🖼️ 현재 배율 [{block.gridPreset || "2x1"}] — 등록된 이미지 총{" "}
                          {(block.images || []).length}장
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const nextImgs = [
                              ...(block.images || []),
                              {
                                id: `img_${Date.now()}`,
                                url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80",
                                title: `이미지 #${(block.images || []).length + 1}`,
                                caption: "",
                                linkUrl: "",
                              },
                            ];
                            handleUpdateBlock(block.id, { images: nextImgs });
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-extrabold hover:bg-emerald-700 cursor-pointer"
                        >
                          + 이미지 칸 1개 더 추가
                        </button>
                      </div>

                      {(() => {
                        const preset = block.gridPreset || "2x1";
                        const colCount =
                          preset === "1x1"
                            ? 1
                            : preset === "2x1" || preset === "2x2"
                            ? 2
                            : preset === "4x1"
                            ? 4
                            : 3;
                        const previewHeightClass =
                          preset === "1x1"
                            ? "h-64 sm:h-80"
                            : preset === "2x1" || preset === "2x2"
                            ? "h-48 sm:h-56"
                            : preset === "4x1"
                            ? "h-32 sm:h-36"
                            : "h-40 sm:h-44";

                        return (
                          <div
                            className="grid gap-3"
                            style={{
                              gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))`,
                            }}
                          >
                            {(block.images || []).map((img, iIdx) => (
                              <div
                                key={img.id}
                                className="min-w-0 bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-extrabold text-emerald-800 truncate">
                                    슬롯 #{iIdx + 1} ({preset})
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const next = (block.images || []).filter(
                                        (x) => x.id !== img.id
                                      );
                                      handleUpdateBlock(block.id, { images: next });
                                    }}
                                    className="text-xs font-bold text-red-600 hover:underline cursor-pointer shrink-0"
                                  >
                                    삭제
                                  </button>
                                </div>

                                {img.url && (
                                  <div
                                    className={`${previewHeightClass} w-full bg-white rounded-lg overflow-hidden border border-slate-200`}
                                  >
                                    <img
                                      src={img.url}
                                      alt={img.title || ""}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}

                                <div className="flex gap-1">
                                  <input
                                    type="text"
                                    value={img.url}
                                    onChange={(e) => {
                                      const next = (block.images || []).map((x) =>
                                        x.id === img.id ? { ...x, url: e.target.value } : x
                                      );
                                      handleUpdateBlock(block.id, { images: next });
                                    }}
                                    placeholder="이미지 URL"
                                    className="min-w-0 flex-1 px-2 py-1.5 rounded border border-slate-300 text-xs bg-white"
                                  />
                                  <label className="px-2 py-1.5 bg-slate-800 text-white rounded text-[11px] font-bold cursor-pointer hover:bg-slate-700 shrink-0">
                                    파일찾기
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) =>
                                        handleFileChange(e, (uploadedUrl) => {
                                          const next = (block.images || []).map((x) =>
                                            x.id === img.id ? { ...x, url: uploadedUrl } : x
                                          );
                                          handleUpdateBlock(block.id, { images: next });
                                        })
                                      }
                                    />
                                  </label>
                                </div>

                                <input
                                  type="text"
                                  value={img.title || ""}
                                  onChange={(e) => {
                                    const next = (block.images || []).map((x) =>
                                      x.id === img.id ? { ...x, title: e.target.value } : x
                                    );
                                    handleUpdateBlock(block.id, { images: next });
                                  }}
                                  placeholder="이미지 제목 (선택)"
                                  className="w-full px-2 py-1.5 rounded border border-slate-300 text-xs font-bold bg-white"
                                />

                                <input
                                  type="text"
                                  value={img.caption || ""}
                                  onChange={(e) => {
                                    const next = (block.images || []).map((x) =>
                                      x.id === img.id ? { ...x, caption: e.target.value } : x
                                    );
                                    handleUpdateBlock(block.id, { images: next });
                                  }}
                                  placeholder="하단 캡션 설명 (선택)"
                                  className="w-full px-2 py-1.5 rounded border border-slate-300 text-xs bg-white"
                                />

                                <input
                                  type="text"
                                  value={img.linkUrl || ""}
                                  onChange={(e) => {
                                    const next = (block.images || []).map((x) =>
                                      x.id === img.id ? { ...x, linkUrl: e.target.value } : x
                                    );
                                    handleUpdateBlock(block.id, { images: next });
                                  }}
                                  placeholder="클릭 시 이동 링크 (선택)"
                                  className="w-full px-2 py-1.5 rounded border border-slate-300 text-xs bg-white"
                                />
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* (E) 🗂️ 카드# 그룹 블록 */}
                  {block.type === "card_grid" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            카드 섹션 제목
                          </label>
                          <input
                            type="text"
                            value={block.title || ""}
                            onChange={(e) => handleUpdateBlock(block.id, { title: e.target.value })}
                            className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            카드 섹션 부제목
                          </label>
                          <input
                            type="text"
                            value={block.subtitle || ""}
                            onChange={(e) =>
                              handleUpdateBlock(block.id, { subtitle: e.target.value })
                            }
                            className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            한 줄당 카드 열 수
                          </label>
                          <select
                            value={block.gridCols || 3}
                            onChange={(e) =>
                              handleUpdateBlock(block.id, {
                                gridCols: Number(e.target.value) as 2 | 3 | 4,
                              })
                            }
                            className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white font-bold"
                          >
                            <option value={2}>2열 배치 (2×N)</option>
                            <option value={3}>3열 배치 (3×N 기본)</option>
                            <option value={4}>4열 배치 (4×N)</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs font-extrabold text-purple-900">
                          🗂️ 등록된 카드 목록 ({(block.cards || []).length}개)
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const nextCards = [
                              ...(block.cards || []),
                              {
                                id: `crd_${Date.now()}`,
                                badge: `POINT 0${(block.cards || []).length + 1}`,
                                title: `새 카드 #${(block.cards || []).length + 1}`,
                                desc: "카드 상세 설명을 입력하세요.",
                                imageUrl:
                                  "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
                                linkUrl: "",
                              },
                            ];
                            handleUpdateBlock(block.id, { cards: nextCards });
                          }}
                          className="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-extrabold hover:bg-purple-700 cursor-pointer"
                        >
                          + 카드# 항목 추가
                        </button>
                      </div>

                      <div
                        className="grid gap-4"
                        style={{
                          gridTemplateColumns: `repeat(${block.gridCols || 3}, minmax(0, 1fr))`,
                        }}
                      >
                        {(block.cards || []).map((card, cIdx) => (
                          <div
                            key={card.id}
                            className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-extrabold text-purple-700">
                                카드 #{cIdx + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const next = (block.cards || []).filter((c) => c.id !== card.id);
                                  handleUpdateBlock(block.id, { cards: next });
                                }}
                                className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
                              >
                                삭제
                              </button>
                            </div>
                            <input
                              type="text"
                              value={card.badge || ""}
                              onChange={(e) => {
                                const next = (block.cards || []).map((c) =>
                                  c.id === card.id ? { ...c, badge: e.target.value } : c
                                );
                                handleUpdateBlock(block.id, { cards: next });
                              }}
                              placeholder="상단 뱃지 (예: POINT 01)"
                              className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs bg-white"
                            />
                            <input
                              type="text"
                              value={card.title}
                              onChange={(e) => {
                                const next = (block.cards || []).map((c) =>
                                  c.id === card.id ? { ...c, title: e.target.value } : c
                                );
                                handleUpdateBlock(block.id, { cards: next });
                              }}
                              placeholder="카드 제목"
                              className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-bold bg-white"
                            />
                            <textarea
                              rows={2}
                              value={card.desc}
                              onChange={(e) => {
                                const next = (block.cards || []).map((c) =>
                                  c.id === card.id ? { ...c, desc: e.target.value } : c
                                );
                                handleUpdateBlock(block.id, { cards: next });
                              }}
                              placeholder="카드 설명"
                              className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs bg-white"
                            />
                            <div className="flex gap-1.5">
                              <input
                                type="text"
                                value={card.imageUrl || ""}
                                onChange={(e) => {
                                  const next = (block.cards || []).map((c) =>
                                    c.id === card.id ? { ...c, imageUrl: e.target.value } : c
                                  );
                                  handleUpdateBlock(block.id, { cards: next });
                                }}
                                placeholder="이미지 URL (선택)"
                                className="flex-1 px-2.5 py-1.5 rounded border border-slate-300 text-xs bg-white"
                              />
                              <label className="px-2.5 py-1.5 bg-slate-800 text-white rounded text-xs font-bold cursor-pointer hover:bg-slate-700 shrink-0">
                                사진업로드
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) =>
                                    handleFileChange(e, (uploadedUrl) => {
                                      const next = (block.cards || []).map((c) =>
                                        c.id === card.id ? { ...c, imageUrl: uploadedUrl } : c
                                      );
                                      handleUpdateBlock(block.id, { cards: next });
                                    })
                                  }
                                />
                              </label>
                            </div>
                            <input
                              type="text"
                              value={card.linkUrl || ""}
                              onChange={(e) => {
                                const next = (block.cards || []).map((c) =>
                                  c.id === card.id ? { ...c, linkUrl: e.target.value } : c
                                );
                                handleUpdateBlock(block.id, { cards: next });
                              }}
                              placeholder="클릭 시 이동할 링크 URL (선택)"
                              className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs bg-white"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* (F) 📢 작은 배너 블록 */}
                  {block.type === "mini_banner" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          상단 뱃지 문구
                        </label>
                        <input
                          type="text"
                          value={block.badge || ""}
                          onChange={(e) => handleUpdateBlock(block.id, { badge: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          배경 색상 테마
                        </label>
                        <select
                          value={block.bannerTheme || "blue"}
                          onChange={(e) =>
                            handleUpdateBlock(block.id, {
                              bannerTheme: e.target.value as "blue" | "dark" | "light",
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white font-semibold"
                        >
                          <option value="blue">블루 그라데이션</option>
                          <option value="dark">다크 네이비</option>
                          <option value="light">화이트 라이트</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          배너 메인 제목
                        </label>
                        <input
                          type="text"
                          value={block.title || ""}
                          onChange={(e) => handleUpdateBlock(block.id, { title: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white font-bold"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          배너 설명 문구
                        </label>
                        <input
                          type="text"
                          value={block.subtitle || ""}
                          onChange={(e) =>
                            handleUpdateBlock(block.id, { subtitle: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          우측 버튼 텍스트 (비워두면 버튼 숨김)
                        </label>
                        <input
                          type="text"
                          value={block.btnText || ""}
                          onChange={(e) => handleUpdateBlock(block.id, { btnText: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          버튼 클릭 시 이동 링크
                        </label>
                        <input
                          type="text"
                          value={block.btnHref || ""}
                          onChange={(e) => handleUpdateBlock(block.id, { btnHref: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* (G) ⏱️ 연혁·공정 타임라인 블록 */}
                  {block.type === "timeline_steps" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            타임라인 제목
                          </label>
                          <input
                            type="text"
                            value={block.title || ""}
                            onChange={(e) => handleUpdateBlock(block.id, { title: e.target.value })}
                            className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            타임라인 부제목
                          </label>
                          <input
                            type="text"
                            value={block.subtitle || ""}
                            onChange={(e) =>
                              handleUpdateBlock(block.id, { subtitle: e.target.value })
                            }
                            className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-amber-900">
                          ⏱️ 단계/연혁 항목 ({(block.steps || []).length}단계)
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const next = [
                              ...(block.steps || []),
                              {
                                id: `tl_${Date.now()}`,
                                stepOrYear: `STEP 0${(block.steps || []).length + 1}`,
                                title: "새 단계 제목",
                                desc: "단계별 상세 설명을 입력하세요.",
                              },
                            ];
                            handleUpdateBlock(block.id, { steps: next });
                          }}
                          className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-extrabold hover:bg-amber-700 cursor-pointer"
                        >
                          + 단계 추가
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {(block.steps || []).map((step) => (
                          <div
                            key={step.id}
                            className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center bg-slate-50 p-3 rounded-xl border border-slate-200"
                          >
                            <div className="md:col-span-2">
                              <input
                                type="text"
                                value={step.stepOrYear}
                                onChange={(e) => {
                                  const next = (block.steps || []).map((s) =>
                                    s.id === step.id ? { ...s, stepOrYear: e.target.value } : s
                                  );
                                  handleUpdateBlock(block.id, { steps: next });
                                }}
                                placeholder="STEP 01 / 2025.05"
                                className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-extrabold bg-white"
                              />
                            </div>
                            <div className="md:col-span-3">
                              <input
                                type="text"
                                value={step.title}
                                onChange={(e) => {
                                  const next = (block.steps || []).map((s) =>
                                    s.id === step.id ? { ...s, title: e.target.value } : s
                                  );
                                  handleUpdateBlock(block.id, { steps: next });
                                }}
                                placeholder="단계 제목"
                                className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-bold bg-white"
                              />
                            </div>
                            <div className="md:col-span-6">
                              <input
                                type="text"
                                value={step.desc}
                                onChange={(e) => {
                                  const next = (block.steps || []).map((s) =>
                                    s.id === step.id ? { ...s, desc: e.target.value } : s
                                  );
                                  handleUpdateBlock(block.id, { steps: next });
                                }}
                                placeholder="단계 상세 설명"
                                className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs bg-white"
                              />
                            </div>
                            <div className="md:col-span-1 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  const next = (block.steps || []).filter((s) => s.id !== step.id);
                                  handleUpdateBlock(block.id, { steps: next });
                                }}
                                className="px-2.5 py-1.5 rounded bg-red-100 text-red-700 text-xs font-bold hover:bg-red-200 cursor-pointer"
                              >
                                삭제
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* (H) ❓ FAQ 질문·답변 아코디언 블록 */}
                  {block.type === "faq_accordion" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            FAQ 섹션 제목
                          </label>
                          <input
                            type="text"
                            value={block.title || ""}
                            onChange={(e) => handleUpdateBlock(block.id, { title: e.target.value })}
                            className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            FAQ 부제목
                          </label>
                          <input
                            type="text"
                            value={block.subtitle || ""}
                            onChange={(e) =>
                              handleUpdateBlock(block.id, { subtitle: e.target.value })
                            }
                            className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-teal-900">
                          ❓ 질문·답변 목록 ({(block.faqs || []).length}개)
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const next = [
                              ...(block.faqs || []),
                              {
                                id: `faq_${Date.now()}`,
                                q: "새 질문을 입력하세요",
                                a: "질문에 대한 상세 답변을 입력하세요.",
                              },
                            ];
                            handleUpdateBlock(block.id, { faqs: next });
                          }}
                          className="px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-extrabold hover:bg-teal-700 cursor-pointer"
                        >
                          + Q&A 항목 추가
                        </button>
                      </div>

                      <div className="space-y-3">
                        {(block.faqs || []).map((faq, fIdx) => (
                          <div
                            key={faq.id}
                            className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-extrabold text-teal-800">
                                Q{fIdx + 1}. 질문과 답변
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const next = (block.faqs || []).filter((f) => f.id !== faq.id);
                                  handleUpdateBlock(block.id, { faqs: next });
                                }}
                                className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
                              >
                                삭제
                              </button>
                            </div>
                            <input
                              type="text"
                              value={faq.q}
                              onChange={(e) => {
                                const next = (block.faqs || []).map((f) =>
                                  f.id === faq.id ? { ...f, q: e.target.value } : f
                                );
                                handleUpdateBlock(block.id, { faqs: next });
                              }}
                              placeholder="질문(Q) 입력"
                              className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs font-bold bg-white"
                            />
                            <textarea
                              rows={2}
                              value={faq.a}
                              onChange={(e) => {
                                const next = (block.faqs || []).map((f) =>
                                  f.id === faq.id ? { ...f, a: e.target.value } : f
                                );
                                handleUpdateBlock(block.id, { faqs: next });
                              }}
                              placeholder="답변(A) 입력"
                              className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs bg-white"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* (I) 🎬 동영상 / 유튜브 플레이어 블록 */}
                  {block.type === "video_embed" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          영상 섹션 제목
                        </label>
                        <input
                          type="text"
                          value={block.title || ""}
                          onChange={(e) => handleUpdateBlock(block.id, { title: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          영상 부제목 / 캡션
                        </label>
                        <input
                          type="text"
                          value={block.subtitle || ""}
                          onChange={(e) =>
                            handleUpdateBlock(block.id, { subtitle: e.target.value })
                          }
                          className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          유튜브 URL 주소 또는 MP4 동영상 URL
                        </label>
                        <input
                          type="text"
                          value={block.videoUrl || ""}
                          onChange={(e) =>
                            handleUpdateBlock(block.id, { videoUrl: e.target.value })
                          }
                          placeholder="예: https://www.youtube.com/watch?v=... 또는 https://.../video.mp4"
                          className="w-full px-3.5 py-2 rounded-lg border border-rose-300 text-sm bg-white font-semibold"
                        />
                      </div>
                    </div>
                  )}

                  {/* (J) 레거시 단독 이미지 블록 호환 */}
                  {block.type === "image_box" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          이미지 제목
                        </label>
                        <input
                          type="text"
                          value={block.title || ""}
                          onChange={(e) => handleUpdateBlock(block.id, { title: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          이미지 URL
                        </label>
                        <input
                          type="text"
                          value={block.imageUrl || ""}
                          onChange={(e) =>
                            handleUpdateBlock(block.id, { imageUrl: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPageBlockBuilder;
