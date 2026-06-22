import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Index = lazy(() => import("./pages/Index"));
const Portal = lazy(() => import("./pages/Portal"));
const AdminHub = lazy(() => import("./pages/AdminHub"));
const AdminSettings = lazy(() => import("./pages/AdminSettings"));
const AdminAutomation = lazy(() => import("./pages/AdminAutomation"));
const AdminLibrarian = lazy(() => import("./pages/AdminLibrarian"));
const AdminStudio = lazy(() => import("./pages/AdminStudio"));
const AdminHermes = lazy(() => import("./pages/AdminHermes"));
const AdminAgents = lazy(() => import("./pages/AdminAgents"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Anamnese = lazy(() => import("./pages/Anamnese"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfUse = lazy(() => import("./pages/TermsOfUse"));
import { ProtectedRoute } from "./components/ProtectedRoute";
import { CookieConsent } from "./components/CookieConsent";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CookieConsent />
      <BrowserRouter>
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/portal" element={<Portal />} />
            <Route path="/anamnese" element={<Anamnese />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-use" element={<TermsOfUse />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminHub />
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute>
                <AdminSettings />
              </ProtectedRoute>
            } />
            <Route path="/admin/automation" element={
              <ProtectedRoute>
                <AdminAutomation />
              </ProtectedRoute>
            } />
            <Route path="/admin/librarian" element={
              <ProtectedRoute>
                <AdminLibrarian />
              </ProtectedRoute>
            } />
            <Route path="/admin/studio" element={
              <ProtectedRoute>
                <AdminStudio />
              </ProtectedRoute>
            } />
            <Route path="/admin/hermes" element={
              <ProtectedRoute>
                <AdminHermes />
              </ProtectedRoute>
            } />
            <Route path="/admin/agents" element={
              <ProtectedRoute>
                <AdminAgents />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
