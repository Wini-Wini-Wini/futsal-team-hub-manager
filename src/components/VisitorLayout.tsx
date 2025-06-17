
import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, Info, Menu } from 'lucide-react';

interface VisitorLayoutProps {
  children: React.ReactNode;
}

export const VisitorLayout: React.FC<VisitorLayoutProps> = ({ children }) => {
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
      isActive ? 'text-purple-600 font-semibold' : 'text-gray-600'
    }`;
  };

  return (
    <div className="app-container bg-gradient-to-b from-purple-100 to-purple-200 flex flex-col">
      {children}
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full max-w-[480px] h-16 bg-white border-t flex justify-around items-center">
        <NavLink to="/visitor/home" className={getNavLinkClass}>
          <Home size={24} />
          <span>Home</span>
        </NavLink>
        
        <NavLink to="/visitor/about" className={getNavLinkClass}>
          <Info size={24} />
          <span>Sobre</span>
        </NavLink>
        
        <NavLink to="/visitor/menu" className={getNavLinkClass}>
          <Menu size={24} />
          <span>Menu</span>
        </NavLink>
      </nav>
    </div>
  );
};
