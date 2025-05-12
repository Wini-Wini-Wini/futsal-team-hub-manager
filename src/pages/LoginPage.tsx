
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<'coach' | 'player'>('player');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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
    
    try {
      const success = await login(email, password, userType);
      
      if (success) {
        navigate('/');
      } else {
        toast({
          title: "Erro de login",
          description: "Email ou senha inválidos",
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
            className="w-40 h-40 object-contain"
          />
        </div>
        
        {/* Login Form */}
        <div className="w-full max-w-xs mt-12">
          <div className="mb-4">
            <label className="text-white text-lg font-semibold">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded bg-white"
              placeholder="seunome@gmail.com"
            />
          </div>
          
          <div className="mb-4">
            <label className="text-white text-lg font-semibold">Senha:</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded bg-white"
                placeholder="Digite sua senha"
              />
              <button 
                type="button" 
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-white text-center">
              <a href="#" className="underline">Esqueceu sua senha?</a>
            </p>
          </div>
          
          <div className="mb-4 flex gap-4">
            <button
              type="button"
              className={`flex-1 py-2 px-4 rounded ${
                userType === 'player' 
                  ? 'bg-white text-futsal-primary font-bold' 
                  : 'bg-futsal-secondary/50 text-white'
              }`}
              onClick={() => setUserType('player')}
            >
              Aluna
            </button>
            <button
              type="button"
              className={`flex-1 py-2 px-4 rounded ${
                userType === 'coach' 
                  ? 'bg-white text-futsal-primary font-bold' 
                  : 'bg-futsal-secondary/50 text-white'
              }`}
              onClick={() => setUserType('coach')}
            >
              Treinador
            </button>
          </div>
          
          <button
            onClick={handleLogin}
            className="w-full py-3 bg-futsal-accent text-black font-bold rounded text-lg uppercase"
          >
            Entrar
          </button>
          
          <p className="text-white text-center mt-4">
            <a href="#" className="text-sm">Voltar à tela inicial</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
