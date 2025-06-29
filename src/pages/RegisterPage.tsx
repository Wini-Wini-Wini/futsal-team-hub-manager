
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserRole } from '../contexts/AuthContext';
import Header from '@/components/Header';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [role, setRole] = useState<UserRole>('player');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
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
    
    // Validate form fields
    if (!name || !email || !password || !confirmPassword || !accessKey) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos",
        variant: "destructive"
      });
      return;
    }
    
    // Validate password confirmation
    if (password !== confirmPassword) {
      toast({
        title: "Senhas diferentes",
        description: "As senhas não coincidem",
        variant: "destructive"
      });
      return;
    }
    
    // Validate password length
    if (password.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive"
      });
      return;
    }
    
    // Validate access key
    if (accessKey !== 'female123') {
      toast({
        title: "Senha de acesso inválida",
        description: "A senha de acesso fornecida é inválida",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { success, error } = await register(email, password, name, role);
      
      if (success) {
        setRegistrationSuccess(true);
        // No need to navigate here as we'll show the success page with a button to return to login
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
  
  // Render success page
  const renderSuccessPage = () => {
    return (
      <div className="min-h-screen flex flex-col bg-[#482683]">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <img 
            src="/lovable-uploads/17cdb063-665a-4886-b459-6deb3c3e1035.png" 
            alt="Female Futsal Logo" 
            className="w-48 h-48 object-contain mx-auto mb-8"
          />
          <p className="text-white text-xl font-semibold text-center mb-8">
            SUAS INFORMAÇÕES FORAM ENVIADAS COM SUCESSO!!
          </p>
          
          <Button
            onClick={() => navigate('/login')}
            className="w-full py-6 bg-[#F2B705] text-black font-bold rounded-md text-lg uppercase"
          >
            VOLTAR AO LOGIN
          </Button>
        </div>
      </div>
    );
  };
  
  // Render registration form
  const renderRegistrationForm = () => {
    return (
      <div className="min-h-screen flex flex-col bg-[#482683]">
        <Header 
          title="CRIAR CONTA" 
          showBackButton={true}
        />
        
        <div className="flex-1 flex flex-col items-center p-8">
          <div className="w-full flex-1 flex flex-col">
            <div className="flex flex-col items-center mb-6">
              <img 
                src="/lovable-uploads/17cdb063-665a-4886-b459-6deb3c3e1035.png" 
                alt="Female Futsal Logo" 
                className="w-32 h-32 object-contain mx-auto"
              />
              <div className="mt-2 text-center">
                <p className="text-2xl font-bold text-[#1A1F2C]">FEMALE</p>
                <p className="text-2xl font-bold text-white">FUTSAL</p>
              </div>
            </div>
            
            <div className="bg-[#745AA9] rounded-md p-4 mt-4 mb-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-bold text-white" htmlFor="name">NOME:</label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded bg-white border-0 mt-2"
                    placeholder="DIGITE SEU NOME"
                  />
                </div>
                
                <div>
                  <label className="block font-bold text-white" htmlFor="email">EMAIL:</label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded bg-white border-0 mt-2"
                    placeholder="DIGITE SEU EMAIL"
                  />
                </div>
                
                <div>
                  <label className="block font-bold text-white" htmlFor="role">CATEGORIA:</label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full h-10 px-3 py-2 border-0 rounded bg-white mt-2"
                  >
                    <option value="coach">COLABORADOR(A)</option>
                    <option value="player">ATLETA</option>
                  </select>
                </div>
                
                <div>
                  <label className="block font-bold text-white" htmlFor="password">SENHA:</label>
                  <div className="relative mt-2">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded bg-white border-0"
                      placeholder="DIGITE SUA SENHA"
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
                
                <div>
                  <label className="block font-bold text-white" htmlFor="confirmPassword">DIGITE NOVAMENTE SUA SENHA:</label>
                  <div className="relative mt-2">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded bg-white border-0"
                      placeholder="REPITA SUA SENHA"
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
                
                <div>
                  <label className="block font-bold text-white" htmlFor="accessKey">SENHA DE ACESSO:</label>
                  <Input
                    id="accessKey"
                    type="password"
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                    className="w-full px-4 py-3 rounded bg-white border-0 mt-2"
                    placeholder="DIGITE O CÓDIGO FORNECIDO PELA ORGANIZAÇÃO"
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-6 bg-[#F2B705] text-black font-bold rounded-md text-lg uppercase mt-4"
                >
                  {isLoading ? "ENVIANDO..." : "ENVIAR"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return registrationSuccess ? renderSuccessPage() : renderRegistrationForm();
};

export default RegisterPage;
