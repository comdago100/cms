"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createAuthBrowserClient, isAuthConfigured } from "@/lib/supabase/browser";

/** 관리자 페이지 상단: 로그인 계정 표시 + 로그아웃 (접근 통제 자체는 src/proxy.ts 에서 서버 측으로 수행) */
export function AdminSessionBar({ slug }: { slug: string }) {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthConfigured()) return;
    createAuthBrowserClient()
      .auth.getUser()
      .then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  if (!email) return null;

  const handleLogout = async () => {
    await createAuthBrowserClient().auth.signOut();
    router.replace("/login");
    router.refresh();
  };

  return (
    <div className="mb-3 flex items-center justify-end gap-3 text-xs">
      <span className="font-semibold text-slate-600">
        🔐 {email} · <span className="text-blue-700">/{slug}/admin</span>
      </span>
      <button
        type="button"
        onClick={handleLogout}
        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
      >
        로그아웃
      </button>
    </div>
  );
}
