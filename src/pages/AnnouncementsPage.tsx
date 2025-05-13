
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import TabBar from '../components/TabBar';
import { useData, Announcement } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { format, parseISO } from 'date-fns';
import { Edit, RefreshCw } from 'lucide-react';
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
      // Definir um temporizador mais longo (15 segundos) antes de marcar como lido
      const timer = setTimeout(() => {
        setHasVisitedPage(true);
      }, 15000); // 15 segundos
      
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

  // Determine color based on priority
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

  const displayedAnnouncements = activeTab === 0 
    ? getUnreadAnnouncements() 
    : getReadAnnouncements();
    
  const handleRefresh = () => {
    fetchData();
  };

  return (
    <div className="flex-1 pb-20">
      <Header 
        title="Avisos"
        showHomeButton={true}
        rightElement={
          <Button variant="ghost" size="icon" onClick={handleRefresh}>
            <RefreshCw className={`h-5 w-5 text-white ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        }
      />
      <TabBar 
        tabs={tabs} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <RefreshCw className="h-8 w-8 animate-spin text-futsal-primary" />
          </div>
        ) : displayedAnnouncements.length > 0 ? (
          <div className="space-y-4">
            {displayedAnnouncements.map((announcement) => {
              const userVote = getUserVote(announcement);
              
              return (
                <Card 
                  key={announcement.id} 
                  className="relative overflow-hidden"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between">
                      <h3 className={`font-bold ${getPriorityColor(announcement.priority)}`}>
                        {announcement.title}
                      </h3>
                      <span className="text-sm text-gray-500">{announcement.author}</span>
                    </div>
                    
                    <p className="mt-1 text-gray-700">{announcement.message}</p>
                    
                    {announcement.voting && (
                      <div className="mt-3 flex items-center space-x-4">
                        <span className="text-sm text-gray-600">Votação:</span>
                        <div className="space-x-2">
                          <button 
                            className={`px-2 py-1 text-sm rounded ${
                              userVote === 'yes' 
                                ? 'bg-futsal-green text-white' 
                                : 'bg-gray-100'
                            }`}
                            onClick={() => handleVote(announcement, 'yes')}
                          >
                            Sim ({announcement.votes?.yes.length || 0})
                          </button>
                          <button 
                            className={`px-2 py-1 text-sm rounded ${
                              userVote === 'no' 
                                ? 'bg-futsal-red text-white' 
                                : 'bg-gray-100'
                            }`}
                            onClick={() => handleVote(announcement, 'no')}
                          >
                            Não ({announcement.votes?.no.length || 0})
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {isCoach && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="absolute bottom-2 right-2 text-futsal-primary"
                        onClick={() => navigate(`/edit-announcement/${announcement.id}`)}
                      >
                        <Edit size={18} />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center p-8 text-gray-500">
            {activeTab === 0 
              ? "Não há avisos não lidos" 
              : "Não há avisos lidos"}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementsPage;
