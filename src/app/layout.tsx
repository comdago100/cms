import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { LanguageProvider } from "@/context/LanguageContext";
import { Header, Footer } from "@/components/HeaderFooter";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <LanguageProvider>
          {/* 상단 헤더 (GNB + KR/EN/CN/JP 언어 전환 버튼) */}
          <Header />

          {/* 본문 영역 */}
          <main className="flex-1">{children}</main>

          {/* 하단 푸터 */}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
