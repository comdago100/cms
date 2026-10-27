import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function HomePage() {
  return (
    <div>
      {/* 히어로 섹션 */}
      <section className="bg-slate-900 py-20 text-white sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <span className="inline-block rounded-full bg-blue-600/20 px-3 py-1 text-xs font-semibold text-blue-400 border border-blue-500/30">
            부산 녹산국가산업단지 강소기업
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl leading-tight">
            정밀 주물부터 초정밀 가공까지,
            <br />
            신뢰할 수 있는 제조 파트너 <span className="text-blue-400">{siteConfig.name}</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base text-slate-300 sm:text-lg">
            {siteConfig.description}. 축적된 기술력과 최신 CNC 설비를 바탕으로 선박, 중장비, 산업기계 핵심 부품을 최고의 품질로 생산합니다.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/products"
              className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
            >
              제품소개 보러가기
            </Link>
            <Link
              href="/support"
              className="rounded-md border border-slate-600 bg-slate-800 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700 transition-colors"
            >
              견적 및 제작 문의
            </Link>
          </div>
        </div>
      </section>

      {/* 핵심 역량 섹션 */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              핵심 사업 분야
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              원소재 주조부터 정밀 가공, 품질 검사까지 원스톱 생산 체계를 갖추고 있습니다.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              {
                title: "특수·일반 주물 생산",
                desc: "회주철(GC), 구상흑연주철(GCD) 및 합금강 주물 등 고객사 요구 사양에 맞춘 고품질 주물 소재 제작",
              },
              {
                title: "CNC 정밀 기계가공",
                desc: "머시닝센터(MCT), CNC 선반, 대형 보링기 등을 활용한 고난도·초정밀 부품 가공",
              },
              {
                title: "철저한 품질 보증",
                desc: "3차원 측정기 및 비파괴 검사 설비를 통한 엄격한 치수 관리 및 납기 준수",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs"
              >
                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 바로가기 배너 섹션 */}
      <section className="border-t border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col justify-between rounded-xl bg-slate-100 p-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900">보유 설비 현황</h3>
                <p className="mt-2 text-sm text-slate-600">
                  생산 설비 및 정밀 측정 장비 리스트를 확인하실 수 있습니다.
                </p>
              </div>
              <Link
                href="/facilities"
                className="mt-6 inline-flex items-center text-sm font-semibold text-blue-700 hover:underline"
              >
                설비현황 자세히 보기 →
              </Link>
            </div>

            <div className="flex flex-col justify-between rounded-xl bg-blue-50 p-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900">고객지원 및 견적문의</h3>
                <p className="mt-2 text-sm text-slate-600">
                  도면 검토 및 가공 견적 문의를 남겨주시면 신속히 답변드리겠습니다.
                </p>
                <p className="mt-3 text-base font-bold text-blue-800">
                  대표전화: {siteConfig.phone}
                </p>
              </div>
              <Link
                href="/support"
                className="mt-6 inline-flex items-center text-sm font-semibold text-blue-700 hover:underline"
              >
                온라인 문의하기 →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
