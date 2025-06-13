
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import { MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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

const FeedbacksPage: React.FC = () => {
  const { profile } = useAuth();
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
        title="Feedbacks Recebidos" 
        showBackButton={true}
        showHomeButton={true} 
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
                      <div className="flex items-start space-x-4">
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
                          
                          <p className="text-gray-700 mb-4 leading-relaxed">
                            {feedback.comment}
                          </p>
                          
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                              {feedback.target_type === 'game' ? 'Jogo' : 'Treino'}
                            </span>
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
