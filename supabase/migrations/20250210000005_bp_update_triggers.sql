-- BP Update Triggers: automatically update total_bp when completions are inserted/deleted
-- This prevents client-side cheating and ensures BP calculations are always correct.

-- Function to update BP and last_activity_date when a quest is completed
create or replace function public.on_quest_completion_insert()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  quest_reward int;
begin
  -- Get the reward BP for this quest
  select reward_bp into quest_reward
  from public.quests
  where id = new.quest_id;

  -- Update the user's profile
  update public.profiles
  set total_bp = total_bp + coalesce(quest_reward, 0),
      last_activity_date = new.completed_date
  where id = new.user_id;

  return new;
end;
$$;

-- Function to subtract BP when a quest completion is deleted (undo)
create or replace function public.on_quest_completion_delete()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  quest_reward int;
begin
  -- Get the reward BP for this quest
  select reward_bp into quest_reward
  from public.quests
  where id = old.quest_id;

  -- Subtract from the user's profile (never go below 0)
  update public.profiles
  set total_bp = greatest(0, total_bp - coalesce(quest_reward, 0))
  where id = old.user_id;

  return old;
end;
$$;

-- Function to update BP and last_activity_date when a video is watched
create or replace function public.on_video_completion_insert()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  video_reward int;
begin
  -- Get the reward BP for this video
  select reward_bp into video_reward
  from public.videos
  where id = new.video_id;

  -- Update the user's profile
  update public.profiles
  set total_bp = total_bp + coalesce(video_reward, 0),
      last_activity_date = new.completed_date
  where id = new.user_id;

  return new;
end;
$$;

-- Function to subtract BP when a video completion is deleted (undo)
create or replace function public.on_video_completion_delete()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  video_reward int;
begin
  -- Get the reward BP for this video
  select reward_bp into video_reward
  from public.videos
  where id = old.video_id;

  -- Subtract from the user's profile (never go below 0)
  update public.profiles
  set total_bp = greatest(0, total_bp - coalesce(video_reward, 0))
  where id = old.user_id;

  return old;
end;
$$;

-- Create triggers for quest_completions
drop trigger if exists quest_completion_insert_bp on public.quest_completions;
create trigger quest_completion_insert_bp
  after insert on public.quest_completions
  for each row
  execute function public.on_quest_completion_insert();

drop trigger if exists quest_completion_delete_bp on public.quest_completions;
create trigger quest_completion_delete_bp
  after delete on public.quest_completions
  for each row
  execute function public.on_quest_completion_delete();

-- Create triggers for video_completions
drop trigger if exists video_completion_insert_bp on public.video_completions;
create trigger video_completion_insert_bp
  after insert on public.video_completions
  for each row
  execute function public.on_video_completion_insert();

drop trigger if exists video_completion_delete_bp on public.video_completions;
create trigger video_completion_delete_bp
  after delete on public.video_completions
  for each row
  execute function public.on_video_completion_delete();
