-- Add admin role to profiles and lock down quests/videos to admin-only writes.

-- 1. Add is_admin column to profiles (default false for all existing and new users)
alter table public.profiles
  add column if not exists is_admin boolean not null default false;

-- 2. Prevent users from self-promoting: allow update only if is_admin is unchanged
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and (select p.is_admin from public.profiles p where p.id = auth.uid()) = is_admin
  );

-- 3. Drop dangerous policies that allowed any authenticated user to manage quests/videos
drop policy if exists "Authenticated can manage quests" on public.quests;
drop policy if exists "Authenticated can manage videos" on public.videos;

-- 4. Quests: replace broad select with active-only for regular users, add admin select and admin write
drop policy if exists "Authenticated users can view quests" on public.quests;
create policy "Authenticated users can view active quests"
  on public.quests for select
  to authenticated
  using (is_active = true);

create policy "Admins can view all quests"
  on public.quests for select
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

create policy "Admins can insert quests"
  on public.quests for insert
  to authenticated
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

create policy "Admins can update quests"
  on public.quests for update
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true))
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

create policy "Admins can delete quests"
  on public.quests for delete
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

-- 5. Videos: add admin select and admin write (keep existing "Authenticated users can view videos" for active-only read)
create policy "Admins can view all videos"
  on public.videos for select
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

create policy "Admins can insert videos"
  on public.videos for insert
  to authenticated
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

create policy "Admins can update videos"
  on public.videos for update
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true))
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

create policy "Admins can delete videos"
  on public.videos for delete
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));
