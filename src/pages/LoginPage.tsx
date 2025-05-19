
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
        <div className="flex flex-col items-center mb-6">
          <img 
            src="/lovable-uploads/250bc0ef-a336-4057-a13f-f5b72f197077.png" 
            alt="Female Futsal Logo" 
            className="w-40 h-40 object-contain mx-auto"
          />
          <div className="mt-2 text-center">
            <p className="text-3xl font-bold text-[#1A1F2C]">FEMALE</p>
            <p className="text-3xl font-bold text-white">FUTSAL</p>
          </div>
        </div>
        
        <div className="w-full flex flex-col gap-4 mt-auto">
          <Button
            onClick={() => setShowLoginForm(true)}
            className="w-full py-6 bg-white text-black font-bold rounded-md text-lg uppercase"
          >
            ENTRAR
          </Button>
          
          <Button
            onClick={() => navigate('/register')}
            className="w-full py-6 bg-[#F2B705] text-black font-bold rounded-md text-lg uppercase"
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
        <div className="flex flex-col items-center mb-6">
          <img 
            src="/lovable-uploads/250bc0ef-a336-4057-a13f-f5b72f197077.png" 
            alt="Female Futsal Logo" 
            className="w-40 h-40 object-contain mx-auto"
          />
          <div className="mt-2 text-center">
            <p className="text-3xl font-bold text-[#1A1F2C]">FEMALE</p>
            <p className="text-3xl font-bold text-white">FUTSAL</p>
          </div>
        </div>
        
        <form onSubmit={handleLogin} className="w-full mt-4">
          <div className="mb-4 bg-[#745AA9] rounded-md p-4">
            <label className="text-white text-lg" htmlFor="email">Email:</label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded bg-white border-0 mt-2"
              placeholder="seunome@gmail.com"
            />
          
            <label className="text-white text-lg mt-4 block" htmlFor="password">Senha:</label>
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

            <div className="mb-2 text-center mt-2">
              <a href="#" className="text-white underline text-sm">
                Esqueceu sua senha?
              </a>
            </div>

            <div className="mb-6 mt-4">
              <RadioGroup 
                value={role} 
                onValueChange={(value) => setRole(value as UserRole)}
                className="flex flex-col space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="coach" id="coach" className="bg-[#1A1F2C] border-[#1A1F2C]" />
                  <label htmlFor="coach" className="text-white text-lg">TREINADOR(A)</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="player" id="player" className="bg-[#1A1F2C] border-[#1A1F2C]" />
                  <label htmlFor="player" className="text-white text-lg">ALUNA</label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-6 bg-[#F2B705] text-black font-bold rounded-md text-lg uppercase mt-4"
          >
            {isLoading ? "Entrando..." : "AVANÇAR"}
          </Button>
          
          <div className="text-center mt-3">
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
    <div className="min-h-screen flex flex-col bg-[#482683]">
      {showLoginForm ? renderLoginForm() : renderInitialScreen()}
    </div>
  );
};

export default LoginPage;
