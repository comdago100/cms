import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { resolveAdminAccess, SLUG_PATTERN } from "@/lib/auth/access";

/**
 * /[slug]/admin 접근 통제 (Next.js 16: middleware -> proxy)
 *  - 미로그인            -> /login?next=... 로 이동
 *  - 로그인했지만 권한 없음 -> /login?error=forbidden 로 이동 (관리자 페이지 렌더링 차단)
 *  - Master(super_admin) -> 모든 기업 admin 프리패스
 *  - 기업 관리자          -> tenant_users 에 매핑된 slug 의 admin 만 허용
 * Supabase 환경변수가 없거나 오류가 나면 항상 차단(fail-closed) 합니다.
 */

const RESERVED_TOP_LEVEL = new Set([
  "about",
  "facilities",
  "products",
  "technology",
  "ir",
  "support",
  "login",
  "api",
]);

function redirectToLogin(request: NextRequest, error?: string) {
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  if (error) url.searchParams.set("error", error);
  url.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export async function proxy(request: NextRequest) {
  const segments = request.nextUrl.pathname.split("/").filter(Boolean);
  const rawSlug = segments[0] || "";

  // 사이트 일반 메뉴(/about/admin 등)는 기업 slug 가 아니므로 이 규칙 대상에서 제외
  if (RESERVED_TOP_LEVEL.has(rawSlug.toLowerCase())) {
    return NextResponse.next();
  }
  if (!SLUG_PATTERN.test(rawSlug.toLowerCase())) {
    return NextResponse.rewrite(new URL("/_not-found", request.url));
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("placeholder.supabase.co")) {
    return redirectToLogin(request, "auth_not_configured");
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // getUser() 는 Supabase Auth 서버에서 토큰을 검증합니다 (쿠키만 믿는 getSession 사용 금지)
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return redirectToLogin(request);
  }

  const decision = await resolveAdminAccess(supabase, user, rawSlug);
  if (!decision.allowed) {
    return redirectToLogin(request, decision.reason === "lookup_failed" ? "lookup_failed" : "forbidden");
  }

  response.headers.set("x-admin-access", decision.reason);
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  matcher: ["/:slug/admin", "/:slug/admin/:path*"],
};
