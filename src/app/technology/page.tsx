import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "기술정보",
};

const certifications = [
  {
    category: "품질·환경 경영인증",
    title: "ISO 9001 품질경영시스템 인증",
    issuer: "한국품질재단 (KFQ)",
    date: "2012. 06",
    desc: "주물 소재 및 정밀 기계부품 가공 전 공정에 대한 국제 품질경영시스템 인증 획득",
  },
  {
    category: "품질·환경 경영인증",
    title: "ISO 14001 환경경영시스템 인증",
    issuer: "한국품질재단 (KFQ)",
    date: "2015. 09",
    desc: "친환경 주조 및 가공 공정 관리를 위한 국제 환경경영시스템 인증 획득",
  },
  {
    category: "선급·해양 인증",
    title: "KR(한국선급) / DNV 선급 공장승인",
    issuer: "한국선급 / DNV",
    date: "2018. 03",
    desc: "선박용 밸브 바디, 플랜지 및 해양 플랜트용 주강·주철 부품 제조 승인",
  },
  {
    category: "특허·지식재산권",
    title: "고내압 밸브 바디의 정밀 주조 및 복합 가공 장치 특허",
    issuer: "대한민국 특허청",
    date: "2021. 11",
    desc: "주조 결함 최소화 및 가공 정밀도 향상을 위한 독자 지그·가공 공정 특허 등록",
  },
  {
    category: "고객사 인증",
    title: "주요 대기업·중견기업 우수 협력사(SQ) 인증",
    issuer: "국내 주요 중공업·기계 제조사",
    date: "2023. 04",
    desc: "납기 준수율 및 무결점 품질 평가를 통한 핵심 부품 1차 협력업체 등록",
  },
  {
    category: "기업부설연구소·기술인증",
    title: "이노비즈(Inno-Biz) 기술혁신형 중소기업 확인",
    issuer: "중소벤처기업부",
    date: "2024. 02",
    desc: "정밀 부품 가공 기술 경쟁력 및 미래 성장 잠재력 우수 기업 선정",
  },
];

export default function TechnologyPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">기술정보</h1>
        <p className="mt-2 text-sm text-slate-600">
          국제 규격의 품질·환경 경영시스템(ISO), 기술 특허, 국내외 고객사 및 선급 인증 현황입니다.
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {certifications.map((item) => (
          <div
            key={item.title}
            className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-xs"
          >
            <div>
              <div className="mb-4 flex h-44 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 text-xs font-medium text-slate-400">
                인증서 / 특허증 이미지 영역
              </div>
              <span className="inline-block rounded bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                {item.category}
              </span>
              <h2 className="mt-2 text-lg font-bold text-slate-900">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</p>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
              <span>발급기관: <strong className="font-medium text-slate-700">{item.issuer}</strong></span>
              <span>취득월: {item.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
