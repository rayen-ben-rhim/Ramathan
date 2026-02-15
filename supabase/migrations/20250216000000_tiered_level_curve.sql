-- Tiered level curve: Level 1 = 0 BP, Level 2 = 50, Level 3 = 120, ...
-- Formula: total BP to reach level L (L>=2) = 10*(L-1)*(L+3)
-- Level from total_bp: level = floor((-20 + sqrt(1600 + 40*total_bp)) / 20), clamped 1..16
-- Maqam bands unchanged: 1-3 Ṣābir, 4-6 Shākir, 7-9 Dhākir, 10-12 Ṣādiq, 13-15 Muḥsin, 16+ Muqarrab

create or replace function public.calculate_level_and_maqam()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_level int;
  v_bp numeric;
begin
  v_bp := greatest(coalesce(new.total_bp, 0), 0);
  -- Tiered curve: level = floor((-20 + sqrt(1600 + 40*bp)) / 20), clamped 1..16
  v_level := least(16, greatest(1, floor((-20 + sqrt(1600 + 40 * v_bp)) / 20)::int));

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

-- Backfill: recompute level/maqam for existing profiles
update public.profiles
set total_bp = total_bp;
