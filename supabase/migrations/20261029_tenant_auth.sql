-- =====================================================================
-- 멀티 테넌트 관리자 권한 제어 + 최고 관리자(Master) 스키마
-- Supabase SQL Editor 에서 1회 실행하세요. (여러 번 실행해도 안전)
--
-- 접근 규칙 (src/proxy.ts 에서 강제)
--   * 일반 기업 관리자 : tenant_users 에 (user_id, tenant_slug) 가 있는 기업의 /[slug]/admin 만 접근
--   * 최고 관리자(Master): profiles.role = 'super_admin' 이거나
--                         서버 환경변수 MASTER_ADMIN_EMAILS 에 이메일이 있으면 모든 기업 접근(프리패스)
--   * 매핑이 없으면 접근 거부 (fail-closed)
-- =====================================================================

-- 1) 사용자 프로필 (역할)
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text,
  role       text not null default 'tenant_admin'
             check (role in ('tenant_admin', 'super_admin')),
  created_at timestamptz not null default now()
);

-- 2) 사용자 ↔ 기업(slug) 매핑 (한 사용자가 여러 기업을 관리할 수도 있음)
create table if not exists public.tenant_users (
  user_id     uuid not null references auth.users (id) on delete cascade,
  tenant_slug text not null check (tenant_slug ~ '^[a-z0-9][a-z0-9-]{0,62}$'),
  created_at  timestamptz not null default now(),
  primary key (user_id, tenant_slug)
);
create index if not exists tenant_users_slug_idx on public.tenant_users (tenant_slug);

-- 3) RLS: 로그인한 사용자는 "자기 행"만 읽을 수 있고, 클라이언트에서의 쓰기는 전면 차단
--    (권한 부여/회수는 SQL Editor 또는 service_role 로만 수행 → 사용자가 스스로 권한 상승 불가)
alter table public.profiles     enable row level security;
alter table public.tenant_users enable row level security;

drop policy if exists "profiles_select_own"     on public.profiles;
drop policy if exists "tenant_users_select_own" on public.tenant_users;

create policy "profiles_select_own" on public.profiles
  for select to authenticated using (id = auth.uid());

create policy "tenant_users_select_own" on public.tenant_users
  for select to authenticated using (user_id = auth.uid());

revoke all on public.profiles     from anon, authenticated;
revoke all on public.tenant_users from anon, authenticated;
grant select on public.profiles     to authenticated;
grant select on public.tenant_users to authenticated;

-- 4) 신규 가입 시 profiles 자동 생성 (기본 role = tenant_admin, 기업 매핑 없음 → 접근 불가 상태)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 5) 이미 만들어 둔 기존 계정 백필
insert into public.profiles (id, email)
select id, email from auth.users
on conflict (id) do nothing;

-- =====================================================================
-- 운영 예시 (SQL Editor 에서 직접 실행)
-- =====================================================================
-- (a) A기업 관리자 계정을 a-company 에 연결
--   insert into public.tenant_users (user_id, tenant_slug)
--   select id, 'a-company' from auth.users where email = 'admin@a-company.com';
--
-- (b) 최고 관리자 지정
--   update public.profiles set role = 'super_admin'
--   where id = (select id from auth.users where email = 'master@example.com');
--
-- (c) 연결 해제
--   delete from public.tenant_users
--   where user_id = (select id from auth.users where email = 'admin@a-company.com')
--     and tenant_slug = 'a-company';
