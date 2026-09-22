create extension if not exists pgcrypto;

create table if not exists public.icebreakers (
  id uuid primary key default gen_random_uuid(),
  from_persona_id uuid not null,
  to_persona_id uuid not null,
  payload_text text not null,
  payload_options jsonb not null default '[]'::jsonb,
  reply_text text,
  picked_option text,
  status text not null default 'sent' check (status in ('sent','accepted','rejected')),
  read_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'icebreakers_from_persona_id_fkey'
  ) then
    alter table public.icebreakers
      add constraint icebreakers_from_persona_id_fkey
      foreign key (from_persona_id) references public.personas(id) on delete cascade;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'icebreakers_to_persona_id_fkey'
  ) then
    alter table public.icebreakers
      add constraint icebreakers_to_persona_id_fkey
      foreign key (to_persona_id) references public.personas(id) on delete cascade;
  end if;
end $$;

create index if not exists icebreakers_to_persona_id_created_at_idx
  on public.icebreakers (to_persona_id, created_at desc);

create index if not exists icebreakers_from_persona_id_created_at_idx
  on public.icebreakers (from_persona_id, created_at desc);

create index if not exists icebreakers_to_persona_unread_idx
  on public.icebreakers (to_persona_id, status, read_at);

create or replace function public.set_updated_at_icebreakers()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_icebreakers_set_updated_at on public.icebreakers;
create trigger trg_icebreakers_set_updated_at
before update on public.icebreakers
for each row
execute function public.set_updated_at_icebreakers();

alter table public.icebreakers enable row level security;

drop policy if exists "icebreakers_select" on public.icebreakers;
create policy "icebreakers_select"
on public.icebreakers
for select
using (
  exists (
    select 1
    from public.personas p
    where p.id = icebreakers.from_persona_id
      and p.user_id = auth.uid()
  )
  or exists (
    select 1
    from public.personas p
    where p.id = icebreakers.to_persona_id
      and p.user_id = auth.uid()
  )
);

drop policy if exists "icebreakers_insert" on public.icebreakers;
create policy "icebreakers_insert"
on public.icebreakers
for insert
with check (
  exists (
    select 1
    from public.personas p
    where p.id = icebreakers.from_persona_id
      and p.user_id = auth.uid()
  )
);

drop policy if exists "icebreakers_update" on public.icebreakers;
create policy "icebreakers_update"
on public.icebreakers
for update
using (
  exists (
    select 1
    from public.personas p
    where p.id = icebreakers.to_persona_id
      and p.user_id = auth.uid()
  )
  or exists (
    select 1
    from public.personas p
    where p.id = icebreakers.from_persona_id
      and p.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.personas p
    where p.id = icebreakers.to_persona_id
      and p.user_id = auth.uid()
  )
  or exists (
    select 1
    from public.personas p
    where p.id = icebreakers.from_persona_id
      and p.user_id = auth.uid()
  )
);
