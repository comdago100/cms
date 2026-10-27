import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "고객지원 (문의하기)",
};

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">고객지원 (문의하기)</h1>
        <p className="mt-2 text-sm text-slate-600">
          견적 문의, 도면 검토 및 기타 궁금하신 사항을 남겨주시면 담당자가 신속히 연락드리겠습니다.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        {/* 연락처 안내 */}
        <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">직통 연락처 안내</h2>
            <p className="mt-1 text-xs text-slate-500">
              급하신 용무는 전화 또는 팩스로 연락 부탁드립니다.
            </p>
          </div>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="font-semibold text-slate-700">대표전화</dt>
              <dd className="mt-0.5 text-base font-bold text-blue-700">{siteConfig.phone}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-700">팩스번호</dt>
              <dd className="mt-0.5 text-slate-900">{siteConfig.fax}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-700">이메일</dt>
              <dd className="mt-0.5 text-slate-900">{siteConfig.email}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-700">업무시간</dt>
              <dd className="mt-0.5 text-slate-900">{siteConfig.operatingHours}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-700">오시는 길</dt>
              <dd className="mt-0.5 text-slate-900">{siteConfig.address}</dd>
            </div>
          </dl>
        </div>

        {/* 온라인 문의 폼 */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-900">온라인 견적·상담 문의</h2>
          <form className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  업체명 / 성함 *
                </label>
                <input
                  type="text"
                  placeholder="예: 대한기계 / 김철수 과장"
                  className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  연락처 *
                </label>
                <input
                  type="tel"
                  placeholder="예: 010-1234-5678"
                  className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                이메일
              </label>
              <input
                type="email"
                placeholder="example@company.co.kr"
                className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                문의 제목 *
              </label>
              <input
                type="text"
                placeholder="주물 소재 및 CNC 가공 견적 문의드립니다."
                className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                문의 내용 (재질, 수량, 희망 납기 등) *
              </label>
              <textarea
                rows={5}
                placeholder="도면 유무, 예상 수량 및 문의 사항을 자유롭게 작성해 주세요."
                className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
              />
            </div>

            <button
              type="button"
              className="w-full rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-colors sm:w-auto"
            >
              문의 등록하기
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
