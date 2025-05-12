
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserRole } from '../contexts/AuthContext';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('player');
  const [isLoading, setIsLoading] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive"
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { success, error } = await register(email, password, name, userRole, phone || undefined);
      
      if (success) {
        toast({
          title: "Registro concluído",
          description: "Sua conta foi criada com sucesso!",
        });
        navigate('/');
      } else {
        toast({
          title: "Erro no registro",
          description: error || "Não foi possível concluir o registro",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar sua conta",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getNavLinkClass = (role: UserRole) => {
    return `flex-1 py-2 px-4 rounded transition-colors ${
      userRole === role 
        ? 'bg-white text-futsal-primary font-bold' 
        : 'bg-futsal-secondary/50 text-white hover:bg-futsal-secondary/70'
    }`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-futsal-primary to-futsal-secondary">
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center">
            <button 
              onClick={() => navigate('/login')}
              className="text-white hover:text-futsal-accent"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-white text-center flex-grow">
              Criar Conta
            </h1>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-white/20">
            <div className="mb-6 flex gap-4">
              <button
                type="button"
                className={getNavLinkClass('player')}
                onClick={() => setUserRole('player')}
              >
                Atleta
              </button>
              <button
                type="button"
                className={getNavLinkClass('coach')}
                onClick={() => setUserRole('coach')}
              >
                Treinador(a)
              </button>
            </div>
            
            <form onSubmit={handleRegister}>
              <div className="mb-4">
                <Label className="text-white" htmlFor="name">Nome completo:</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded bg-white/80 border-0"
                  placeholder="Seu nome completo"
                  required
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
                  placeholder="seuemail@gmail.com"
                  required
                />
              </div>
              
              <div className="mb-4">
                <Label className="text-white" htmlFor="phone">Telefone (opcional):</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 rounded bg-white/80 border-0"
                  placeholder="(99) 99999-9999"
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
                    required
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
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded bg-white/80 border-0"
                    placeholder="Confirme sua senha"
                    required
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-futsal-accent text-black font-bold rounded text-lg uppercase hover:bg-futsal-accent/80"
              >
                {isLoading ? "Registrando..." : "Criar Conta"}
              </Button>
              
              <p className="text-white text-center mt-4 text-sm">
                Já tem uma conta? <Link to="/login" className="underline text-futsal-accent">Faça login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
