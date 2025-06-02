import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Game {
  id: string;
  date: string;
  location: string;
  opponent: string;
  uniform: string;
  time: string;
  homeScore?: number;
  awayScore?: number;
  home_team_logo?: string;
  away_team_logo?: string;
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
  isLoading: boolean;
  addGame: (game: Omit<Game, 'id'>) => Promise<void>;
  addTraining: (training: Omit<Training, 'id'>) => Promise<void>;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'read'>) => Promise<void>;
  markAnnouncementAsRead: (id: string) => Promise<void>;
  voteOnAnnouncement: (id: string, vote: 'yes' | 'no') => Promise<void>;
  getReadAnnouncements: () => Announcement[];
  getUnreadAnnouncements: () => Announcement[];
  fetchData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  
  // State for data
  const [games, setGames] = useState<Game[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // Fetch data from Supabase
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch games
      const { data: gamesData, error: gamesError } = await supabase
        .from('games')
        .select('*')
        .order('date', { ascending: true });
      
      if (gamesError) throw gamesError;
      
      // Format game data
      const formattedGames: Game[] = gamesData.map(game => ({
        id: game.id,
        date: game.date,
        location: game.location,
        opponent: game.opponent || '',
        uniform: game.uniform || '',
        time: game.time,
        homeScore: game.home_score,
        awayScore: game.away_score,
        home_team_logo: game.home_team_logo,
        away_team_logo: game.away_team_logo
      }));
      setGames(formattedGames);
      
      // Fetch trainings
      const { data: trainingsData, error: trainingsError } = await supabase
        .from('trainings')
        .select('*')
        .order('date', { ascending: true });
      
      if (trainingsError) throw trainingsError;
      
      // Format training data
      const formattedTrainings: Training[] = trainingsData.map(training => ({
        id: training.id,
        date: training.date,
        location: training.location,
        uniform: training.uniform || '',
        time: training.time
      }));
      setTrainings(formattedTrainings);
      
      // Fetch announcements
      const { data: announcementsData, error: announcementsError } = await supabase
        .from('announcements')
        .select('*')
        .order('date', { ascending: false });
      
      if (announcementsError) throw announcementsError;
      
      // Format announcement data
      const formattedAnnouncements: Announcement[] = announcementsData.map(announcement => ({
        id: announcement.id,
        title: announcement.title,
        message: announcement.message,
        date: announcement.date,
        priority: announcement.priority as 'high' | 'medium' | 'low',
        author: announcement.author,
        voting: announcement.voting || false,
        read: announcement.read || [],
        votes: announcement.votes as { yes: string[], no: string[] } || { yes: [], no: [] }
      }));
      setAnnouncements(formattedAnnouncements);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Ocorreu um erro ao carregar os dados",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const addGame = async (game: Omit<Game, 'id'>) => {
    try {
      if (!user?.id) {
        throw new Error('Usuário não autenticado');
      }
      
      const { data, error } = await supabase
        .from('games')
        .insert({
          date: game.date,
          location: game.location,
          opponent: game.opponent,
          uniform: game.uniform,
          time: game.time,
          home_score: game.homeScore || 0,
          away_score: game.awayScore || 0,
          home_team_logo: game.home_team_logo,
          away_team_logo: game.away_team_logo,
          created_by: user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Format the returned game
      const newGame: Game = {
        id: data.id,
        date: data.date,
        location: data.location,
        opponent: data.opponent || '',
        uniform: data.uniform || '',
        time: data.time,
        homeScore: data.home_score,
        awayScore: data.away_score,
        home_team_logo: data.home_team_logo,
        away_team_logo: data.away_team_logo
      };
      
      // Update local state
      setGames(prev => [...prev, newGame]);
      
    } catch (error) {
      console.error('Error adding game:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar o jogo",
        variant: "destructive"
      });
      throw error;
    }
  };

  const addTraining = async (training: Omit<Training, 'id'>) => {
    try {
      if (!user?.id) {
        throw new Error('Usuário não autenticado');
      }
      
      const { data, error } = await supabase
        .from('trainings')
        .insert({
          date: training.date,
          location: training.location,
          uniform: training.uniform,
          time: training.time,
          created_by: user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Format the returned training
      const newTraining: Training = {
        id: data.id,
        date: data.date,
        location: data.location,
        uniform: data.uniform || '',
        time: data.time
      };
      
      // Update local state
      setTrainings(prev => [...prev, newTraining]);
      
    } catch (error) {
      console.error('Error adding training:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar o treino",
        variant: "destructive"
      });
      throw error;
    }
  };

  const addAnnouncement = async (announcement: Omit<Announcement, 'id' | 'read'>) => {
    try {
      if (!user?.id) {
        throw new Error('Usuário não autenticado');
      }
      
      const { data, error } = await supabase
        .from('announcements')
        .insert({
          title: announcement.title,
          message: announcement.message,
          date: announcement.date,
          priority: announcement.priority,
          author: announcement.author,
          voting: announcement.voting || false,
          created_by: user.id,
          read: [],
          votes: { yes: [], no: [] }
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Format the returned announcement
      const newAnnouncement: Announcement = {
        id: data.id,
        title: data.title,
        message: data.message,
        date: data.date,
        priority: data.priority as 'high' | 'medium' | 'low',
        author: data.author,
        voting: data.voting || false,
        read: data.read || [],
        votes: data.votes as { yes: string[], no: string[] } || { yes: [], no: [] }
      };
      
      // Update local state
      setAnnouncements(prev => [...prev, newAnnouncement]);
      
    } catch (error) {
      console.error('Error adding announcement:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar o aviso",
        variant: "destructive"
      });
      throw error;
    }
  };

  const markAnnouncementAsRead = async (id: string) => {
    if (!user?.id) return;
    
    try {
      // Find the announcement locally
      const announcement = announcements.find(a => a.id === id);
      if (!announcement) return;
      
      // Don't update if already read by this user
      if (announcement.read.includes(user.id)) return;
      
      // Add user to the read array
      const updatedRead = [...announcement.read, user.id];
      
      // Update the database
      const { error } = await supabase
        .from('announcements')
        .update({ read: updatedRead })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setAnnouncements(prev => 
        prev.map(ann => 
          ann.id === id ? { ...ann, read: updatedRead } : ann
        )
      );
      
    } catch (error) {
      console.error('Error marking announcement as read:', error);
    }
  };

  const voteOnAnnouncement = async (id: string, vote: 'yes' | 'no') => {
    if (!user?.id) return;
    
    try {
      // Find the announcement locally
      const announcement = announcements.find(a => a.id === id);
      if (!announcement || !announcement.votes) return;
      
      // Remove user from both vote lists first
      const filteredYes = announcement.votes.yes.filter(userId => userId !== user.id);
      const filteredNo = announcement.votes.no.filter(userId => userId !== user.id);
      
      // Add user to the appropriate vote list
      const updatedVotes = {
        yes: vote === 'yes' ? [...filteredYes, user.id] : filteredYes,
        no: vote === 'no' ? [...filteredNo, user.id] : filteredNo
      };
      
      // Update the database
      const { error } = await supabase
        .from('announcements')
        .update({ votes: updatedVotes })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setAnnouncements(prev => 
        prev.map(ann => 
          ann.id === id ? { ...ann, votes: updatedVotes } : ann
        )
      );
      
    } catch (error) {
      console.error('Error voting on announcement:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao registrar seu voto",
        variant: "destructive"
      });
    }
  };

  const getReadAnnouncements = () => {
    if (!user?.id) return [];
    return announcements.filter((ann) => ann.read.includes(user.id));
  };

  const getUnreadAnnouncements = () => {
    if (!user?.id) return [];
    return announcements.filter((ann) => !ann.read.includes(user.id));
  };

  return (
    <DataContext.Provider
      value={{
        games,
        trainings,
        announcements,
        isLoading,
        addGame,
        addTraining,
        addAnnouncement,
        markAnnouncementAsRead,
        voteOnAnnouncement,
        getReadAnnouncements,
        getUnreadAnnouncements,
        fetchData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
