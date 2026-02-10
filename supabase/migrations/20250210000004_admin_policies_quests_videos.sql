-- Admin-friendly RLS policies for managing quests and videos.
-- For this MVP, any authenticated user can perform all operations.

-- Quests: allow authenticated users full CRUD access.
create policy "Authenticated can manage quests"
  on public.quests
  for all
  to authenticated
  using (true)
  with check (true);

-- Videos: allow authenticated users full CRUD access.
create policy "Authenticated can manage videos"
  on public.videos
  for all
  to authenticated
  using (true)
  with check (true);

