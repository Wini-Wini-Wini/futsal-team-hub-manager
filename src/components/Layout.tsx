
import React from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, Calendar, AlertTriangle, Menu, Plus } from 'lucide-react';

export const Layout: React.FC = () => {
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

  const isCoach = profile?.role === 'coach';
  
  // Determine add button visibility and action based on current route
  const renderAddButton = () => {
    if (!isCoach) return null;
    
    // Different add behaviors based on current route
    let addAction = '';
    let shouldShow = false;
    
    if (location.pathname === '/agenda' || location.pathname === '/') {
      shouldShow = true;
      addAction = '/add';
    } else if (location.pathname === '/announcements') {
      shouldShow = true;
      // Navigate directly to add announcement tab
      addAction = '/add?tab=2'; // Tab index 2 is for announcements
    } else {
      shouldShow = false;
    }
    
    if (!shouldShow) return null;
    
    return (
      <button 
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-futsal-primary text-white text-3xl flex items-center justify-center shadow-lg"
        onClick={() => navigate(addAction)}
      >
        <Plus size={24} />
      </button>
    );
  };

  return (
    <div className="app-container bg-gradient-to-b from-futsal-light to-futsal-secondary flex flex-col">
      <Outlet />
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full max-w-[480px] h-16 bg-white border-t flex justify-around items-center">
        <NavLink to="/" className={getNavLinkClass}>
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
      
      {/* Context-specific Add Button */}
      {renderAddButton()}
    </div>
  );
};
