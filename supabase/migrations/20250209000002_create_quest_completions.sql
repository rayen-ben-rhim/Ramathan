-- Quest completions: tracks which user completed which quest on which date
create table public.quest_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  quest_id uuid not null references public.quests (id) on delete cascade,
  completed_date date not null default (current_date),
  created_at timestamptz not null default now(),
  unique (user_id, quest_id, completed_date)
);

create index idx_quest_completions_user_date on public.quest_completions (user_id, completed_date);

-- RLS: users can only insert and read their own completions
alter table public.quest_completions enable row level security;

create policy "Users can view own completions"
  on public.quest_completions for select
  using (auth.uid() = user_id);

create policy "Users can insert own completions"
  on public.quest_completions for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own completions"
  on public.quest_completions for delete
  using (auth.uid() = user_id);
