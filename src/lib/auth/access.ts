import type { SupabaseClient, User } from "@supabase/supabase-js";

/**
 * 멀티 테넌트 관리자 접근 판정 로직 (proxy.ts 와 로그인 페이지에서 공용 사용)
 *
 * 규칙
 *  1) 최고 관리자(Master): 아래 중 하나라도 만족하면 모든 /[slug]/admin 에 프리패스
 *     - 이메일이 서버 환경변수 MASTER_ADMIN_EMAILS(콤마 구분)에 포함 (이메일 인증 완료 계정만)
 *     - profiles.role = 'super_admin'
 *  2) 일반 기업 관리자: tenant_users 에 (user_id, tenant_slug) 매핑이 있어야 해당 slug 만 접근
 *  3) 그 외(매핑 없음/조회 실패)는 모두 거부 (fail-closed)
 */

export const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]{0,62}$/;

export type AccessDecision =
  | { allowed: true; reason: "master_email" | "master_role" | "tenant_member" }
  | { allowed: false; reason: "invalid_slug" | "no_mapping" | "lookup_failed" };

export function getMasterEmails(): string[] {
  const raw =
    process.env.MASTER_ADMIN_EMAILS ||
    process.env.NEXT_PUBLIC_MASTER_ADMIN_EMAILS ||
    "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isMasterEmail(user: Pick<User, "email">): boolean {
  if (!user.email) return false;
  return getMasterEmails().includes(user.email.toLowerCase());
}

export async function isSuperAdminRole(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();
  if (error) return false;
  return data?.role === "super_admin";
}

export async function resolveAdminAccess(
  supabase: SupabaseClient,
  user: User,
  rawSlug: string
): Promise<AccessDecision> {
  const slug = rawSlug.toLowerCase();
  if (!SLUG_PATTERN.test(slug)) return { allowed: false, reason: "invalid_slug" };

  // 1) 최고 관리자 예외 처리 (프리패스): 지정 이메일 또는 DB role = 'super_admin'
  if (isMasterEmail(user)) return { allowed: true, reason: "master_email" };
  if (
    user.app_metadata?.role === "super_admin" ||
    user.user_metadata?.role === "super_admin"
  ) {
    return { allowed: true, reason: "master_role" };
  }

  const { data: profileData } = await supabase
    .from("profiles")
    .select("role, tenant_slug")
    .eq("id", user.id)
    .maybeSingle();

  if (profileData?.role === "super_admin") {
    return { allowed: true, reason: "master_role" };
  }

  // 2) 일반 기업 관리자: profiles.tenant_slug 또는 tenant_users 테이블의 (user_id, tenant_slug) 매핑 확인
  if (
    typeof profileData?.tenant_slug === "string" &&
    profileData.tenant_slug.toLowerCase() === slug
  ) {
    return { allowed: true, reason: "tenant_member" };
  }

  const { data, error } = await supabase
    .from("tenant_users")
    .select("tenant_slug")
    .eq("user_id", user.id)
    .eq("tenant_slug", slug)
    .maybeSingle();

  if (error) return { allowed: false, reason: "lookup_failed" };
  if (data) return { allowed: true, reason: "tenant_member" };
  return { allowed: false, reason: "no_mapping" };
}
