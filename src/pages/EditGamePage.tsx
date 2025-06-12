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

const EditGamePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { games, fetchData } = useData();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [gameForm, setGameForm] = useState({
    date: '',
    location: '',
    opponent: '',
    uniform: '',
    time: '',
    home_score: 0,
    away_score: 0
  });
  
  // Only coaches can edit content
  if (profile?.role !== 'coach') {
    navigate('/');
    return null;
  }
  
  // Load game data
  useEffect(() => {
    if (id) {
      const game = games.find(g => g.id === id);
      if (game) {
        setGameForm({
          date: game.date,
          location: game.location,
          opponent: game.opponent || '',
          uniform: game.uniform || '',
          time: game.time,
          home_score: game.home_score || 0,
          away_score: game.away_score || 0
        });
        setIsLoading(false);
      } else {
        // Game not found, redirect to agenda page
        toast({
          title: "Jogo não encontrado",
          description: "O jogo que você está tentando editar não foi encontrado",
          variant: "destructive"
        });
        navigate('/agenda');
      }
    }
  }, [id, games]);
  
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setGameForm(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setGameForm(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      if (!id || !user?.id) {
        throw new Error('Erro ao atualizar jogo');
      }
      
      // Update game in Supabase
      const { error } = await supabase
        .from('games')
        .update({
          date: gameForm.date,
          location: gameForm.location,
          opponent: gameForm.opponent,
          uniform: gameForm.uniform,
          time: gameForm.time,
          home_score: gameForm.home_score,
          away_score: gameForm.away_score
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Refresh data
      await fetchData();
      
      toast({
        title: "Jogo atualizado",
        description: "O jogo foi atualizado com sucesso"
      });
      
      navigate('/agenda');
      
    } catch (error) {
      console.error('Error updating game:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o jogo",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir este jogo?')) {
      setIsSubmitting(true);
      
      try {
        if (!id) {
          throw new Error('ID do jogo não encontrado');
        }
        
        // Delete game from Supabase
        const { error } = await supabase
          .from('games')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        // Refresh data
        await fetchData();
        
        toast({
          title: "Jogo excluído",
          description: "O jogo foi excluído com sucesso"
        });
        
        navigate('/agenda');
        
      } catch (error) {
        console.error('Error deleting game:', error);
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao excluir o jogo",
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
      <Header title="Editar Jogo" showBackButton={true} />
      
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
                  value={gameForm.date}
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
                  value={gameForm.location}
                  onChange={handleChange}
                  placeholder="Quadra do Exponencial"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="opponent">Adversário</Label>
                <Input
                  id="opponent"
                  type="text"
                  name="opponent"
                  value={gameForm.opponent}
                  onChange={handleChange}
                  placeholder="Nome do time adversário"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="uniform">Uniforme</Label>
                <Input
                  id="uniform"
                  type="text"
                  name="uniform"
                  value={gameForm.uniform}
                  onChange={handleChange}
                  placeholder="Uniforme principal"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time">Horário</Label>
                <Input
                  id="time"
                  type="time"
                  name="time"
                  value={gameForm.time}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="home_score">Placar Casa</Label>
                  <Input
                    id="home_score"
                    type="number"
                    name="home_score"
                    value={gameForm.home_score}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="away_score">Placar Visitante</Label>
                  <Input
                    id="away_score"
                    type="number"
                    name="away_score"
                    value={gameForm.away_score}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
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

export default EditGamePage;
