
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, Info, User } from 'lucide-react';

interface VisitorLayoutProps {
  children: React.ReactNode;
}

export const VisitorLayout: React.FC<VisitorLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { isVisitor } = useAuth();

  React.useEffect(() => {
    if (!isVisitor) {
      navigate('/login');
    }
  }, [isVisitor, navigate]);

  if (!isVisitor) return null;

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) => {
    return `flex flex-col items-center justify-center text-sm ${
      isActive ? 'text-futsal-primary font-semibold' : 'text-gray-600'
    }`;
  };

  return (
    <div className="app-container bg-gradient-to-b from-futsal-light to-futsal-secondary flex flex-col">
      {children}
      
      {/* Bottom Navigation for Visitors */}
      <nav className="fixed bottom-0 w-full max-w-[480px] h-16 bg-white border-t flex justify-around items-center">
        <NavLink to="/visitor-home" className={getNavLinkClass}>
          <Home size={24} />
          <span>Home</span>
        </NavLink>
        
        <NavLink to="/about" className={getNavLinkClass}>
          <Info size={24} />
          <span>Sobre</span>
        </NavLink>
        
        <NavLink to="/visitor-profile" className={getNavLinkClass}>
          <User size={24} />
          <span>Perfil</span>
        </NavLink>
      </nav>
    </div>
  );
};
