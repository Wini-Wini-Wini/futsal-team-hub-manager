
import React, { useEffect } from 'react';
import Header from '../components/Header';
import { useData } from '../contexts/DataContext';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Edit, Trash2, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
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
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AnnouncementsPage: React.FC = () => {
  const { announcements, fetchAnnouncements } = useData();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = parseISO(dateStr);
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500 hover:bg-red-600';
      case 'medium':
        return 'bg-amber-500 hover:bg-amber-600';
      case 'low':
        return 'bg-green-500 hover:bg-green-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Média';
      case 'low':
        return 'Baixa';
      default:
        return 'Normal';
    }
  };

  const handleDeleteAnnouncement = async (announcementId: string) => {
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', announcementId);

      if (error) throw error;

      toast({
        title: "Aviso excluído",
        description: "O aviso foi excluído com sucesso"
      });

      fetchAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o aviso",
        variant: "destructive"
      });
    }
  };

  const isCoach = profile?.role === 'coach';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 font-inter">
      <Header title="Avisos" />
      
      <div className="pt-24 p-6 pb-32 space-y-4 max-w-4xl mx-auto min-h-screen">
        {announcements.length === 0 ? (
          <Card className="bg-gradient-to-r from-white to-purple-50 border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-purple-600 text-lg">Nenhum aviso encontrado</p>
            </CardContent>
          </Card>
        ) : (
          announcements.map((announcement) => (
            <Card key={announcement.id} className="bg-gradient-to-r from-white to-purple-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-bold text-xl text-purple-900">
                        {announcement.title}
                      </h3>
                      <Badge 
                        className={`text-white font-medium ${getPriorityColor(announcement.priority)}`}
                      >
                        {getPriorityText(announcement.priority)}
                      </Badge>
                    </div>
                    
                    <p className="text-purple-700 mb-4 leading-relaxed">
                      {announcement.message}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-purple-600">
                      <span className="font-medium">
                        Por: {announcement.author}
                      </span>
                      <span>
                        {formatDate(announcement.created_at)}
                      </span>
                    </div>
                  </div>
                  
                  {isCoach && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-purple-600 hover:bg-purple-100">
                          <MoreVertical size={18} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => navigate(`/edit-announcement/${announcement.id}`)}
                          className="cursor-pointer"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
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
                              <AlertDialogTitle>Excluir aviso</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir este aviso? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteAnnouncement(announcement.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Fixed Add Button for Coaches */}
      {isCoach && (
        <Button
          onClick={() => navigate('/add?tab=2')}
          className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg z-10"
          size="icon"
        >
          <Plus className="h-6 w-6 text-white" />
        </Button>
      )}
    </div>
  );
};

export default AnnouncementsPage;
