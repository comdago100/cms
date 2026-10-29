import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // NOTE: 관리자 접근 통제(proxy.ts)는 서버 런타임이 필요하므로 정적 내보내기(output: "export")를 사용하지 않습니다.
  images: {
    unoptimized: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
