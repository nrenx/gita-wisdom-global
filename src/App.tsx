
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Chapters from "./pages/Chapters";
import ChapterDetail from "./pages/ChapterDetail";
import Languages from "./pages/Languages";
import About from "./pages/About";
import Donation from "./pages/Donation";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes with layout */}
            <Route path="/" element={<Layout><Index /></Layout>} />
            <Route path="/chapters" element={<Layout><Chapters /></Layout>} />
            <Route path="/chapter/:chapterNumber" element={<Layout><ChapterDetail /></Layout>} />
            <Route path="/languages" element={<Layout><Languages /></Layout>} />
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/donation" element={<Layout><Donation /></Layout>} />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />
            
            {/* Auth routes (no layout) */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
            
            {/* 404 page */}
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
