
import React, { useEffect } from 'react';
import Header from '../components/Header';
import { useData } from '../contexts/DataContext';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AnnouncementsPage: React.FC = () => {
  const { announcements, fetchAnnouncements } = useData();
  const { profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = parseISO(dateStr);
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500 hover:bg-red-600';
      case 'medium':
        return 'bg-amber-500 hover:bg-amber-600';
      case 'low':
        return 'bg-green-500 hover:bg-green-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Média';
      case 'low':
        return 'Baixa';
      default:
        return 'Normal';
    }
  };

  const isCoach = profile?.role === 'coach';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 font-inter">
      <Header title="Avisos" />
      
      <div className="pt-20 p-6 pb-32 space-y-4 max-w-4xl mx-auto min-h-screen">
        {announcements.length === 0 ? (
          <Card className="bg-gradient-to-r from-white to-purple-50 border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-purple-600 text-lg">Nenhum aviso encontrado</p>
            </CardContent>
          </Card>
        ) : (
          announcements.map((announcement) => (
            <Card key={announcement.id} className="bg-gradient-to-r from-white to-purple-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-bold text-xl text-purple-900">
                        {announcement.title}
                      </h3>
                      <Badge 
                        className={`text-white font-medium ${getPriorityColor(announcement.priority)}`}
                      >
                        {getPriorityText(announcement.priority)}
                      </Badge>
                    </div>
                    
                    <p className="text-purple-700 mb-4 leading-relaxed">
                      {announcement.message}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-purple-600">
                      <span className="font-medium">
                        Por: {announcement.author}
                      </span>
                      <span>
                        {formatDate(announcement.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Fixed Add Button for Coaches */}
      {isCoach && (
        <Button
          onClick={() => navigate('/add?tab=2')}
          className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg z-10"
          size="icon"
        >
          <Plus className="h-6 w-6 text-white" />
        </Button>
      )}
    </div>
  );
};

export default AnnouncementsPage;
