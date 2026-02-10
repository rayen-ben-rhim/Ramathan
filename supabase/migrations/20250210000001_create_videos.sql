-- Videos table: stores YouTube reminders with BP rewards
create table public.videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  youtube_id text not null,
  reward_bp int not null,
  duration text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- RLS: all authenticated users can read active videos
alter table public.videos enable row level security;

create policy "Authenticated users can view videos"
  on public.videos for select
  to authenticated
  using (is_active = true);

-- Optional: seed some default videos (replace youtube_id with real IDs)
insert into public.videos (title, youtube_id, reward_bp, duration) values
  ('The Beauty of Patience in Ramadan', 'VIDEO_ID_1', 20, '7:30'),
  ('Gratitude: A Key to Inner Peace', 'VIDEO_ID_2', 15, '5:45'),
  ('The Night of Power — What You Need to Know', 'VIDEO_ID_3', 25, '9:12');

-- Video completions: tracks which user watched which video on which date
create table public.video_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  video_id uuid not null references public.videos (id) on delete cascade,
  completed_date date not null default (current_date),
  created_at timestamptz not null default now(),
  unique (user_id, video_id, completed_date)
);

create index idx_video_completions_user_date on public.video_completions (user_id, completed_date);

-- RLS: users can only manage their own video completions
alter table public.video_completions enable row level security;

create policy "Users can view own video completions"
  on public.video_completions for select
  using (auth.uid() = user_id);

create policy "Users can insert own video completions"
  on public.video_completions for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own video completions"
  on public.video_completions for delete
  using (auth.uid() = user_id);

