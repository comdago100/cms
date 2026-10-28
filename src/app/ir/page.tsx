import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "투자정보",
};

const disclosures = [
  {
    date: "2026-03-28",
    category: "정기공시",
    title: "제28기 감사보고서 및 재무제표 공시",
    source: "DART 전자공시",
  },
  {
    date: "2026-03-12",
    category: "주주총회",
    title: "제28기 정기주주총회 소집 공고",
    source: "회사공고",
  },
  {
    date: "2025-11-15",
    category: "IR자료",
    title: "녹산 제2공장 대형 CNC 보링 설비 증설 투자 안내",
    source: "IR 자료실",
  },
  {
    date: "2025-03-29",
    category: "정기공시",
    title: "제27기 결산 공고 및 감사보고서",
    source: "DART 전자공시",
  },
];

const financialHighlights = [
  { label: "매출액 (2025년 기준)", value: "185억 원", note: "전년 대비 +12.4% 성장" },
  { label: "영업이익률", value: "9.8%", note: "고부가 정밀가공 비중 확대" },
  { label: "신용등급", value: "BB+ (안정적)", note: "기업신용평가 기준" },
];

export default function IrPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">투자정보</h1>
        <p className="mt-2 text-sm text-slate-600">
          투명하고 건실한 경영을 바탕으로 {siteConfig.name}의 주요 재무 현황, DART 공시 및 투자 자료를 안내합니다.
        </p>
      </div>

      {/* 주요 재무 하이라이트 */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">주요 경영·재무 지표</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-3">
          {financialHighlights.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs"
            >
              <p className="text-xs font-semibold text-slate-500">{item.label}</p>
              <p className="mt-2 text-2xl font-bold text-blue-700">{item.value}</p>
              <p className="mt-1 text-xs text-slate-600">{item.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 공시 및 IR 자료 게시판 */}
      <section className="mt-12">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <h2 className="text-xl font-bold text-slate-900">공시정보 및 IR 자료</h2>
          <a
            href="https://dart.fss.or.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs font-semibold text-blue-700 hover:underline"
          >
            금융감독원 전자공시시스템(DART) 바로가기 ↗
          </a>
        </div>

        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-100 text-slate-700">
              <tr>
                <th className="px-6 py-3.5 font-semibold">구분</th>
                <th className="px-6 py-3.5 font-semibold">제목</th>
                <th className="px-6 py-3.5 font-semibold">출처</th>
                <th className="px-6 py-3.5 font-semibold">등록일</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {disclosures.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <span className="inline-block rounded bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">{item.title}</td>
                  <td className="px-6 py-4 text-slate-600">{item.source}</td>
                  <td className="px-6 py-4 text-slate-500">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
