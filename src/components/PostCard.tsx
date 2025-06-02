
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Trash2, MoreVertical } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Post {
  id: string;
  content: string;
  media_url: string | null;
  created_at: string;
  author_name?: string;
  created_by?: string;
}

interface PostCardProps {
  post: Post;
  onDelete: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onDelete }) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const isCoach = profile?.role === 'coach';
  const canDelete = isCoach && (post.created_by === user?.id);
  
  const formatDate = (dateStr: string) => {
    const date = parseISO(dateStr);
    return format(date, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR });
  };
  
  const handleDelete = async () => {
    if (!canDelete) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', post.id);
      
      if (error) throw error;
      
      onDelete(post.id);
      
      toast({
        title: "Postagem excluída",
        description: "A postagem foi excluída com sucesso",
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a postagem",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="overflow-hidden shadow-lg border-0 bg-gradient-to-br from-white to-purple-50">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white shadow-lg">
                <span className="text-lg font-bold">
                  {post.author_name?.charAt(0) || '?'}
                </span>
              </div>
              <div className="ml-4">
                <p className="font-bold text-gray-900">{post.author_name || 'Treinador'}</p>
                <p className="text-sm text-purple-600 font-medium">{formatDate(post.created_at)}</p>
              </div>
            </div>
            
            {canDelete && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-purple-600 hover:bg-purple-100">
                    <MoreVertical size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {isDeleting ? 'Excluindo...' : 'Excluir'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          
          <p className="text-gray-800 whitespace-pre-line mb-4 leading-relaxed">{post.content}</p>
          
          {post.media_url && (
            <div className="mt-4 rounded-xl overflow-hidden shadow-md">
              {post.media_url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                <img 
                  src={post.media_url} 
                  alt="Post media" 
                  className="w-full h-auto max-h-96 object-cover"
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
  );
};

export default PostCard;
