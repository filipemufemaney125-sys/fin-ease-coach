
-- Client enums
DO $$ BEGIN
  CREATE TYPE public.client_type AS ENUM ('privado','estado','empresa_publica','pme','ong','singular');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.client_status AS ENUM ('ativo','inativo','suspenso');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  employee_number text,
  email text NOT NULL,
  photo_url text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiles viewable by authenticated" ON public.profiles;
CREATE POLICY "Profiles viewable by authenticated"
  ON public.profiles FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "Admins update any profile" ON public.profiles;
CREATE POLICY "Admins update any profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Clients
CREATE TABLE IF NOT EXISTS public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gaia_number text,
  bscs_code text,
  nuit text,
  name text NOT NULL,
  client_type public.client_type NOT NULL DEFAULT 'privado',
  platform text,
  status public.client_status NOT NULL DEFAULT 'ativo',
  acquisition_date date,
  contact_name text,
  contact_email text,
  contact_phone text,
  address text,
  notes text,
  manager_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS clients_manager_id_idx ON public.clients(manager_id);
CREATE INDEX IF NOT EXISTS clients_name_idx ON public.clients(name);
CREATE INDEX IF NOT EXISTS clients_nuit_idx ON public.clients(nuit);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.clients TO authenticated;
GRANT ALL ON public.clients TO service_role;

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff read all clients" ON public.clients;
CREATE POLICY "Staff read all clients"
  ON public.clients FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin'::public.app_role)
    OR public.has_role(auth.uid(), 'delegado'::public.app_role)
    OR public.has_role(auth.uid(), 'assessor'::public.app_role)
  );

DROP POLICY IF EXISTS "Manager reads own clients" ON public.clients;
CREATE POLICY "Manager reads own clients"
  ON public.clients FOR SELECT TO authenticated
  USING (manager_id = auth.uid());

DROP POLICY IF EXISTS "Admins insert clients" ON public.clients;
CREATE POLICY "Admins insert clients"
  ON public.clients FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Managers insert own clients" ON public.clients;
CREATE POLICY "Managers insert own clients"
  ON public.clients FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'gestora'::public.app_role) AND manager_id = auth.uid());

DROP POLICY IF EXISTS "Admins update any client" ON public.clients;
CREATE POLICY "Admins update any client"
  ON public.clients FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Manager updates own clients" ON public.clients;
CREATE POLICY "Manager updates own clients"
  ON public.clients FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'gestora'::public.app_role) AND manager_id = auth.uid())
  WITH CHECK (public.has_role(auth.uid(), 'gestora'::public.app_role) AND manager_id = auth.uid());

DROP POLICY IF EXISTS "Admins delete clients" ON public.clients;
CREATE POLICY "Admins delete clients"
  ON public.clients FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP TRIGGER IF EXISTS clients_updated_at ON public.clients;
CREATE TRIGGER clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- New-user trigger
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;

  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'gestora');
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();
