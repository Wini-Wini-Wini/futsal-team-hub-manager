import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Header from '@/components/Header';
import { Edit, Mail, Phone, User, Shield, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Feedback {
  id: string;
  comment: string;
  rating: number;
  created_at: string;
  target_type: string;
  target_id: string;
  user_id: string;
  profiles?: {
    name: string;
  };
}

const ProfilePage: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  const isCoach = profile?.role === 'coach';

  useEffect(() => {
    if (isCoach) {
      fetchFeedbacks();
    } else {
      setLoading(false);
    }
  }, [isCoach]);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      // Buscar feedback e depois buscar os perfis dos usuários separadamente
      const { data: feedbackData, error: feedbackError } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (feedbackError) throw feedbackError;

      if (feedbackData && feedbackData.length > 0) {
        // Buscar os perfis dos usuários que fizeram feedback
        const userIds = [...new Set(feedbackData.map(f => f.user_id))];
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, name')
          .in('id', userIds);

        if (profilesError) throw profilesError;

        // Combinar os dados
        const feedbacksWithProfiles = feedbackData.map(feedback => ({
          ...feedback,
          profiles: profilesData?.find(p => p.id === feedback.user_id) || { name: 'Usuário desconhecido' }
        }));

        setFeedbacks(feedbacksWithProfiles);
      } else {
        setFeedbacks([]);
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 font-inter">
      <Header 
        title="Meu Perfil" 
        showBackButton={true}
        showHomeButton={true} 
      />
      
      <main className="p-6 pb-32 max-w-4xl mx-auto">
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
                  {profile?.name?.charAt(0) || 'U'}
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

            {isCoach ? (
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="info">Informações</TabsTrigger>
                  <TabsTrigger value="feedbacks">Feedbacks</TabsTrigger>
                </TabsList>
                
                <TabsContent value="info" className="space-y-4 mt-6">
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
                </TabsContent>
                
                <TabsContent value="feedbacks" className="mt-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <MessageSquare className="h-5 w-5 text-purple-600" />
                      <h3 className="text-lg font-semibold text-purple-900">
                        Feedbacks Recebidos ({feedbacks.length})
                      </h3>
                    </div>
                    
                    {loading ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                      </div>
                    ) : feedbacks.length === 0 ? (
                      <div className="text-center py-8 text-purple-600">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 text-purple-400" />
                        <p className="font-medium">Nenhum feedback recebido ainda</p>
                        <p className="text-sm text-purple-500 mt-1">
                          Os feedbacks das atletas aparecerão aqui
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {feedbacks.map((feedback) => (
                          <div key={feedback.id} className="bg-white rounded-lg p-4 shadow-sm border border-purple-100">
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0">
                                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold">
                                  {feedback.profiles?.name?.charAt(0) || '?'}
                                </div>
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-sm font-medium text-gray-900">
                                    {feedback.profiles?.name || 'Usuário'}
                                  </p>
                                  
                                  <div className="flex items-center space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                      <div
                                        key={i}
                                        className={`w-3 h-3 rounded-full ${
                                          i < feedback.rating
                                            ? 'bg-yellow-400'
                                            : 'bg-gray-300'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                                
                                <p className="text-sm text-gray-700 mb-2">
                                  {feedback.comment}
                                </p>
                                
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <span>
                                    {feedback.target_type === 'game' ? 'Jogo' : 'Treino'}
                                  </span>
                                  <span>
                                    {new Date(feedback.created_at).toLocaleDateString('pt-BR')}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              /* Profile Information for non-coaches */
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
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ProfilePage;
