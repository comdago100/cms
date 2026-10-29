"use client";

import { useEffect, useState } from "react";
import {
  PageKey,
  CustomPageBlock,
  CustomCardItem,
  getCustomPageBlocks,
  saveCustomPageBlocks,
  uploadMediaFileToUrl,
  makeSvgDataUrl,
} from "@/lib/cms";

const PAGE_LABELS: Record<PageKey, string> = {
  home: "홈 화면 (/)",
  about: "회사소개 (/about)",
  facilities: "설비현황 (/facilities)",
  products: "제품소개 (/products)",
  technology: "기술정보 (/technology)",
  ir: "투자정보 (/ir)",
  support: "고객지원 (/support)",
};

export function AdminPageBlockBuilder({
  slug = "noksan",
  page,
}: {
  slug?: string;
  page: PageKey;
}) {
  const [blocks, setBlocks] = useState<CustomPageBlock[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setBlocks(getCustomPageBlocks(slug, page));
  }, [slug, page]);

  const persist = (next: CustomPageBlock[]) => {
    setBlocks(next);
    saveCustomPageBlocks(slug, page, next);
  };

  // 1) 작은 배너 추가
  const handleAddMiniBanner = () => {
    const count = blocks.filter((b) => b.type === "mini_banner").length + 1;
    const newBlock: CustomPageBlock = {
      id: `block_banner_${Date.now()}`,
      page,
      position: "bottom",
      type: "mini_banner",
      bannerTheme: "blue",
      badge: "CUSTOM BANNER",
      title: `${PAGE_LABELS[page].split(" ")[0]} 안내 배너 #${count}`,
      subtitle: "원하시는 안내 문구나 프로모션 설명을 자유롭게 입력해 주세요.",
      btnText: "자세히 보기 →",
      btnHref: "/support",
      btnNewTab: false,
      imageUrl: "",
    };
    persist([...blocks, newBlock]);
  };

  // 2) 카드# 섹션 추가
  const handleAddCardGrid = () => {
    const newBlock: CustomPageBlock = {
      id: `block_cards_${Date.now()}`,
      page,
      position: "bottom",
      type: "card_grid",
      badge: "FEATURE CARDS",
      title: `${PAGE_LABELS[page].split(" ")[0]} 추가 안내 카드`,
      subtitle: "카드를 원하는 개수만큼 자유롭게 추가·삭제할 수 있습니다.",
      cards: [
        {
          id: `card_${Date.now()}_1`,
          badge: "POINT 01",
          title: "카드 #1 제목을 입력하세요",
          desc: "카드 #1에 들어갈 상세 설명 문구를 입력해 주세요.",
          imageUrl: makeSvgDataUrl("카드 #1", "CUSTOM CARD ITEM 01", "blue"),
          linkUrl: "",
        },
        {
          id: `card_${Date.now()}_2`,
          badge: "POINT 02",
          title: "카드 #2 제목을 입력하세요",
          desc: "카드 #2에 들어갈 상세 설명 문구를 입력해 주세요.",
          imageUrl: makeSvgDataUrl("카드 #2", "CUSTOM CARD ITEM 02", "indigo"),
          linkUrl: "",
        },
        {
          id: `card_${Date.now()}_3`,
          badge: "POINT 03",
          title: "카드 #3 제목을 입력하세요",
          desc: "카드 #3에 들어갈 상세 설명 문구를 입력해 주세요.",
          imageUrl: makeSvgDataUrl("카드 #3", "CUSTOM CARD ITEM 03", "slate"),
          linkUrl: "",
        },
      ],
    };
    persist([...blocks, newBlock]);
  };

  // 3) 이미지 블록 추가
  const handleAddImageBox = () => {
    const count = blocks.filter((b) => b.type === "image_box").length + 1;
    const newBlock: CustomPageBlock = {
      id: `block_img_${Date.now()}`,
      page,
      position: "bottom",
      type: "image_box",
      badge: "PHOTO GALLERY",
      title: `추가 이미지 #${count}`,
      subtitle: "이미지에 대한 부가 설명이나 캡션을 입력할 수 있습니다. (클릭 시 확대 지원)",
      imageUrl: makeSvgDataUrl(
        `추가 이미지 #${count}`,
        "클릭하면 확대되는 고해상도 이미지 영역",
        "blue"
      ),
    };
    persist([...blocks, newBlock]);
  };

  const updateBlock = (blockId: string, patch: Partial<CustomPageBlock>) => {
    const next = blocks.map((b) => (b.id === blockId ? { ...b, ...patch } : b));
    setBlocks(next);
  };

  const handleSaveAll = () => {
    saveCustomPageBlocks(slug, page, blocks);
    alert(
      `[${PAGE_LABELS[page]}]에 구성한 작은 배너 · 카드# · 이미지 블록이 모두 저장되어 홈페이지에 즉시 반영되었습니다!`
    );
  };

  const handleDeleteBlock = (blockId: string) => {
    if (!confirm("이 블록을 삭제하시겠습니까?")) return;
    const next = blocks.filter((b) => b.id !== blockId);
    persist(next);
  };

  const handleMoveBlock = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    const temp = next[idx];
    next[idx] = next[target];
    next[target] = temp;
    persist(next);
  };

  // 카드# 내부 개별 카드 추가/수정/삭제/이동
  const handleAddCardToBlock = (blockId: string) => {
    const next = blocks.map((b) => {
      if (b.id !== blockId) return b;
      const cards = b.cards || [];
      const nextNum = cards.length + 1;
      const newCard: CustomCardItem = {
        id: `card_${Date.now()}_${nextNum}`,
        badge: `POINT 0${nextNum}`,
        title: `카드 #${nextNum} 제목`,
        desc: `카드 #${nextNum} 상세 설명을 입력해 주세요.`,
        imageUrl: makeSvgDataUrl(
          `카드 #${nextNum}`,
          `CUSTOM CARD ITEM 0${nextNum}`,
          nextNum % 2 === 0 ? "indigo" : "blue"
        ),
        linkUrl: "",
      };
      return { ...b, cards: [...cards, newCard] };
    });
    persist(next);
  };

  const handleUpdateCardInBlock = (
    blockId: string,
    cardIdx: number,
    patch: Partial<CustomCardItem>
  ) => {
    const next = blocks.map((b) => {
      if (b.id !== blockId) return b;
      const nextCards = (b.cards || []).map((c, i) =>
        i === cardIdx ? { ...c, ...patch } : c
      );
      return { ...b, cards: nextCards };
    });
    setBlocks(next);
  };

  const handleDeleteCardInBlock = (blockId: string, cardIdx: number) => {
    const next = blocks.map((b) => {
      if (b.id !== blockId) return b;
      const cards = b.cards || [];
      if (cards.length <= 1) {
        alert("카드 섹션에는 최소 1개의 카드가 필요합니다. 전체를 지우려면 우측 상단 [블록 삭제]를 눌러주세요.");
        return b;
      }
      return { ...b, cards: cards.filter((_, i) => i !== cardIdx) };
    });
    persist(next);
  };

  const handleMoveCardInBlock = (
    blockId: string,
    cardIdx: number,
    dir: -1 | 1
  ) => {
    const next = blocks.map((b) => {
      if (b.id !== blockId) return b;
      const cards = [...(b.cards || [])];
      const target = cardIdx + dir;
      if (target < 0 || target >= cards.length) return b;
      const temp = cards[cardIdx];
      cards[cardIdx] = cards[target];
      cards[target] = temp;
      return { ...b, cards };
    });
    persist(next);
  };

  const handleUploadBlockImage = async (blockId: string, file: File | null) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadMediaFileToUrl(slug, file);
      const next = blocks.map((b) =>
        b.id === blockId ? { ...b, imageUrl: url } : b
      );
      persist(next);
    } finally {
      setUploading(false);
    }
  };

  const handleUploadCardImage = async (
    blockId: string,
    cardIdx: number,
    file: File | null
  ) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadMediaFileToUrl(slug, file);
      const next = blocks.map((b) => {
        if (b.id !== blockId) return b;
        const nextCards = (b.cards || []).map((c, i) =>
          i === cardIdx ? { ...c, imageUrl: url } : c
        );
        return { ...b, cards: nextCards };
      });
      persist(next);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-8 rounded-2xl border-2 border-indigo-200 bg-white p-6 shadow-xs sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="inline-block rounded-full bg-indigo-50 px-3 py-0.5 text-[11px] font-bold text-indigo-700">
            자유 커스텀 블록 빌더 ({PAGE_LABELS[page]})
          </span>
          <h2 className="mt-1 text-lg font-bold text-slate-900">
            🧩 [{PAGE_LABELS[page]}] 내 입맛대로 추가·제거 (작은 배너 · 카드# · 이미지)
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            현재 메뉴 페이지의 상단 또는 하단에 <strong>작은 배너</strong>, <strong>카드 #1·#2·#3...</strong>, <strong>대형 이미지</strong>를 원하는 만큼 추가하거나 제거할 수 있습니다.
          </p>
        </div>

        {/* 3대 블록 원클릭 추가 버튼 */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleAddMiniBanner}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-500 transition-colors cursor-pointer"
          >
            <span>📢 + 작은 배너 추가</span>
          </button>
          <button
            type="button"
            onClick={handleAddCardGrid}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-500 transition-colors cursor-pointer"
          >
            <span>🗂️ + 카드# 섹션 추가</span>
          </button>
          <button
            type="button"
            onClick={handleAddImageBox}
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <span>🖼️ + 이미지 추가</span>
          </button>
        </div>
      </div>

      {blocks.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 py-10 text-center">
          <p className="text-sm font-semibold text-slate-700">
            현재 [{PAGE_LABELS[page]}]에 추가된 커스텀 블록이 없습니다.
          </p>
          <p className="mt-1 text-xs text-slate-500">
            우측 상단의 <strong>[📢 + 작은 배너 추가]</strong>, <strong>[🗂️ + 카드# 섹션 추가]</strong>, <strong>[🖼️ + 이미지 추가]</strong> 버튼을 눌러 원하는 구성을 자유롭게 만들어 보세요!
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {blocks.map((block, idx) => (
            <div
              key={block.id}
              className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6 space-y-4"
            >
              {/* 블록 상단 컨트롤 헤더 */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-slate-900 px-3 py-1 text-xs font-bold text-white">
                    {block.type === "mini_banner"
                      ? `📢 작은 배너 블록 #${idx + 1}`
                      : block.type === "card_grid"
                      ? `🗂️ 카드# 그룹 블록 #${idx + 1}`
                      : `🖼️ 이미지 블록 #${idx + 1}`}
                  </span>

                  {/* 노출 위치 선택 (본문 상단 vs 본문 하단) */}
                  <select
                    value={block.position || "bottom"}
                    onChange={(e) =>
                      updateBlock(block.id, {
                        position: e.target.value as "top" | "bottom",
                      })
                    }
                    className="rounded-lg border border-blue-300 bg-white px-2.5 py-1 text-xs font-bold text-blue-700"
                  >
                    <option value="top">📍 페이지 본문 상단에 표시</option>
                    <option value="bottom">📍 페이지 본문 하단에 표시</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleMoveBlock(idx, -1)}
                    disabled={idx === 0}
                    className="rounded border border-slate-300 bg-white px-2.5 py-1 text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                  >
                    ▲ 위로
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveBlock(idx, 1)}
                    disabled={idx === blocks.length - 1}
                    className="rounded border border-slate-300 bg-white px-2.5 py-1 text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                  >
                    ▼ 아래로
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteBlock(block.id)}
                    className="rounded-lg bg-red-500 px-3 py-1 text-xs font-bold text-white hover:bg-red-600 cursor-pointer"
                  >
                    🗑️ 블록 삭제
                  </button>
                </div>
              </div>

              {/* 1) 작은 배너 편집 폼 */}
              {block.type === "mini_banner" && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      배너 색상 스타일
                    </label>
                    <select
                      value={block.bannerTheme || "blue"}
                      onChange={(e) =>
                        updateBlock(block.id, {
                          bannerTheme: e.target.value as "blue" | "dark" | "light",
                        })
                      }
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900"
                    >
                      <option value="blue">🟦 파란색 강조 배너</option>
                      <option value="dark">⬛ 다크 네이비 배너</option>
                      <option value="light">⬜ 깔끔한 화이트 배너</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      상단 작은 뱃지 문구
                    </label>
                    <input
                      type="text"
                      value={block.badge || ""}
                      onChange={(e) =>
                        updateBlock(block.id, { badge: e.target.value })
                      }
                      placeholder="예: NOTICE / 견적안내"
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      배너 메인 제목 *
                    </label>
                    <input
                      type="text"
                      value={block.title}
                      onChange={(e) =>
                        updateBlock(block.id, { title: e.target.value })
                      }
                      placeholder="배너 제목을 입력하세요"
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      배너 설명 문구
                    </label>
                    <input
                      type="text"
                      value={block.subtitle || ""}
                      onChange={(e) =>
                        updateBlock(block.id, { subtitle: e.target.value })
                      }
                      placeholder="배너 보조 설명을 입력하세요"
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      배경 이미지 업로드 (선택)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleUploadBlockImage(
                          block.id,
                          e.target.files?.[0] || null
                        )
                      }
                      className="w-full text-[11px] text-slate-600 file:mr-2 file:rounded file:border-0 file:bg-blue-600 file:px-2.5 file:py-1 file:text-[11px] file:font-semibold file:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      버튼 텍스트 (비우면 버튼 숨김)
                    </label>
                    <input
                      type="text"
                      value={block.btnText || ""}
                      onChange={(e) =>
                        updateBlock(block.id, { btnText: e.target.value })
                      }
                      placeholder="예: 자세히 보기 →"
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      버튼 클릭 시 이동할 링크 주소 (내부 경로 예: /support 또는 외부 https://...)
                    </label>
                    <div className="flex flex-wrap items-center gap-3">
                      <input
                        type="text"
                        value={block.btnHref || ""}
                        onChange={(e) =>
                          updateBlock(block.id, { btnHref: e.target.value })
                        }
                        placeholder="예: /support 또는 https://dart.fss.or.kr"
                        className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs"
                      />
                      <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(block.btnNewTab)}
                          onChange={(e) =>
                            updateBlock(block.id, {
                              btnNewTab: e.target.checked,
                            })
                          }
                          className="h-4 w-4 rounded text-blue-600"
                        />
                        새 창으로 열기
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* 2) 카드# 섹션 편집 폼 */}
              {block.type === "card_grid" && (
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        섹션 상단 뱃지 (선택)
                      </label>
                      <input
                        type="text"
                        value={block.badge || ""}
                        onChange={(e) =>
                          updateBlock(block.id, { badge: e.target.value })
                        }
                        placeholder="예: KEY FEATURES"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        카드 섹션 제목 (선택)
                      </label>
                      <input
                        type="text"
                        value={block.title}
                        onChange={(e) =>
                          updateBlock(block.id, { title: e.target.value })
                        }
                        placeholder="섹션 제목 입력 (비워두면 카드만 표시)"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        카드 섹션 보조 설명 (선택)
                      </label>
                      <input
                        type="text"
                        value={block.subtitle || ""}
                        onChange={(e) =>
                          updateBlock(block.id, { subtitle: e.target.value })
                        }
                        placeholder="보조 설명 입력"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-bold text-indigo-700">
                      수록된 카드 목록 (총 {(block.cards || []).length}개)
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAddCardToBlock(block.id)}
                      className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-500 cursor-pointer"
                    >
                      ➕ 이 섹션에 카드 #{(block.cards || []).length + 1} 추가
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {(block.cards || []).map((card, cIdx) => (
                      <div
                        key={card.id}
                        className="rounded-xl border border-slate-200 bg-white p-4 space-y-2.5 flex flex-col justify-between shadow-2xs"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <span className="rounded bg-indigo-600 px-2 py-0.5 text-[11px] font-bold text-white">
                              카드 #{cIdx + 1}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() =>
                                  handleMoveCardInBlock(block.id, cIdx, -1)
                                }
                                disabled={cIdx === 0}
                                className="rounded border border-slate-200 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 disabled:opacity-30 cursor-pointer"
                              >
                                ◀
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleMoveCardInBlock(block.id, cIdx, 1)
                                }
                                disabled={cIdx === (block.cards || []).length - 1}
                                className="rounded border border-slate-200 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 disabled:opacity-30 cursor-pointer"
                              >
                                ▶
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteCardInBlock(block.id, cIdx)
                                }
                                className="rounded bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600 hover:bg-red-500 hover:text-white cursor-pointer"
                              >
                                삭제
                              </button>
                            </div>
                          </div>

                          {card.imageUrl && (
                            <div className="relative h-24 w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-900">
                              <img
                                src={card.imageUrl}
                                alt={card.title}
                                className="h-full w-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateCardInBlock(block.id, cIdx, {
                                    imageUrl: "",
                                  })
                                }
                                className="absolute right-1.5 top-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-white hover:bg-red-600 cursor-pointer"
                              >
                                이미지 제거
                              </button>
                            </div>
                          )}

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                              카드 상단 작은 라벨
                            </label>
                            <input
                              type="text"
                              value={card.badge || ""}
                              onChange={(e) =>
                                handleUpdateCardInBlock(block.id, cIdx, {
                                  badge: e.target.value,
                                })
                              }
                              placeholder="예: POINT 01"
                              className="w-full rounded border border-slate-300 px-2.5 py-1 text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                              카드 제목 *
                            </label>
                            <input
                              type="text"
                              value={card.title}
                              onChange={(e) =>
                                handleUpdateCardInBlock(block.id, cIdx, {
                                  title: e.target.value,
                                })
                              }
                              placeholder="카드 제목 입력"
                              className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                              카드 설명
                            </label>
                            <textarea
                              rows={3}
                              value={card.desc}
                              onChange={(e) =>
                                handleUpdateCardInBlock(block.id, cIdx, {
                                  desc: e.target.value,
                                })
                              }
                              placeholder="카드 설명 입력"
                              className="w-full rounded border border-slate-300 px-2.5 py-1 text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                              카드 사진 업로드 또는 URL
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleUploadCardImage(
                                  block.id,
                                  cIdx,
                                  e.target.files?.[0] || null
                                )
                              }
                              className="w-full text-[10px] text-slate-600 file:mr-2 file:rounded file:border-0 file:bg-indigo-600 file:px-2 file:py-1 file:text-[10px] file:font-semibold file:text-white"
                            />
                            <input
                              type="text"
                              value={
                                card.imageUrl?.startsWith("data:")
                                  ? ""
                                  : card.imageUrl || ""
                              }
                              onChange={(e) =>
                                handleUpdateCardInBlock(block.id, cIdx, {
                                  imageUrl: e.target.value,
                                })
                              }
                              placeholder="또는 외부 이미지 URL 입력"
                              className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-[11px]"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                              클릭 시 이동할 링크 (선택)
                            </label>
                            <input
                              type="text"
                              value={card.linkUrl || ""}
                              onChange={(e) =>
                                handleUpdateCardInBlock(block.id, cIdx, {
                                  linkUrl: e.target.value,
                                })
                              }
                              placeholder="예: https://... 또는 /products"
                              className="w-full rounded border border-slate-300 px-2 py-1 text-[11px]"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* 카드# 추가 버튼 박스 */}
                    <button
                      type="button"
                      onClick={() => handleAddCardToBlock(block.id)}
                      className="flex min-h-[220px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-indigo-300 bg-indigo-50/40 p-4 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-500 transition-all cursor-pointer"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white">
                        +
                      </span>
                      <span className="text-xs font-bold">
                        + 카드 #{(block.cards || []).length + 1} 추가하기
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* 3) 이미지 블록 편집 폼 */}
              {block.type === "image_box" && (
                <div className="grid gap-4 lg:grid-cols-12 items-start">
                  <div className="lg:col-span-5 space-y-2">
                    <div className="h-44 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-900 flex items-center justify-center">
                      {block.imageUrl ? (
                        <img
                          src={block.imageUrl}
                          alt={block.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-slate-400">
                          이미지를 업로드해 주세요
                        </span>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleUploadBlockImage(
                          block.id,
                          e.target.files?.[0] || null
                        )
                      }
                      className="w-full text-xs text-slate-600 file:mr-2 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white"
                    />
                    <input
                      type="text"
                      value={
                        block.imageUrl?.startsWith("data:")
                          ? ""
                          : block.imageUrl || ""
                      }
                      onChange={(e) =>
                        updateBlock(block.id, { imageUrl: e.target.value })
                      }
                      placeholder="또는 외부 이미지 URL 직접 입력"
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs"
                    />
                  </div>

                  <div className="lg:col-span-7 space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        상단 작은 라벨 (선택)
                      </label>
                      <input
                        type="text"
                        value={block.badge || ""}
                        onChange={(e) =>
                          updateBlock(block.id, { badge: e.target.value })
                        }
                        placeholder="예: FACTORY VIEW / 공정 안내도"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        이미지 제목 (선택, 비우면 사진만 크게 표시)
                      </label>
                      <input
                        type="text"
                        value={block.title}
                        onChange={(e) =>
                          updateBlock(block.id, { title: e.target.value })
                        }
                        placeholder="이미지 제목 입력"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        이미지 하단 설명 / 캡션 (선택)
                      </label>
                      <textarea
                        rows={3}
                        value={block.subtitle || ""}
                        onChange={(e) =>
                          updateBlock(block.id, { subtitle: e.target.value })
                        }
                        placeholder="이미지에 대한 상세 설명을 입력하세요."
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleAddMiniBanner}
                className="rounded-lg border border-blue-300 bg-blue-50 px-3.5 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 cursor-pointer"
              >
                + 작은 배너 추가
              </button>
              <button
                type="button"
                onClick={handleAddCardGrid}
                className="rounded-lg border border-indigo-300 bg-indigo-50 px-3.5 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 cursor-pointer"
              >
                + 카드# 섹션 추가
              </button>
              <button
                type="button"
                onClick={handleAddImageBox}
                className="rounded-lg border border-slate-300 bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                + 이미지 블록 추가
              </button>
            </div>

            <button
              type="button"
              onClick={handleSaveAll}
              disabled={uploading}
              className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-indigo-500 transition-colors cursor-pointer"
            >
              💾 [{PAGE_LABELS[page]}] 커스텀 블록 변경사항 저장하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
