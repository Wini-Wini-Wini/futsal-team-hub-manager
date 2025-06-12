import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DataContextType {
  games: Game[];
  trainings: Training[];
  announcements: Announcement[];
  posts: Post[];
  fetchGames: () => Promise<void>;
  fetchTrainings: () => Promise<void>;
  fetchAnnouncements: () => Promise<void>;
  fetchPosts: () => Promise<void>;
  fetchFeedback: (targetType: 'game' | 'training', targetId: string) => Promise<any[]>;
  addGame: (gameData: any[]) => Promise<{ success: boolean; error?: string }>;
  addTraining: (trainingData: any[]) => Promise<{ success: boolean; error?: string }>;
  addAnnouncement: (announcementData: any[]) => Promise<{ success: boolean; error?: string }>;
}

// Fix the interface types to match database schema
interface Game {
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

interface Training {
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

interface Announcement {
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

interface Post {
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

interface Feedback {
  id: string;
  user_id: string;
  target_type: 'game' | 'training';
  target_id: string;
  comment: string;
  rating?: number;
  created_at: string;
  updated_at: string;
  profiles?: {
    name: string;
    avatar_url?: string;
  };
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
        // Transform data to match expected interface
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
        // Transform data to match expected interface
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
        .select(`
          *,
          profiles:created_by (
            name,
            role
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching announcements:', error);
        return;
      }
      
      if (data) {
        const transformedAnnouncements = data.map(announcement => ({
          ...announcement,
          content: announcement.message,
          author: announcement.profiles?.name || 'Usuário',
          profiles: {
            name: announcement.profiles?.name || 'Usuário',
            role: announcement.profiles?.role || 'player'
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
        .select(`
          *,
          profiles:created_by (
            id,
            name,
            avatar_url,
            role
          )
        `)
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
            id: post.profiles?.id || '',
            name: post.profiles?.name || 'Usuário',
            avatar_url: post.profiles?.avatar_url,
            role: post.profiles?.role || 'player'
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
          profiles:user_id (
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

  const addGame = async (gameData: any[]) => {
    try {
      // Transform the data to match database schema
      const transformedData = gameData.map(game => ({
        created_by: game.author_id,
        date: game.date,
        time: game.time,
        location: game.location,
        opponent: game.opponent,
        uniform: 'home' // default value
      }));

      const { error } = await supabase
        .from('games')
        .insert(transformedData);
      
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

  const addTraining = async (trainingData: any[]) => {
    try {
      // Transform the data to match database schema
      const transformedData = trainingData.map(training => ({
        created_by: training.author_id,
        date: training.date,
        time: training.time,
        location: training.location,
        uniform: 'training' // default value
      }));

      const { error } = await supabase
        .from('trainings')
        .insert(transformedData);
      
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

  const addAnnouncement = async (announcementData: any[]) => {
    try {
      // Transform the data to match database schema
      const transformedData = announcementData.map(announcement => ({
        created_by: announcement.author_id,
        title: announcement.title,
        message: announcement.content,
        priority: 'normal',
        date: new Date().toISOString().split('T')[0],
        voting: false,
        votes: {},
        read: []
      }));

      const { error } = await supabase
        .from('announcements')
        .insert(transformedData);
      
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

  return (
    <DataContext.Provider value={{
      games,
      trainings,
      announcements,
      posts,
      fetchGames,
      fetchTrainings,
      fetchAnnouncements,
      fetchPosts,
      fetchFeedback,
      addGame,
      addTraining,
      addAnnouncement,
    }}>
      {children}
    </DataContext.Provider>
  );
};
