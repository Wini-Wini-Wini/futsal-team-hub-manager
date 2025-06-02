
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

const HomePage: React.FC = () => {
  const { profile } = useAuth();
  const { games, getUnreadAnnouncements, markAnnouncementAsRead } = useData();
  const navigate = useNavigate();
  
  // Get next game
  const upcomingGames = games
    .filter(game => new Date(game.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const nextGame = upcomingGames.length > 0 ? upcomingGames[0] : null;
  
  // Get latest finished game
  const pastGames = games
    .filter(game => new Date(game.date) < new Date())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const latestGame = pastGames.length > 0 ? pastGames[0] : null;
  
  // Get unread announcements for players
  const unreadAnnouncements = getUnreadAnnouncements();

  const formatDate = (dateStr: string) => {
    const date = parseISO(dateStr);
    return format(date, "EEEE, dd 'de' MMMM", { locale: ptBR });
  };

  // Function to capitalize first letter
  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  
  // Get priority color for announcements
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-futsal-red';
      case 'medium':
        return 'text-amber-500';
      case 'low':
        return 'text-futsal-green';
      default:
        return '';
    }
  };
  
  const handleAnnouncementClick = (announcement: Announcement) => {
    markAnnouncementAsRead(announcement.id);
    navigate('/announcements');
  };

  const isCoach = profile?.role === 'coach';

  return (
    <div className="flex-1 pb-24"> {/* Increased bottom padding to prevent cutoff */}
      <header className="bg-futsal-primary text-white p-4">
        <h1 className="text-xl font-bold">
          Boa {getTimeOfDay()}, {profile?.name?.split(' ')[0] || (profile?.role === 'coach' ? 'Treinador(a)' : 'Atleta')}
        </h1>
      </header>

      <main className="p-4 flex-1 pb-8"> {/* Added bottom padding */}
        {/* Coach Post Form */}
        {isCoach && (
          <section className="mb-6">
            <PostForm />
          </section>
        )}

        {/* Posts Section */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-futsal-dark mb-2">Feed de notícias:</h2>
          <PostsList />
        </section>

        {/* Next Game Section */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-futsal-dark mb-2">Próximo jogo:</h2>
          {nextGame ? (
            <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg">
                      {capitalize(formatDate(nextGame.date))}
                    </h3>
                    <div className="text-sm text-gray-600 mt-1">
                      <p className="flex items-center">
                        <span className="mr-1">📍</span> {nextGame.location}
                      </p>
                      <p className="flex items-center">
                        <span className="mr-1">👕</span> Uniforme: {nextGame.uniform}
                      </p>
                      <p className="flex items-center">
                        <span className="mr-1">🕒</span> Horário: {nextGame.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="flex flex-col items-center">
                      <img 
                        src={nextGame.home_team_logo || "/placeholder.svg"} 
                        alt="Home Team" 
                        className="w-8 h-8 object-contain"
                      />
                      <span className="text-xs">Casa</span>
                    </div>
                    <div className="px-2">
                      <div className="text-lg font-bold">
                        {nextGame.homeScore ?? 0} - {nextGame.awayScore ?? 0}
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <img 
                        src={nextGame.away_team_logo || "/placeholder.svg"} 
                        alt="Away Team" 
                        className="w-8 h-8 object-contain"
                      />
                      <span className="text-xs">{nextGame.opponent || 'Visitante'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
              <p>Não há jogos agendados.</p>
            </div>
          )}
        </section>

        {/* Unread Announcements for Players */}
        {profile?.role === 'player' && unreadAnnouncements.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-futsal-dark mb-2">Avisos não lidos:</h2>
            <div className="space-y-3">
              {unreadAnnouncements.slice(0, 3).map(announcement => (
                <Card 
                  key={announcement.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleAnnouncementClick(announcement)}
                >
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center">
                      <h3 className={`font-bold ${getPriorityColor(announcement.priority)}`}>
                        {announcement.title}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {format(parseISO(announcement.date), 'dd/MM')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2 mt-1">
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
                    className="text-futsal-primary"
                  >
                    Ver todos os {unreadAnnouncements.length} avisos
                  </Button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Latest Results Section */}
        <section className="mb-8"> {/* Added margin bottom for final spacing */}
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-futsal-dark">Último resultado:</h2>
            {isCoach && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/add?type=past-game')}
                className="text-futsal-primary"
              >
                Adicionar resultado
              </Button>
            )}
          </div>
          
          {latestGame && (latestGame.homeScore !== null || latestGame.awayScore !== null) ? (
            <div className="bg-futsal-light rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-green-500">
                    {latestGame.homeScore > latestGame.awayScore ? 'Vitória!' : 
                     latestGame.homeScore < latestGame.awayScore ? 'Derrota' : 'Empate'}
                  </h3>
                  <div className="text-sm">
                    <p>{capitalize(formatDate(latestGame.date))}</p>
                    <p>{latestGame.location}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col items-center">
                    <img 
                      src={latestGame.home_team_logo || "/placeholder.svg"} 
                      alt="Home Team" 
                      className="w-8 h-8 object-contain"
                    />
                    <span className="text-xs">Casa</span>
                  </div>
                  <div className="text-xl font-bold">
                    {latestGame.homeScore} - {latestGame.awayScore}
                  </div>
                  <div className="flex flex-col items-center">
                    <img 
                      src={latestGame.away_team_logo || "/placeholder.svg"} 
                      alt="Away Team" 
                      className="w-8 h-8 object-contain"
                    />
                    <span className="text-xs">{latestGame.opponent || 'Visitante'}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-futsal-light rounded-lg p-4 text-center">
              <p>Nenhum resultado disponível.</p>
            </div>
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
