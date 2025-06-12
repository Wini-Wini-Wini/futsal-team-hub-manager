
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Star, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Feedback {
  id: string;
  comment: string;
  rating: number;
  created_at: string;
  user_id: string;
  profiles?: {
    name: string;
    avatar_url?: string;
  };
}

interface FeedbackListProps {
  targetType: 'game' | 'training';
  targetId: string;
  refreshTrigger?: number;
}

const FeedbackList: React.FC<FeedbackListProps> = ({ 
  targetType, 
  targetId, 
  refreshTrigger 
}) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFeedbacks = async () => {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select(`
          *,
          profiles:user_id (
            name,
            avatar_url
          )
        `)
        .eq('target_type', targetType)
        .eq('target_id', targetId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFeedbacks(data || []);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [targetType, targetId, refreshTrigger]);

  if (isLoading) {
    return (
      <div className="text-center p-4">
        <p className="text-purple-600">Carregando feedbacks...</p>
      </div>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-white to-purple-50 border-0 shadow-lg">
        <CardContent className="p-8 text-center">
          <MessageCircle className="h-12 w-12 text-purple-400 mx-auto mb-4" />
          <p className="text-purple-600 font-medium">Ainda não há feedbacks</p>
          <p className="text-purple-400 text-sm mt-2">Seja o primeiro a compartilhar sua experiência</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white mb-4">
        Feedbacks ({feedbacks.length})
      </h3>
      
      {feedbacks.map((feedback) => (
        <Card key={feedback.id} className="bg-gradient-to-br from-white to-purple-50 border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white shadow-lg overflow-hidden flex-shrink-0">
                {feedback.profiles?.avatar_url ? (
                  <img 
                    src={feedback.profiles.avatar_url} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-bold">
                    {feedback.profiles?.name?.charAt(0) || '?'}
                  </span>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900">
                    {feedback.profiles?.name || 'Usuário'}
                  </p>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= feedback.rating 
                            ? 'text-yellow-500 fill-current' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <p className="text-gray-700 mb-2">{feedback.comment}</p>
                
                <p className="text-sm text-purple-600">
                  {format(parseISO(feedback.created_at), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FeedbackList;
