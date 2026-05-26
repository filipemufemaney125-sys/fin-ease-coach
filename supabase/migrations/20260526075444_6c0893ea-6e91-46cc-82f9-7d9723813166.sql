
-- =====================================================
-- ROLES
-- =====================================================
create type public.app_role as enum ('admin', 'editor', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create policy "Users view own roles" on public.user_roles
  for select using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));
create policy "Admins manage roles" on public.user_roles
  for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- First user becomes admin automatically
create or replace function public.handle_new_user_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  else
    insert into public.user_roles (user_id, role) values (new.id, 'user');
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user_role();

-- =====================================================
-- TIMESTAMPS HELPER
-- =====================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

-- =====================================================
-- CATEGORIES
-- =====================================================
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.categories enable row level security;

create policy "Categories public read" on public.categories for select using (true);
create policy "Admins manage categories" on public.categories for all
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create trigger trg_categories_updated
  before update on public.categories
  for each row execute function public.set_updated_at();

-- =====================================================
-- ARTICLES
-- =====================================================
create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content text not null default '',
  cover_url text,
  category_id uuid references public.categories(id) on delete set null,
  author text not null default 'NextGen Editorial',
  tags text[] not null default '{}',
  seo_title text,
  seo_description text,
  published boolean not null default false,
  published_at timestamptz,
  reading_minutes int not null default 5,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index articles_category_idx on public.articles(category_id);
create index articles_published_idx on public.articles(published, published_at desc);

alter table public.articles enable row level security;

create policy "Published articles public read" on public.articles
  for select using (published = true);
create policy "Admins read all articles" on public.articles
  for select using (public.has_role(auth.uid(), 'admin'));
create policy "Admins insert articles" on public.articles
  for insert with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins update articles" on public.articles
  for update using (public.has_role(auth.uid(), 'admin'));
create policy "Admins delete articles" on public.articles
  for delete using (public.has_role(auth.uid(), 'admin'));

create trigger trg_articles_updated
  before update on public.articles
  for each row execute function public.set_updated_at();

-- =====================================================
-- NEWSLETTER
-- =====================================================
create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  status text not null default 'active',
  source text,
  created_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

create policy "Anyone can subscribe" on public.newsletter_subscribers
  for insert with check (true);
create policy "Admins view subscribers" on public.newsletter_subscribers
  for select using (public.has_role(auth.uid(), 'admin'));
create policy "Admins manage subscribers" on public.newsletter_subscribers
  for delete using (public.has_role(auth.uid(), 'admin'));

-- =====================================================
-- CONTACT MESSAGES
-- =====================================================
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  handled boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

create policy "Anyone can submit contact" on public.contact_messages
  for insert with check (true);
create policy "Admins read contact" on public.contact_messages
  for select using (public.has_role(auth.uid(), 'admin'));
create policy "Admins update contact" on public.contact_messages
  for update using (public.has_role(auth.uid(), 'admin'));
create policy "Admins delete contact" on public.contact_messages
  for delete using (public.has_role(auth.uid(), 'admin'));

-- =====================================================
-- STORAGE BUCKET
-- =====================================================
insert into storage.buckets (id, name, public)
values ('article-images', 'article-images', true);

create policy "Public read article images" on storage.objects
  for select using (bucket_id = 'article-images');
create policy "Admins upload article images" on storage.objects
  for insert with check (bucket_id = 'article-images' and public.has_role(auth.uid(), 'admin'));
create policy "Admins update article images" on storage.objects
  for update using (bucket_id = 'article-images' and public.has_role(auth.uid(), 'admin'));
create policy "Admins delete article images" on storage.objects
  for delete using (bucket_id = 'article-images' and public.has_role(auth.uid(), 'admin'));

-- =====================================================
-- SEEDS
-- =====================================================
insert into public.categories (slug, name, description, sort_order) values
  ('ai-tools', 'AI Tools', 'The most powerful AI tools, reviewed.', 1),
  ('technology', 'Technology', 'Tech that matters in the next decade.', 2),
  ('trading', 'Trading', 'Markets, strategy, and AI-driven edge.', 3),
  ('digital-money', 'Digital Money', 'Crypto, fintech and the new economy.', 4),
  ('tutorials', 'Tutorials', 'Hands-on guides for builders and operators.', 5),
  ('opportunities', 'Opportunities', 'Real ways to earn online in the AI era.', 6);

insert into public.articles (slug, title, excerpt, content, category_id, tags, published, published_at, reading_minutes)
select
  v.slug, v.title, v.excerpt, v.content, c.id, v.tags, true, now() - (v.days || ' days')::interval, v.minutes
from (values
  ('best-ai-tools-2026','The 10 Best AI Tools Redefining Productivity in 2026','From writing assistants to autonomous agents, these AI tools are quietly reshaping how modern teams build, sell, and ship.',
$$## A new era of intelligent software

Artificial intelligence has moved from novelty to infrastructure. In 2026, the best teams are not the ones with the most tools — they are the ones with the right ones.

## 1. Conversational copilots

Modern copilots no longer just answer questions; they act.

## 2. Autonomous research agents

Instead of searching for hours, you brief an agent and receive a structured report.

## Final thoughts

The winners of this cycle will be the operators who combine taste with leverage.$$,
   'ai-tools', array['AI','Productivity','Tools'], 14, 8),
  ('ai-trading-strategies','How AI Is Quietly Rewriting the Rules of Modern Trading','Quantitative funds have used machine learning for years. Today, the same edge is reaching retail traders.',
$$## From quants to everyone

The institutional edge of pattern recognition is becoming accessible.

## Risk first, returns later

AI excels at modelling tail events and adjusting position sizing in real time.$$,
   'trading', array['Trading','AI','Markets'], 21, 6),
  ('ultimate-productivity-stack','The Ultimate Productivity Stack for Modern Knowledge Workers','A quiet, deliberate setup beats a noisy, bloated one.',
$$## Less, but better

The most productive operators of 2026 use fewer apps, not more.

## Capture, process, execute

Every effective system has three layers.$$,
   'tutorials', array['Productivity','Tools','Workflow'], 28, 7),
  ('digital-money-guide','Digital Money in 2026: A Beginner''s Guide That Actually Helps','Stablecoins, custodial wallets, on-chain identity — cut through the noise.',
$$## The simple mental model

Think of digital money as programmable cash.

## Practical first steps

Open a reputable wallet, move a small amount, and learn by doing.$$,
   'digital-money', array['Crypto','Fintech','Beginner'], 35, 9),
  ('future-of-work-ai','The Future of Work Is Human-AI Collaboration, Not Replacement','A new class of operators working side-by-side with intelligent systems.',
$$## Augmentation, not replacement

The jobs being transformed are not disappearing — they are being rebuilt around AI leverage.$$,
   'technology', array['AI','Future of Work','Careers'], 42, 5),
  ('online-earning-opportunities','Real Online Opportunities to Earn Income in 2026','Forget the gurus. Real, durable ways to build digital income.',
$$## Skill stacking beats hustle

The most reliable online income comes from compounding two or three skills.

## Build in public

Distribution is the new moat.$$,
   'opportunities', array['Side Hustle','Online Income','Remote Work'], 54, 6)
) as v(slug, title, excerpt, content, cat_slug, tags, days, minutes)
join public.categories c on c.slug = v.cat_slug;
