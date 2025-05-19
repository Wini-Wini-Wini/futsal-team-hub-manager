
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useToast } from '@/hooks/use-toast';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Header from '@/components/Header';

// Updated interface to match Game type in DataContext
interface GameData {
  date: Date | undefined;
  time: string;
  opponent: string;
  location: string;
  uniform: string; // Added missing property
  notes?: string; // Optional notes that can be stored elsewhere
}

// Updated interface to match Training type in DataContext
interface TrainingData {
  date: Date | undefined;
  time: string;
  location: string; // Added missing property
  uniform: string; // Added missing property
  focus?: string; // Optional focus that can be stored elsewhere
  drills?: string; // Optional drills that can be stored elsewhere
  notes?: string; // Optional notes that can be stored elsewhere
}

// Updated interface to match Announcement type in DataContext
interface AnnouncementData {
  title: string;
  content: string; // This will map to message
  date: string; // Added required property
  priority: 'high' | 'medium' | 'low'; // Added required property with correct type
  author: string; // Added required property
  voting?: boolean; // Optional voting property
}

const AddPage = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const tabParam = queryParams.get('tab');
  const location = useLocation();
  const initialTabIndex = tabParam ? parseInt(tabParam) : 0;
  const [activeTab, setActiveTab] = useState(initialTabIndex);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { addGame, addTraining, addAnnouncement } = useData();
  const { toast } = useToast();
  
  // Form state for Game with default values
  const [gameData, setGameData] = useState<GameData>({
    date: undefined,
    time: '',
    opponent: '',
    location: '',
    uniform: '', // Initialize with empty string
    notes: '',
  });
  
  // Form state for Training with default values
  const [trainingData, setTrainingData] = useState<TrainingData>({
    date: undefined,
    time: '',
    location: '', // Initialize with empty string
    uniform: '', // Initialize with empty string
    focus: '',
    drills: '',
    notes: '',
  });
  
  // Form state for Announcement with default values
  const [announcementData, setAnnouncementData] = useState<AnnouncementData>({
    title: '',
    content: '', // Will map to message
    date: new Date().toISOString().split('T')[0], // Current date in ISO format
    priority: 'medium', // Default priority
    author: profile?.name || 'Unknown', // Default author or Unknown
    voting: false,
  });
  
  // Reset functions for each form
  const resetGame = () => {
    setGameData({
      date: undefined,
      time: '',
      opponent: '',
      location: '',
      uniform: '',
      notes: '',
    });
  };
  
  const resetTraining = () => {
    setTrainingData({
      date: undefined,
      time: '',
      location: '',
      uniform: '',
      focus: '',
      drills: '',
      notes: '',
    });
  };
  
  const resetAnnouncement = () => {
    setAnnouncementData({
      title: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
      priority: 'medium',
      author: profile?.name || 'Unknown',
      voting: false,
    });
  };
  
  // Handler functions for each form
  const handleGameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGameData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  const handleTrainingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTrainingData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  const handleAnnouncementChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAnnouncementData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  // Check profile loading and permissions
  useEffect(() => {
    // Set a timeout to allow the profile to load
    const timer = setTimeout(() => {
      if (profile === undefined) {
        // Profile is still loading, wait longer
        setIsLoading(true);
      } else if (profile === null) {
        // User is not logged in
        navigate('/login');
        toast({
          title: "Acesso negado",
          description: "Você precisa estar logado para acessar esta página",
          variant: "destructive"
        });
      } else if (profile.role !== 'coach') {
        // User is not a coach
        navigate('/');
        toast({
          title: "Acesso negado",
          description: "Apenas treinadores podem adicionar conteúdo",
          variant: "destructive"
        });
      } else {
        // User is a coach and can access this page
        setIsLoading(false);
        // Update author if profile is loaded
        setAnnouncementData(prev => ({
          ...prev,
          author: profile.name
        }));
      }
    }, 500); // Give extra time for profile to load
    
    return () => clearTimeout(timer);
  }, [profile, navigate, toast]);
  
  // Handle form submissions
  const handleGameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!gameData.date) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma data",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Convert GameData to match the expected Game type
      const gameToAdd = {
        date: gameData.date.toISOString().split('T')[0],
        time: gameData.time,
        opponent: gameData.opponent,
        location: gameData.location,
        uniform: gameData.uniform
      };
      
      await addGame(gameToAdd);
      toast({
        title: "Sucesso!",
        description: "Jogo adicionado com sucesso",
      });
      resetGame();
      navigate('/agenda', { replace: true });
    } catch (error) {
      console.error("Error adding game:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar o jogo",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleTrainingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!trainingData.date) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma data",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Convert TrainingData to match the expected Training type
      const trainingToAdd = {
        date: trainingData.date.toISOString().split('T')[0],
        time: trainingData.time,
        location: trainingData.location,
        uniform: trainingData.uniform
      };
      
      await addTraining(trainingToAdd);
      toast({
        title: "Sucesso!",
        description: "Treino adicionado com sucesso",
      });
      resetTraining();
      navigate('/agenda', { replace: true });
    } catch (error) {
      console.error("Error adding training:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar o treino",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleAnnouncementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Convert AnnouncementData to match the expected Announcement type
      const announcementToAdd = {
        title: announcementData.title,
        message: announcementData.content, // Map content to message
        date: announcementData.date,
        priority: announcementData.priority,
        author: announcementData.author,
        voting: announcementData.voting
      };
      
      await addAnnouncement(announcementToAdd);
      toast({
        title: "Sucesso!",
        description: "Aviso adicionado com sucesso",
      });
      resetAnnouncement();
      navigate('/announcements', { replace: true });
    } catch (error) {
      console.error("Error adding announcement:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar o aviso",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Show loading state while checking permissions
  if (isLoading) {
    return (
      <div className="flex-1 pb-20">
        <Header 
          title="Carregando..." 
          showBackButton={true}
          showHomeButton={true}
        />
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-futsal-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 pb-20">
      <Header 
        title="Adicionar" 
        showBackButton={true}
        showHomeButton={true}
      />
      
      <Tabs value={`${activeTab}`} onValueChange={(value) => setActiveTab(parseInt(value))} className="w-full">
        <TabsList className="w-full flex justify-around">
          <TabsTrigger value="0">Jogo</TabsTrigger>
          <TabsTrigger value="1">Treino</TabsTrigger>
          <TabsTrigger value="2">Aviso</TabsTrigger>
        </TabsList>
        
        {/* Game Tab */}
        <TabsContent value="0" className="mt-4 px-4">
          <form onSubmit={handleGameSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="game-date">Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !gameData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {gameData.date ? (
                      format(gameData.date, "PPP")
                    ) : (
                      <span>Escolher data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center" side="bottom">
                  <Calendar
                    mode="single"
                    selected={gameData.date}
                    onSelect={(date) => setGameData(prev => ({...prev, date: date}))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label htmlFor="game-time">Horário</Label>
              <Input 
                type="time" 
                id="game-time" 
                name="time"
                value={gameData.time}
                onChange={handleGameChange}
                placeholder="Horário do jogo" 
              />
            </div>
            
            <div>
              <Label htmlFor="game-opponent">Oponente</Label>
              <Input 
                type="text" 
                id="game-opponent" 
                name="opponent"
                value={gameData.opponent}
                onChange={handleGameChange}
                placeholder="Nome do oponente" 
              />
            </div>
            
            <div>
              <Label htmlFor="game-location">Local</Label>
              <Input 
                type="text" 
                id="game-location" 
                name="location"
                value={gameData.location}
                onChange={handleGameChange}
                placeholder="Local do jogo" 
              />
            </div>
            
            <div>
              <Label htmlFor="game-uniform">Uniforme</Label>
              <Input 
                type="text" 
                id="game-uniform" 
                name="uniform"
                value={gameData.uniform}
                onChange={handleGameChange}
                placeholder="Uniforme para o jogo" 
              />
            </div>
            
            <div>
              <Label htmlFor="game-notes">Notas</Label>
              <Textarea
                id="game-notes"
                name="notes"
                value={gameData.notes}
                onChange={handleGameChange}
                placeholder="Notas adicionais"
              />
            </div>
            
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? "Adicionando..." : "Adicionar Jogo"}
            </Button>
          </form>
        </TabsContent>
        
        {/* Training Tab */}
        <TabsContent value="1" className="mt-4 px-4">
          <form onSubmit={handleTrainingSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="training-date">Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !trainingData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {trainingData.date ? (
                      format(trainingData.date, "PPP")
                    ) : (
                      <span>Escolher data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center" side="bottom">
                  <Calendar
                    mode="single"
                    selected={trainingData.date}
                    onSelect={(date) => setTrainingData(prev => ({...prev, date: date}))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label htmlFor="training-time">Horário</Label>
              <Input 
                type="time" 
                id="training-time"
                name="time"
                value={trainingData.time}
                onChange={handleTrainingChange}
                placeholder="Horário do treino" 
              />
            </div>
            
            <div>
              <Label htmlFor="training-location">Local</Label>
              <Input 
                type="text" 
                id="training-location"
                name="location"
                value={trainingData.location}
                onChange={handleTrainingChange}
                placeholder="Local do treino" 
              />
            </div>
            
            <div>
              <Label htmlFor="training-uniform">Uniforme</Label>
              <Input 
                type="text" 
                id="training-uniform"
                name="uniform"
                value={trainingData.uniform}
                onChange={handleTrainingChange}
                placeholder="Uniforme para o treino" 
              />
            </div>
            
            <div>
              <Label htmlFor="training-focus">Foco</Label>
              <Input 
                type="text" 
                id="training-focus"
                name="focus"
                value={trainingData.focus}
                onChange={handleTrainingChange}
                placeholder="Foco do treino" 
              />
            </div>
            
            <div>
              <Label htmlFor="training-drills">Exercícios</Label>
              <Textarea
                id="training-drills"
                name="drills"
                value={trainingData.drills}
                onChange={handleTrainingChange}
                placeholder="Exercícios a serem realizados"
              />
            </div>
            
            <div>
              <Label htmlFor="training-notes">Notas</Label>
              <Textarea
                id="training-notes"
                name="notes"
                value={trainingData.notes}
                onChange={handleTrainingChange}
                placeholder="Notas adicionais"
              />
            </div>
            
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? "Adicionando..." : "Adicionar Treino"}
            </Button>
          </form>
        </TabsContent>
        
        {/* Announcement Tab */}
        <TabsContent value="2" className="mt-4 px-4">
          <form onSubmit={handleAnnouncementSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="announcement-title">Título</Label>
              <Input 
                type="text" 
                id="announcement-title"
                name="title"
                value={announcementData.title}
                onChange={handleAnnouncementChange}
                placeholder="Título do aviso" 
                required
              />
            </div>
            
            <div>
              <Label htmlFor="announcement-content">Conteúdo</Label>
              <Textarea
                id="announcement-content"
                name="content"
                value={announcementData.content}
                onChange={handleAnnouncementChange}
                placeholder="Conteúdo do aviso"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="announcement-priority">Prioridade</Label>
              <select
                id="announcement-priority"
                name="priority"
                className="w-full p-2 border rounded-md"
                value={announcementData.priority}
                onChange={(e) => setAnnouncementData(prev => ({
                  ...prev, 
                  priority: e.target.value as 'high' | 'medium' | 'low'
                }))}
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="announcement-voting"
                checked={announcementData.voting}
                onChange={(e) => setAnnouncementData(prev => ({
                  ...prev,
                  voting: e.target.checked
                }))}
              />
              <Label htmlFor="announcement-voting">Permitir votação</Label>
            </div>
            
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? "Adicionando..." : "Adicionar Aviso"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AddPage;
