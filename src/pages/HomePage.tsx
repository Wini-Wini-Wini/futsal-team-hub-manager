
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData, Game, Announcement } from '../contexts/DataContext';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PostForm from '@/components/PostForm';
import PostsList from '@/components/PostsList';
import GameCard from '@/components/GameCard';
import { Plus, Calendar, Trophy, Bell } from 'lucide-react';

const HomePage: React.FC = () => {
  const { profile } = useAuth();
  const { games, getUnreadAnnouncements, markAnnouncementAsRead } = useData();
  const navigate = useNavigate();
  
  // Get next game
  const upcomingGames = games
    .filter(game => new Date(game.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const nextGame = upcomingGames.length > 0 ? upcomingGames[0] : null;
  
  // Get latest finished games with results
  const pastGamesWithResults = games
    .filter(game => 
      new Date(game.date) < new Date() && 
      (game.homeScore !== null || game.awayScore !== null)
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const latestResults = pastGamesWithResults.slice(0, 3);
  
  // Get unread announcements for players
  const unreadAnnouncements = getUnreadAnnouncements();
  
  // Get priority color for announcements
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-purple-600 bg-purple-50 border-purple-200';
    }
  };
  
  const handleAnnouncementClick = (announcement: Announcement) => {
    markAnnouncementAsRead(announcement.id);
    navigate('/announcements');
  };

  const isCoach = profile?.role === 'coach';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              Boa {getTimeOfDay()}, {profile?.name?.split(' ')[0] || (profile?.role === 'coach' ? 'Treinador(a)' : 'Atleta')}
            </h1>
            <p className="text-purple-200 text-sm">
              {profile?.role === 'coach' ? 'Painel do Treinador' : 'Portal do Atleta'}
            </p>
          </div>
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm overflow-hidden">
            {profile?.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold">
                {profile?.name?.charAt(0) || '?'}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="p-6 space-y-8 pb-32">
        {/* Coach Post Form */}
        {isCoach && (
          <section className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 flex items-center justify-center">
                <Plus className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Nova Postagem</h2>
            </div>
            <PostForm />
          </section>
        )}

        {/* Posts Section */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center">
              <Bell className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Feed de Notícias</h2>
          </div>
          <PostsList />
        </section>

        {/* Next Game Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-green-700 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Próximo Jogo</h2>
            </div>
            {isCoach && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/add?type=game')}
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar
              </Button>
            )}
          </div>
          
          {nextGame ? (
            <GameCard game={nextGame} />
          ) : (
            <Card className="bg-gradient-to-br from-white to-purple-50 border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <p className="text-purple-600 font-medium">Não há jogos agendados</p>
                <p className="text-purple-400 text-sm mt-2">Os próximos jogos aparecerão aqui</p>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Unread Announcements for Players */}
        {profile?.role === 'player' && unreadAnnouncements.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                <Bell className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Avisos Importantes</h2>
            </div>
            
            <div className="space-y-3">
              {unreadAnnouncements.slice(0, 3).map(announcement => (
                <Card 
                  key={announcement.id} 
                  className={`cursor-pointer hover:shadow-lg transition-all duration-300 border-2 ${getPriorityColor(announcement.priority)}`}
                  onClick={() => handleAnnouncementClick(announcement)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-lg">
                        {announcement.title}
                      </h3>
                      <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                        {format(parseISO(announcement.date), 'dd/MM')}
                      </span>
                    </div>
                    <p className="text-gray-700 line-clamp-2 mt-2">
                      {announcement.message}
                    </p>
                  </CardContent>
                </Card>
              ))}
              
              {unreadAnnouncements.length > 3 && (
                <div className="text-center">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/announcements')}
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                  >
                    Ver todos os {unreadAnnouncements.length} avisos
                  </Button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Latest Results Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                <Trophy className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Últimos Resultados</h2>
            </div>
            {isCoach && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/add?type=past-game')}
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar resultado
              </Button>
            )}
          </div>
          
          {latestResults.length > 0 ? (
            <div className="space-y-4">
              {latestResults.map(game => (
                <GameCard 
                  key={game.id} 
                  game={game} 
                  showResult={true}
                />
              ))}
            </div>
          ) : (
            <Card className="bg-gradient-to-br from-white to-purple-50 border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <Trophy className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <p className="text-purple-600 font-medium">Nenhum resultado disponível</p>
                <p className="text-purple-400 text-sm mt-2">Os resultados dos jogos aparecerão aqui</p>
              </CardContent>
            </Card>
          )}
        </section>
      </main>
    </div>
  );
};

// Helper function to get time of day
function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return 'manhã';
  if (hour < 18) return 'tarde';
  return 'noite';
}

export default HomePage;
