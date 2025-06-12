import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import AgendaPage from './pages/AgendaPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import MenuPage from './pages/MenuPage';
import ProfilePage from './pages/ProfilePage';
import ProfileEditPage from './pages/ProfileEditPage';
import AddPage from './pages/AddPage';
import EditGamePage from './pages/EditGamePage';
import EditTrainingPage from './pages/EditTrainingPage';
import EditAnnouncementPage from './pages/EditAnnouncementPage';
import NotFound from './pages/NotFoundPage';
import Layout from './components/Layout';
import Index from './pages/Index';
import { Toaster } from "@/components/ui/toaster"
import { QueryClient } from 'react-query';

function App() {
  return (
    <QueryClient>
      <AuthProvider>
        <DataProvider>
          <Toaster />
          <Router>
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
              <Route path="/add" element={<Layout><AddPage /></Layout>} />
              <Route path="/edit-game/:id" element={<Layout><EditGamePage /></Layout>} />
              <Route path="/edit-training/:id" element={<Layout><EditTrainingPage /></Layout>} />
              <Route path="/edit-announcement/:id" element={<Layout><EditAnnouncementPage /></Layout>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </DataProvider>
      </AuthProvider>
    </QueryClient>
  );
}

export default App;
