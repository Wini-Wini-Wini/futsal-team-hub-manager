
import React, { useState, useEffect } from 'react';
import { useData } from '@/contexts/DataContext';
import { Star } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FeedbackListProps {
  targetType: 'game' | 'training';
  targetId: string;
}

const FeedbackList: React.FC<FeedbackListProps> = ({ targetType, targetId }) => {
  const { fetchFeedback } = useData();
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeedback = async () => {
      setLoading(true);
      const data = await fetchFeedback(targetType, targetId);
      setFeedbacks(data);
      setLoading(false);
    };

    loadFeedback();
  }, [targetType, targetId, fetchFeedback]);

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
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-purple-800 mb-4">
        Feedbacks ({feedbacks.length})
      </h3>
      
      {feedbacks.map((feedback) => (
        <div key={feedback.id} className="bg-white rounded-lg p-4 shadow-sm border border-purple-100">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold">
                {feedback.profiles?.avatar_url ? (
                  <img 
                    src={feedback.profiles.avatar_url} 
                    alt="Avatar" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  feedback.profiles?.name?.charAt(0) || '?'
                )}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">
                  {feedback.profiles?.name || 'Usuário'}
                </p>
                
                {feedback.rating && (
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
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
              
              <p className="text-sm text-gray-700 mt-1">
                {feedback.comment}
              </p>
              
              <p className="text-xs text-gray-500 mt-2">
                {format(new Date(feedback.created_at), "dd 'de' MMMM 'às' HH:mm", {
                  locale: ptBR
                })}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeedbackList;
