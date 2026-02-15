-- First-time user intro: show welcome/feature screens until they dismiss.
-- New users get has_completed_intro = false; existing users are backfilled to true.

alter table public.profiles
  add column if not exists has_completed_intro boolean not null default false;

-- Existing users have already "seen" the app, so mark intro as completed
update public.profiles
set has_completed_intro = true
where has_completed_intro = false;
