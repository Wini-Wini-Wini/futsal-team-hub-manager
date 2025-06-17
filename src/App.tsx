
import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import { Layout } from "./components/Layout";
import { VisitorLayout } from "./components/VisitorLayout";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import AgendaPage from "./pages/AgendaPage";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import MenuPage from "./pages/MenuPage";
import ProfilePage from "./pages/ProfilePage";
import ProfileEditPage from "./pages/ProfileEditPage";
import AddPage from "./pages/AddPage";
import EditGamePage from "./pages/EditGamePage";
import EditTrainingPage from "./pages/EditTrainingPage";
import EditAnnouncementPage from "./pages/EditAnnouncementPage";
import FeedbacksPage from "./pages/FeedbacksPage";
import VisitorHomePage from "./pages/VisitorHomePage";
import AboutPage from "./pages/AboutPage";
import VisitorMenuPage from "./pages/VisitorMenuPage";
import VisitorProfilePage from "./pages/VisitorProfilePage";
import VisitorProfileEditPage from "./pages/VisitorProfileEditPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/home" element={<Layout><HomePage /></Layout>} />
              <Route path="/agenda" element={<Layout><AgendaPage /></Layout>} />
              <Route path="/announcements" element={<Layout><AnnouncementsPage /></Layout>} />
              <Route path="/menu" element={<Layout><MenuPage /></Layout>} />
              <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
              <Route path="/profile/edit" element={<Layout><ProfileEditPage /></Layout>} />
              <Route path="/feedbacks" element={<Layout><FeedbacksPage /></Layout>} />
              <Route path="/add" element={<Layout><AddPage /></Layout>} />
              <Route path="/edit-game/:id" element={<Layout><EditGamePage /></Layout>} />
              <Route path="/edit-training/:id" element={<Layout><EditTrainingPage /></Layout>} />
              <Route path="/edit-announcement/:id" element={<Layout><EditAnnouncementPage /></Layout>} />
              
              {/* Visitor Routes */}
              <Route path="/visitor/home" element={<VisitorLayout><VisitorHomePage /></VisitorLayout>} />
              <Route path="/visitor/about" element={<VisitorLayout><AboutPage /></VisitorLayout>} />
              <Route path="/visitor/menu" element={<VisitorLayout><VisitorMenuPage /></VisitorLayout>} />
              <Route path="/visitor/profile" element={<VisitorLayout><VisitorProfilePage /></VisitorLayout>} />
              <Route path="/visitor/profile/edit" element={<VisitorLayout><VisitorProfileEditPage /></VisitorLayout>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
