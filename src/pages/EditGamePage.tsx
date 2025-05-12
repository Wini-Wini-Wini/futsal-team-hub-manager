
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
    homeScore: 0,
    awayScore: 0
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
          homeScore: game.homeScore || 0,
          awayScore: game.awayScore || 0
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
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'number') {
      setGameForm(prev => ({ 
        ...prev, 
        [name]: parseInt(value) || 0 
      }));
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
          home_score: gameForm.homeScore,
          away_score: gameForm.awayScore
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
                  placeholder="Ginásio AABB"
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
                  placeholder="Nome do adversário"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="uniform">Uniforme</Label>
                <select
                  id="uniform"
                  name="uniform"
                  value={gameForm.uniform}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="">Selecione o uniforme</option>
                  <option value="A">Uniforme A</option>
                  <option value="B">Uniforme B</option>
                  <option value="C">Uniforme C</option>
                </select>
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
                  <Label htmlFor="homeScore">Placar Casa</Label>
                  <Input
                    id="homeScore"
                    type="number"
                    name="homeScore"
                    min="0"
                    value={gameForm.homeScore}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="awayScore">Placar Visitante</Label>
                  <Input
                    id="awayScore"
                    type="number"
                    name="awayScore"
                    min="0"
                    value={gameForm.awayScore}
                    onChange={handleChange}
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
