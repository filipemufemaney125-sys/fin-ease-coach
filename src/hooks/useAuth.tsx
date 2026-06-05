import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "delegado" | "assessor" | "gestora" | "user";

interface AuthCtx {
  user: User | null;
  session: Session | null;
  roles: AppRole[];
  isAdmin: boolean;
  isDelegado: boolean;
  isAssessor: boolean;
  isGestora: boolean;
  canSeeAllClients: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>({
  user: null,
  session: null,
  roles: [],
  isAdmin: false,
  isDelegado: false,
  isAssessor: false,
  isGestora: false,
  canSeeAllClients: false,
  loading: true,
  signOut: async () => {},
});

async function loadRoles(userId: string): Promise<AppRole[]> {
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  return (data ?? []).map((r: any) => r.role as AppRole);
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        setTimeout(() => {
          loadRoles(s.user.id).then(setRoles);
        }, 0);
      } else {
        setRoles([]);
      }
    });
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setRoles(await loadRoles(session.user.id));
      }
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthCtx>(() => {
    const isAdmin = roles.includes("admin");
    const isDelegado = roles.includes("delegado");
    const isAssessor = roles.includes("assessor");
    const isGestora = roles.includes("gestora");
    return {
      user,
      session,
      roles,
      isAdmin,
      isDelegado,
      isAssessor,
      isGestora,
      canSeeAllClients: isAdmin || isDelegado || isAssessor,
      loading,
      signOut: async () => {
        await supabase.auth.signOut();
      },
    };
  }, [user, session, roles, loading]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useAuth = () => useContext(Ctx);