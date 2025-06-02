
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, MapPin, Clock, Shirt, Trophy } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Game } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface GameCardProps {
  game: Game;
  showResult?: boolean;
  className?: string;
}

const GameCard: React.FC<GameCardProps> = ({ game, showResult = false, className = "" }) => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const isCoach = profile?.role === 'coach';
  
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
  const isPastGame = new Date(game.date) < new Date();
  const hasScore = game.homeScore !== null && game.awayScore !== null;
  
  const getResultStatus = () => {
    if (!hasScore) return null;
    if (game.homeScore! > game.awayScore!) return { text: 'Vitória!', color: 'text-green-600', bg: 'bg-green-50' };
    if (game.homeScore! < game.awayScore!) return { text: 'Derrota', color: 'text-red-600', bg: 'bg-red-50' };
    return { text: 'Empate', color: 'text-yellow-600', bg: 'bg-yellow-50' };
  };
  
  const result = getResultStatus();

  return (
    <Card className={`overflow-hidden shadow-lg border-0 bg-gradient-to-br from-white to-purple-50 hover:shadow-xl transition-all duration-300 ${className}`}>
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="font-bold text-xl text-gray-900 mb-2">
                {capitalize(dayOfWeek)}, {date}
              </h3>
              
              {result && showResult && (
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold mb-3 ${result.bg} ${result.color}`}>
                  <Trophy className="mr-1 h-4 w-4" />
                  {result.text}
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex items-center text-purple-700">
                  <MapPin className="mr-2 h-4 w-4" />
                  <span className="font-medium">{game.location}</span>
                </div>
                <div className="flex items-center text-purple-700">
                  <Clock className="mr-2 h-4 w-4" />
                  <span className="font-medium">{game.time}</span>
                </div>
                <div className="flex items-center text-purple-700">
                  <Shirt className="mr-2 h-4 w-4" />
                  <span className="font-medium">Uniforme: {game.uniform}</span>
                </div>
                {game.opponent && (
                  <div className="flex items-center text-purple-700">
                    <span className="mr-2 text-lg">🆚</span>
                    <span className="font-medium">vs {game.opponent}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col items-center ml-4">
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-lg mb-2">
                    {game.home_team_logo ? (
                      <img 
                        src={game.home_team_logo} 
                        alt="Home Team" 
                        className="w-12 h-12 object-contain rounded-full"
                      />
                    ) : (
                      <span className="text-white font-bold text-lg">C</span>
                    )}
                  </div>
                  <span className="text-xs font-medium text-purple-600">Casa</span>
                </div>
                
                <div className="text-center px-4">
                  <div className="text-3xl font-bold text-purple-800 bg-white rounded-lg px-4 py-2 shadow-md">
                    {game.homeScore ?? 0} - {game.awayScore ?? 0}
                  </div>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center shadow-lg mb-2">
                    {game.away_team_logo ? (
                      <img 
                        src={game.away_team_logo} 
                        alt="Away Team" 
                        className="w-12 h-12 object-contain rounded-full"
                      />
                    ) : (
                      <span className="text-white font-bold text-lg">V</span>
                    )}
                  </div>
                  <span className="text-xs font-medium text-gray-600">{game.opponent || 'Visitante'}</span>
                </div>
              </div>
              
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
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameCard;
