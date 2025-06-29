
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [authorProfile, setAuthorProfile] = useState<{ avatar_url?: string; name?: string } | null>(null);
  
  // User can delete if they are the author of the post
  const canDelete = user?.id === post.created_by;

  useEffect(() => {
    const fetchAuthorProfile = async () => {
      if (post.created_by) {
        const { data } = await supabase
          .from('profiles')
          .select('avatar_url, name')
          .eq('id', post.created_by)
          .single();
        
        if (data) {
          setAuthorProfile(data);
        }
      }
    };

    fetchAuthorProfile();
  }, [post.created_by]);
  
  const formatDate = (dateStr: string) => {
    const date = parseISO(dateStr);
    return format(date, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR });
  };
  
  const handleDelete = async () => {
    if (!canDelete) return;
    
    setIsDeleting(true);
    try {
      // Delete media file if exists
      if (post.media_url) {
        const urlParts = post.media_url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        if (fileName) {
          await supabase.storage
            .from('profiles')
            .remove([`${user?.id}/${fileName}`]);
        }
      }
      
      // Delete post from database
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
              <Avatar className="w-12 h-12">
                <AvatarImage 
                  src={authorProfile?.avatar_url || ''} 
                  alt="Profile picture" 
                />
                <AvatarFallback className="bg-gradient-to-br from-purple-600 to-purple-800 text-white font-bold">
                  {(authorProfile?.name || post.author_name)?.charAt(0) || '?'}
                </AvatarFallback>
              </Avatar>
              
              <div className="ml-4">
                <p className="font-bold text-gray-900">{authorProfile?.name || post.author_name || 'Colaborador'}</p>
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
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem 
                        onSelect={(e) => e.preventDefault()}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir postagem</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir esta postagem? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleDelete}
                          disabled={isDeleting}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {isDeleting ? 'Excluindo...' : 'Excluir'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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
