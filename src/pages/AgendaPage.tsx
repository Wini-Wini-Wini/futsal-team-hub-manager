
import React, { useState } from 'react';
import Header from '../components/Header';
import TabBar from '../components/TabBar';
import { useData, Training } from '../contexts/DataContext';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Edit, RefreshCw, Calendar, MapPin, Clock, Shirt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import GameCard from '@/components/GameCard';

const AgendaPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { games, trainings, isLoading, fetchData } = useData();
  const { profile } = useAuth();
  const navigate = useNavigate();
  
  const tabs = ['Próximos jogos', 'Próximos treinos'];

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

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  
  const isCoach = profile?.role === 'coach';
  
  const handleRefresh = () => {
    fetchData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <Header 
        title="Agenda" 
        rightElement={
          <Button variant="ghost" size="icon" onClick={handleRefresh}>
            <RefreshCw className={`h-5 w-5 text-white ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        }
      />
      
      <div className="bg-white/10 backdrop-blur-sm">
        <TabBar 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
      </div>

      <div className="p-6 pb-32">
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <div className="text-center">
              <RefreshCw className="h-12 w-12 animate-spin text-white mb-4 mx-auto" />
              <p className="text-white font-medium">Carregando agenda...</p>
            </div>
          </div>
        ) : activeTab === 0 ? (
          // Games
          <div className="space-y-6">
            {sortedGames.length > 0 ? (
              sortedGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))
            ) : (
              <Card className="bg-gradient-to-br from-white to-purple-50 border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <Calendar className="h-16 w-16 text-purple-400 mx-auto mb-6" />
                  <h3 className="text-xl font-bold text-purple-800 mb-2">Nenhum jogo agendado</h3>
                  <p className="text-purple-600">Os próximos jogos aparecerão aqui</p>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          // Trainings
          <div className="space-y-6">
            {sortedTrainings.length > 0 ? (
              sortedTrainings.map((training) => {
                const { dayOfWeek, date } = formatDate(training.date);
                return (
                  <Card 
                    key={training.id} 
                    className="overflow-hidden shadow-lg border-0 bg-gradient-to-br from-white to-blue-50 hover:shadow-xl transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-bold text-xl text-gray-900 mb-4">
                            {dayOfWeek}, {date}
                          </h3>
                          
                          <div className="space-y-3">
                            <div className="flex items-center text-blue-700">
                              <MapPin className="mr-3 h-5 w-5" />
                              <span className="font-medium">{training.location}</span>
                            </div>
                            <div className="flex items-center text-blue-700">
                              <Clock className="mr-3 h-5 w-5" />
                              <span className="font-medium">{training.time}</span>
                            </div>
                            <div className="flex items-center text-blue-700">
                              <Shirt className="mr-3 h-5 w-5" />
                              <span className="font-medium">{training.uniform}</span>
                            </div>
                          </div>
                        </div>
                        
                        {isCoach && (
                          <Button 
                            variant="outline"
                            size="sm"
                            className="text-blue-600 border-blue-300 hover:bg-blue-50 hover:border-blue-400"
                            onClick={() => navigate(`/edit-training/${training.id}`)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card className="bg-gradient-to-br from-white to-blue-50 border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <Calendar className="h-16 w-16 text-blue-400 mx-auto mb-6" />
                  <h3 className="text-xl font-bold text-blue-800 mb-2">Nenhum treino agendado</h3>
                  <p className="text-blue-600">Os próximos treinos aparecerão aqui</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgendaPage;
