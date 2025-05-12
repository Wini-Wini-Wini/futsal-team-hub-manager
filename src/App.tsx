
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import { Layout } from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import AgendaPage from "./pages/AgendaPage";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import MenuPage from "./pages/MenuPage";
import ProfilePage from "./pages/ProfilePage";
import AddPage from "./pages/AddPage";
import EditGamePage from "./pages/EditGamePage";
import EditTrainingPage from "./pages/EditTrainingPage";
import EditAnnouncementPage from "./pages/EditAnnouncementPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/agenda" element={<AgendaPage />} />
                <Route path="/announcements" element={<AnnouncementsPage />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/add" element={<AddPage />} />
                <Route path="/edit-game/:id" element={<EditGamePage />} />
                <Route path="/edit-training/:id" element={<EditTrainingPage />} />
                <Route path="/edit-announcement/:id" element={<EditAnnouncementPage />} />
              </Route>
              
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </TooltipProvider>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
