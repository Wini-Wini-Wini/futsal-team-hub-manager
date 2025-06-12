
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Header from '@/components/Header';
import { Edit, Mail, Phone, User, Shield } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <Header 
        title="Meu Perfil" 
        showBackButton={true}
        showHomeButton={true} 
      />
      
      <main className="p-6 pb-32">
        <Card className="bg-gradient-to-br from-white to-purple-50 border-0 shadow-lg">
          <CardContent className="p-6">
            {/* Profile Header */}
            <div className="flex flex-col items-center space-y-4 mb-8">
              <Avatar className="w-24 h-24">
                <AvatarImage 
                  src={profile?.avatar_url || ''} 
                  alt="Profile picture" 
                />
                <AvatarFallback className="bg-gradient-to-br from-purple-600 to-purple-800 text-white text-2xl font-bold">
                  {profile?.name?.charAt(0) || '?'}
                </AvatarFallback>
              </Avatar>
              
              <div className="text-center">
                <h2 className="text-2xl font-bold text-purple-900 mb-1">
                  {profile?.name || 'Nome não informado'}
                </h2>
                <p className="text-purple-600 font-medium capitalize">
                  {profile?.role === 'coach' ? 'Treinador(a)' : 'Atleta'}
                </p>
              </div>
              
              <Button
                onClick={() => navigate('/profile/edit')}
                className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white"
              >
                <Edit className="mr-2 h-4 w-4" />
                Editar Perfil
              </Button>
            </div>

            {/* Profile Information */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-purple-100 rounded-lg">
                <User className="h-5 w-5 text-purple-600" />
                <div className="flex-1">
                  <p className="text-sm text-purple-600 font-medium">Nome Completo</p>
                  <p className="text-purple-900 font-semibold">
                    {profile?.name || 'Não informado'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-purple-100 rounded-lg">
                <Mail className="h-5 w-5 text-purple-600" />
                <div className="flex-1">
                  <p className="text-sm text-purple-600 font-medium">Email</p>
                  <p className="text-purple-900 font-semibold">
                    {profile?.email || 'Não informado'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-purple-100 rounded-lg">
                <Phone className="h-5 w-5 text-purple-600" />
                <div className="flex-1">
                  <p className="text-sm text-purple-600 font-medium">Telefone</p>
                  <p className="text-purple-900 font-semibold">
                    {profile?.phone || 'Não informado'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-purple-100 rounded-lg">
                <Shield className="h-5 w-5 text-purple-600" />
                <div className="flex-1">
                  <p className="text-sm text-purple-600 font-medium">Função</p>
                  <p className="text-purple-900 font-semibold capitalize">
                    {profile?.role === 'coach' ? 'Treinador(a)' : 'Atleta'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ProfilePage;
