
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { LogOut, User } from 'lucide-react';

const MenuPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const isCoach = user?.role === 'coach';

  return (
    <div className="flex-1 pb-20">
      <Header title="Menu" />
      
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
          {/* User Info Section */}
          <div className="bg-futsal-primary p-6 text-center text-white">
            <div className="w-24 h-24 rounded-full bg-white text-futsal-primary mx-auto flex items-center justify-center mb-3">
              <User size={48} />
            </div>
            <h2 className="text-xl font-bold">
              {user?.role === 'coach' ? 'Treinador(a)' : user?.name || 'Atleta'}
            </h2>
          </div>
          
          {/* Menu Options */}
          <div className="divide-y">
            <button 
              className="w-full p-4 text-left flex items-center hover:bg-gray-50"
              onClick={() => navigate('/profile')}
            >
              <User size={20} className="mr-3 text-futsal-primary" />
              <span>Informações pessoais</span>
            </button>
            
            {isCoach && (
              <button 
                className="w-full p-4 text-left flex items-center hover:bg-gray-50"
                onClick={() => navigate('/team')}
              >
                <span className="mr-3">👥</span>
                <span>Gerenciar Equipe</span>
              </button>
            )}
            
            {isCoach && (
              <button 
                className="w-full p-4 text-left flex items-center hover:bg-gray-50"
                onClick={() => navigate('/statistics')}
              >
                <span className="mr-3">📊</span>
                <span>Estatísticas</span>
              </button>
            )}
          </div>
        </div>
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg flex items-center justify-center"
        >
          <LogOut size={20} className="mr-2" />
          Sair
        </button>
      </div>
    </div>
  );
};

export default MenuPage;
