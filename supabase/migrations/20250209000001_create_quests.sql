-- Quests table: predefined quests by category and optional Ramadan day
create table public.quests (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('spiritual', 'mental', 'physical')),
  title text not null,
  reward_bp int not null,
  ramadan_day int,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- RLS: all authenticated users can read quests
alter table public.quests enable row level security;

create policy "Authenticated users can view quests"
  on public.quests for select
  to authenticated
  using (true);

-- Seed default quests (aligned with app's Index.tsx)
insert into public.quests (category, title, reward_bp, ramadan_day) values
  ('spiritual', 'Pray all 5 prayers on time', 50, null),
  ('spiritual', 'Read 5 pages of Quran', 30, null),
  ('spiritual', 'Make morning & evening adhkār', 20, null),
  ('mental', 'Watch today''s reminder video', 20, null),
  ('mental', 'Write a short reflection on gratitude', 25, null),
  ('physical', 'Take a 15-minute walk after Iftar', 15, null),
  ('physical', 'Stretch for 5 minutes before Fajr', 10, null);
