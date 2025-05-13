
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

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('player');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-futsal-primary to-futsal-secondary">
      {/* Logo and Title */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="mb-6">
          <img 
            src="/lovable-uploads/a1b14023-9776-403e-8461-54f962bb9c6d.png" 
            alt="Female Futsal Logo" 
            className="w-40 h-40 object-contain rounded-full border-4 border-white shadow-lg"
          />
        </div>
        
        <h1 className="text-2xl font-bold text-white text-center mb-8">
          Futsal Feminino<br />
          <span className="text-futsal-accent">Gerenciamento de Time</span>
        </h1>
        
        {/* Login Form */}
        <div className="w-full max-w-xs mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-white/20">
          <h2 className="text-xl font-bold text-white text-center mb-4">Login</h2>
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <Label className="text-white" htmlFor="email">Email:</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded bg-white/80 border-0"
                placeholder="seunome@gmail.com"
              />
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

            <div className="mb-4">
              <Label className="text-white mb-2 block">Entrar como:</Label>
              <RadioGroup 
                value={role} 
                onValueChange={(value) => setRole(value as UserRole)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="player" id="player" />
                  <Label htmlFor="player" className="text-white">Atleta</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="coach" id="coach" />
                  <Label htmlFor="coach" className="text-white">Treinador(a)</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="mb-4">
              <p className="text-white text-center text-sm">
                <a href="#" className="underline">Esqueceu sua senha?</a>
              </p>
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-futsal-accent text-black font-bold rounded text-lg uppercase hover:bg-futsal-accent/80"
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
          
          <p className="text-white text-center mt-4 text-sm">
            Não tem uma conta? <Link to="/register" className="underline text-futsal-accent">Registre-se</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
