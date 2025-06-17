
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, profile } = useAuth();

  useEffect(() => {
    if (isAuthenticated && profile) {
      // Redirect based on user role
      if (profile.role === 'visitor') {
        navigate('/visitor/home');
      } else {
        navigate('/home');
      }
    } else if (isAuthenticated && !profile) {
      // Wait for profile to load
      return;
    } else {
      navigate('/login');
    }
  }, [isAuthenticated, profile, navigate]);

  // Show loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-xl">Carregando...</p>
      </div>
    </div>
  );
};

export default Index;
