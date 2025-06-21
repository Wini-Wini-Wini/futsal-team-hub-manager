
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { MapPin, Clock, Shirt, Edit, Trophy, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import FeedbackForm from './FeedbackForm';
import FeedbackList from './FeedbackList';

interface Game {
  id: string;
  date: string;
  location: string;
  opponent?: string;
  uniform?: string;
  time: string;
  home_score?: number;
  away_score?: number;
  home_team_logo?: string;
  away_team_logo?: string;
}

interface GameCardProps {
  game: Game;
  showResult?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ game, showResult = false }) => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackKey, setFeedbackKey] = useState(0);
  
  const isCoach = profile?.role === 'coach';
  const isPlayer = profile?.role === 'player';
  const gameDate = parseISO(game.date);
  const isPastGame = gameDate < new Date();
  const hasResult = game.home_score !== null && game.away_score !== null;
  
  const formatDate = (dateStr: string) => {
    const date = parseISO(dateStr);
    return {
      dayOfWeek: format(date, "EEEE", { locale: ptBR }),
      date: format(date, "dd 'de' MMMM", { locale: ptBR })
    };
  };

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const { dayOfWeek, date } = formatDate(game.date);
  
  const handleFeedbackSubmitted = () => {
    setFeedbackKey(prev => prev + 1);
  };

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden shadow-lg border-0 bg-gradient-to-br from-white to-purple-50 hover:shadow-xl transition-all duration-300">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-2 break-words">
                {capitalize(dayOfWeek)}, {date}
              </h3>
              
              {game.opponent && (
                <div className="flex items-center justify-center space-x-2 sm:space-x-4 mb-4 p-3 sm:p-4 bg-purple-100 rounded-lg">
                  <div className="text-center flex-1 min-w-0">
                    {game.home_team_logo ? (
                      <img src={game.home_team_logo} alt="Casa" className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 object-contain" />
                    ) : (
                      <div className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                        C
                      </div>
                    )}
                    <p className="text-xs sm:text-sm font-medium text-purple-800">Casa</p>
                    {showResult && hasResult && (
                      <p className="text-lg sm:text-2xl font-bold text-purple-900">{game.home_score}</p>
                    )}
                  </div>
                  
                  <div className="text-center flex-shrink-0">
                    <p className="text-sm sm:text-lg font-bold text-purple-700">VS</p>
                  </div>
                  
                  <div className="text-center flex-1 min-w-0">
                    {game.away_team_logo ? (
                      <img src={game.away_team_logo} alt={game.opponent} className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 object-contain" />
                    ) : (
                      <div className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                        {game.opponent.charAt(0)}
                      </div>
                    )}
                    <p className="text-xs sm:text-sm font-medium text-purple-800 truncate">{game.opponent}</p>
                    {showResult && hasResult && (
                      <p className="text-lg sm:text-2xl font-bold text-purple-900">{game.away_score}</p>
                    )}
                  </div>
                </div>
              )}
              
              <div className="space-y-3">
                <div className="flex items-start text-purple-700">
                  <MapPin className="mr-3 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 mt-0.5" />
                  <span className="font-medium text-sm sm:text-base break-words">{game.location}</span>
                </div>
                <div className="flex items-center text-purple-700">
                  <Clock className="mr-3 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base">{game.time}</span>
                </div>
                {game.uniform && (
                  <div className="flex items-center text-purple-700">
                    <Shirt className="mr-3 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    <span className="font-medium text-sm sm:text-base">Uniforme {game.uniform}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col space-y-2 flex-shrink-0">
              {isCoach && (
                <Button 
                  variant="outline"
                  size="sm"
                  className="text-purple-600 border-purple-300 hover:bg-purple-50 hover:border-purple-400 text-xs sm:text-sm"
                  onClick={() => navigate(`/edit-game/${game.id}`)}
                >
                  <Edit className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Editar
                </Button>
              )}
              
              {showResult && (
                <div className="flex items-center text-orange-600 bg-orange-50 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                  <Trophy className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="font-medium whitespace-nowrap">Finalizado</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Feedback Section for Players */}
          {isPlayer && isPastGame && (
            <div className="mt-4 pt-4 border-t border-purple-200">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFeedback(!showFeedback)}
                className="text-purple-600 border-purple-300 hover:bg-purple-50 hover:border-purple-400 w-full text-xs sm:text-sm"
              >
                <MessageCircle className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="truncate">{showFeedback ? 'Ocultar Feedback' : 'Ver/Dar Feedback'}</span>
                {showFeedback ? (
                  <ChevronUp className="ml-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                ) : (
                  <ChevronDown className="ml-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Feedback Panel */}
      {showFeedback && isPlayer && isPastGame && (
        <div className="space-y-4">
          <FeedbackForm
            targetType="game"
            targetId={game.id}
            targetTitle={`Jogo vs ${game.opponent || 'Adversário'}`}
            onFeedbackSubmitted={handleFeedbackSubmitted}
          />
          <FeedbackList
            key={feedbackKey}
            targetType="game"
            targetId={game.id}
          />
        </div>
      )}
    </div>
  );
};

export default GameCard;
