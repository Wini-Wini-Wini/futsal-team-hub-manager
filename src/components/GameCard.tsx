
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
  opponent: string;
  uniform: string;
  time: string;
  homeScore?: number;
  awayScore?: number;
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
  const [feedbackRefresh, setFeedbackRefresh] = useState(0);
  
  const isCoach = profile?.role === 'coach';
  const isPlayer = profile?.role === 'player';
  const gameDate = parseISO(game.date);
  const isPastGame = gameDate < new Date();
  const hasResult = game.homeScore !== null && game.awayScore !== null;
  
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
    setFeedbackRefresh(prev => prev + 1);
  };

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden shadow-lg border-0 bg-gradient-to-br from-white to-purple-50 hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="font-bold text-xl text-gray-900 mb-2">
                {capitalize(dayOfWeek)}, {date}
              </h3>
              
              {game.opponent && (
                <div className="flex items-center justify-center space-x-4 mb-4 p-4 bg-purple-100 rounded-lg">
                  <div className="text-center">
                    {game.home_team_logo ? (
                      <img src={game.home_team_logo} alt="Casa" className="w-12 h-12 mx-auto mb-2 object-contain" />
                    ) : (
                      <div className="w-12 h-12 mx-auto mb-2 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        C
                      </div>
                    )}
                    <p className="text-sm font-medium text-purple-800">Casa</p>
                    {showResult && hasResult && (
                      <p className="text-2xl font-bold text-purple-900">{game.homeScore}</p>
                    )}
                  </div>
                  
                  <div className="text-center">
                    <p className="text-lg font-bold text-purple-700">VS</p>
                  </div>
                  
                  <div className="text-center">
                    {game.away_team_logo ? (
                      <img src={game.away_team_logo} alt={game.opponent} className="w-12 h-12 mx-auto mb-2 object-contain" />
                    ) : (
                      <div className="w-12 h-12 mx-auto mb-2 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                        {game.opponent.charAt(0)}
                      </div>
                    )}
                    <p className="text-sm font-medium text-purple-800">{game.opponent}</p>
                    {showResult && hasResult && (
                      <p className="text-2xl font-bold text-purple-900">{game.awayScore}</p>
                    )}
                  </div>
                </div>
              )}
              
              <div className="space-y-3">
                <div className="flex items-center text-purple-700">
                  <MapPin className="mr-3 h-5 w-5" />
                  <span className="font-medium">{game.location}</span>
                </div>
                <div className="flex items-center text-purple-700">
                  <Clock className="mr-3 h-5 w-5" />
                  <span className="font-medium">{game.time}</span>
                </div>
                {game.uniform && (
                  <div className="flex items-center text-purple-700">
                    <Shirt className="mr-3 h-5 w-5" />
                    <span className="font-medium">Uniforme {game.uniform}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
              {isCoach && (
                <Button 
                  variant="outline"
                  size="sm"
                  className="text-purple-600 border-purple-300 hover:bg-purple-50 hover:border-purple-400"
                  onClick={() => navigate(`/edit-game/${game.id}`)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
              )}
              
              {showResult && (
                <div className="flex items-center text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                  <Trophy className="mr-2 h-4 w-4" />
                  <span className="text-sm font-medium">Finalizado</span>
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
                className="text-purple-600 border-purple-300 hover:bg-purple-50 hover:border-purple-400 w-full"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                {showFeedback ? 'Ocultar Feedback' : 'Ver/Dar Feedback'}
                {showFeedback ? (
                  <ChevronUp className="ml-2 h-4 w-4" />
                ) : (
                  <ChevronDown className="ml-2 h-4 w-4" />
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
            targetType="game"
            targetId={game.id}
            refreshTrigger={feedbackRefresh}
          />
        </div>
      )}
    </div>
  );
};

export default GameCard;
