import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "회사소개",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">회사소개</h1>
        <p className="mt-2 text-sm text-slate-600">
          끊임없는 기술 혁신과 품질 경영으로 고객과 함께 성장하는 {siteConfig.name}입니다.
        </p>
      </div>

      {/* CEO 인사말 */}
      <section className="mt-10 rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-900">대표이사 인사말</h2>
        <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
          <p>
            안녕하십니까. {siteConfig.name} 홈페이지를 방문해 주신 고객 여러분께 진심으로 감사드립니다.
          </p>
          <p>
            당사는 부산 녹산국가산업단지에 자리 잡은 이래 주물 소재 생산 및 CNC 정밀가공 분야에서
            오랜 현장 경험과 기술 노하우를 축적해 왔습니다.
          </p>
          <p>
            앞으로도 철저한 품질 관리와 납기 준수를 최우선 가치로 삼아 고객사의 경쟁력을 높이는
            든든한 파트너가 되겠습니다. 감사합니다.
          </p>
          <p className="pt-2 font-semibold text-slate-900">
            {siteConfig.name} 대표이사 {siteConfig.ceo}
          </p>
        </div>
      </section>

      {/* 기업 개요 */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">기업 개요</h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <dl className="divide-y divide-slate-200 text-sm">
            <div className="grid grid-cols-3 px-6 py-4">
              <dt className="font-semibold text-slate-700">상호명</dt>
              <dd className="col-span-2 text-slate-900">{siteConfig.name} ({siteConfig.englishName})</dd>
            </div>
            <div className="grid grid-cols-3 px-6 py-4">
              <dt className="font-semibold text-slate-700">대표자</dt>
              <dd className="col-span-2 text-slate-900">{siteConfig.ceo}</dd>
            </div>
            <div className="grid grid-cols-3 px-6 py-4">
              <dt className="font-semibold text-slate-700">설립일</dt>
              <dd className="col-span-2 text-slate-900">{siteConfig.established}</dd>
            </div>
            <div className="grid grid-cols-3 px-6 py-4">
              <dt className="font-semibold text-slate-700">주요 사업</dt>
              <dd className="col-span-2 text-slate-900">{siteConfig.description}</dd>
            </div>
            <div className="grid grid-cols-3 px-6 py-4">
              <dt className="font-semibold text-slate-700">소재지</dt>
              <dd className="col-span-2 text-slate-900">{siteConfig.address}</dd>
            </div>
            <div className="grid grid-cols-3 px-6 py-4">
              <dt className="font-semibold text-slate-700">연락처</dt>
              <dd className="col-span-2 text-slate-900">
                TEL: {siteConfig.phone} / FAX: {siteConfig.fax}
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  );
}
