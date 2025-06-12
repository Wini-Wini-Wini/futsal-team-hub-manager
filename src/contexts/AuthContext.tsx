
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Session, User } from '@supabase/supabase-js';

export type UserRole = 'coach' | 'player';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string, role: UserRole, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  fetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchProfile = async (userId?: string) => {
    try {
      const targetUserId = userId || user?.id;
      if (!targetUserId) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetUserId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
      
      if (data) {
        setProfile(data as UserProfile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    const setupAuthListener = async () => {
      // Set up auth state listener FIRST
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, currentSession) => {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          if (currentSession?.user) {
            setTimeout(() => {
              fetchProfile(currentSession.user.id);
            }, 0);
          } else {
            setProfile(null);
          }
        }
      );

      // THEN check for existing session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        await fetchProfile(currentSession.user.id);
      }
      
      setIsLoading(false);
      
      return () => {
        subscription.unsubscribe();
      };
    };

    setupAuthListener();
  }, []);

  const login = async (email: string, password: string, requestedRole?: UserRole) => {
    try {
      // First, get the user's profile to check their registered role
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('email', email)
        .single();
      
      // If we can't find the profile or there's an error, we'll proceed with login 
      // and check the role afterward
      if (!profileError && profileData && requestedRole && profileData.role !== requestedRole) {
        return { 
          success: false, 
          error: `Você não pode entrar como ${requestedRole === 'coach' ? 'treinador(a)' : 'aluna'} porque se registrou como ${profileData.role === 'coach' ? 'treinador(a)' : 'aluna'}.` 
        };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Double-check role after login
      if (data.user) {
        const { data: userProfile, error: fetchError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();
        
        if (!fetchError && userProfile && requestedRole && userProfile.role !== requestedRole) {
          // Wrong role, log the user out and return an error
          await supabase.auth.signOut();
          return { 
            success: false, 
            error: `Você não pode entrar como ${requestedRole === 'coach' ? 'treinador(a)' : 'aluna'} porque se registrou como ${userProfile.role === 'coach' ? 'treinador(a)' : 'aluna'}.`
          };
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Ocorreu um erro ao fazer login' 
      };
    }
  };

  const register = async (email: string, password: string, name: string, role: UserRole, phone?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            phone
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // After successful signup, log the user out to force them back to the login screen
      await supabase.auth.signOut();

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Ocorreu um erro ao registrar' 
      };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user || !profile) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);

      if (error) {
        return { success: false, error: error.message };
      }

      // Update local profile state
      setProfile({ ...profile, ...data });
      
      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Ocorreu um erro ao atualizar o perfil' 
      };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      session,
      isAuthenticated: !!session, 
      isLoading, 
      login, 
      register,
      logout, 
      updateProfile,
      fetchProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
