-- Streak trigger: keeps current_streak and longest_streak in sync
-- based on changes to last_activity_date on profiles.

create or replace function public.update_streaks_on_activity()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  day_diff int;
begin
  -- If last_activity_date is not being changed, do nothing.
  if new.last_activity_date is null or new.last_activity_date = old.last_activity_date then
    return new;
  end if;

  -- First ever activity: start streak at 1.
  if old.last_activity_date is null then
    new.current_streak := 1;
    new.longest_streak := greatest(1, coalesce(old.longest_streak, 0));
    return new;
  end if;

  -- Difference between new and old activity dates (in whole days).
  day_diff := (new.last_activity_date - old.last_activity_date);

  if day_diff = 1 then
    -- Consecutive day: increment streak.
    new.current_streak := coalesce(old.current_streak, 0) + 1;
  else
    -- Missed at least one day: reset streak.
    new.current_streak := 1;
  end if;

  new.longest_streak := greatest(new.current_streak, coalesce(old.longest_streak, 0));

  return new;
end;
$$;

-- Attach trigger to profiles table.
drop trigger if exists profiles_update_streaks on public.profiles;

create trigger profiles_update_streaks
  before update of last_activity_date on public.profiles
  for each row
  execute function public.update_streaks_on_activity();

-- Backfill: initialize streaks for existing profiles in a simple, safe way.
-- Any profile with a non-null last_activity_date and zeroed streaks
-- will be set to a 1-day streak by default.
update public.profiles
set current_streak = case when last_activity_date is not null then 1 else 0 end,
    longest_streak = case when last_activity_date is not null then 1 else 0 end
where coalesce(current_streak, 0) = 0
  and coalesce(longest_streak, 0) = 0;

