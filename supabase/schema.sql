-- ============================================================================
--  Aleppo Cafe — Supabase schema
--  Run this ONCE in your Supabase project:  Dashboard → SQL Editor → New query
--  → paste this whole file → Run.
--
--  It creates every table the CMS uses, a public "media" storage bucket for
--  images/media, and Row Level Security (RLS) policies so that:
--     • anyone (the public website) can READ content
--     • only a logged-in admin can INSERT / UPDATE / DELETE content or upload
--  See SETUP.md for the full walkthrough.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. TABLES
-- ---------------------------------------------------------------------------

-- Free-form bilingual text/image blocks (hero, story, footer, contacts …).
-- Keyed by a stable string so the website can look each one up by name.
create table if not exists public.content_blocks (
  id          uuid primary key default gen_random_uuid(),
  key         text unique not null,          -- e.g. 'hero.tagline'
  section     text default 'general',        -- grouping shown in the CMS
  label       text,                           -- human friendly name in the CMS
  type        text default 'text',            -- 'text' | 'html' | 'image' | 'url'
  value_en    text default '',                -- English / LTR value
  value_ar    text default '',                -- Arabic  / RTL value
  sort_order  int  default 0,
  updated_at  timestamptz default now()
);

-- Menu branches (Ramallah, Berzait …).
create table if not exists public.branches (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,           -- 'ramallah'
  name_en     text not null,
  name_ar     text not null,
  sort_order  int  default 0,
  is_active   boolean default true,
  updated_at  timestamptz default now()
);

-- Menu categories (Drinks, Sandwiches …). One row per branch+category so a
-- branch can have its own set of categories.
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  branch_id   uuid references public.branches(id) on delete cascade,
  slug        text not null,                  -- 'drinks'
  name_en     text not null,
  name_ar     text not null,
  image1_url  text default '',                -- two showcase images per section
  image2_url  text default '',
  sort_order  int  default 0,
  is_active   boolean default true,
  updated_at  timestamptz default now(),
  unique (branch_id, slug)
);

-- Optional sub-groups inside a category (Drinks → Hot / Cold / Juices …).
create table if not exists public.subcategories (
  id          uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete cascade,
  slug        text not null,                  -- 'hot'
  name_en     text not null,
  name_ar     text not null,
  sort_order  int  default 0,
  updated_at  timestamptz default now(),
  unique (category_id, slug)
);

-- The actual menu items.
create table if not exists public.menu_items (
  id             uuid primary key default gen_random_uuid(),
  category_id    uuid references public.categories(id) on delete cascade,
  subcategory_id uuid references public.subcategories(id) on delete set null,
  name_en        text not null,
  name_ar        text default '',
  price          text default '',             -- kept as text: "10 / 7 ₪", "30–35 ₪"
  description_en text default '',
  description_ar text default '',
  image_url      text default '',
  sort_order     int  default 0,
  is_available   boolean default true,
  updated_at     timestamptz default now()
);

-- Locations / branches shown in the "Find Us" section.
create table if not exists public.locations (
  id             uuid primary key default gen_random_uuid(),
  num            text default '',             -- "01"
  name_en        text not null,
  name_ar        text default '',
  description_en text default '',
  description_ar text default '',
  address_en     text default '',
  address_ar     text default '',
  social_handle  text default '',
  map_url        text default '',             -- the button link (Instagram / Maps)
  sort_order     int  default 0,
  is_active      boolean default true,
  updated_at     timestamptz default now()
);

-- Social media + contact links.
create table if not exists public.social_links (
  id          uuid primary key default gen_random_uuid(),
  platform    text not null,                  -- 'instagram' | 'facebook' | 'phone' | 'email'
  label       text default '',                -- '@aleppo.cafe.palestine'
  url         text default '',                -- full href
  icon        text default '',                -- short glyph/letter shown in footer ('f')
  sort_order  int  default 0,
  is_active   boolean default true,
  updated_at  timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- 2. updated_at auto-touch trigger
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array[
    'content_blocks','branches','categories','subcategories',
    'menu_items','locations','social_links'
  ] loop
    execute format('drop trigger if exists trg_touch_%1$s on public.%1$s;', t);
    execute format(
      'create trigger trg_touch_%1$s before update on public.%1$s
         for each row execute function public.touch_updated_at();', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- 3. ROW LEVEL SECURITY
--    Public read, authenticated write.
-- ---------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'content_blocks','branches','categories','subcategories',
    'menu_items','locations','social_links'
  ] loop
    execute format('alter table public.%I enable row level security;', t);

    execute format('drop policy if exists "public read %1$s" on public.%1$s;', t);
    execute format(
      'create policy "public read %1$s" on public.%1$s
         for select using (true);', t);

    execute format('drop policy if exists "auth write %1$s" on public.%1$s;', t);
    execute format(
      'create policy "auth write %1$s" on public.%1$s
         for all to authenticated using (true) with check (true);', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- 3b. GRANTS  — let the anon/authenticated roles reach the tables.
--     (RLS above still decides which rows they may actually touch.)
-- ---------------------------------------------------------------------------
grant usage on schema public to anon, authenticated;
grant select on all tables in schema public to anon, authenticated;
grant insert, update, delete on all tables in schema public to authenticated;

-- ---------------------------------------------------------------------------
-- 4. STORAGE  — public "media" bucket for images & other uploads
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "media public read"  on storage.objects;
create policy "media public read" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "media auth insert" on storage.objects;
create policy "media auth insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'media');

drop policy if exists "media auth update" on storage.objects;
create policy "media auth update" on storage.objects
  for update to authenticated using (bucket_id = 'media');

drop policy if exists "media auth delete" on storage.objects;
create policy "media auth delete" on storage.objects
  for delete to authenticated using (bucket_id = 'media');

-- ============================================================================
--  Done. Next: open supabase/seed.sql to load the current site content,
--  or just start adding content from the CMS (admin.html).
-- ============================================================================
