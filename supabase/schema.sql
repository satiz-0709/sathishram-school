create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.create_profile_for_new_user();

grant select on public.profiles to authenticated;
revoke all on public.profiles from anon;
revoke insert, update, delete on public.profiles from authenticated;
grant update (display_name, updated_at) on public.profiles to authenticated;

create table if not exists public.lesson_content (
  id bigint generated always as identity primary key,
  module_slug text not null,
  lesson_slug text not null,
  content jsonb not null,
  is_sample boolean not null default false,
  unique (module_slug, lesson_slug)
);

alter table public.lesson_content enable row level security;

drop policy if exists "Anyone can read sample lessons" on public.lesson_content;
create policy "Anyone can read sample lessons"
  on public.lesson_content for select
  to anon, authenticated
  using (is_sample);

drop policy if exists "Signed-in users can read full lessons" on public.lesson_content;
create policy "Signed-in users can read full lessons"
  on public.lesson_content for select
  to authenticated
  using (true);

revoke insert, update, delete on public.lesson_content from anon, authenticated;
grant select on public.lesson_content to anon, authenticated;
