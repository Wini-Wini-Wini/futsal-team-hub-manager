
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
  profiles: Profile | null;
}

const PostsList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('posts')
          .select(`
            id,
            content,
            media_url,
            created_at,
            profiles:created_by(name)
          `)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        // Make sure we have valid profile data before setting posts
        const validPosts = data?.filter(post => 
          post.profiles && typeof post.profiles === 'object' && 'name' in post.profiles
        );
        
        // Using type assertion after validation
        setPosts(validPosts as Post[] || []);
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
        (payload) => {
          // Fetch the full post with author info
          const fetchNewPost = async () => {
            const { data } = await supabase
              .from('posts')
              .select(`
                id,
                content,
                media_url,
                created_at,
                profiles:created_by(name)
              `)
              .eq('id', payload.new.id)
              .single();
              
            if (data && data.profiles && typeof data.profiles === 'object' && 'name' in data.profiles) {
              // Using type assertion after validation
              setPosts(prev => [data as Post, ...prev]);
            }
          };
          
          fetchNewPost();
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
                  {post.profiles?.name?.charAt(0) || '?'}
                </div>
                <div className="ml-2">
                  <p className="font-semibold">{post.profiles?.name || 'Treinador'}</p>
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
