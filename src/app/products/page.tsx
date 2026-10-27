import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "제품소개",
};

const products = [
  {
    category: "선박·해양 부품",
    name: "선박용 밸브 바디 및 플랜지",
    material: "GCD450 / SCPH2",
    desc: "내압성과 내식성이 요구되는 선박 배관용 정밀 주조 및 가공 부품",
  },
  {
    category: "중장비 부품",
    name: "유압 펌프 하우징 & 실린더 커버",
    material: "GC250 / GCD500",
    desc: "건설기계 및 산업용 유압 시스템에 적용되는 고강도 정밀 가공품",
  },
  {
    category: "산업기계 부품",
    name: "감속기 케이스 및 기어 하우징",
    material: "GC250 / GCD450",
    desc: "대형 산업용 감속기 및 동력 전달 장치용 정밀 보링 가공 부품",
  },
  {
    category: "펌프·컴프레서",
    name: "임펠러 및 케이싱",
    material: "SCS13 / 청동주물",
    desc: "고효율 유체 기계를 위한 정밀 주물 소재 및 5축·복합 가공 부품",
  },
  {
    category: "자동차·방산 부품",
    name: "특수 차량용 브래킷 & 허브",
    material: "합금강 / 구상흑연주철",
    desc: "엄격한 치수 정밀도와 내구성을 만족하는 맞춤형 정밀 기계부품",
  },
  {
    category: "주문제작(OEM)",
    name: "도면 기반 맞춤형 주물·가공품",
    material: "고객사 지정 재질",
    desc: "목형 제작부터 주조, 열처리, 정밀가공까지 원스톱 맞춤 제작",
  },
];

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">제품소개</h1>
        <p className="mt-2 text-sm text-slate-600">
          선박, 중장비, 산업기계 등 다양한 산업 분야에 납품되는 주요 생산 제품입니다.
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.name}
            className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-xs"
          >
            <div>
              <div className="mb-4 flex h-40 items-center justify-center rounded-lg bg-slate-100 text-xs font-medium text-slate-400">
                제품 이미지 영역
              </div>
              <span className="inline-block rounded bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                {product.category}
              </span>
              <h2 className="mt-2 text-lg font-bold text-slate-900">{product.name}</h2>
              <p className="mt-2 text-sm text-slate-600">{product.desc}</p>
            </div>
            <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
              주요 재질: <span className="font-medium text-slate-700">{product.material}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
