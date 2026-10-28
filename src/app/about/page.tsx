"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { getSiteSettings, defaultSiteSettings, SiteSettings } from "@/lib/cms";

type AboutTab = "greeting" | "overview" | "vision" | "history" | "location";

const aboutTabsContent = {
  KR: {
    tabs: [
      { id: "greeting" as AboutTab, label: "CEO 인사말" },
      { id: "overview" as AboutTab, label: "회사개요" },
      { id: "vision" as AboutTab, label: "비전·핵심가치" },
      { id: "history" as AboutTab, label: "기업연혁" },
      { id: "location" as AboutTab, label: "오시는 길" },
    ],
    greetingLead: "“정밀 기술과 신뢰를 바탕으로 글로벌 제조 산업의 내일을 열어갑니다.”",
    ceoRole: "대표이사",
    stats: [
      { label: "업력 및 노하우", value: "28년+", desc: "1998년 창립 이래 무결점 생산" },
      { label: "가공 정밀도", value: "±0.005mm", desc: "3차원 측정 기반 초정밀 공차" },
      { label: "납기 준수율", value: "99.4%", desc: "체계적인 공정·생산 일정 관리" },
      { label: "보유 생산설비", value: "20대+", desc: "MCT·CNC선반·대형보링·유도로" },
    ],
    vision: {
      sloganLabel: "VISION 2030",
      slogan: "글로벌 핵심 기계부품 시장을 선도하는 초정밀 제조 파트너",
      subSlogan:
        "원소재 주조 기술과 첨단 CNC 복합가공 역량을 융합하여 고객에게 가장 완벽한 품질 솔루션을 제공합니다.",
      pillars: [
        {
          step: "01",
          title: "초정밀 품질주의 (Zero-Defect)",
          desc: "원자재 성분 분석부터 3차원 측정 검사까지 전 공정 데이터 기반 품질 보증 체계를 실천합니다.",
        },
        {
          step: "02",
          title: "스마트 공정 혁신 (Smart Factory)",
          desc: "대형·복합 CNC 설비 자동화와 가공 지그 독자 개발로 생산성과 정밀도를 동시에 극대화합니다.",
        },
        {
          step: "03",
          title: "고객 가치 동반성장 (Partnership)",
          desc: "단순 외주 가공을 넘어 도면 검토·소재 제안부터 납기까지 책임지는 기술 파트너가 됩니다.",
        },
      ],
    },
    history: [
      {
        period: "2020 ~ 현재",
        phase: "스마트 정밀가공 고도화 및 글로벌 수출 확대기",
        events: [
          { year: "2025. 11", text: "녹산 제2공장 대형 CNC 문형 보링기 및 복합가공 라인 증설" },
          { year: "2024. 02", text: "중소벤처기업부 기술혁신형 중소기업(Inno-Biz) 인증 획득" },
          { year: "2023. 04", text: "국내 주요 중공업·방산 대기업 1차 우수협력사(SQ) 인증" },
          { year: "2021. 11", text: "고내압 밸브 바디 정밀 주조 및 복합 가공 지그 장치 특허 등록" },
        ],
      },
      {
        period: "2010 ~ 2019",
        phase: "국제 품질·선급 인증 획득 및 사업 다각화기",
        events: [
          { year: "2018. 03", text: "한국선급(KR) 및 노르웨이선급(DNV) 선박 부품 공장승인 획득" },
          { year: "2015. 09", text: "ISO 14001 환경경영시스템 국제 인증 획득" },
          { year: "2012. 06", text: "ISO 9001 품질경영시스템 인증 및 3차원 측정실(CMM) 구축" },
        ],
      },
      {
        period: "1998 ~ 2009",
        phase: "창립 및 부산 녹산국가산업단지 기반 구축기",
        events: [
          { year: "2005. 08", text: "부산 녹산국가산업단지 현 본사 및 제1공장 신축 이전" },
          { year: "2001. 04", text: "선박용 밸브 및 중장비 유압 부품 정밀가공 사업부 출범" },
          { year: "1998. 05", text: "(주)녹산정밀기공 법인 설립 (특수·일반 주물 및 기계부품 제조)" },
        ],
      },
    ],
    location: {
      searchTitle: "구글 지도 위치 검색 (주소 입력 시 즉시 지도 이동)",
      searchPlaceholder: "주소를 입력하면 해당 위치가 구글 지도에 바로 표시됩니다.",
      resetBtn: "본사 기본 주소로 복원",
      openGoogleMapsBtn: "구글 지도 크게 보기 ↗",
      directionsTitle: "교통편 및 방문 안내",
      directions: [
        {
          title: "승용차·화물차 이용 시",
          desc: "남해고속도로 가락IC 또는 부산신항 배후도로 → 녹산국가산업단지 진입 → 녹산산단382로 14번길 방면 (대형 화물차 진·출입 가능)",
        },
        {
          title: "대중교통 이용 시",
          desc: "부산 도시철도 1호선 하단역 환승 → 급행 1009번 또는 강서구 마을버스 이용 → '녹산산단 중소기업단지' 정류장 하차 도보 5분",
        },
        {
          title: "김해국제공항 / 부산역 출발 시",
          desc: "김해국제공항에서 차량 약 25분 소요 / KTX 부산역에서 차량 약 40분 소요",
        },
      ],
    },
  },
  EN: {
    tabs: [
      { id: "greeting" as AboutTab, label: "CEO Message" },
      { id: "overview" as AboutTab, label: "Overview" },
      { id: "vision" as AboutTab, label: "Vision & Values" },
      { id: "history" as AboutTab, label: "History" },
      { id: "location" as AboutTab, label: "Location" },
    ],
    greetingLead: "“Opening the future of global manufacturing with precision technology and trust.”",
    ceoRole: "Chief Executive Officer",
    stats: [
      { label: "Industry Experience", value: "28+ Yrs", desc: "Proven track record since 1998" },
      { label: "Machining Tolerance", value: "±0.005mm", desc: "3D CMM verified ultra-precision" },
      { label: "On-Time Delivery", value: "99.4%", desc: "Systematic ERP production control" },
      { label: "Major Facilities", value: "20+ Units", desc: "MCT, CNC Lathe, Boring & Foundry" },
    ],
    vision: {
      sloganLabel: "VISION 2030",
      slogan: "Global Leading Ultra-Precision Manufacturing Partner for Core Machinery Parts",
      subSlogan:
        "Combining raw material casting expertise with advanced multi-axis CNC machining to deliver complete quality solutions.",
      pillars: [
        {
          step: "01",
          title: "Zero-Defect Quality",
          desc: "Full data-driven quality assurance from spectrometer material analysis to 3D CMM inspection.",
        },
        {
          step: "02",
          title: "Smart Process Innovation",
          desc: "Maximizing productivity and precision through large CNC automation and proprietary fixture engineering.",
        },
        {
          step: "03",
          title: "Customer Partnership",
          desc: "Going beyond subcontracting to provide drawing review, material consulting, and reliable global delivery.",
        },
      ],
    },
    history: [
      {
        period: "2020 ~ Present",
        phase: "Smart CNC Machining Advancement & Global Export Expansion",
        events: [
          { year: "2025. 11", text: "Expanded Noksan Plant 2 with large CNC double-column boring lines" },
          { year: "2024. 02", text: "Certified as Inno-Biz Technology Innovative Enterprise" },
          { year: "2023. 04", text: "Acquired Tier-1 Supplier Quality (SQ) Certification from major OEMs" },
          { year: "2021. 11", text: "Registered patent for high-pressure valve body casting & multi-axis jig" },
        ],
      },
      {
        period: "2010 ~ 2019",
        phase: "International Quality & Marine Classification Approvals",
        events: [
          { year: "2018. 03", text: "Approved by Korean Register (KR) and DNV for marine components" },
          { year: "2015. 09", text: "Acquired ISO 14001 Environmental Management System Certification" },
          { year: "2012. 06", text: "Acquired ISO 9001 Certification & established 3D CMM Quality Lab" },
        ],
      },
      {
        period: "1998 ~ 2009",
        phase: "Foundation & Noksan Industrial Complex Headquarters",
        events: [
          { year: "2005. 08", text: "Relocated to newly built HQ & Plant 1 in Busan Noksan Industrial Complex" },
          { year: "2001. 04", text: "Launched Marine Valve & Heavy Equipment Hydraulic Machining Division" },
          { year: "1998. 05", text: "Established NOKSAN PRECISION MFG CO., LTD." },
        ],
      },
    ],
    location: {
      searchTitle: "Google Maps Live Address Search",
      searchPlaceholder: "Enter any address to view its exact location on Google Maps",
      resetBtn: "Reset to HQ Address",
      openGoogleMapsBtn: "Open in Google Maps ↗",
      directionsTitle: "Directions & Access",
      directions: [
        {
          title: "By Car / Freight Truck",
          desc: "Namhae Expressway Garak IC or Busan New Port Highway → Enter Noksan National Industrial Complex → Noksansandan 382-ro 14beon-gil",
        },
        {
          title: "From Gimhae International Airport (PUS)",
          desc: "Approx. 25 minutes by taxi/car from Gimhae International Airport",
        },
        {
          title: "From Busan KTX Station / Busan New Port",
          desc: "Approx. 15 minutes from Busan New Port / 40 minutes from Busan KTX Station",
        },
      ],
    },
  },
  CN: {
    tabs: [
      { id: "greeting" as AboutTab, label: "代表致辞" },
      { id: "overview" as AboutTab, label: "公司概况" },
      { id: "vision" as AboutTab, label: "企业愿景" },
      { id: "history" as AboutTab, label: "发展历程" },
      { id: "location" as AboutTab, label: "地理位置" },
    ],
    greetingLead: "“以精密技术与信赖为基础，开创全球制造业的未来。”",
    ceoRole: "代表理事",
    stats: [
      { label: "行业经验", value: "28年+", desc: "1998年成立以来稳定生产" },
      { label: "加工精度", value: "±0.005mm", desc: "三坐标测量超精密公差管理" },
      { label: "交期遵守率", value: "99.4%", desc: "系统化的生产与工程进度管理" },
      { label: "核心生产设备", value: "20台+", desc: "加工中心·数控车床·大型镗床·电炉" },
    ],
    vision: {
      sloganLabel: "VISION 2030",
      slogan: "引领全球核心机械零部件市场的超精密制造合作伙伴",
      subSlogan: "融合原材料铸造技术与尖端CNC复合加工能力，为客户提供最完善的品质解决方案。",
      pillars: [
        {
          step: "01",
          title: "超精密品质主义 (Zero-Defect)",
          desc: "从原材料成分分析到三坐标测量检查，全工序实行基于数据的品质保证体系。",
        },
        {
          step: "02",
          title: "智能工艺创新 (Smart Factory)",
          desc: "通过大型复合CNC设备自动化与专用工装夹具自主研发，同时最大化生产效率与精度。",
        },
        {
          step: "03",
          title: "客户价值共同成长 (Partnership)",
          desc: "超越单纯外协加工，成为负责从图纸审核、材质建议到严守交期的技术合作伙伴。",
        },
      ],
    },
    history: [
      {
        period: "2020 ~ 至今",
        phase: "智能精密加工升级与全球出口扩大期",
        events: [
          { year: "2025. 11", text: "菉山第二工厂增设大型CNC龙门镗铣床及复合加工生产线" },
          { year: "2024. 02", text: "获得韩国中小风险企业部技术创新型企业(Inno-Biz)认证" },
          { year: "2023. 04", text: "获得主要重工业及机械大企业一级优秀协力社(SQ)认证" },
          { year: "2021. 11", text: "高耐压阀体精密铸造及复合加工工装装置专利注册" },
        ],
      },
      {
        period: "2010 ~ 2019",
        phase: "国际质量与船级社认证取得期",
        events: [
          { year: "2018. 03", text: "获得韩国船级社(KR)及挪威船级社(DNV)船舶部件工厂认可" },
          { year: "2015. 09", text: "获得 ISO 14001 环境管理体系国际认证" },
          { year: "2012. 06", text: "获得 ISO 9001 质量管理体系认证并建立三坐标测量室(CMM)" },
        ],
      },
      {
        period: "1998 ~ 2009",
        phase: "创立及釜山菉山国家产业园区基础建设期",
        events: [
          { year: "2005. 08", text: "釜山菉山国家产业园区现总部及第一工厂新建迁入" },
          { year: "2001. 04", text: "成立船用阀门及重型装备液压部件精密加工事业部" },
          { year: "1998. 05", text: "(株)菉山精密机工法人成立" },
        ],
      },
    ],
    location: {
      searchTitle: "Google地图地址搜索",
      searchPlaceholder: "输入地址即可在Google地图上准确定位",
      resetBtn: "恢复总部地址",
      openGoogleMapsBtn: "在Google地图中打开 ↗",
      directionsTitle: "交通指南",
      directions: [
        {
          title: "自驾 / 货运车辆",
          desc: "南海高速公路驾洛IC或釜山新港背道 → 进入菉山国家产业园区 → 菉山产团382路14番街方向",
        },
        {
          title: "金海国际机场出发",
          desc: "从金海国际机场乘车约需25分钟",
        },
        {
          title: "釜山新港 / KTX釜山站出发",
          desc: "距釜山新港约15分钟车程 / 距KTX釜山站约40分钟车程",
        },
      ],
    },
  },
  JP: {
    tabs: [
      { id: "greeting" as AboutTab, label: "代表挨拶" },
      { id: "overview" as AboutTab, label: "会社概要" },
      { id: "vision" as AboutTab, label: "ビジョン" },
      { id: "history" as AboutTab, label: "沿革" },
      { id: "location" as AboutTab, label: "アクセス" },
    ],
    greetingLead: "「精密技術と信頼を礎に、グローバル製造産業の明日を切り拓きます。」",
    ceoRole: "代表取締役",
    stats: [
      { label: "業歴・ノウハウ", value: "28年+", desc: "1998年創業以来の確かな実績" },
      { label: "加工精度", value: "±0.005mm", desc: "三次元測定機による超精密公差" },
      { label: "納期遵守率", value: "99.4%", desc: "体系的な工程・生産スケジュール管理" },
      { label: "保有生産設備", value: "20台+", desc: "MCT・CNC旋盤・大型ボーリング・誘導炉" },
    ],
    vision: {
      sloganLabel: "VISION 2030",
      slogan: "グローバル主要機械部品市場をリードする超精密製造パートナー",
      subSlogan:
        "素材の鋳造技術と先端CNC複合加工能力を融合し、お客様に最適な品質ソリューションを提供します。",
      pillars: [
        {
          step: "01",
          title: "超精密品質主義 (Zero-Defect)",
          desc: "原材料の成分分析から三次元測定検査まで、全工程でデータに基づく品質保証を実践します。",
        },
        {
          step: "02",
          title: "スマート工程革新 (Smart Factory)",
          desc: "大型・複合CNC設備の自動化と独自治具開発により、生産性と精度を同時に最大化します。",
        },
        {
          step: "03",
          title: "顧客価値の同伴成長 (Partnership)",
          desc: "単なる外注加工を超え、図面検討・素材提案から納期まで責任を持つ技術パートナーとなります。",
        },
      ],
    },
    history: [
      {
        period: "2020 ~ 現在",
        phase: "スマート精密加工の高度化およびグローバル輸出拡大期",
        events: [
          { year: "2025. 11", text: "菉山第2工場 大型CNC門型ボーリングマシンおよび複合加工ライン増設" },
          { year: "2024. 02", text: "中小ベンチャー企業部 技術革新形中小企業(Inno-Biz)認定取得" },
          { year: "2023. 04", text: "韓国内主要重工業・機械メーカー 一次優秀協力会社(SQ)認証" },
          { year: "2021. 11", text: "高耐圧バルブボディ精密鋳造および複合加工治具装置の特許登録" },
        ],
      },
      {
        period: "2010 ~ 2019",
        phase: "国際品質・船級認証取得および事業多角化期",
        events: [
          { year: "2018. 03", text: "韓国船級(KR)およびDNV 船舶部品工場承認を取得" },
          { year: "2015. 09", text: "ISO 14001 環境マネジメントシステム国際認証取得" },
          { year: "2012. 06", text: "ISO 9001 品質マネジメントシステム認証および三次元測定室(CMM)構築" },
        ],
      },
      {
        period: "1998 ~ 2009",
        phase: "創業および釜山・菉山国家産業団地 基盤構築期",
        events: [
          { year: "2005. 08", text: "釜山・菉山国家産業団地 現本社および第1工場 新築移転" },
          { year: "2001. 04", text: "船舶用バルブおよび重機油圧部品 精密加工事業部発足" },
          { year: "1998. 05", text: "(株)菉山精密機工 法人設立" },
        ],
      },
    ],
    location: {
      searchTitle: "Googleマップ住所検索",
      searchPlaceholder: "住所を入力するとその位置がGoogleマップに表示されます",
      resetBtn: "本社住所に戻す",
      openGoogleMapsBtn: "Googleマップで大きく見る ↗",
      directionsTitle: "交通アクセス・ご来社案内",
      directions: [
        {
          title: "お車・貨物車でお越しの場合",
          desc: "南海高速道路 駕洛IC または 釜山新港背後道路 → 菉山国家産業団地進入 → 菉山産団382路14番街方面",
        },
        {
          title: "金海国際空港からお越しの場合",
          desc: "金海国際空港よりお車で約25分",
        },
        {
          title: "釜山新港 / KTX釜山駅からお越しの場合",
          desc: "釜山新港よりお車で約15分 / KTX釜山駅よりお車で約40分",
        },
      ],
    },
  },
};

export default function AboutPage() {
  const { locale, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<AboutTab>("greeting");
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [mapQuery, setMapQuery] = useState<string>(defaultSiteSettings.address);

  useEffect(() => {
    const load = () => {
      const s = getSiteSettings("noksan");
      setSettings(s);
      setMapQuery(s.address);
    };
    load();
    window.addEventListener("cms-updated", load);
    return () => window.removeEventListener("cms-updated", load);
  }, []);

  const c = aboutTabsContent[locale];

  const companyName = locale === "KR" ? settings.name : t.company.name;
  const ceoName = locale === "KR" ? settings.ceo : t.company.ceo;
  const established = locale === "KR" ? settings.established : t.company.established;
  const businessDesc = locale === "KR" ? settings.description : t.company.description;
  const addressText = locale === "KR" ? settings.address : t.company.address;
  const greetingLead = locale === "KR" ? settings.ceoGreetingLead : c.greetingLead;
  const greetingParagraphs =
    locale === "KR"
      ? settings.ceoGreetingBody.split(/\n+/).filter(Boolean)
      : t.about.ceoParagraphs;
  const visionSlogan = locale === "KR" ? settings.visionSlogan : c.vision.slogan;
  const visionSubSlogan = locale === "KR" ? settings.visionSubSlogan : c.vision.subSlogan;

  return (
    <div className="bg-slate-50">
      {/* 서브 비주얼 배너 */}
      <section className="bg-slate-900 py-14 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">
            COMPANY INFORMATION
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            {t.about.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            {t.about.subtitle}
          </p>
        </div>
      </section>

      {/* 서브 탭 네비게이션 */}
      <div className="sticky top-16 z-40 border-b border-slate-200 bg-white shadow-2xs">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex overflow-x-auto no-scrollbar">
            {c.tabs.map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative whitespace-nowrap px-5 py-4 text-sm font-semibold transition-colors cursor-pointer ${
                    isSelected
                      ? "text-blue-700"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                  {isSelected && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 탭별 본문 컨텐츠 영역 */}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        {/* 1. CEO 인사말 */}
        {activeTab === "greeting" && (
          <div className="grid gap-8 lg:grid-cols-12 items-stretch">
            <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 p-8 text-white shadow-md">
              <div>
                <span className="inline-block rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300 border border-blue-400/30">
                  CEO MESSAGE
                </span>
                <p className="mt-6 text-xl font-bold leading-snug sm:text-2xl">
                  {greetingLead}
                </p>
              </div>
              <div className="mt-10 border-t border-white/15 pt-6">
                <p className="text-xs text-slate-400">{settings.englishName}</p>
                <p className="mt-1 text-lg font-bold">
                  {companyName} · {c.ceoRole} {ceoName}
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-8 shadow-xs">
              <h2 className="text-2xl font-bold text-slate-900">
                {t.about.ceoGreetingTitle}
              </h2>
              <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                {greetingParagraphs.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-8 flex items-center justify-end border-t border-slate-100 pt-6">
                <div className="text-right">
                  <p className="text-xs text-slate-500">{companyName}</p>
                  <p className="text-base font-bold text-slate-900">
                    {c.ceoRole} {ceoName}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. 회사개요 */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {c.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs"
                >
                  <p className="text-xs font-semibold text-slate-500">{stat.label}</p>
                  <p className="mt-2 text-3xl font-extrabold text-blue-700">{stat.value}</p>
                  <p className="mt-1.5 text-xs text-slate-600">{stat.desc}</p>
                </div>
              ))}
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
              <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
                <h2 className="text-lg font-bold text-slate-900">{t.about.overviewTitle}</h2>
              </div>
              <dl className="grid grid-cols-1 divide-y divide-slate-200 text-sm md:grid-cols-2 md:divide-y-0">
                <div className="flex flex-col border-b border-slate-200 p-6 md:border-r">
                  <dt className="text-xs font-semibold text-slate-500">{t.about.labels.companyName}</dt>
                  <dd className="mt-1.5 font-bold text-slate-900">
                    {companyName} ({settings.englishName})
                  </dd>
                </div>
                <div className="flex flex-col border-b border-slate-200 p-6">
                  <dt className="text-xs font-semibold text-slate-500">{t.about.labels.ceo}</dt>
                  <dd className="mt-1.5 font-bold text-slate-900">{ceoName}</dd>
                </div>
                <div className="flex flex-col border-b border-slate-200 p-6 md:border-r">
                  <dt className="text-xs font-semibold text-slate-500">{t.about.labels.established}</dt>
                  <dd className="mt-1.5 font-semibold text-slate-900">{established}</dd>
                </div>
                <div className="flex flex-col border-b border-slate-200 p-6">
                  <dt className="text-xs font-semibold text-slate-500">{t.about.labels.contact}</dt>
                  <dd className="mt-1.5 font-semibold text-slate-900">
                    TEL: {settings.phone} / FAX: {settings.fax}
                  </dd>
                </div>
                <div className="flex flex-col border-b border-slate-200 p-6 md:col-span-2">
                  <dt className="text-xs font-semibold text-slate-500">{t.about.labels.business}</dt>
                  <dd className="mt-1.5 text-slate-900">{businessDesc}</dd>
                </div>
                <div className="flex flex-col p-6 md:col-span-2">
                  <dt className="text-xs font-semibold text-slate-500">{t.about.labels.address}</dt>
                  <dd className="mt-1.5 text-slate-900">{addressText}</dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        {/* 3. 비전 및 핵심가치 */}
        {activeTab === "vision" && (
          <div className="space-y-8">
            <div className="rounded-2xl bg-slate-900 p-8 text-center text-white sm:p-12">
              <span className="inline-block rounded-full bg-blue-500/20 px-3.5 py-1 text-xs font-bold tracking-wider text-blue-400">
                {c.vision.sloganLabel}
              </span>
              <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
                “{visionSlogan}”
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
                {visionSubSlogan}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {c.vision.pillars.map((pillar) => (
                <div
                  key={pillar.step}
                  className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 shadow-xs"
                >
                  <span className="text-3xl font-black text-blue-600/20">
                    {pillar.step}
                  </span>
                  <h3 className="mt-2 text-lg font-bold text-slate-900">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {pillar.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. 기업연혁 */}
        {activeTab === "history" && (
          <div className="space-y-8">
            {c.history.map((block) => (
              <div
                key={block.period}
                className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs md:grid-cols-12 sm:p-8"
              >
                <div className="md:col-span-4 border-b border-slate-100 pb-4 md:border-b-0 md:border-r md:pr-6">
                  <span className="text-2xl font-extrabold text-blue-700">
                    {block.period}
                  </span>
                  <p className="mt-1.5 text-sm font-medium text-slate-600">
                    {block.phase}
                  </p>
                </div>
                <div className="md:col-span-8 space-y-4">
                  {block.events.map((ev) => (
                    <div key={ev.year} className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
                      <span className="w-24 shrink-0 font-mono text-sm font-bold text-slate-900">
                        {ev.year}
                      </span>
                      <span className="text-sm text-slate-700">{ev.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 5. 오시는 길 (실시간 구글지도 임베드 + 주소 검색) */}
        {activeTab === "location" && (
          <div className="grid gap-8 lg:grid-cols-12">
            {/* 구글 지도 임베드 및 주소 입력 바 */}
            <div className="lg:col-span-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between">
              <div className="border-b border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <label className="text-xs font-bold text-slate-700">
                    📍 {c.location.searchTitle}
                  </label>
                  <button
                    type="button"
                    onClick={() => setMapQuery(settings.address)}
                    className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                  >
                    {c.location.resetBtn}
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={mapQuery}
                    onChange={(e) => setMapQuery(e.target.value)}
                    placeholder={c.location.searchPlaceholder}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      mapQuery || settings.address
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 transition-colors"
                  >
                    {c.location.openGoogleMapsBtn}
                  </a>
                </div>
              </div>

              {/* 실제 구글 지도 iframe */}
              <div className="relative h-96 w-full bg-slate-100">
                <iframe
                  title="Google Maps Location"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    mapQuery || settings.address
                  )}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="grid grid-cols-2 divide-x divide-slate-200 border-t border-slate-200 bg-slate-50 text-xs">
                <div className="p-4">
                  <span className="font-semibold text-slate-500">{t.footer.phone}</span>
                  <p className="mt-1 text-sm font-bold text-slate-900">{settings.phone}</p>
                </div>
                <div className="p-4">
                  <span className="font-semibold text-slate-500">{t.support.labels.hours}</span>
                  <p className="mt-1 text-sm font-bold text-slate-900">{settings.operatingHours}</p>
                </div>
              </div>
            </div>

            {/* 교통편 안내 */}
            <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {c.location.directionsTitle}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  {addressText}
                </p>
                <div className="mt-6 space-y-5">
                  {c.location.directions.map((dir, i) => (
                    <div key={i} className="border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
                      <h3 className="text-sm font-bold text-blue-700">{dir.title}</h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                        {dir.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link
                  href="/support"
                  className="block w-full rounded-lg bg-slate-900 py-3 text-center text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
                >
                  {t.home.btnSupport} →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
