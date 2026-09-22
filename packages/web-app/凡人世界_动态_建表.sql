create extension if not exists pgcrypto;

create table if not exists public.moments (
  id uuid primary key default gen_random_uuid(),
  persona_id uuid not null,
  content text not null,
  likes int not null default 0,
  created_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'moments_persona_id_fkey'
  ) then
    alter table public.moments
      add constraint moments_persona_id_fkey
      foreign key (persona_id) references public.personas(id) on delete cascade;
  end if;
end $$;

create index if not exists moments_created_at_idx
  on public.moments (created_at desc);

create index if not exists moments_persona_id_idx
  on public.moments (persona_id);

alter table public.moments enable row level security;

drop policy if exists "moments_select_authed" on public.moments;
create policy "moments_select_authed"
on public.moments
for select
using (auth.role() = 'authenticated');

drop policy if exists "moments_insert_own_persona" on public.moments;
create policy "moments_insert_own_persona"
on public.moments
for insert
with check (
  auth.role() = 'authenticated'
  and exists (
    select 1 from public.personas p
    where p.id = persona_id and p.user_id = auth.uid()
  )
);

drop policy if exists "moments_delete_own_persona" on public.moments;
create policy "moments_delete_own_persona"
on public.moments
for delete
using (
  auth.role() = 'authenticated'
  and exists (
    select 1 from public.personas p
    where p.id = persona_id and p.user_id = auth.uid()
  )
);

create or replace function public.like_moment(moment_id uuid)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  new_likes int;
begin
  update public.moments
  set likes = coalesce(likes, 0) + 1
  where id = moment_id
  returning likes into new_likes;

  if new_likes is null then
    raise exception 'moment not found';
  end if;

  return new_likes;
end;
$$;

grant execute on function public.like_moment(uuid) to authenticated;

notify pgrst, 'reload schema';
