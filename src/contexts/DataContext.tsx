
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface Game {
  id: string;
  date: string;
  location: string;
  opponent: string;
  uniform: string;
  time: string;
  homeScore?: number;
  awayScore?: number;
}

export interface Training {
  id: string;
  date: string;
  location: string;
  uniform: string;
  time: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
  author: string;
  voting?: boolean;
  read: string[];
  votes?: {
    yes: string[];
    no: string[];
  };
}

interface DataContextType {
  games: Game[];
  trainings: Training[];
  announcements: Announcement[];
  addGame: (game: Omit<Game, 'id'>) => void;
  addTraining: (training: Omit<Training, 'id'>) => void;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'read'>) => void;
  markAnnouncementAsRead: (id: string) => void;
  voteOnAnnouncement: (id: string, vote: 'yes' | 'no') => void;
  getReadAnnouncements: () => Announcement[];
  getUnreadAnnouncements: () => Announcement[];
}

// Mock initial data
const initialGames: Game[] = [
  {
    id: '1',
    date: '2025-05-08',
    location: 'Ginásio AABB',
    opponent: 'Equipo Rival',
    uniform: 'A',
    time: '15:00',
    homeScore: 0,
    awayScore: 0,
  },
  {
    id: '2',
    date: '2025-05-16',
    location: 'Ginásio AABB',
    opponent: 'Equipo Rival',
    uniform: 'B',
    time: '15:00',
    homeScore: 0,
    awayScore: 0,
  },
  {
    id: '3',
    date: '2025-05-19',
    location: 'Ginásio AABB',
    opponent: 'Equipo Rival',
    uniform: 'A',
    time: '15:00',
    homeScore: 0,
    awayScore: 0,
  }
];

const initialTrainings: Training[] = [
  {
    id: '1',
    date: '2025-05-07',
    location: 'Quadra do Exponencial',
    uniform: 'Uniforme de Treino',
    time: '14:20',
  }
];

const initialAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Alteração da Data do treino',
    message: 'Treino de 07 de Maio',
    date: '2025-05-05',
    priority: 'medium',
    author: 'Treinador',
    read: [],
  },
  {
    id: '2',
    title: 'Cartão Vermelho',
    message: 'Fulana Seila da Silva',
    date: '2025-05-06',
    priority: 'high',
    author: 'Treinador',
    read: [],
  }
];

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { user } = useAuth();
  
  // Initialize state from localStorage or use initial data
  const [games, setGames] = useState<Game[]>(() => {
    const storedGames = localStorage.getItem('futsalGames');
    return storedGames ? JSON.parse(storedGames) : initialGames;
  });
  
  const [trainings, setTrainings] = useState<Training[]>(() => {
    const storedTrainings = localStorage.getItem('futsalTrainings');
    return storedTrainings ? JSON.parse(storedTrainings) : initialTrainings;
  });
  
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const storedAnnouncements = localStorage.getItem('futsalAnnouncements');
    return storedAnnouncements ? JSON.parse(storedAnnouncements) : initialAnnouncements;
  });

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('futsalGames', JSON.stringify(games));
  }, [games]);

  useEffect(() => {
    localStorage.setItem('futsalTrainings', JSON.stringify(trainings));
  }, [trainings]);

  useEffect(() => {
    localStorage.setItem('futsalAnnouncements', JSON.stringify(announcements));
  }, [announcements]);

  const addGame = (game: Omit<Game, 'id'>) => {
    const newGame = {
      ...game,
      id: crypto.randomUUID(),
    };
    setGames((prev) => [...prev, newGame]);
  };

  const addTraining = (training: Omit<Training, 'id'>) => {
    const newTraining = {
      ...training,
      id: crypto.randomUUID(),
    };
    setTrainings((prev) => [...prev, newTraining]);
  };

  const addAnnouncement = (announcement: Omit<Announcement, 'id' | 'read'>) => {
    const newAnnouncement = {
      ...announcement,
      id: crypto.randomUUID(),
      read: [],
    };
    setAnnouncements((prev) => [...prev, newAnnouncement]);
  };

  const markAnnouncementAsRead = (id: string) => {
    if (!user) return;
    
    setAnnouncements((prev) => 
      prev.map((ann) => 
        ann.id === id && !ann.read.includes(user.id)
          ? { ...ann, read: [...ann.read, user.id] }
          : ann
      )
    );
  };

  const voteOnAnnouncement = (id: string, vote: 'yes' | 'no') => {
    if (!user) return;
    
    setAnnouncements((prev) => 
      prev.map((ann) => {
        if (ann.id !== id) return ann;
        
        if (!ann.votes) {
          ann.votes = { yes: [], no: [] };
        }
        
        // Remove user from both vote lists first
        const filteredYes = ann.votes.yes.filter(userId => userId !== user.id);
        const filteredNo = ann.votes.no.filter(userId => userId !== user.id);
        
        // Add user to the appropriate vote list
        return {
          ...ann,
          votes: {
            yes: vote === 'yes' ? [...filteredYes, user.id] : filteredYes,
            no: vote === 'no' ? [...filteredNo, user.id] : filteredNo
          }
        };
      })
    );
  };

  const getReadAnnouncements = () => {
    if (!user) return [];
    return announcements.filter((ann) => ann.read.includes(user.id));
  };

  const getUnreadAnnouncements = () => {
    if (!user) return [];
    return announcements.filter((ann) => !ann.read.includes(user.id));
  };

  return (
    <DataContext.Provider
      value={{
        games,
        trainings,
        announcements,
        addGame,
        addTraining,
        addAnnouncement,
        markAnnouncementAsRead,
        voteOnAnnouncement,
        getReadAnnouncements,
        getUnreadAnnouncements
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
