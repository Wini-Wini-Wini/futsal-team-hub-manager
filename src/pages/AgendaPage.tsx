
import React, { useEffect } from 'react';
import Header from '../components/Header';
import { useData } from '../contexts/DataContext';
import GameCard from '../components/GameCard';
import { Card, CardContent } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Clock, MapPin, Shirt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AgendaPage: React.FC = () => {
  const { games, trainings, fetchGames, fetchTrainings } = useData();
  const { profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchGames();
    fetchTrainings();
  }, []);

  // Combine games and trainings and sort by date
  const allEvents = [
    ...games.map(game => ({ ...game, type: 'game' })),
    ...trainings.map(training => ({ ...training, type: 'training' }))
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const upcomingEvents = allEvents.filter(event => new Date(event.date) >= new Date());
  const pastEvents = allEvents.filter(event => new Date(event.date) < new Date());

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

  const isCoach = profile?.role === 'coach';

  const renderTrainingCard = (training: any) => {
    const { dayOfWeek, date } = formatDate(training.date);
    
    return (
      <Card key={training.id} className="overflow-hidden shadow-lg border-0 bg-gradient-to-br from-white to-blue-50 hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="font-bold text-xl text-gray-900 mb-2">
                {capitalize(dayOfWeek)}, {date}
              </h3>
              
              <div className="mb-4 p-4 bg-blue-100 rounded-lg text-center">
                <h4 className="text-lg font-bold text-blue-900 mb-2">Treino</h4>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-blue-700">
                  <MapPin className="mr-3 h-5 w-5" />
                  <span className="font-medium">{training.location}</span>
                </div>
                <div className="flex items-center text-blue-700">
                  <Clock className="mr-3 h-5 w-5" />
                  <span className="font-medium">{training.time}</span>
                </div>
                {training.uniform && (
                  <div className="flex items-center text-blue-700">
                    <Shirt className="mr-3 h-5 w-5" />
                    <span className="font-medium">Uniforme {training.uniform}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
              {isCoach && (
                <Button 
                  variant="outline"
                  size="sm"
                  className="text-blue-600 border-blue-300 hover:bg-blue-50 hover:border-blue-400"
                  onClick={() => navigate(`/edit-training/${training.id}`)}
                >
                  Editar
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 font-inter">
      <Header 
        title="Agenda" 
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
      
      <div className="p-6 pb-32 space-y-6 max-w-4xl mx-auto min-h-screen">
        {/* Próximos Eventos */}
        {upcomingEvents.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Próximos Eventos</h2>
            <div className="space-y-4">
              {upcomingEvents.map(event => 
                event.type === 'game' 
                  ? <GameCard key={event.id} game={event} />
                  : renderTrainingCard(event)
              )}
            </div>
          </div>
        )}

        {/* Eventos Passados */}
        {pastEvents.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Eventos Passados</h2>
            <div className="space-y-4">
              {pastEvents.map(event => 
                event.type === 'game' 
                  ? <GameCard key={event.id} game={event} showResult={true} />
                  : renderTrainingCard(event)
              )}
            </div>
          </div>
        )}

        {allEvents.length === 0 && (
          <Card className="bg-gradient-to-r from-white to-purple-50 border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-purple-600 text-lg">Nenhum evento encontrado</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Fixed Add Button for Coaches */}
      {isCoach && (
        <Button
          onClick={() => navigate('/add')}
          className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg z-10"
          size="icon"
        >
          <Plus className="h-6 w-6 text-white" />
        </Button>
      )}
    </div>
  );
};

export default AgendaPage;
