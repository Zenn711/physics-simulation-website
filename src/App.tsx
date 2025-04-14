
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { applyProjectileSimulationFix } from "./utils/projectileSimulationPatch";

// Configure React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60000,
    },
  },
});

const App = () => {
  // Enforce dark mode on initial render and after any changes
  useEffect(() => {
    // Always enforce dark mode
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    
    // Set a dark mode attribute that our CSS can use
    document.documentElement.setAttribute('data-mode', 'dark');
    
    // Apply the patch for ProjectileSimulation
    applyProjectileSimulationFix();
    
    // Persist dark mode preference
    localStorage.setItem('theme', 'dark');
    
    // Check theme preference periodically to ensure it stays in dark mode
    const intervalId = setInterval(() => {
      if (!document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.add('dark');
      }
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/simulation" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
