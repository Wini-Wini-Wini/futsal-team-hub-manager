
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FileText } from 'lucide-react';
import PostCard from './PostCard';

interface Post {
  id: string;
  content: string;
  media_url: string | null;
  created_at: string;
  author_name?: string;
  created_by?: string;
}

const PostsList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (postsError) throw postsError;
        
        const postsWithAuthors: Post[] = [];
        
        for (const post of postsData || []) {
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
            author_name: profileData?.name || 'Colaborador',
            created_by: post.created_by
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
          const { data: post } = await supabase
            .from('posts')
            .select('*')
            .eq('id', payload.new.id)
            .single();
            
          if (post) {
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
              author_name: profileData?.name || 'Colaborador',
              created_by: post.created_by
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
  
  const handleDeletePost = (postId: string) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  };
  
  if (loading && posts.length === 0) {
    return (
      <div className="flex justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-purple-600 font-medium">Carregando postagens...</p>
        </div>
      </div>
    );
  }
  
  if (posts.length === 0) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-8 text-center border border-purple-100 shadow-lg">
        <div className="flex justify-center py-6">
          <FileText size={48} className="text-purple-400" />
        </div>
        <p className="text-purple-600 font-medium">Nenhuma postagem encontrada</p>
        <p className="text-purple-400 text-sm mt-2">As postagens aparecerão aqui</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map(post => (
        <PostCard 
          key={post.id} 
          post={post} 
          onDelete={handleDeletePost}
        />
      ))}
    </div>
  );
};

export default PostsList;
