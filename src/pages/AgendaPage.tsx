
import React, { useState } from 'react';
import Header from '../components/Header';
import TabBar from '../components/TabBar';
import { useData, Game, Training } from '../contexts/DataContext';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Edit } from 'lucide-react';

const AgendaPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { games, trainings } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const tabs = ['Próximos jogos', 'Próximos treinos'];

  // Sort games and trainings by date
  const sortedGames = [...games]
    .filter(game => new Date(game.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const sortedTrainings = [...trainings]
    .filter(training => new Date(training.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const formatDate = (dateStr: string) => {
    const date = parseISO(dateStr);
    return {
      dayOfWeek: capitalize(format(date, "EEEE", { locale: ptBR })),
      date: format(date, "dd 'de' MMMM", { locale: ptBR })
    };
  };

  // Function to capitalize first letter
  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  
  const isCoach = user?.role === 'coach';

  return (
    <div className="flex-1 pb-20">
      <Header title="Agenda" />
      <TabBar 
        tabs={tabs} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      <div className="p-4">
        {activeTab === 0 ? (
          // Games
          <div className="space-y-4">
            {sortedGames.length > 0 ? (
              sortedGames.map((game) => {
                const { dayOfWeek, date } = formatDate(game.date);
                return (
                  <div 
                    key={game.id} 
                    className="bg-white rounded-lg p-4 shadow-sm relative"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{dayOfWeek}, {date}</h3>
                        <div className="text-sm text-gray-600 mt-1">
                          <p className="flex items-center">
                            <span className="mr-1">📍</span> {game.location}
                          </p>
                          <p className="flex items-center">
                            <span className="mr-1">👕</span> Uniforme: {game.uniform}
                          </p>
                          <p className="flex items-center">
                            <span className="mr-1">🕒</span> Horário: {game.time}
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
                        </div>
                        <div className="px-2">
                          <div className="text-lg font-bold">
                            {game.homeScore ?? 0} - {game.awayScore ?? 0}
                          </div>
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
                    
                    {isCoach && (
                      <button 
                        className="absolute bottom-2 right-2 text-futsal-primary"
                        onClick={() => navigate(`/edit-game/${game.id}`)}
                      >
                        <Edit size={18} />
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center p-8 text-gray-500">
                Não há jogos agendados
              </div>
            )}
          </div>
        ) : (
          // Trainings
          <div className="space-y-4">
            {sortedTrainings.length > 0 ? (
              sortedTrainings.map((training) => {
                return (
                  <div 
                    key={training.id} 
                    className="bg-white rounded-lg p-4 shadow-sm relative"
                  >
                    <h3 className="font-bold">{format(parseISO(training.date), "dd 'de' MMMM", { locale: ptBR })}</h3>
                    <div className="text-sm text-gray-600 mt-1">
                      <p className="flex items-center">
                        <span className="mr-1">📍</span> {training.location}
                      </p>
                      <p className="flex items-center">
                        <span className="mr-1">🕒</span> {training.time}
                      </p>
                      <p className="flex items-center">
                        <span className="mr-1">👕</span> {training.uniform}
                      </p>
                    </div>
                    
                    {isCoach && (
                      <button 
                        className="absolute bottom-2 right-2 text-futsal-primary"
                        onClick={() => navigate(`/edit-training/${training.id}`)}
                      >
                        <Edit size={18} />
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center p-8 text-gray-500">
                Não há treinos agendados
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgendaPage;
