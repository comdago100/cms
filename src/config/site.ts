export const siteConfig = {
  name: "(주)녹산정밀기공",
  englishName: "NOKSAN PRECISION MFG CO., LTD.",
  description: "부산 녹산국가산업단지 소재 주물·정밀가공·기계부품 제조 전문기업",
  ceo: "홍길동",
  businessNumber: "605-81-00000",
  established: "1998년 5월",
  address: "부산광역시 강서구 녹산산단 382로 14번길 25 (송정동)",
  phone: "051-831-0000",
  fax: "051-831-0001",
  email: "info@noksan-mfg.co.kr",
  operatingHours: "평일 08:30 ~ 17:30 (토·일·공휴일 휴무)",
  copyrightYear: "2026",
  navItems: [
    { label: "홈", href: "/" },
    { label: "회사소개", href: "/about" },
    { label: "설비현황", href: "/facilities" },
    { label: "제품소개", href: "/products" },
    { label: "기술정보", href: "/technology" },
    { label: "투자정보", href: "/ir" },
    { label: "고객지원", href: "/support" },
  ],
};

export type SiteConfig = typeof siteConfig;
