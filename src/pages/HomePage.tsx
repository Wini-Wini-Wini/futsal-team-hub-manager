
import React, { useEffect } from 'react';
import Header from '../components/Header';
import TabBar from '../components/TabBar';
import { useData, Game, Announcement } from '../contexts/DataContext';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '@/contexts/AuthContext';
import { Trophy, Calendar, Bell, User, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import PostsList from '@/components/PostsList';

const HomePage: React.FC = () => {
  const { games, announcements, getUnreadAnnouncements, markAnnouncementAsRead } = useData();
  const { profile } = useAuth();
  const navigate = useNavigate();

  // Get the next 3 upcoming games
  const upcomingGames = games
    .filter(game => new Date(game.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  // Get games with results (past games with scores)
  const recentResults = games
    .filter(game => {
      const gameDate = new Date(game.date);
      const hasResult = game.home_score !== null && game.away_score !== null;
      return gameDate < new Date() && hasResult;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  // Get latest announcements
  const latestAnnouncements = announcements
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  const formatDate = (dateStr: string) => {
    const date = parseISO(dateStr);
    return {
      dayOfWeek: capitalize(format(date, "EEEE", { locale: ptBR })),
      shortDate: format(date, "dd/MM", { locale: ptBR })
    };
  };

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-amber-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const isCoach = profile?.role === 'coach';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <Header 
        title="Início" 
        rightElement={
          isCoach ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/add')}
              className="text-white hover:bg-white/20"
            >
              <Plus className="h-5 w-5" />
            </Button>
          ) : undefined
        }
      />
      
      <div className="p-6 pb-32 space-y-6">
        {/* Welcome Section */}
        <Card className="bg-gradient-to-r from-white to-purple-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xl">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-purple-900">
                  Olá, {profile?.name || 'Atleta'}!
                </h2>
                <p className="text-purple-600">
                  Bem-vinda ao Female Futsal
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-lg">
            <CardContent className="p-4 text-center text-white">
              <Calendar className="h-8 w-8 mx-auto mb-2" />
              <p className="text-2xl font-bold">{upcomingGames.length}</p>
              <p className="text-sm opacity-90">Próximos jogos</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500 to-green-600 border-0 shadow-lg">
            <CardContent className="p-4 text-center text-white">
              <Trophy className="h-8 w-8 mx-auto mb-2" />
              <p className="text-2xl font-bold">{recentResults.length}</p>
              <p className="text-sm opacity-90">Resultados</p>
            </CardContent>
          </Card>
        </div>

        {/* Próximos Jogos */}
        {upcomingGames.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Próximos Jogos</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/agenda')}
                className="text-white hover:bg-white/20"
              >
                Ver todos
              </Button>
            </div>
            
            <div className="space-y-3">
              {upcomingGames.map((game) => {
                const { dayOfWeek, shortDate } = formatDate(game.date);
                return (
                  <Card key={game.id} className="bg-gradient-to-r from-white to-purple-50 border-0 shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-purple-900">
                            {game.opponent ? `vs ${game.opponent}` : 'Jogo'}
                          </h4>
                          <p className="text-sm text-purple-600">
                            {dayOfWeek}, {shortDate} • {game.time}
                          </p>
                          <p className="text-xs text-purple-500">{game.location}</p>
                        </div>
                        
                        <div className="text-right">
                          <div className="w-3 h-3 rounded-full bg-purple-500 ml-auto mb-1"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Resultados Recentes */}
        {recentResults.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Resultados Recentes</h3>
            
            <div className="space-y-3">
              {recentResults.map((game) => {
                const { dayOfWeek, shortDate } = formatDate(game.date);
                return (
                  <Card key={game.id} className="bg-gradient-to-r from-white to-green-50 border-0 shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-green-900">
                            {game.opponent ? `vs ${game.opponent}` : 'Jogo'}
                          </h4>
                          <p className="text-sm text-green-600">
                            {dayOfWeek}, {shortDate}
                          </p>
                          <p className="text-xs text-green-500">{game.location}</p>
                        </div>
                        
                        <div className="text-center">
                          <div className="flex items-center space-x-2 text-lg font-bold text-green-900">
                            <span>{game.home_score}</span>
                            <span>-</span>
                            <span>{game.away_score}</span>
                          </div>
                          <Trophy className="h-4 w-4 text-green-600 mx-auto mt-1" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Últimos Avisos */}
        {latestAnnouncements.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Últimos Avisos</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/announcements')}
                className="text-white hover:bg-white/20"
              >
                Ver todos
              </Button>
            </div>
            
            <div className="space-y-3">
              {latestAnnouncements.map((announcement) => (
                <Card key={announcement.id} className="bg-gradient-to-r from-white to-orange-50 border-0 shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(announcement.priority)} mt-2 flex-shrink-0`}></div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-orange-900 mb-1">
                          {announcement.title}
                        </h4>
                        <p className="text-sm text-orange-700 line-clamp-2">
                          {announcement.message}
                        </p>
                        <div className="flex items-center mt-2 text-xs text-orange-500">
                          <Bell className="h-3 w-3 mr-1" />
                          <span>{announcement.author}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Feed de Posts */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Feed da Equipe</h3>
          <PostsList />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
