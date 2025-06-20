
import React, { useEffect } from 'react';
import Header from '../components/Header';
import { useData } from '../contexts/DataContext';
import GameCard from '../components/GameCard';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, MapPin, Shirt, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FeedbackForm from '@/components/FeedbackForm';
import FeedbackList from '@/components/FeedbackList';

const AgendaPage: React.FC = () => {
  const { games, trainings, fetchGames, fetchTrainings, fetchFeedback } = useData();
  const { profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchGames();
    fetchTrainings();
  }, []);

  const upcomingGames = games.filter(game => new Date(game.date) >= new Date());
  const pastGames = games.filter(game => new Date(game.date) < new Date());
  const upcomingTrainings = trainings.filter(training => new Date(training.date) >= new Date());
  const pastTrainings = trainings.filter(training => new Date(training.date) < new Date());

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

  const renderTrainingCard = (training: any, isPast: boolean = false) => {
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
          </div>

          {/* Feedback section for past trainings */}
          {isPast && (
            <div className="mt-6 pt-6 border-t border-blue-200">
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-blue-900 mb-2 flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Feedback do Treino
                </h4>
              </div>
              
              <FeedbackList 
                targetType="training" 
                targetId={training.id} 
              />
              
              {!isCoach && (
                <div className="mt-4">
                  <FeedbackForm
                    targetType="training"
                    targetId={training.id}
                    targetTitle={`Treino - ${capitalize(dayOfWeek)}, ${date}`}
                    onFeedbackSubmitted={() => {
                      // Refresh feedback list
                      fetchFeedback('training', training.id);
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 font-inter">
      <Header title="Agenda" showBackButton={true} />
      
      <div className="pt-20 p-6 pb-32 space-y-6 max-w-4xl mx-auto min-h-screen">
        <Tabs defaultValue="games" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-sm">
            <TabsTrigger value="games" className="text-white data-[state=active]:bg-white data-[state=active]:text-purple-900">
              Jogos
            </TabsTrigger>
            <TabsTrigger value="trainings" className="text-white data-[state=active]:bg-white data-[state=active]:text-purple-900">
              Treinos
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="games" className="space-y-6 mt-6">
            {/* Próximos Jogos */}
            {upcomingGames.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Próximos Jogos</h2>
                <div className="space-y-4">
                  {upcomingGames.map(game => 
                    <GameCard key={game.id} game={game} />
                  )}
                </div>
              </div>
            )}

            {/* Jogos Passados */}
            {pastGames.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Jogos Passados</h2>
                <div className="space-y-4">
                  {pastGames.map(game => 
                    <GameCard key={game.id} game={game} showResult={true} />
                  )}
                </div>
              </div>
            )}

            {upcomingGames.length === 0 && pastGames.length === 0 && (
              <Card className="bg-gradient-to-r from-white to-purple-50 border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <p className="text-purple-600 text-lg">Nenhum jogo encontrado</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="trainings" className="space-y-6 mt-6">
            {/* Próximos Treinos */}
            {upcomingTrainings.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Próximos Treinos</h2>
                <div className="space-y-4">
                  {upcomingTrainings.map(training => 
                    renderTrainingCard(training, false)
                  )}
                </div>
              </div>
            )}

            {/* Treinos Passados */}
            {pastTrainings.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Treinos Passados</h2>
                <div className="space-y-4">
                  {pastTrainings.map(training => 
                    renderTrainingCard(training, true)
                  )}
                </div>
              </div>
            )}

            {upcomingTrainings.length === 0 && pastTrainings.length === 0 && (
              <Card className="bg-gradient-to-r from-white to-purple-50 border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <p className="text-purple-600 text-lg">Nenhum treino encontrado</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AgendaPage;
