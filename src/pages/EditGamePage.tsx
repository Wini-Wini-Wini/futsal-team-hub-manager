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
import { Loader2, Trash2, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

const EditGamePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { games, fetchData } = useData();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState<'home' | 'away' | null>(null);
  
  const [gameForm, setGameForm] = useState({
    date: '',
    location: '',
    opponent: '',
    uniform: '',
    time: '',
    homeScore: 0,
    awayScore: 0,
    homeTeamLogo: '',
    awayTeamLogo: ''
  });
  
  // Only coaches can edit content
  useEffect(() => {
    if (profile?.role !== 'coach') {
      navigate('/');
    }
  }, [profile, navigate]);
  
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
          awayScore: game.awayScore || 0,
          homeTeamLogo: game.home_team_logo || '',
          awayTeamLogo: game.away_team_logo || ''
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
  }, [id, games, toast, navigate]);
  
  if (!profile || profile.role !== 'coach') {
    return null;
  }
  
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

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, team: 'home' | 'away') => {
    if (!e.target.files || !e.target.files[0] || !user) return;
    
    const file = e.target.files[0];
    setIsUploadingLogo(team);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${team}-team-${uuidv4()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      const { error: uploadError } = await supabase
        .storage
        .from('teams')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;

      // Get public URL for the file
      const { data: publicUrlData } = supabase
        .storage
        .from('teams')
        .getPublicUrl(filePath);
        
      const logoUrl = publicUrlData.publicUrl;
      
      // Update form state
      setGameForm(prev => ({
        ...prev,
        [team === 'home' ? 'homeTeamLogo' : 'awayTeamLogo']: logoUrl
      }));
      
      toast({
        title: "Logo enviada",
        description: `Logo do time ${team === 'home' ? 'da casa' : 'visitante'} foi enviada com sucesso`,
      });
      
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a logo do time",
        variant: "destructive"
      });
    } finally {
      setIsUploadingLogo(null);
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
          away_score: gameForm.awayScore,
          home_team_logo: gameForm.homeTeamLogo,
          away_team_logo: gameForm.awayTeamLogo
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
      <Header 
        title="Editar Jogo" 
        showBackButton={true}
        showHomeButton={true} 
      />
      
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

              {/* Team Logos Section */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Logo Time da Casa</Label>
                  <div className="flex flex-col items-center space-y-2">
                    {gameForm.homeTeamLogo && (
                      <img 
                        src={gameForm.homeTeamLogo} 
                        alt="Home team logo" 
                        className="w-16 h-16 object-contain"
                      />
                    )}
                    <label className="cursor-pointer bg-gray-100 border rounded-md px-3 py-2 text-sm flex items-center gap-2">
                      <Upload size={16} />
                      {isUploadingLogo === 'home' ? 'Enviando...' : 'Enviar Logo'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleLogoUpload(e, 'home')}
                        disabled={isUploadingLogo === 'home'}
                      />
                    </label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Logo Time Visitante</Label>
                  <div className="flex flex-col items-center space-y-2">
                    {gameForm.awayTeamLogo && (
                      <img 
                        src={gameForm.awayTeamLogo} 
                        alt="Away team logo" 
                        className="w-16 h-16 object-contain"
                      />
                    )}
                    <label className="cursor-pointer bg-gray-100 border rounded-md px-3 py-2 text-sm flex items-center gap-2">
                      <Upload size={16} />
                      {isUploadingLogo === 'away' ? 'Enviando...' : 'Enviar Logo'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleLogoUpload(e, 'away')}
                        disabled={isUploadingLogo === 'away'}
                      />
                    </label>
                  </div>
                </div>
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
