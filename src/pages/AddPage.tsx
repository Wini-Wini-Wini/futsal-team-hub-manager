
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import TabBar from '../components/TabBar';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useToast } from '@/hooks/use-toast';

const AddPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { addGame, addTraining, addAnnouncement } = useData();
  const { toast } = useToast();
  const tabs = ['Jogo', 'Treino', 'Aviso'];
  
  // Game form state
  const [gameForm, setGameForm] = useState({
    date: '',
    location: '',
    opponent: '',
    uniform: '',
    time: ''
  });
  
  // Training form state
  const [trainingForm, setTrainingForm] = useState({
    date: '',
    location: '',
    uniform: '',
    time: ''
  });
  
  // Announcement form state
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    message: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    voting: false,
    date: new Date().toISOString().split('T')[0]
  });
  
  // Only coaches can add content
  if (profile?.role !== 'coach') {
    navigate('/');
    return null;
  }
  
  const handleGameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGameForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTrainingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTrainingForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAnnouncementChange = (
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (activeTab === 0) {
        // Add game
        if (!gameForm.date || !gameForm.location || !gameForm.time) {
          toast({
            title: "Campos obrigatórios",
            description: "Por favor, preencha todos os campos obrigatórios",
            variant: "destructive"
          });
          return;
        }
        
        addGame({
          date: gameForm.date,
          location: gameForm.location,
          opponent: gameForm.opponent,
          uniform: gameForm.uniform,
          time: gameForm.time,
          homeScore: 0,
          awayScore: 0
        });
        
        toast({
          title: "Jogo adicionado",
          description: "O jogo foi adicionado com sucesso"
        });
        
        navigate('/agenda');
      } else if (activeTab === 1) {
        // Add training
        if (!trainingForm.date || !trainingForm.location || !trainingForm.time) {
          toast({
            title: "Campos obrigatórios",
            description: "Por favor, preencha todos os campos obrigatórios",
            variant: "destructive"
          });
          return;
        }
        
        addTraining({
          date: trainingForm.date,
          location: trainingForm.location,
          uniform: trainingForm.uniform,
          time: trainingForm.time
        });
        
        toast({
          title: "Treino adicionado",
          description: "O treino foi adicionado com sucesso"
        });
        
        navigate('/agenda');
      } else {
        // Add announcement
        if (!announcementForm.title || !announcementForm.message) {
          toast({
            title: "Campos obrigatórios",
            description: "Por favor, preencha todos os campos obrigatórios",
            variant: "destructive"
          });
          return;
        }
        
        addAnnouncement({
          title: announcementForm.title,
          message: announcementForm.message,
          priority: announcementForm.priority,
          author: profile?.name || 'Treinador',
          date: announcementForm.date,
          voting: announcementForm.voting
        });
        
        toast({
          title: "Aviso adicionado",
          description: "O aviso foi adicionado com sucesso"
        });
        
        navigate('/announcements');
      }
    } catch (error) {
      console.error('Error adding item:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar o item",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex-1 pb-20">
      <Header title={`Novo ${tabs[activeTab].toLowerCase()}`} showBackButton={true} />
      <TabBar 
        tabs={tabs} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 0 && (
            // Game Form
            <>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Data</label>
                <input
                  type="date"
                  name="date"
                  value={gameForm.date}
                  onChange={handleGameChange}
                  className="w-full border rounded-md px-3 py-2"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium">Local</label>
                <input
                  type="text"
                  name="location"
                  value={gameForm.location}
                  onChange={handleGameChange}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Ginásio AABB"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium">Adversário</label>
                <input
                  type="text"
                  name="opponent"
                  value={gameForm.opponent}
                  onChange={handleGameChange}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Nome do adversário"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium">Uniforme</label>
                <select
                  name="uniform"
                  value={gameForm.uniform}
                  onChange={handleGameChange}
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="">Selecione o uniforme</option>
                  <option value="A">Uniforme A</option>
                  <option value="B">Uniforme B</option>
                  <option value="C">Uniforme C</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium">Horário</label>
                <input
                  type="time"
                  name="time"
                  value={gameForm.time}
                  onChange={handleGameChange}
                  className="w-full border rounded-md px-3 py-2"
                  required
                />
              </div>
            </>
          )}
          
          {activeTab === 1 && (
            // Training Form
            <>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Data</label>
                <input
                  type="date"
                  name="date"
                  value={trainingForm.date}
                  onChange={handleTrainingChange}
                  className="w-full border rounded-md px-3 py-2"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium">Local</label>
                <input
                  type="text"
                  name="location"
                  value={trainingForm.location}
                  onChange={handleTrainingChange}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Quadra do Exponencial"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium">Uniforme</label>
                <input
                  type="text"
                  name="uniform"
                  value={trainingForm.uniform}
                  onChange={handleTrainingChange}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Uniforme de treino"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium">Horário</label>
                <input
                  type="time"
                  name="time"
                  value={trainingForm.time}
                  onChange={handleTrainingChange}
                  className="w-full border rounded-md px-3 py-2"
                  required
                />
              </div>
            </>
          )}
          
          {activeTab === 2 && (
            // Announcement Form
            <>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Título</label>
                <input
                  type="text"
                  name="title"
                  value={announcementForm.title}
                  onChange={handleAnnouncementChange}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Digite o título do aviso..."
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium">Prioridade</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="priority"
                      value="high"
                      checked={announcementForm.priority === 'high'}
                      onChange={handleAnnouncementChange}
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
                      onChange={handleAnnouncementChange}
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
                      onChange={handleAnnouncementChange}
                      className="mr-1"
                    />
                    <span className="w-4 h-4 bg-futsal-green rounded-sm inline-block mr-1"></span>
                    Baixa
                  </label>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium">Data</label>
                <input
                  type="date"
                  name="date"
                  value={announcementForm.date}
                  onChange={handleAnnouncementChange}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <label className="text-sm font-medium mr-2">Votação</label>
                  <div className="flex items-center">
                    <label className="flex items-center mr-4">
                      <input
                        type="checkbox"
                        name="voting"
                        checked={announcementForm.voting}
                        onChange={handleAnnouncementChange}
                        className="mr-1"
                      />
                      Sim
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium">Mensagem</label>
                <textarea
                  name="message"
                  value={announcementForm.message}
                  onChange={handleAnnouncementChange}
                  className="w-full border rounded-md px-3 py-2 h-32"
                  placeholder="Digite uma mensagem..."
                  required
                />
              </div>
            </>
          )}
          
          <button
            type="submit"
            className="w-full py-3 mt-6 bg-futsal-accent text-black font-bold rounded-md"
          >
            ADICIONAR
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPage;
