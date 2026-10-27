import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "설비현황",
};

const facilities = [
  { category: "가공설비", name: "수직 머시닝센터 (MCT)", spec: "8호기 / 6호기", qty: "4대", maker: "두산공작기계" },
  { category: "가공설비", name: "수평 머시닝센터 (HMCT)", spec: "Pallet 800×800", qty: "2대", maker: "현대위아" },
  { category: "가공설비", name: "CNC 선반", spec: "10인치 ~ 24인치", qty: "6대", maker: "두산공작기계" },
  { category: "가공설비", name: "CNC 문형 보링기", spec: "2,500 × 4,000", qty: "1대", maker: "한국정밀" },
  { category: "주조설비", name: "고주파 유도로", spec: "3톤 / 1.5톤", qty: "2기", maker: "인덕터썸" },
  { category: "검사설비", name: "3차원 측정기 (CMM)", spec: "1,000 × 1,500 × 800", qty: "1대", maker: "Mitutoyo" },
  { category: "검사설비", name: "금속 성분 분석기 / 경도계", spec: "표준형", qty: "1식", maker: "Spectro" },
];

export default function FacilitiesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">설비현황</h1>
        <p className="mt-2 text-sm text-slate-600">
          고정밀·고품질 생산을 위한 최신 주조·가공 설비 및 정밀 측정 장비를 보유하고 있습니다.
        </p>
      </div>

      <div className="mt-10 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-100 text-slate-700">
            <tr>
              <th className="px-6 py-3.5 font-semibold">구분</th>
              <th className="px-6 py-3.5 font-semibold">설비명</th>
              <th className="px-6 py-3.5 font-semibold">규격 / 사양</th>
              <th className="px-6 py-3.5 font-semibold">수량</th>
              <th className="px-6 py-3.5 font-semibold">제조사</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {facilities.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-blue-700">{item.category}</td>
                <td className="px-6 py-4 font-semibold text-slate-900">{item.name}</td>
                <td className="px-6 py-4 text-slate-600">{item.spec}</td>
                <td className="px-6 py-4 text-slate-900">{item.qty}</td>
                <td className="px-6 py-4 text-slate-600">{item.maker}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
