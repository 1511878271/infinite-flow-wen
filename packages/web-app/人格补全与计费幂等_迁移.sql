-- Server-side persona enrichment and billing idempotency migration.

alter table public.transaction_logs
  add column if not exists request_id text;

create unique index if not exists transaction_logs_request_id_uidx
  on public.transaction_logs (request_id)
  where request_id is not null;

create table if not exists public.persona_profile_enrichments (
  persona_id uuid primary key references public.personas(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  questionnaire_version integer not null default 1,
  answers jsonb not null default '{}'::jsonb,
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.persona_profile_enrichments enable row level security;

drop policy if exists "Users can read own persona enrichment" on public.persona_profile_enrichments;
create policy "Users can read own persona enrichment"
  on public.persona_profile_enrichments for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own persona enrichment" on public.persona_profile_enrichments;
create policy "Users can insert own persona enrichment"
  on public.persona_profile_enrichments for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.personas p
      where p.id = persona_id and p.user_id = auth.uid()
    )
  );

drop policy if exists "Users can update own persona enrichment" on public.persona_profile_enrichments;
create policy "Users can update own persona enrichment"
  on public.persona_profile_enrichments for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

notify pgrst, 'reload schema';
