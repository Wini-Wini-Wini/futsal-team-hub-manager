import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Header from '@/components/Header';
import { Edit, Mail, Phone, User, Shield, MessageSquare, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
  game_info?: {
    opponent: string;
    date: string;
    location: string;
  };
  training_info?: {
    date: string;
    location: string;
  };
}

const ProfilePage: React.FC = () => {
  const { profile, user } = useAuth();
  const { toast } = useToast();
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

        // Buscar informações dos jogos e treinos
        const gameIds = feedbackData.filter(f => f.target_type === 'game').map(f => f.target_id);
        const trainingIds = feedbackData.filter(f => f.target_type === 'training').map(f => f.target_id);

        const gamesPromise = gameIds.length > 0 ? 
          supabase.from('games').select('id, opponent, date, location').in('id', gameIds) :
          Promise.resolve({ data: [], error: null });

        const trainingsPromise = trainingIds.length > 0 ?
          supabase.from('trainings').select('id, date, location').in('id', trainingIds) :
          Promise.resolve({ data: [], error: null });

        const [gamesResult, trainingsResult] = await Promise.all([gamesPromise, trainingsPromise]);

        if (gamesResult.error) throw gamesResult.error;
        if (trainingsResult.error) throw trainingsResult.error;

        // Combinar os dados
        const feedbacksWithInfo = feedbackData.map(feedback => ({
          ...feedback,
          profiles: profilesData?.find(p => p.id === feedback.user_id) || { name: 'Usuário desconhecido' },
          game_info: feedback.target_type === 'game' ? 
            gamesResult.data?.find(g => g.id === feedback.target_id) : undefined,
          training_info: feedback.target_type === 'training' ?
            trainingsResult.data?.find(t => t.id === feedback.target_id) : undefined
        }));

        setFeedbacks(feedbacksWithInfo);
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

  const handleDeleteFeedback = async (feedbackId: string, feedbackUserId: string) => {
    // Verificar se o usuário pode deletar (próprio feedback ou é coach)
    if (user?.id !== feedbackUserId && profile?.role !== 'coach') {
      toast({
        title: "Erro",
        description: "Você não tem permissão para deletar este feedback",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('feedback')
        .delete()
        .eq('id', feedbackId);

      if (error) throw error;

      toast({
        title: "Feedback removido",
        description: "O feedback foi removido com sucesso"
      });

      // Recarregar feedbacks
      fetchFeedbacks();
    } catch (error) {
      console.error('Error deleting feedback:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o feedback",
        variant: "destructive"
      });
    }
  };

  const getTargetInfo = (feedback: Feedback) => {
    if (feedback.target_type === 'game' && feedback.game_info) {
      const date = format(new Date(feedback.game_info.date), "dd 'de' MMMM", { locale: ptBR });
      return `Jogo vs ${feedback.game_info.opponent} - ${date}`;
    } else if (feedback.target_type === 'training' && feedback.training_info) {
      const date = format(new Date(feedback.training_info.date), "dd 'de' MMMM", { locale: ptBR });
      return `Treino - ${date}`;
    }
    return feedback.target_type === 'game' ? 'Jogo' : 'Treino';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 font-inter">
      <Header 
        title="Meu Perfil" 
        showBackButton={true}
      />
      
      <main className="pt-20 p-4 pb-32 max-w-4xl mx-auto">
        <Card className="bg-gradient-to-br from-white to-purple-50 border-0 shadow-lg">
          <CardContent className="p-4 sm:p-6">
            {/* Profile Header */}
            <div className="flex flex-col items-center space-y-4 mb-8">
              <Avatar className="w-20 h-20 sm:w-24 sm:h-24">
                <AvatarImage 
                  src={profile?.avatar_url || ''} 
                  alt="Profile picture" 
                />
                <AvatarFallback className="bg-gradient-to-br from-purple-600 to-purple-800 text-white text-xl sm:text-2xl font-bold">
                  {profile?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-purple-900 mb-1">
                  {profile?.name || 'Nome não informado'}
                </h2>
                <p className="text-purple-600 font-medium capitalize">
                  {profile?.role === 'coach' ? 'Colaborador(a)' : 'Atleta'}
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
                        {profile?.role === 'coach' ? 'Colaborador(a)' : 'Atleta'}
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="feedbacks" className="mt-6 overflow-hidden">
                  <div className="space-y-4 w-full overflow-hidden">
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
                      <div className="space-y-3 w-full overflow-hidden">
                        {feedbacks.map((feedback) => (
                          <div key={feedback.id} className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-purple-100 w-full">
                            <div className="flex items-start justify-between w-full">
                              <div className="flex items-start space-x-2 sm:space-x-3 flex-1 min-w-0 overflow-hidden">
                                <div className="flex-shrink-0">
                                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                                    {feedback.profiles?.name?.charAt(0) || '?'}
                                  </div>
                                </div>
                                
                                <div className="flex-1 min-w-0 overflow-hidden">
                                  <div className="flex items-center justify-between mb-2 gap-2">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {feedback.profiles?.name || 'Usuário'}
                                    </p>
                                    
                                    <div className="flex items-center space-x-1 flex-shrink-0">
                                      {[...Array(5)].map((_, i) => (
                                        <div
                                          key={i}
                                          className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                                            i < feedback.rating
                                              ? 'bg-yellow-400'
                                              : 'bg-gray-300'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                  </div>

                                  {/* Informação sobre qual jogo/treino */}
                                  <div className="mb-2">
                                    <span className="inline-block bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium break-words">
                                      {getTargetInfo(feedback)}
                                    </span>
                                  </div>
                                  
                                  <p className="text-sm text-gray-700 mb-2 break-words overflow-wrap-anywhere hyphens-auto">
                                    {feedback.comment}
                                  </p>
                                  
                                  <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>
                                      {new Date(feedback.created_at).toLocaleDateString('pt-BR')}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Botão de deletar */}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteFeedback(feedback.id, feedback.user_id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-2 flex-shrink-0 p-1 h-8 w-8"
                              >
                                <Trash2 size={12} />
                              </Button>
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
                      {profile?.role === 'coach' ? 'Colaborador(a)' : 'Atleta'}
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
