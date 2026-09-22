alter table public.personas
  add column if not exists visual_generation_history jsonb not null default '[]'::jsonb;

comment on column public.personas.visual_generation_history is 'AI 视觉生成历史，包含文生图与图生3D记录';
