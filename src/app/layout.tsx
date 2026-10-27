import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
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
        {/* 상단 헤더 */}
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
            <Link href="/" className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900">
                {siteConfig.name}
              </span>
              <span className="text-[10px] font-medium tracking-wider text-slate-500">
                {siteConfig.englishName}
              </span>
            </Link>

            <nav className="flex items-center gap-4 sm:gap-8 text-sm font-medium text-slate-700">
              {siteConfig.navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition-colors hover:text-blue-700"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        {/* 본문 영역 */}
        <main className="flex-1">{children}</main>

        {/* 하단 푸터 */}
        <footer className="border-t border-slate-200 bg-slate-900 text-slate-400">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div>
                <p className="text-base font-bold text-white">{siteConfig.name}</p>
                <p className="mt-1 text-sm text-slate-400">{siteConfig.description}</p>
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                {siteConfig.navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="mt-6 border-t border-slate-800 pt-6 text-xs leading-6 text-slate-400">
              <p>
                대표자: {siteConfig.ceo} | 사업자등록번호: {siteConfig.businessNumber} | 주소: {siteConfig.address}
              </p>
              <p>
                대표전화: {siteConfig.phone} | 팩스: {siteConfig.fax} | 이메일: {siteConfig.email}
              </p>
              <p className="mt-2 text-slate-500">
                Copyright © {siteConfig.copyrightYear} {siteConfig.englishName} All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
