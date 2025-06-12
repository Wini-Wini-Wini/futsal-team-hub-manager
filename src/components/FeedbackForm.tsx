
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FeedbackFormProps {
  targetType: 'game' | 'training';
  targetId: string;
  targetTitle: string;
  onFeedbackSubmitted: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ 
  targetType, 
  targetId, 
  targetTitle, 
  onFeedbackSubmitted 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !comment.trim() || rating === 0) {
      toast({
        title: "Erro",
        description: "Por favor, preencha o comentário e selecione uma avaliação",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('feedback')
        .insert({
          user_id: user.id,
          target_type: targetType,
          target_id: targetId,
          comment: comment.trim(),
          rating: rating
        });

      if (error) throw error;

      toast({
        title: "Feedback enviado",
        description: "Seu feedback foi enviado com sucesso!"
      });

      setComment('');
      setRating(0);
      onFeedbackSubmitted();
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar o feedback",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-white to-purple-50 border-0 shadow-lg">
      <CardContent className="p-6">
        <h3 className="text-lg font-bold text-purple-800 mb-4">
          Dar Feedback: {targetTitle}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="rating" className="text-purple-700 font-medium">
              Avaliação
            </Label>
            <div className="flex items-center space-x-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-1 rounded transition-colors ${
                    star <= rating ? 'text-yellow-500' : 'text-gray-300'
                  }`}
                >
                  <Star className="h-6 w-6 fill-current" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="comment" className="text-purple-700 font-medium">
              Comentário
            </Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Compartilhe sua experiência sobre este jogo/treino..."
              className="mt-2 border-purple-300 focus:border-purple-500"
              rows={4}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !comment.trim() || rating === 0}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white"
          >
            {isSubmitting ? (
              "Enviando..."
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Enviar Feedback
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FeedbackForm;
