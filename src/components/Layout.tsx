
import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, Calendar, AlertTriangle, Menu } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, profile } = useAuth();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) => {
    return `flex flex-col items-center justify-center text-sm ${
      isActive ? 'text-futsal-primary font-semibold' : 'text-gray-600'
    }`;
  };

  return (
    <div className="app-container bg-gradient-to-b from-futsal-light to-futsal-secondary flex flex-col">
      {children}
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full max-w-[480px] h-16 bg-white border-t flex justify-around items-center">
        <NavLink to="/home" className={getNavLinkClass}>
          <Home size={24} />
          <span>Home</span>
        </NavLink>
        
        <NavLink to="/agenda" className={getNavLinkClass}>
          <Calendar size={24} />
          <span>Agenda</span>
        </NavLink>
        
        <NavLink to="/announcements" className={getNavLinkClass}>
          <AlertTriangle size={24} />
          <span>Avisos</span>
        </NavLink>
        
        <NavLink to="/menu" className={getNavLinkClass}>
          <Menu size={24} />
          <span>Menu</span>
        </NavLink>
      </nav>
    </div>
  );
};
