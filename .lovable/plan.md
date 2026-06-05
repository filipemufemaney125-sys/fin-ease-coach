## Fase 1 — Fundação do TMCEL CRM

Sem cores oficiais fornecidas, assumo a paleta corporativa TMCEL: **vermelho `#E30613`** como primária, branco e cinzentos. Pode trocar depois.

### O que entrego nesta fase

1. **Limpeza do projeto**
   - Remover todas as páginas/componentes do NextGen Moz (blog, AI Generator, admin antigo, newsletter, etc.).
   - Manter Supabase, mas com schema novo (tabelas do blog continuam — não as apago, só deixam de ser usadas).

2. **Identidade visual TMCEL**
   - Design system semântico no `index.css` + `tailwind.config.ts`: vermelho TMCEL, brancos, cinzentos claros, tokens para sidebar, cards, status (verde/âmbar/vermelho para KPIs).
   - Tipografia limpa estilo CRM corporativo (Inter).
   - Layout mobile-first com sidebar colapsável em desktop e bottom-nav em telemóvel.

3. **Autenticação + perfis**
   - Login email/password + recuperação de senha (`/login`, `/reset-password`).
   - Tabela `profiles` (nome, número trabalhador, fotografia, email, estado).
   - Enum `app_role`: `admin`, `delegado`, `assessor`, `gestora`.
   - Tabela `user_roles` + função `has_role` (padrão seguro, sem recursão).
   - Trigger que cria profile + role `gestora` por defeito ao registar; primeiro utilizador vira `admin`.
   - Guards de rota por perfil.

4. **Gestão de Clientes (módulo completo)**
   - Tabela `clients` com todos os campos pedidos: nº Gaia, código BSCS, NUIT, nome, tipo (enum: privado, estado, empresa_publica, pme, ong, singular), plataforma, estado, data de angariação, contactos, gestora atribuída.
   - Páginas: lista (`/clientes`) com pesquisa + filtros, criar, editar, ver detalhe, eliminar.
   - RLS: `gestora` vê só os seus clientes; `admin`/`delegado`/`assessor` veem todos. Só `admin` e a gestora dona podem editar.

5. **Dashboard inicial (`/`)**
   - Cards: total de clientes, novos no ano, clientes ativos, clientes inativos.
   - Gráfico simples de novos clientes por mês (Recharts).
   - Os KPIs financeiros (receita, dívida, cobrança) aparecem na Fase 2 quando existirem as tabelas.

6. **PWA**
   - `manifest.webmanifest`, theme-color vermelho TMCEL, ícones, instalável no telemóvel. Sem service worker / offline (só quando pedir).

7. **Layout principal**
   - Sidebar com itens já no menu mas marcados "Em breve" para módulos da Fase 2+ (Serviços, Carteiras, Faturação, Dívidas, Cobranças, Relatórios, Utilizadores, Auditoria, Configurações).
   - Top bar com perfil + logout + pesquisa global (UI por agora; backend de pesquisa entra na Fase 2).

### Fases seguintes (não entregam nesta iteração)

- **Fase 2:** Serviços + `client_services` + Faturação + Dívidas + Cobranças + KPIs financeiros + Aging.
- **Fase 3:** Carteiras + transferências + modo férias + Gestão de Utilizadores (admin) + Metas.
- **Fase 4:** Relatórios (PDF/Excel/Word) + Auditoria completa + Pesquisa global + Classificação de pagadores.

### Detalhes técnicos

- **Stack:** React + TS + Vite + Tailwind + shadcn (já instalado) + Recharts + react-router + Lovable Cloud (Supabase).
- **Tabelas criadas nesta fase:** `profiles`, `user_roles`, `clients`. Enums: `app_role`, `client_type`, `client_status`.
- **RLS:** activado em todas; políticas por papel via `has_role`. Política restritiva já corrigida para impedir auto-promoção a admin (já feito na iteração anterior).
- **Storage:** bucket `avatars` (público) para fotos de utilizador.
- **Rotas principais:**
  ```text
  /login                /reset-password
  /                     dashboard
  /clientes             lista + filtros
  /clientes/novo
  /clientes/:id         detalhe/editar
  /perfil               perfil do utilizador
  ```

Confirmo e avanço com a Fase 1?