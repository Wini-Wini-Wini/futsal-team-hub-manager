
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut, UserPlus } from 'lucide-react';

const VisitorProfilePage: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCreateAccount = () => {
    logout();
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 font-inter">
      <Header title="Perfil" />
      
      <main className="p-6 pb-24 max-w-4xl mx-auto">
        <Card className="bg-gradient-to-br from-white to-purple-50 border-0 shadow-lg mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4 mb-8">
              <Avatar className="w-24 h-24">
                <AvatarImage 
                  src="/lovable-uploads/17cdb063-665a-4886-b459-6deb3c3e1035.png" 
                  alt="Visitante" 
                />
                <AvatarFallback className="bg-gradient-to-br from-purple-600 to-purple-800 text-white text-2xl font-bold">
                  V
                </AvatarFallback>
              </Avatar>
              
              <div className="text-center">
                <h2 className="text-2xl font-bold text-purple-900 mb-1">
                  Visitante
                </h2>
                <p className="text-purple-600 font-medium">
                  Modo visitante ativo
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-purple-100 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">
                  Acesso limitado
                </h3>
                <p className="text-purple-700 text-sm">
                  Como visitante, você tem acesso apenas às informações públicas da equipe Female Futsal. 
                  Para ter acesso completo, crie uma conta ou faça login.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <Button
            onClick={handleCreateAccount}
            className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Criar Conta
          </Button>

          <Button
            onClick={handleLogout}
            className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair do modo visitante
          </Button>
        </div>
      </main>
    </div>
  );
};

export default VisitorProfilePage;
