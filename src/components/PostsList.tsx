
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from "@/components/ui/card";
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FileText } from 'lucide-react';

interface Profile {
  name: string;
}

interface Post {
  id: string;
  content: string;
  media_url: string | null;
  created_at: string;
  author_name?: string;
}

const PostsList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        // Fetch posts without trying to join with profiles
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (postsError) throw postsError;
        
        // Fetch author profiles separately to get names
        const postsWithAuthors: Post[] = [];
        
        for (const post of postsData || []) {
          // Get author profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', post.created_by)
            .single();
            
          postsWithAuthors.push({
            id: post.id,
            content: post.content,
            media_url: post.media_url,
            created_at: post.created_at,
            author_name: profileData?.name || 'Treinador'
          });
        }
        
        setPosts(postsWithAuthors);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'posts'
        },
        async (payload) => {
          // Fetch the new post
          const { data: post } = await supabase
            .from('posts')
            .select('*')
            .eq('id', payload.new.id)
            .single();
            
          if (post) {
            // Get author profile
            const { data: profileData } = await supabase
              .from('profiles')
              .select('name')
              .eq('id', post.created_by)
              .single();
              
            const newPost: Post = {
              id: post.id,
              content: post.content,
              media_url: post.media_url,
              created_at: post.created_at,
              author_name: profileData?.name || 'Treinador'
            };
            
            setPosts(prev => [newPost, ...prev]);
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  const formatDate = (dateStr: string) => {
    const date = parseISO(dateStr);
    return format(date, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR });
  };
  
  if (loading && posts.length === 0) {
    return (
      <div className="flex justify-center p-6">
        <p>Carregando postagens...</p>
      </div>
    );
  }
  
  if (posts.length === 0) {
    return (
      <Card className="mb-4">
        <CardContent className="p-4 text-center">
          <div className="flex justify-center py-10">
            <FileText size={48} className="text-gray-400" />
          </div>
          <p className="text-muted-foreground">Nenhuma postagem encontrada</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <Card key={post.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-futsal-primary flex items-center justify-center text-white">
                  {post.author_name?.charAt(0) || '?'}
                </div>
                <div className="ml-2">
                  <p className="font-semibold">{post.author_name || 'Treinador'}</p>
                  <p className="text-xs text-gray-500">{formatDate(post.created_at)}</p>
                </div>
              </div>
              
              <p className="text-sm whitespace-pre-line mb-3">{post.content}</p>
              
              {post.media_url && (
                <div className="mt-2 rounded-lg overflow-hidden">
                  {post.media_url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                    <img 
                      src={post.media_url} 
                      alt="Post media" 
                      className="w-full h-auto max-h-96 object-contain"
                    />
                  ) : post.media_url.match(/\.(mp4|webm|ogg)$/i) ? (
                    <video 
                      src={post.media_url} 
                      controls
                      className="w-full max-h-96"
                    />
                  ) : null}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PostsList;
