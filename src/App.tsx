import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import Machines from "./pages/Machines";
import MachineDetails from "./pages/MachineDetails";
import Maintenance from "./pages/Maintenance";
import Editor from "./pages/Editor";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";
import UsersPage from "./pages/Users";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import UserNow from "./pages/Users";

import { UserProvider, useUser } from "./context/UserContext";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename="/">
          <UserProvider>
            <MainApp />
          </UserProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

const MainApp = () => {
  const { showUser, setShowUser } = useUser();
  const location = useLocation();

  React.useEffect(() => {
    setShowUser(false);
  }, [location, setShowUser]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <AppHeader />
          {showUser && <UserNow />}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/machines" element={<Machines />} />
              <Route path="/machines/:id" element={<MachineDetails />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/editor" element={<Editor />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default App;
