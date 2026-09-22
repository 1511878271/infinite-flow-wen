create extension if not exists pgcrypto;

create table if not exists public.feedbacks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  category text not null,
  message text not null,
  contact text,
  source text,
  page text,
  persona_id text,
  persona_name text,
  request_id text,
  ip text,
  user_agent text,
  context jsonb,
  created_at timestamptz not null default now()
);

create index if not exists feedbacks_created_at_idx
  on public.feedbacks (created_at desc);

create index if not exists feedbacks_user_id_idx
  on public.feedbacks (user_id);

create index if not exists feedbacks_source_idx
  on public.feedbacks (source);

create index if not exists feedbacks_persona_id_idx
  on public.feedbacks (persona_id);

alter table public.feedbacks enable row level security;

notify pgrst, 'reload schema';
