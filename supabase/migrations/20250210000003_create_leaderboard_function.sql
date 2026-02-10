-- Read-only leaderboard function: returns top users by total Barakah Points.
-- This exposes only non-sensitive profile fields and ignores RLS restrictions
-- on the underlying profiles table by using SECURITY DEFINER.

create or replace function public.get_leaderboard_profiles(limit_count int default 50)
returns table (
  id uuid,
  display_name text,
  current_maqam text,
  current_level int,
  total_bp int,
  current_streak int,
  longest_streak int
)
language sql
security definer
set search_path = public
as $$
  select
    p.id,
    coalesce(p.display_name, 'Traveler') as display_name,
    p.current_maqam,
    p.current_level,
    p.total_bp,
    p.current_streak,
    p.longest_streak
  from public.profiles as p
  order by
    p.total_bp desc,
    p.longest_streak desc,
    p.current_streak desc,
    p.created_at asc
  limit greatest(limit_count, 1)
$$;

