import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import { MessageSquare, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
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

const FeedbacksPage: React.FC = () => {
  const { profile, user } = useAuth();
  const { toast } = useToast();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

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
        title="Feedbacks Recebidos" 
        showBackButton={true}
      />
      
      <main className="p-6 pb-32 max-w-4xl mx-auto">
        <Card className="bg-gradient-to-br from-white to-purple-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-6">
                <MessageSquare className="h-6 w-6 text-purple-600" />
                <h2 className="text-xl font-semibold text-purple-900">
                  Feedbacks Recebidos ({feedbacks.length})
                </h2>
              </div>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
              ) : feedbacks.length === 0 ? (
                <div className="text-center py-12 text-purple-600">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 text-purple-400" />
                  <p className="font-medium text-lg mb-2">Nenhum feedback recebido ainda</p>
                  <p className="text-sm text-purple-500">
                    Os feedbacks das atletas aparecerão aqui
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {feedbacks.map((feedback) => (
                    <div key={feedback.id} className="bg-white rounded-lg p-6 shadow-sm border border-purple-100">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                              {feedback.profiles?.name?.charAt(0) || '?'}
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-3">
                              <p className="text-lg font-semibold text-gray-900">
                                {feedback.profiles?.name || 'Usuário'}
                              </p>
                              
                              <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <div
                                    key={i}
                                    className={`w-4 h-4 rounded-full ${
                                      i < feedback.rating
                                        ? 'bg-yellow-400'
                                        : 'bg-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>

                            {/* Informação sobre qual jogo/treino */}
                            <div className="mb-3">
                              <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                                {getTargetInfo(feedback)}
                              </span>
                            </div>
                            
                            <p className="text-gray-700 mb-4 leading-relaxed">
                              {feedback.comment}
                            </p>
                            
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <span>
                                {new Date(feedback.created_at).toLocaleDateString('pt-BR', {
                                  day: '2-digit',
                                  month: 'long',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Botão de deletar - visível para o autor do feedback ou para coaches */}
                        {(user?.id === feedback.user_id || profile?.role === 'coach') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteFeedback(feedback.id, feedback.user_id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-4"
                          >
                            <Trash2 size={16} />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default FeedbacksPage;
