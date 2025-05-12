
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import TabBar from '../components/TabBar';
import { useData, Announcement } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { format, parseISO } from 'date-fns';
import { Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const AnnouncementsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { announcements, markAnnouncementAsRead, voteOnAnnouncement } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const tabs = ['Não lidos', 'Lidos'];
  
  useEffect(() => {
    // Mark announcements as seen when they are viewed
    if (user && activeTab === 0) {
      const unreadAnnouncements = getUnreadAnnouncements();
      unreadAnnouncements.forEach(announcement => {
        markAnnouncementAsRead(announcement.id);
      });
    }
  }, [activeTab]);
  
  const isCoach = user?.role === 'coach';
  
  const getUnreadAnnouncements = () => {
    if (!user) return [];
    return announcements.filter(ann => !ann.read.includes(user.id));
  };
  
  const getReadAnnouncements = () => {
    if (!user) return [];
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
    if (!user || !announcement.votes) return null;
    
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

  return (
    <div className="flex-1 pb-20">
      <Header title="Avisos" />
      <TabBar 
        tabs={tabs} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      <div className="p-4">
        {displayedAnnouncements.length > 0 ? (
          <div className="space-y-4">
            {displayedAnnouncements.map((announcement) => {
              const userVote = getUserVote(announcement);
              
              return (
                <div 
                  key={announcement.id} 
                  className="bg-white rounded-lg p-4 shadow-sm relative"
                >
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
                          Sim
                        </button>
                        <button 
                          className={`px-2 py-1 text-sm rounded ${
                            userVote === 'no' 
                              ? 'bg-futsal-red text-white' 
                              : 'bg-gray-100'
                          }`}
                          onClick={() => handleVote(announcement, 'no')}
                        >
                          Não
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {isCoach && (
                    <button 
                      className="absolute bottom-2 right-2 text-futsal-primary"
                      onClick={() => navigate(`/edit-announcement/${announcement.id}`)}
                    >
                      <Edit size={18} />
                    </button>
                  )}
                </div>
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
