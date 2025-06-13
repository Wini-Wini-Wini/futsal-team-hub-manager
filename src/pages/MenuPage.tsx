
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut, User, MessageSquare } from 'lucide-react';

const MenuPage: React.FC = () => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isCoach = profile?.role === 'coach';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 font-inter">
      <Header title="Menu" />
      
      <main className="p-6 pb-24 max-w-4xl mx-auto">
        <Card className="bg-gradient-to-br from-white to-purple-50 border-0 shadow-lg mb-6">
          <CardContent className="p-6">
            {/* User Info Section */}
            <div className="flex flex-col items-center space-y-4 mb-8">
              <Avatar className="w-24 h-24">
                <AvatarImage 
                  src={profile?.avatar_url || ''} 
                  alt="Profile picture" 
                />
                <AvatarFallback className="bg-gradient-to-br from-purple-600 to-purple-800 text-white text-2xl font-bold">
                  {profile?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="text-center">
                <h2 className="text-2xl font-bold text-purple-900 mb-1">
                  {profile?.name || 'Usuário'}
                </h2>
                <p className="text-purple-600 font-medium capitalize">
                  {profile?.role === 'coach' ? 'Treinador(a)' : 'Atleta'}
                </p>
              </div>
            </div>
            
            {/* Menu Options */}
            <div className="space-y-4">
              <button 
                className="w-full p-4 flex items-center space-x-3 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors"
                onClick={() => navigate('/profile')}
              >
                <User className="h-5 w-5 text-purple-600" />
                <span className="text-purple-900 font-medium">Informações pessoais</span>
              </button>

              {isCoach && (
                <button 
                  className="w-full p-4 flex items-center space-x-3 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors"
                  onClick={() => navigate('/feedbacks')}
                >
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                  <span className="text-purple-900 font-medium">Ver Feedbacks</span>
                </button>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </main>
    </div>
  );
};

export default MenuPage;
