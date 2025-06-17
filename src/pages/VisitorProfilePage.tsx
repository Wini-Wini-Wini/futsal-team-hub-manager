
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Edit } from 'lucide-react';

const VisitorProfilePage: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 font-inter">
      <Header 
        title="Perfil" 
        rightElement={
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/visitor/profile/edit')}
            className="text-white hover:bg-white/20"
          >
            <Edit className="h-5 w-5" />
          </Button>
        }
      />
      
      <div className="p-6 pb-32 max-w-4xl mx-auto">
        <Card className="bg-gradient-to-br from-white to-purple-50 border-0 shadow-lg">
          <CardContent className="p-6">
            {/* Profile Header */}
            <div className="flex flex-col items-center space-y-4 mb-8">
              <Avatar className="w-32 h-32">
                <AvatarImage 
                  src={profile?.avatar_url || ''} 
                  alt="Profile picture" 
                />
                <AvatarFallback className="bg-gradient-to-br from-purple-600 to-purple-800 text-white text-4xl font-bold">
                  {profile?.name?.charAt(0)?.toUpperCase() || 'V'}
                </AvatarFallback>
              </Avatar>
              
              <div className="text-center">
                <h2 className="text-2xl font-bold text-purple-900 mb-1">
                  {profile?.name || 'Visitante'}
                </h2>
                <p className="text-purple-600 font-medium capitalize bg-purple-100 px-3 py-1 rounded-full">
                  Visitante
                </p>
              </div>
            </div>
            
            {/* Profile Information */}
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-2">Informações Pessoais</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-purple-700">Nome Completo</label>
                    <p className="text-purple-900 font-medium">{profile?.name || 'Não informado'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-purple-700">Email</label>
                    <p className="text-purple-900 font-medium">{profile?.email || 'Não informado'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-purple-700">Telefone</label>
                    <p className="text-purple-900 font-medium">{profile?.phone || 'Não informado'}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Sobre o Perfil de Visitante</h3>
                <p className="text-blue-700 text-sm leading-relaxed">
                  Como visitante, você tem acesso aos feeds da equipe, resultados dos jogos e informações 
                  sobre a instituição. Este perfil permite acompanhar as atividades da Female Futsal.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VisitorProfilePage;
