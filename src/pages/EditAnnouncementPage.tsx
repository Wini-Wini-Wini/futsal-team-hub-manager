
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import Header from '../components/Header';
import { Loader2, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const EditAnnouncementPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { announcements, fetchData } = useData();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    message: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    voting: false,
    date: ''
  });
  
  // Only coaches can edit content
  if (profile?.role !== 'coach') {
    navigate('/');
    return null;
  }
  
  // Load announcement data
  useEffect(() => {
    if (id) {
      const announcement = announcements.find(a => a.id === id);
      if (announcement) {
        setAnnouncementForm({
          title: announcement.title,
          message: announcement.message,
          priority: announcement.priority,
          voting: announcement.voting || false,
          date: announcement.date
        });
        setIsLoading(false);
      } else {
        // Announcement not found, redirect to announcements page
        toast({
          title: "Aviso não encontrado",
          description: "O aviso que você está tentando editar não foi encontrado",
          variant: "destructive"
        });
        navigate('/announcements');
      }
    }
  }, [id, announcements]);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setAnnouncementForm(prev => ({ ...prev, [name]: checked }));
    } else {
      setAnnouncementForm(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      if (!id || !user?.id) {
        throw new Error('Erro ao atualizar aviso');
      }
      
      // Update announcement in Supabase
      const { error } = await supabase
        .from('announcements')
        .update({
          title: announcementForm.title,
          message: announcementForm.message,
          priority: announcementForm.priority,
          voting: announcementForm.voting,
          date: announcementForm.date
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Refresh data
      await fetchData();
      
      toast({
        title: "Aviso atualizado",
        description: "O aviso foi atualizado com sucesso"
      });
      
      navigate('/announcements');
      
    } catch (error) {
      console.error('Error updating announcement:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o aviso",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir este aviso?')) {
      setIsSubmitting(true);
      
      try {
        if (!id) {
          throw new Error('ID do aviso não encontrado');
        }
        
        // Delete announcement from Supabase
        const { error } = await supabase
          .from('announcements')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        // Refresh data
        await fetchData();
        
        toast({
          title: "Aviso excluído",
          description: "O aviso foi excluído com sucesso"
        });
        
        navigate('/announcements');
        
      } catch (error) {
        console.error('Error deleting announcement:', error);
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao excluir o aviso",
          variant: "destructive"
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-futsal-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 pb-20">
      <Header title="Editar Aviso" showBackButton={true} />
      
      <div className="p-4">
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  type="text"
                  name="title"
                  value={announcementForm.title}
                  onChange={handleChange}
                  placeholder="Digite o título do aviso..."
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Prioridade</Label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="priority"
                      value="high"
                      checked={announcementForm.priority === 'high'}
                      onChange={handleChange}
                      className="mr-1"
                    />
                    <span className="w-4 h-4 bg-futsal-red rounded-sm inline-block mr-1"></span>
                    Alta
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="priority"
                      value="medium"
                      checked={announcementForm.priority === 'medium'}
                      onChange={handleChange}
                      className="mr-1"
                    />
                    <span className="w-4 h-4 bg-amber-500 rounded-sm inline-block mr-1"></span>
                    Média
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="priority"
                      value="low"
                      checked={announcementForm.priority === 'low'}
                      onChange={handleChange}
                      className="mr-1"
                    />
                    <span className="w-4 h-4 bg-futsal-green rounded-sm inline-block mr-1"></span>
                    Baixa
                  </label>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  name="date"
                  value={announcementForm.date}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="voting" className="mr-2">Votação</Label>
                  <div className="flex items-center">
                    <label className="flex items-center mr-4">
                      <input
                        id="voting"
                        type="checkbox"
                        name="voting"
                        checked={announcementForm.voting}
                        onChange={handleChange}
                        className="mr-1"
                      />
                      Sim
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Mensagem</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={announcementForm.message}
                  onChange={handleChange}
                  className="h-32"
                  placeholder="Digite uma mensagem..."
                  required
                />
              </div>
              
              <div className="flex justify-between pt-4 mt-4 border-t">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir
                </Button>
                
                <Button
                  type="submit"
                  className="bg-futsal-accent text-black font-bold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando
                    </>
                  ) : (
                    'Salvar'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditAnnouncementPage;
