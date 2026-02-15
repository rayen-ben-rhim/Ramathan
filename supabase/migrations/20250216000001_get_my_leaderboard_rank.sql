-- Returns the current user's leaderboard rank and profile row (same ordering as get_leaderboard_profiles).
-- Used for "Your rank" section on Path of Consistency.

create or replace function public.get_my_leaderboard_rank(p_user_id uuid)
returns table (
  rank int,
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
stable
as $$
  with ranked as (
    select
      p.id,
      coalesce(p.display_name, 'Traveler') as display_name,
      p.current_maqam,
      p.current_level,
      p.total_bp,
      p.current_streak,
      p.longest_streak,
      rank() over (
        order by
          p.total_bp desc,
          p.longest_streak desc,
          p.current_streak desc,
          p.created_at asc
      )::int as rn
    from public.profiles as p
  )
  select
    r.rn as rank,
    r.id,
    r.display_name,
    r.current_maqam,
    r.current_level,
    r.total_bp,
    r.current_streak,
    r.longest_streak
  from ranked as r
  where r.id = p_user_id
$$;
