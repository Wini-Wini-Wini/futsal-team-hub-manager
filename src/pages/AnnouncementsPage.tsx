
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import TabBar from '../components/TabBar';
import { useData, Announcement } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { format, parseISO } from 'date-fns';
import { Edit, RefreshCw, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const AnnouncementsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { announcements, markAnnouncementAsRead, voteOnAnnouncement, isLoading, fetchData } = useData();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const tabs = ['Não lidos', 'Lidos'];
  const [hasVisitedPage, setHasVisitedPage] = useState(false);
  
  // Mark as visited after a delay
  useEffect(() => {
    if (activeTab === 0) {
      setHasVisitedPage(false);
      const timer = setTimeout(() => {
        setHasVisitedPage(true);
      }, 15000);
      
      return () => clearTimeout(timer);
    }
  }, [activeTab]);
  
  // Mark announcements as read only after the delay has passed
  useEffect(() => {
    if (user && activeTab === 0 && hasVisitedPage) {
      const unreadAnnouncements = getUnreadAnnouncements();
      unreadAnnouncements.forEach(announcement => {
        markAnnouncementAsRead(announcement.id);
      });
    }
  }, [hasVisitedPage, activeTab, user]);
  
  const isCoach = profile?.role === 'coach';
  
  const getUnreadAnnouncements = () => {
    if (!user?.id) return [];
    return announcements.filter(ann => !ann.read.includes(user.id));
  };
  
  const getReadAnnouncements = () => {
    if (!user?.id) return [];
    return announcements.filter(ann => ann.read.includes(user.id));
  };
  
  const handleVote = (announcement: Announcement, vote: 'yes' | 'no') => {
    voteOnAnnouncement(announcement.id, vote);
    
    toast({
      title: "Voto registrado",
      description: `Você votou ${vote === 'yes' ? 'Sim' : 'Não'} para "${announcement.title}"`,
    });
  };
  
  const getUserVote = (announcement: Announcement) => {
    if (!user?.id || !announcement.votes) return null;
    
    if (announcement.votes.yes.includes(user.id)) {
      return 'yes';
    } else if (announcement.votes.no.includes(user.id)) {
      return 'no';
    }
    
    return null;
  };

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

  const displayedAnnouncements = activeTab === 0 
    ? getUnreadAnnouncements() 
    : getReadAnnouncements();
    
  const handleRefresh = () => {
    fetchData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <Header 
        title="Avisos"
        showHomeButton={true}
        rightElement={
          <Button variant="ghost" size="icon" onClick={handleRefresh}>
            <RefreshCw className={`h-5 w-5 text-white ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        }
      />
      
      <div className="px-6 py-4">
        <TabBar 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
      </div>

      <div className="px-6 pb-32">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="flex flex-col items-center space-y-4">
              <RefreshCw className="h-8 w-8 animate-spin text-purple-300" />
              <p className="text-purple-200 font-medium">Carregando avisos...</p>
            </div>
          </div>
        ) : displayedAnnouncements.length > 0 ? (
          <div className="space-y-6">
            {displayedAnnouncements.map((announcement) => {
              const userVote = getUserVote(announcement);
              
              return (
                <Card 
                  key={announcement.id} 
                  className="relative overflow-hidden shadow-lg border-0 bg-gradient-to-br from-white to-purple-50"
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${getPriorityColor(announcement.priority)} border-2`}>
                          <AlertTriangle size={20} />
                        </div>
                        <div>
                          <h3 className={`font-bold text-lg ${getPriorityColor(announcement.priority).split(' ')[0]}`}>
                            {announcement.title}
                          </h3>
                          <div className="flex items-center space-x-2 text-sm text-purple-600">
                            <span className="font-medium">{announcement.author}</span>
                            <span>•</span>
                            <span>{format(parseISO(announcement.date), "dd 'de' MMMM", { locale: require('date-fns/locale/pt-BR') })}</span>
                          </div>
                        </div>
                      </div>
                      
                      {isCoach && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-purple-600 hover:bg-purple-100"
                          onClick={() => navigate(`/edit-announcement/${announcement.id}`)}
                        >
                          <Edit size={18} />
                        </Button>
                      )}
                    </div>
                    
                    <p className="text-gray-800 leading-relaxed mb-4">{announcement.message}</p>
                    
                    {announcement.voting && (
                      <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-purple-700">Votação:</span>
                          <div className="flex space-x-3">
                            <button 
                              className={`px-4 py-2 text-sm rounded-lg font-medium transition-all ${
                                userVote === 'yes' 
                                  ? 'bg-green-600 text-white shadow-md' 
                                  : 'bg-white text-green-600 border border-green-200 hover:bg-green-50'
                              }`}
                              onClick={() => handleVote(announcement, 'yes')}
                            >
                              Sim ({announcement.votes?.yes.length || 0})
                            </button>
                            <button 
                              className={`px-4 py-2 text-sm rounded-lg font-medium transition-all ${
                                userVote === 'no' 
                                  ? 'bg-red-600 text-white shadow-md' 
                                  : 'bg-white text-red-600 border border-red-200 hover:bg-red-50'
                              }`}
                              onClick={() => handleVote(announcement, 'no')}
                            >
                              Não ({announcement.votes?.no.length || 0})
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="bg-gradient-to-br from-white to-purple-50 border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="flex justify-center py-6">
                <AlertTriangle size={48} className="text-purple-400" />
              </div>
              <p className="text-purple-600 font-medium text-lg">
                {activeTab === 0 
                  ? "Não há avisos não lidos" 
                  : "Não há avisos lidos"}
              </p>
              <p className="text-purple-400 text-sm mt-2">
                {activeTab === 0 
                  ? "Novos avisos aparecerão aqui" 
                  : "Avisos lidos aparecerão aqui"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AnnouncementsPage;
