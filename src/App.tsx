import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppShell from "@/components/AppShell";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import ClientForm from "./pages/ClientForm";
import ClientDetail from "./pages/ClientDetail";
import Profile from "./pages/Profile";
import Placeholder from "./pages/Placeholder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              element={
                <ProtectedRoute>
                  <AppShell />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Dashboard />} />
              <Route path="/clientes" element={<Clients />} />
              <Route path="/clientes/novo" element={<ClientForm />} />
              <Route path="/clientes/:id" element={<ClientDetail />} />
              <Route path="/clientes/:id/editar" element={<ClientForm />} />
              <Route path="/perfil" element={<Profile />} />
              <Route path="/servicos" element={<Placeholder title="Serviços" />} />
              <Route path="/carteiras" element={<Placeholder title="Carteiras" />} />
              <Route path="/faturacao" element={<Placeholder title="Faturação" />} />
              <Route path="/dividas" element={<Placeholder title="Dívidas" />} />
              <Route path="/cobrancas" element={<Placeholder title="Cobranças" />} />
              <Route path="/relatorios" element={<Placeholder title="Relatórios" />} />
              <Route path="/utilizadores" element={<Placeholder title="Utilizadores" />} />
              <Route path="/auditoria" element={<Placeholder title="Auditoria" />} />
              <Route path="/configuracoes" element={<Placeholder title="Configurações" />} />
            </Route>
            <Route path="/auth" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
