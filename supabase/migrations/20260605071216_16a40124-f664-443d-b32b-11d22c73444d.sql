
-- 1) Fix privilege escalation on user_roles
-- Replace the broad ALL policy with explicit per-command admin policies
DROP POLICY IF EXISTS "Admins manage roles" ON public.user_roles;

CREATE POLICY "Admins insert roles"
  ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update roles"
  ON public.user_roles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete roles"
  ON public.user_roles FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 2) Fix article-images storage policy: remove `OR true`
DROP POLICY IF EXISTS "Public read article images" ON storage.objects;

CREATE POLICY "Public read article images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'article-images');
