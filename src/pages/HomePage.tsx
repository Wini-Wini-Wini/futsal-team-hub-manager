
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData, Game } from '../contexts/DataContext';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { games } = useData();
  
  // Get next game
  const upcomingGames = games
    .filter(game => new Date(game.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const nextGame = upcomingGames.length > 0 ? upcomingGames[0] : null;

  const formatDate = (dateStr: string) => {
    const date = parseISO(dateStr);
    return format(date, "EEEE, dd 'de' MMMM", { locale: ptBR });
  };

  // Function to capitalize first letter
  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="flex-1">
      <header className="bg-futsal-primary text-white p-4">
        <h1 className="text-xl font-bold">
          Boa {getTimeOfDay()}, {user?.name?.split(' ')[0] || (user?.role === 'coach' ? 'Treinador(a)' : 'Atleta')}
        </h1>
      </header>

      <main className="p-4 flex-1">
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
                        src="/placeholder.svg" 
                        alt="Home Team" 
                        className="w-8 h-8"
                      />
                      <span className="text-xs">Home</span>
                    </div>
                    <div className="px-2">
                      <div className="text-lg font-bold">
                        {nextGame.homeScore ?? 0} - {nextGame.awayScore ?? 0}
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <img 
                        src="/placeholder.svg" 
                        alt="Away Team" 
                        className="w-8 h-8"
                      />
                      <span className="text-xs">Away</span>
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

        {/* Latest Results Section */}
        <section>
          <h2 className="text-lg font-semibold text-futsal-dark mb-2">Últimos resultados:</h2>
          <div className="bg-futsal-light rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-green-500">Vitória!!</h3>
                <div className="text-sm">
                  <p>12' Fulana de Tal</p>
                  <p>21' Jandira Top</p>
                  <p>45' Angela M. de Aço</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex flex-col items-center">
                  <img 
                    src="/placeholder.svg" 
                    alt="Home Team" 
                    className="w-8 h-8"
                  />
                </div>
                <div className="text-xl font-bold">
                  3 - 1
                </div>
                <div className="flex flex-col items-center">
                  <img 
                    src="/placeholder.svg" 
                    alt="Away Team" 
                    className="w-8 h-8"
                  />
                </div>
              </div>
            </div>
          </div>
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
