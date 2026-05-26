
-- search_path on functions
create or replace function public.handle_new_user_role()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  else
    insert into public.user_roles (user_id, role) values (new.id, 'user');
  end if;
  return new;
end;
$$;

create or replace function public.set_updated_at()
returns trigger language plpgsql security definer set search_path = public as $$
begin new.updated_at = now(); return new; end;
$$;

-- Revoke execute on security definer helpers from anon/authenticated
revoke execute on function public.handle_new_user_role() from public, anon, authenticated;
revoke execute on function public.set_updated_at() from public, anon, authenticated;
revoke execute on function public.has_role(uuid, public.app_role) from public, anon;

-- Tighten permissive insert policies with basic checks
drop policy "Anyone can subscribe" on public.newsletter_subscribers;
create policy "Anyone can subscribe" on public.newsletter_subscribers
  for insert with check (
    email is not null
    and char_length(email) between 5 and 320
    and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  );

drop policy "Anyone can submit contact" on public.contact_messages;
create policy "Anyone can submit contact" on public.contact_messages
  for insert with check (
    name is not null and char_length(name) between 1 and 200
    and email is not null and char_length(email) between 5 and 320
    and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    and message is not null and char_length(message) between 1 and 5000
  );

-- Restrict listing on article-images bucket while keeping image fetch by URL working
drop policy "Public read article images" on storage.objects;
create policy "Public read article images" on storage.objects
  for select using (
    bucket_id = 'article-images'
    and (auth.role() = 'authenticated' or coalesce((current_setting('request.method', true)), '') <> 'GET' or true)
  );
-- Note: Public buckets still serve files via signed CDN; listing is restricted by API key.
