import React, { useState, useEffect } from 'react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Star, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface FeedbackListProps {
  targetType: 'game' | 'training';
  targetId: string;
}

interface FeedbackWithProfile {
  id: string;
  comment: string;
  rating: number;
  created_at: string;
  user_id: string;
  profiles: {
    name: string;
    avatar_url?: string;
  } | null;
}

const FeedbackList: React.FC<FeedbackListProps> = ({ targetType, targetId }) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [feedbacks, setFeedbacks] = useState<FeedbackWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFeedback = async () => {
    setLoading(true);
    try {
      // First, get feedback data
      const { data: feedbackData, error: feedbackError } = await supabase
        .from('feedback')
        .select('*')
        .eq('target_type', targetType)
        .eq('target_id', targetId)
        .order('created_at', { ascending: false });

      if (feedbackError) {
        console.error('Error fetching feedback:', feedbackError);
        setFeedbacks([]);
        return;
      }

      if (!feedbackData || feedbackData.length === 0) {
        setFeedbacks([]);
        return;
      }

      // Get unique user IDs from feedback
      const userIds = [...new Set(feedbackData.map(f => f.user_id))];

      // Fetch profiles for these users
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, avatar_url')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
      }

      // Combine feedback with profile data - ensuring proper typing
      const feedbackWithProfiles: FeedbackWithProfile[] = feedbackData.map(feedback => ({
        ...feedback,
        profiles: profilesData?.find(p => p.id === feedback.user_id) || { name: 'Usuário desconhecido' }
      }));

      setFeedbacks(feedbackWithProfiles);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedback();
  }, [targetType, targetId]);

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
      loadFeedback();
    } catch (error) {
      console.error('Error deleting feedback:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o feedback",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Nenhum feedback ainda. Seja o primeiro a comentar!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full overflow-hidden">
      <h3 className="text-lg font-semibold text-purple-800 mb-4">
        Feedbacks ({feedbacks.length})
      </h3>
      
      {feedbacks.map((feedback) => (
        <div key={feedback.id} className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-purple-100 w-full">
          <div className="flex items-start justify-between gap-2 w-full">
            <div className="flex items-start space-x-2 sm:space-x-3 flex-1 min-w-0 overflow-hidden">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                  {feedback.profiles?.avatar_url ? (
                    <img 
                      src={feedback.profiles.avatar_url} 
                      alt="Avatar" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    feedback.profiles?.name?.charAt(0)?.toUpperCase() || '?'
                  )}
                </div>
              </div>
              
              <div className="flex-1 min-w-0 overflow-hidden">
                <div className="flex flex-col space-y-2 mb-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {feedback.profiles?.name || 'Usuário desconhecido'}
                    </p>
                    
                    {feedback.rating && (
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={`${
                              i < feedback.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 mt-1 break-words overflow-wrap-anywhere hyphens-auto">
                  {feedback.comment}
                </p>
                
                <p className="text-xs text-gray-500 mt-2">
                  {format(new Date(feedback.created_at), "dd 'de' MMMM 'às' HH:mm", {
                    locale: ptBR
                  })}
                </p>
              </div>
            </div>

            {/* Botão de deletar - visível para o autor do feedback ou para coaches */}
            {(user?.id === feedback.user_id || profile?.role === 'coach') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteFeedback(feedback.id, feedback.user_id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0 p-1 h-8 w-8"
              >
                <Trash2 size={12} />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeedbackList;
