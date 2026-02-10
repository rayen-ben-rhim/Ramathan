-- Auto-calculate level and maqam based on total_bp
-- Each level requires 500 BP:
--   level = floor(total_bp / 500) + 1
-- Maqam mapping (by level):
--   1-3   -> Ṣābir
--   4-6   -> Shākir
--   7-9   -> Dhākir
--   10-12 -> Ṣādiq
--   13-15 -> Muḥsin
--   16+   -> Muqarrab

create or replace function public.calculate_level_and_maqam()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_level int;
begin
  -- Ensure non-negative BP and compute level
  v_level := floor(GREATEST(new.total_bp, 0) / 500.0)::int + 1;
  if v_level < 1 then
    v_level := 1;
  end if;

  new.current_level := v_level;

  new.current_maqam := case
    when v_level between 1 and 3 then 'Ṣābir'
    when v_level between 4 and 6 then 'Shākir'
    when v_level between 7 and 9 then 'Dhākir'
    when v_level between 10 and 12 then 'Ṣādiq'
    when v_level between 13 and 15 then 'Muḥsin'
    else 'Muqarrab'
  end;

  return new;
end;
$$;

-- Trigger: keep level/maqam in sync whenever total_bp changes
drop trigger if exists profiles_level_maqam on public.profiles;

create trigger profiles_level_maqam
  before update of total_bp on public.profiles
  for each row
  execute function public.calculate_level_and_maqam();

-- Backfill: recompute level/maqam for existing profiles
update public.profiles
set total_bp = total_bp;

