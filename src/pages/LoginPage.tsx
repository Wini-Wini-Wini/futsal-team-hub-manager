
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UserRole } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('player');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Erro de login",
        description: "Email e senha são obrigatórios",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { success, error } = await login(email, password, role);
      
      if (success) {
        toast({
          title: "Login realizado",
          description: `Bem-vindo de volta, ${role === 'coach' ? 'Treinador(a)' : 'Atleta'}!`,
        });
        navigate('/');
      } else {
        toast({
          title: "Erro de login",
          description: error || "Email ou senha inválidos",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao fazer login",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderInitialScreen = () => {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="mb-6">
          <img 
            src="/lovable-uploads/a1b14023-9776-403e-8461-54f962bb9c6d.png" 
            alt="Female Futsal Logo" 
            className="w-40 h-40 object-contain rounded-full border-4 border-white shadow-lg"
          />
        </div>
        
        <h1 className="text-2xl font-bold text-white text-center mb-8">
          <span className="text-[#270E58]">FEMALE</span><br />
          <span className="text-white">FUTSAL</span>
        </h1>
        
        <div className="w-full flex flex-col gap-4 mt-auto">
          <Button
            onClick={() => setShowLoginForm(true)}
            className="w-full py-6 bg-white text-black font-bold rounded-md text-lg uppercase"
          >
            ENTRAR
          </Button>
          
          <Button
            onClick={() => navigate('/register')}
            className="w-full py-6 bg-futsal-accent text-black font-bold rounded-md text-lg uppercase"
          >
            CRIE SUA CONTA
          </Button>
        </div>
      </div>
    );
  };

  const renderLoginForm = () => {
    return (
      <div className="flex-1 flex flex-col items-center p-8">
        <div className="mb-6">
          <img 
            src="/lovable-uploads/a1b14023-9776-403e-8461-54f962bb9c6d.png" 
            alt="Female Futsal Logo" 
            className="w-40 h-40 object-contain rounded-full border-4 border-white shadow-lg"
          />
        </div>
        
        <h1 className="text-2xl font-bold text-white text-center mb-8">
          <span className="text-[#270E58]">FEMALE</span><br />
          <span className="text-white">FUTSAL</span>
        </h1>
        
        <form onSubmit={handleLogin} className="w-full mt-4">
          <div className="mb-4">
            <label className="text-white text-lg" htmlFor="email">Email:</label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded bg-white border-0 mt-2"
              placeholder="seunome@gmail.com"
            />
          </div>
          
          <div className="mb-4">
            <label className="text-white text-lg" htmlFor="password">Senha:</label>
            <div className="relative mt-2">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded bg-white border-0"
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
            <RadioGroup 
              value={role} 
              onValueChange={(value) => setRole(value as UserRole)}
              className="flex flex-col space-y-3 mt-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="coach" id="coach" />
                <label htmlFor="coach" className="text-white text-lg">TREINADOR(A)</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="player" id="player" />
                <label htmlFor="player" className="text-white text-lg">ALUNA</label>
              </div>
            </RadioGroup>
          </div>

          <div className="mb-4 text-center">
            <a href="#" className="text-white underline text-sm">
              Esqueceu sua senha?
            </a>
          </div>
          
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-6 bg-futsal-accent text-black font-bold rounded-md text-lg uppercase mt-4"
          >
            {isLoading ? "Entrando..." : "ENTRAR"}
          </Button>
          
          <div className="text-center mt-4">
            <button 
              type="button" 
              onClick={() => setShowLoginForm(false)}
              className="text-white underline text-sm uppercase"
            >
              Voltar à tela inicial
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-futsal-primary to-futsal-secondary">
      {showLoginForm ? renderLoginForm() : renderInitialScreen()}
    </div>
  );
};

export default LoginPage;
