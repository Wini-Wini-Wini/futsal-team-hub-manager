import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

export interface Game {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  opponent?: string;
  type: 'game';
  created_at: string;
}

export interface Training {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description?: string;
  type: 'training';
  created_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  created_at: string;
  author: {
    name: string;
    role: string;
  };
}

export interface Post {
  id: string;
  content: string;
  image_url?: string;
  created_at: string;
  author: {
    id: string;
    name: string;
    avatar_url?: string;
    role: string;
  };
}

export interface Feedback {
  id: string;
  user_id: string;
  target_type: 'game' | 'training';
  target_id: string;
  comment: string;
  rating?: number;
  created_at: string;
  profiles: {
    name: string;
    avatar_url?: string;
  };
}

interface DataContextType {
  games: Game[];
  trainings: Training[];
  announcements: Announcement[];
  posts: Post[];
  feedback: Feedback[];
  loading: boolean;
  fetchGames: () => Promise<void>;
  fetchTrainings: () => Promise<void>;
  fetchAnnouncements: () => Promise<void>;
  fetchPosts: () => Promise<void>;
  fetchFeedback: (targetType: 'game' | 'training', targetId: string) => Promise<Feedback[]>;
  addGame: (game: Omit<Game, 'id' | 'created_at' | 'type'>) => Promise<boolean>;
  addTraining: (training: Omit<Training, 'id' | 'created_at' | 'type'>) => Promise<boolean>;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'created_at' | 'author'>) => Promise<boolean>;
  addPost: (post: Omit<Post, 'id' | 'created_at' | 'author'>) => Promise<boolean>;
  addFeedback: (feedback: Omit<Feedback, 'id' | 'created_at' | 'profiles'>) => Promise<boolean>;
  updateGame: (id: string, game: Partial<Game>) => Promise<boolean>;
  updateTraining: (id: string, training: Partial<Training>) => Promise<boolean>;
  updateAnnouncement: (id: string, announcement: Partial<Announcement>) => Promise<boolean>;
  deleteGame: (id: string) => Promise<boolean>;
  deleteTraining: (id: string) => Promise<boolean>;
  deleteAnnouncement: (id: string) => Promise<boolean>;
  deletePost: (id: string) => Promise<boolean>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, profile } = useAuth();

  // Fetch data from Supabase
  const fetchGames = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setGames(data || []);
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrainings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('trainings')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setTrainings(data || []);
    } catch (error) {
      console.error('Error fetching trainings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('announcements')
        .select(`
          *,
          profiles:author_id (
            name,
            role
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedAnnouncements = data?.map(item => ({
        id: item.id,
        title: item.title,
        content: item.content,
        created_at: item.created_at,
        author: {
          name: item.profiles?.name || 'Unknown',
          role: item.profiles?.role || 'unknown'
        }
      })) || [];

      setAnnouncements(formattedAnnouncements);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:author_id (
            id,
            name,
            avatar_url,
            role
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedPosts = data?.map(item => ({
        id: item.id,
        content: item.content,
        image_url: item.image_url,
        created_at: item.created_at,
        author: {
          id: item.profiles?.id || '',
          name: item.profiles?.name || 'Unknown',
          avatar_url: item.profiles?.avatar_url,
          role: item.profiles?.role || 'unknown'
        }
      })) || [];

      setPosts(formattedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedback = async (targetType: 'game' | 'training', targetId: string): Promise<Feedback[]> => {
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

      if (error) throw error;
      return data as Feedback[] || [];
    } catch (error) {
      console.error('Error fetching feedback:', error);
      return [];
    }
  };

  // Add functions
  const addGame = async (gameData: Omit<Game, 'id' | 'created_at' | 'type'>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('games')
        .insert([{ ...gameData, author_id: user.id }]);

      if (error) throw error;
      await fetchGames();
      return true;
    } catch (error) {
      console.error('Error adding game:', error);
      return false;
    }
  };

  const addTraining = async (trainingData: Omit<Training, 'id' | 'created_at' | 'type'>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('trainings')
        .insert([{ ...trainingData, author_id: user.id }]);

      if (error) throw error;
      await fetchTrainings();
      return true;
    } catch (error) {
      console.error('Error adding training:', error);
      return false;
    }
  };

  const addAnnouncement = async (announcementData: Omit<Announcement, 'id' | 'created_at' | 'author'>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('announcements')
        .insert([{ ...announcementData, author_id: user.id }]);

      if (error) throw error;
      await fetchAnnouncements();
      return true;
    } catch (error) {
      console.error('Error adding announcement:', error);
      return false;
    }
  };

  const addPost = async (postData: Omit<Post, 'id' | 'created_at' | 'author'>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('posts')
        .insert([{ 
          content: postData.content,
          image_url: postData.image_url,
          author_id: user.id 
        }]);

      if (error) throw error;
      await fetchPosts();
      return true;
    } catch (error) {
      console.error('Error adding post:', error);
      return false;
    }
  };

  const addFeedback = async (feedbackData: Omit<Feedback, 'id' | 'created_at' | 'profiles'>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('feedback')
        .insert([feedbackData]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error adding feedback:', error);
      return false;
    }
  };

  // Update functions
  const updateGame = async (id: string, gameData: Partial<Game>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('games')
        .update(gameData)
        .eq('id', id);

      if (error) throw error;
      await fetchGames();
      return true;
    } catch (error) {
      console.error('Error updating game:', error);
      return false;
    }
  };

  const updateTraining = async (id: string, trainingData: Partial<Training>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('trainings')
        .update(trainingData)
        .eq('id', id);

      if (error) throw error;
      await fetchTrainings();
      return true;
    } catch (error) {
      console.error('Error updating training:', error);
      return false;
    }
  };

  const updateAnnouncement = async (id: string, announcementData: Partial<Announcement>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('announcements')
        .update(announcementData)
        .eq('id', id);

      if (error) throw error;
      await fetchAnnouncements();
      return true;
    } catch (error) {
      console.error('Error updating announcement:', error);
      return false;
    }
  };

  // Delete functions
  const deleteGame = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('games')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchGames();
      return true;
    } catch (error) {
      console.error('Error deleting game:', error);
      return false;
    }
  };

  const deleteTraining = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('trainings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchTrainings();
      return true;
    } catch (error) {
      console.error('Error deleting training:', error);
      return false;
    }
  };

  const deleteAnnouncement = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchAnnouncements();
      return true;
    } catch (error) {
      console.error('Error deleting announcement:', error);
      return false;
    }
  };

  const deletePost = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchPosts();
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchGames();
      fetchTrainings();
      fetchAnnouncements();
      fetchPosts();
    }
  }, [user]);

  return (
    <DataContext.Provider value={{
      games,
      trainings,
      announcements,
      posts,
      feedback,
      loading,
      fetchGames,
      fetchTrainings,
      fetchAnnouncements,
      fetchPosts,
      fetchFeedback,
      addGame,
      addTraining,
      addAnnouncement,
      addPost,
      addFeedback,
      updateGame,
      updateTraining,
      updateAnnouncement,
      deleteGame,
      deleteTraining,
      deleteAnnouncement,
      deletePost
    }}>
      {children}
    </DataContext.Provider>
  );
};
