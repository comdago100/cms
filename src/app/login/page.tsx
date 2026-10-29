"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createAuthBrowserClient, isAuthConfigured } from "@/lib/supabase/browser";

const ERROR_MESSAGES: Record<string, string> = {
  forbidden: "이 기업 관리자 페이지에 접근할 권한이 없습니다. 본인 기업 계정으로 로그인해 주세요.",
  lookup_failed: "권한 확인 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
  auth_not_configured:
    "인증 서버(Supabase) 환경변수가 설정되지 않아 관리자 페이지를 열 수 없습니다. NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY 를 설정해 주세요.",
};

// 오픈 리다이렉트 방지: /{slug}/admin 형태의 내부 경로만 허용
function safeNextPath(next: string | null): string | null {
  if (!next) return null;
  return /^\/[a-z0-9][a-z0-9-]*\/admin(\/[A-Za-z0-9\-_/]*)?$/i.test(next) ? next : null;
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const errorKey = params.get("error");
  const nextPath = safeNextPath(params.get("next"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(
    errorKey ? ERROR_MESSAGES[errorKey] || "로그인이 필요합니다." : null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthConfigured()) {
      setMessage(ERROR_MESSAGES.auth_not_configured);
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const supabase = createAuthBrowserClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error || !data.user) {
        setMessage("이메일 또는 비밀번호가 올바르지 않습니다.");
        return;
      }

      if (nextPath) {
        // 최종 접근 가능 여부는 proxy.ts 가 다시 검증합니다.
        router.replace(nextPath);
        router.refresh();
        return;
      }

      // next 가 없으면 본인에게 매핑된 첫 번째 기업 admin 으로 이동 (Master 는 기본 기업)
      const { data: rows } = await supabase
        .from("tenant_users")
        .select("tenant_slug")
        .eq("user_id", data.user.id)
        .limit(1);
      const mySlug = rows?.[0]?.tenant_slug;
      // 매핑이 없으면(Master 포함) 기본 기업으로 시도하고, 최종 허용 여부는 proxy.ts 가 판정합니다.
      router.replace(`/${mySlug || "noksan"}/admin`);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-16">
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-600">ADMIN LOGIN</p>
        <h1 className="mt-1 text-2xl font-extrabold text-slate-900">관리자 로그인</h1>
        <p className="mt-1 text-xs text-slate-500">
          기업 관리자는 본인 기업의 관리자 페이지에만 접근할 수 있습니다.
        </p>

        {message && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-700">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700">이메일</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700">비밀번호</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60 cursor-pointer"
          >
            {loading ? "확인 중..." : "로그인"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
