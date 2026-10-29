import { createBrowserClient } from "@supabase/ssr";

/** 로그인/로그아웃용 브라우저 클라이언트 (세션을 쿠키에 저장하여 proxy.ts 가 검증할 수 있게 함) */
export function createAuthBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  return createBrowserClient(url, key);
}

export function isAuthConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return Boolean(
    url && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && !url.includes("placeholder.supabase.co")
  );
}
