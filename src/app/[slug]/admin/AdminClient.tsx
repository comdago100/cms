"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CmsCategory,
  CmsItem,
  fetchCmsItems,
  createCmsItem,
  updateCmsItem,
  deleteCmsItem,
} from "@/lib/cms";
import { siteConfig } from "@/config/site";

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
    qtyLabel: "모델/도면번호 (선택)",
    qtyPlaceholder: "예: NK-2026-A",
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
    label: "📊 투자·공시 게시판 관리",
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

  const [activeCategory, setActiveCategory] = useState<CmsCategory>("facilities");
  const [items, setItems] = useState<CmsItem[]>([]);
  const [loading, setLoading] = useState(false);

  // 입력 폼 상태
  const [editingId, setEditingId] = useState<string | null>(null);
  const [subCategory, setSubCategory] = useState("");
  const [title, setTitle] = useState("");
  const [specOrMaterial, setSpecOrMaterial] = useState("");
  const [qtyOrDate, setQtyOrDate] = useState("");
  const [maker, setMaker] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const currentTabConfig =
    CATEGORY_TABS.find((t) => t.id === activeCategory) || CATEGORY_TABS[0];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab") as CmsCategory | null;
      if (tabParam && ["facilities", "products", "technology", "ir"].includes(tabParam)) {
        setActiveCategory(tabParam);
      }
    }
  }, []);

  const loadData = async () => {
    const data = await fetchCmsItems(companySlug, activeCategory);
    setItems(data);
  };

  useEffect(() => {
    resetForm();
    loadData();
  }, [companySlug, activeCategory]);

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

  const handleEditClick = (item: CmsItem) => {
    setEditingId(item.id);
    setSubCategory(item.subCategory || "");
    setTitle(item.title || "");
    setSpecOrMaterial(item.specOrMaterial || "");
    setQtyOrDate(item.qtyOrDate || "");
    setMaker(item.maker || "");
    setDescription(item.description || "");
    setImageUrl(item.imageUrl || "");
    setFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        category: activeCategory,
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
      await loadData();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await deleteCmsItem(companySlug, id);
    await loadData();
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl">
        {/* 상단 헤더 카드 */}
        <div className="flex flex-col justify-between gap-4 rounded-2xl bg-slate-900 p-6 text-white sm:flex-row sm:items-center sm:p-8">
          <div>
            <span className="inline-block rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300">
              CMS 통합 콘텐츠 관리 시스템
            </span>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
              🛠️ {siteConfig.name} 홈페이지 관리자
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              설비현황 사진, 제품소개, 기술인증서, 투자공시 게시글을 등록·수정하면 각 메뉴 페이지에 자동으로 삽입됩니다.
            </p>
          </div>
          <Link
            href={currentTabConfig.pageHref}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-500 transition-colors shrink-0"
          >
            실제 페이지 보러가기 ({currentTabConfig.pageHref}) ↗
          </Link>
        </div>

        {/* 관리 메뉴 탭 */}
        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {CATEGORY_TABS.map((tab) => {
            const isSelected = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id)}
                className={`rounded-xl px-4 py-3.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 등록 및 수정 폼 */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">
              {editingId ? "✏️ 항목 수정하기" : `➕ 신규 등록 (${currentTabConfig.label})`}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                수정 취소 (신규 등록으로 전환)
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
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
                상세 설명 (선택)
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="특징, 가공 범위 또는 상세 내용을 입력해 주세요."
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
                    placeholder="https://example.com/machine.jpg"
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
                  ? "수정 내용 저장하기"
                  : "홈페이지에 등록하기"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  취소
                </button>
              )}
            </div>
          </form>
        </div>

        {/* 등록된 항목 리스트 및 수정/삭제 보드 */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">
              등록된 항목 목록 ({items.length}건)
            </h2>
            <span className="text-xs text-slate-500">
              * 등록된 항목은 기본 템플릿 데이터 상단에 자동으로 노출됩니다.
            </span>
          </div>

          {items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-12 text-center text-sm text-slate-500">
              현재 추가로 등록된 항목이 없습니다. 위 폼에서 새 항목과 사진을 등록해 보세요!
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col justify-between gap-4 py-4 sm:flex-row sm:items-center"
                >
                  <div className="flex items-center gap-4">
                    {currentTabConfig.showImage && (
                      <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[11px] text-slate-400">
                            기본 그래픽
                          </div>
                        )}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                          {item.subCategory}
                        </span>
                        <h3 className="font-bold text-slate-900">{item.title}</h3>
                      </div>
                      <p className="mt-1 text-xs text-slate-600">
                        {item.specOrMaterial && `규격/재질/출처: ${item.specOrMaterial}`}
                        {item.qtyOrDate && ` | 수량/일자: ${item.qtyOrDate}`}
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
                      className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
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
    </div>
  );
}
