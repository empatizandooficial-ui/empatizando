import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { CookieConsent } from "./components/CookieConsent";
import { AdminLayout } from "./components/AdminLayout";
import { CartProvider } from "./contexts/CartContext";
import { CartDrawer } from "./components/CartDrawer";

const Index = lazy(() => import("./pages/Index"));
const Portal = lazy(() => import("./pages/Portal"));
const AdminHub = lazy(() => import("./pages/AdminHub"));
const AdminSettings = lazy(() => import("./pages/AdminSettings"));
const AdminAutomation = lazy(() => import("./pages/AdminAutomation"));
const AdminLibrarian = lazy(() => import("./pages/AdminLibrarian"));
const AdminStudio = lazy(() => import("./pages/AdminStudio"));
const AdminHermes = lazy(() => import("./pages/AdminHermes"));
const AdminAgents = lazy(() => import("./pages/AdminAgents"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminCRM = lazy(() => import("./pages/AdminCRM"));
const AdminProfessionals = lazy(() => import("./pages/AdminProfessionals"));
const AdminProducts = lazy(() => import("./pages/AdminProducts"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Anamnese = lazy(() => import("./pages/Anamnese"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfUse = lazy(() => import("./pages/TermsOfUse"));
const ForSpecialists = lazy(() => import("./pages/ForSpecialists"));
const SpecialistPortal = lazy(() => import("./pages/SpecialistPortal"));
const Store = lazy(() => import("./pages/Store"));
const AffiliateSignup = lazy(() => import("./pages/AffiliateSignup"));
const AffiliatePortal = lazy(() => import("./pages/AffiliatePortal"));
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
      <Sonner />
      <CookieConsent />
      <CartDrawer />
      <BrowserRouter>
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/portal" element={<Portal />} />
            <Route path="/anamnese" element={<Anamnese />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-use" element={<TermsOfUse />} />
            <Route path="/login" element={<Login />} />
            <Route path="/loja" element={<Store />} />
            <Route path="/afiliados/cadastro" element={<AffiliateSignup />} />
            <Route path="/afiliados/portal" element={
              <ProtectedRoute>
                <AffiliatePortal />
              </ProtectedRoute>
            } />
            <Route path="/especialista" element={<ForSpecialists />} />
            <Route path="/portal-especialista" element={
              <ProtectedRoute>
                <SpecialistPortal />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/crm" element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminCRM />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/professionals" element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminProfessionals />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminSettings />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/automation" element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminAutomation />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/librarian" element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminLibrarian />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/studio" element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminStudio />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/hermes" element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminHermes />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/agents" element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminAgents />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/products" element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminProducts />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
