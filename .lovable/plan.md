## Goal
Turn NextGen Moz into a production-ready publication with newsletter, dynamic articles from DB, admin CRUD, functional contact form, and SEO/AdSense polish.

## Scope & Approach

### 1. Database (Lovable Cloud)
- `categories` (slug, name, description) — public read, admin write
- `articles` (slug, title, excerpt, content, cover_url, category_id, author, published, published_at, tags[], seo_title, seo_description) — public read where `published=true`, admin write
- `newsletter_subscribers` (email unique, status, created_at) — public insert only, admin read
- `contact_messages` (name, email, message, created_at) — public insert, admin read
- `user_roles` + `app_role` enum + `has_role()` security-definer function (admin role pattern)
- Storage bucket `article-images` (public) with admin-only write
- Seed categories + migrate the 6 hardcoded posts into DB

### 2. Authentication
- Email/password signup + login at `/auth`
- First user can self-promote to admin via a one-time bootstrap (or via a simple "claim admin if no admin exists" rule in trigger)
- Protected `/admin/*` routes via `has_role(uid, 'admin')`

### 3. Newsletter
- "Subscribe" modal triggered from header/footer/Newsletter section
- Edge function `subscribe-newsletter` validates + inserts (handles duplicates gracefully)
- Toast feedback, loading state, success animation

### 4. Articles
- Refactor `Blog`, `BlogPost`, `Category`, `FeaturedArticles` to fetch from Supabase (replace `src/data/posts.ts` usage)
- Keep search + category filtering, related posts, reading time calc
- Dynamic SEO per article (title/description/OG via react-helmet-async)

### 5. Admin Dashboard (`/admin`)
- Articles list with create/edit/delete
- Rich-ish editor (textarea + markdown preview, image upload to bucket)
- Categories manager
- Newsletter subscribers list (read-only export view)
- Contact messages inbox

### 6. Contact form
- Edge function `submit-contact` inserts into `contact_messages`
- Validation (zod), rate-limit friendly, toast feedback

### 7. SEO / AdSense
- Add `react-helmet-async` provider + per-route SEO via existing `SEO` component (extend with OG image, canonical, JSON-LD Article)
- Generate sitemap (script + `predev`/`prebuild`) listing static routes + DB articles
- `robots.txt` already exists — keep
- Ad placement slots (`<AdSlot>` placeholder component) in sidebar, mid-article, footer area

### 8. UX polish
- Loading skeletons on Blog/BlogPost
- Smooth fade-in animations (already have utilities)
- Fix nav links, mobile menu check

## Out of scope (call out)
- Actual sending of emails (SMTP/Resend) — we store newsletter + contact in DB; can add Lovable Emails later if requested
- Rich text editor (Tiptap) — using markdown textarea to keep scope sane
- The existing AI Generator stays as-is (already functional)

## Technical notes
- New deps: `react-helmet-async` (SEO), `@uiw/react-md-editor` optional — will use plain textarea + react-markdown to avoid heavy deps
- Migration is large but single — one approval
- Will seed existing 6 posts into DB so site looks identical day one

## Confirmation needed
This is a large build (~15-20 files + migration + 2 edge functions). Want me to proceed with everything above, or split into phases (e.g., Phase 1: DB + newsletter + contact + SEO; Phase 2: Admin dashboard)?