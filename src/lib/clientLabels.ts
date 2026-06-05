export const CLIENT_TYPES = [
  { value: "privado", label: "Privado" },
  { value: "estado", label: "Estado" },
  { value: "empresa_publica", label: "Empresa Pública" },
  { value: "pme", label: "PME" },
  { value: "ong", label: "ONG" },
  { value: "singular", label: "Singular" },
] as const;

export const CLIENT_STATUSES = [
  { value: "ativo", label: "Ativo" },
  { value: "inativo", label: "Inativo" },
  { value: "suspenso", label: "Suspenso" },
] as const;

export const ROLE_LABELS: Record<string, string> = {
  admin: "Administrador",
  delegado: "Delegado",
  assessor: "Assessor",
  gestora: "Gestora",
  user: "Utilizador",
};

export function clientTypeLabel(v: string) {
  return CLIENT_TYPES.find((t) => t.value === v)?.label ?? v;
}
export function clientStatusLabel(v: string) {
  return CLIENT_STATUSES.find((t) => t.value === v)?.label ?? v;
}