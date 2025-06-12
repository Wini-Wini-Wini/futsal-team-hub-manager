
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Game {
  id: string;
  title?: string;
  type?: string;
  date: string;
  time: string;
  location: string;
  opponent?: string;
  uniform?: string;
  home_score?: number;
  away_score?: number;
  home_team_logo?: string;
  away_team_logo?: string;
  created_by: string;
  created_at: string;
}

export interface Training {
  id: string;
  title?: string;
  type?: string;
  date: string;
  time: string;
  location: string;
  uniform?: string;
  created_by: string;
  created_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  content?: string;
  priority: string;
  author: string;
  date: string;
  voting: boolean;
  votes: any;
  read: string[];
  created_by: string;
  created_at: string;
  profiles?: {
    name: string;
    role: string;
  };
}

export interface Post {
  id: string;
  content: string;
  image_url?: string;
  media_url?: string;
  created_by: string;
  created_at: string;
  profiles?: {
    id: string;
    name: string;
    avatar_url?: string;
    role: string;
  };
}

interface DataContextType {
  games: Game[];
  trainings: Training[];
  announcements: Announcement[];
  posts: Post[];
  isLoading: boolean;
  fetchGames: () => Promise<void>;
  fetchTrainings: () => Promise<void>;
  fetchAnnouncements: () => Promise<void>;
  fetchPosts: () => Promise<void>;
  fetchFeedback: (targetType: 'game' | 'training', targetId: string) => Promise<any[]>;
  fetchData: () => Promise<void>;
  addGame: (gameData: any) => Promise<{ success: boolean; error?: string }>;
  addTraining: (trainingData: any) => Promise<{ success: boolean; error?: string }>;
  addAnnouncement: (announcementData: any) => Promise<{ success: boolean; error?: string }>;
  markAnnouncementAsRead: (announcementId: string) => Promise<void>;
  voteOnAnnouncement: (announcementId: string, vote: 'yes' | 'no') => Promise<void>;
  getUnreadAnnouncements: () => Announcement[];
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
  const [games, setGames] = useState<Game[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchGames = async () => {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('date', { ascending: true });
      
      if (error) {
        console.error('Error fetching games:', error);
        return;
      }
      
      if (data) {
        const transformedGames = data.map(game => ({
          ...game,
          title: game.opponent ? `vs ${game.opponent}` : 'Jogo',
          type: 'game'
        }));
        setGames(transformedGames);
      }
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  const fetchTrainings = async () => {
    try {
      const { data, error } = await supabase
        .from('trainings')
        .select('*')
        .order('date', { ascending: true });
      
      if (error) {
        console.error('Error fetching trainings:', error);
        return;
      }
      
      if (data) {
        const transformedTrainings = data.map(training => ({
          ...training,
          title: 'Treino',
          type: 'training'
        }));
        setTrainings(transformedTrainings);
      }
    } catch (error) {
      console.error('Error fetching trainings:', error);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching announcements:', error);
        return;
      }
      
      if (data) {
        const transformedAnnouncements = data.map(announcement => ({
          ...announcement,
          content: announcement.message,
          author: announcement.author || 'Usuário',
          profiles: {
            name: announcement.author || 'Usuário',
            role: 'player'
          }
        }));
        setAnnouncements(transformedAnnouncements);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching posts:', error);
        return;
      }
      
      if (data) {
        const transformedPosts = data.map(post => ({
          ...post,
          image_url: post.media_url,
          profiles: {
            id: post.created_by,
            name: 'Usuário',
            avatar_url: undefined,
            role: 'player'
          }
        }));
        setPosts(transformedPosts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchFeedback = async (targetType: 'game' | 'training', targetId: string) => {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select(`
          *,
          profiles!feedback_user_id_fkey (
            name,
            avatar_url
          )
        `)
        .eq('target_type', targetType)
        .eq('target_id', targetId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching feedback:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching feedback:', error);
      return [];
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    await Promise.all([
      fetchGames(),
      fetchTrainings(),
      fetchAnnouncements(),
      fetchPosts()
    ]);
    setIsLoading(false);
  };

  const addGame = async (gameData: any) => {
    try {
      const transformedData = {
        created_by: gameData.created_by,
        date: gameData.date,
        time: gameData.time,
        location: gameData.location,
        opponent: gameData.opponent,
        uniform: gameData.uniform || 'home'
      };

      const { error } = await supabase
        .from('games')
        .insert([transformedData]);
      
      if (error) {
        console.error('Error adding game:', error);
        return { success: false, error: error.message };
      }
      
      await fetchGames();
      return { success: true };
    } catch (error) {
      console.error('Error adding game:', error);
      return { success: false, error: 'Erro ao adicionar jogo' };
    }
  };

  const addTraining = async (trainingData: any) => {
    try {
      const transformedData = {
        created_by: trainingData.created_by,
        date: trainingData.date,
        time: trainingData.time,
        location: trainingData.location,
        uniform: trainingData.uniform || 'training'
      };

      const { error } = await supabase
        .from('trainings')
        .insert([transformedData]);
      
      if (error) {
        console.error('Error adding training:', error);
        return { success: false, error: error.message };
      }
      
      await fetchTrainings();
      return { success: true };
    } catch (error) {
      console.error('Error adding training:', error);
      return { success: false, error: 'Erro ao adicionar treino' };
    }
  };

  const addAnnouncement = async (announcementData: any) => {
    try {
      const transformedData = {
        created_by: announcementData.created_by,
        title: announcementData.title,
        message: announcementData.message,
        author: announcementData.author,
        priority: 'normal',
        date: new Date().toISOString().split('T')[0],
        voting: announcementData.voting || false,
        votes: { yes: [], no: [] },
        read: []
      };

      const { error } = await supabase
        .from('announcements')
        .insert([transformedData]);
      
      if (error) {
        console.error('Error adding announcement:', error);
        return { success: false, error: error.message };
      }
      
      await fetchAnnouncements();
      return { success: true };
    } catch (error) {
      console.error('Error adding announcement:', error);
      return { success: false, error: 'Erro ao adicionar aviso' };
    }
  };

  const markAnnouncementAsRead = async (announcementId: string) => {
    // Implementation placeholder
    console.log('Mark as read:', announcementId);
  };

  const voteOnAnnouncement = async (announcementId: string, vote: 'yes' | 'no') => {
    // Implementation placeholder
    console.log('Vote:', announcementId, vote);
  };

  const getUnreadAnnouncements = () => {
    // Implementation placeholder
    return announcements;
  };

  return (
    <DataContext.Provider value={{
      games,
      trainings,
      announcements,
      posts,
      isLoading,
      fetchGames,
      fetchTrainings,
      fetchAnnouncements,
      fetchPosts,
      fetchFeedback,
      fetchData,
      addGame,
      addTraining,
      addAnnouncement,
      markAnnouncementAsRead,
      voteOnAnnouncement,
      getUnreadAnnouncements,
    }}>
      {children}
    </DataContext.Provider>
  );
};
