
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UserRole } from '../contexts/AuthContext';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('player');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Senhas diferentes",
        description: "As senhas não coincidem",
        variant: "destructive"
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { success, error } = await register(email, password, name, role, phone);
      
      if (success) {
        toast({
          title: "Conta criada",
          description: "Sua conta foi criada com sucesso!",
        });
        navigate('/');
      } else {
        toast({
          title: "Erro ao criar conta",
          description: error || "Ocorreu um erro ao criar sua conta",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao registrar sua conta",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-futsal-primary to-futsal-secondary">
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="mb-6">
          <img 
            src="/lovable-uploads/a1b14023-9776-403e-8461-54f962bb9c6d.png" 
            alt="Female Futsal Logo" 
            className="w-24 h-24 object-contain rounded-full border-4 border-white shadow-lg"
          />
        </div>
        
        <h1 className="text-xl font-bold text-white text-center mb-6">
          Registro de Conta
        </h1>
        
        <div className="w-full max-w-md bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-white/20">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label className="text-white" htmlFor="name">Nome completo:</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded bg-white/80 border-0"
                placeholder="Maria da Silva"
              />
            </div>
            
            <div className="mb-4">
              <Label className="text-white" htmlFor="email">Email:</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded bg-white/80 border-0"
                placeholder="maria@gmail.com"
              />
            </div>
            
            <div className="mb-4">
              <Label className="text-white" htmlFor="phone">Telefone (opcional):</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 rounded bg-white/80 border-0"
                placeholder="(11) 98765-4321"
              />
            </div>
            
            <div className="mb-4">
              <Label className="text-white mb-2 block">Tipo de conta:</Label>
              <RadioGroup 
                value={role} 
                onValueChange={(value) => setRole(value as UserRole)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="player" id="player-reg" />
                  <Label htmlFor="player-reg" className="text-white">Atleta</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="coach" id="coach-reg" />
                  <Label htmlFor="coach-reg" className="text-white">Treinador(a)</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="mb-4">
              <Label className="text-white" htmlFor="password">Senha:</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded bg-white/80 border-0"
                  placeholder="Digite sua senha"
                />
                <button 
                  type="button" 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <Label className="text-white" htmlFor="confirmPassword">Confirmar senha:</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded bg-white/80 border-0"
                  placeholder="Confirme sua senha"
                />
                <button 
                  type="button" 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-futsal-accent text-black font-bold rounded text-lg uppercase hover:bg-futsal-accent/80"
            >
              {isLoading ? "Criando conta..." : "Criar conta"}
            </Button>
            
            <p className="text-white text-center mt-4 text-sm">
              Já tem uma conta? <Link to="/login" className="underline text-futsal-accent">Entre aqui</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
