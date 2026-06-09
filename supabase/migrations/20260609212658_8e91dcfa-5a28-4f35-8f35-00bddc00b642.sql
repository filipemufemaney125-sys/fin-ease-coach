
DROP POLICY IF EXISTS "Profiles viewable by authenticated" ON public.profiles;
CREATE POLICY "Users view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Anyone can submit contact" ON public.contact_messages;
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter_subscribers;
