
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import Header from '../components/Header';
import { Loader2, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const EditTrainingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { trainings, fetchData } = useData();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [trainingForm, setTrainingForm] = useState({
    date: '',
    location: '',
    uniform: '',
    time: ''
  });
  
  // Only coaches can edit content
  if (profile?.role !== 'coach') {
    navigate('/');
    return null;
  }
  
  // Load training data
  useEffect(() => {
    if (id) {
      const training = trainings.find(t => t.id === id);
      if (training) {
        setTrainingForm({
          date: training.date,
          location: training.location,
          uniform: training.uniform || '',
          time: training.time
        });
        setIsLoading(false);
      } else {
        // Training not found, redirect to agenda page
        toast({
          title: "Treino não encontrado",
          description: "O treino que você está tentando editar não foi encontrado",
          variant: "destructive"
        });
        navigate('/agenda');
      }
    }
  }, [id, trainings]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTrainingForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      if (!id || !user?.id) {
        throw new Error('Erro ao atualizar treino');
      }
      
      // Update training in Supabase
      const { error } = await supabase
        .from('trainings')
        .update({
          date: trainingForm.date,
          location: trainingForm.location,
          uniform: trainingForm.uniform,
          time: trainingForm.time
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Refresh data
      await fetchData();
      
      toast({
        title: "Treino atualizado",
        description: "O treino foi atualizado com sucesso"
      });
      
      navigate('/agenda');
      
    } catch (error) {
      console.error('Error updating training:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o treino",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir este treino?')) {
      setIsSubmitting(true);
      
      try {
        if (!id) {
          throw new Error('ID do treino não encontrado');
        }
        
        // Delete training from Supabase
        const { error } = await supabase
          .from('trainings')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        // Refresh data
        await fetchData();
        
        toast({
          title: "Treino excluído",
          description: "O treino foi excluído com sucesso"
        });
        
        navigate('/agenda');
        
      } catch (error) {
        console.error('Error deleting training:', error);
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao excluir o treino",
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
      <Header title="Editar Treino" showBackButton={true} />
      
      <div className="p-4">
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  name="date"
                  value={trainingForm.date}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Local</Label>
                <Input
                  id="location"
                  type="text"
                  name="location"
                  value={trainingForm.location}
                  onChange={handleChange}
                  placeholder="Quadra do Exponencial"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="uniform">Uniforme</Label>
                <Input
                  id="uniform"
                  type="text"
                  name="uniform"
                  value={trainingForm.uniform}
                  onChange={handleChange}
                  placeholder="Uniforme de treino"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time">Horário</Label>
                <Input
                  id="time"
                  type="time"
                  name="time"
                  value={trainingForm.time}
                  onChange={handleChange}
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

export default EditTrainingPage;
