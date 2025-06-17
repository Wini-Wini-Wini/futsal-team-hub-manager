
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, UserRole } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('coach');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    try {
      const result = await register(
        formData.email, 
        formData.password, 
        formData.name, 
        selectedRole,
        formData.phone
      );
      
      if (result.success) {
        setSuccess('Conta criada com sucesso! Redirecionando para o login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(result.error || 'Erro ao criar conta');
      }
    } catch (err) {
      setError('Erro inesperado ao criar conta');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVisitorAccess = () => {
    navigate('/visitor/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-purple-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo da Coruja */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4">
            <img 
              src="/lovable-uploads/03c981d8-3de9-4300-98e4-ae9bcc382308.png" 
              alt="Female Futsal Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">FEMALE</h1>
          <h2 className="text-4xl font-bold text-white">FUTSAL</h2>
        </div>

        {/* Formulário */}
        <div className="bg-purple-700/50 rounded-lg p-6 backdrop-blur-sm">
          {error && (
            <Alert className="border-red-200 bg-red-50 mb-4">
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50 mb-4">
              <AlertDescription className="text-green-700">
                {success}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Nome Completo:
              </label>
              <Input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Email:
              </label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-white"
                placeholder="seunome@gmail.com"
                required
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Telefone (opcional):
              </label>
              <Input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full bg-white"
                placeholder="(11) 99999-9999"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Senha:
              </label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-white pr-10"
                  placeholder="Digite sua senha"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Confirmar Senha:
              </label>
              <div className="relative">
                <Input
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full bg-white pr-10"
                  placeholder="Confirme sua senha"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Seleção de Papel */}
            <div className="space-y-2">
              <label className="flex items-center text-white">
                <input
                  type="radio"
                  name="role"
                  value="coach"
                  checked={selectedRole === 'coach'}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="mr-2"
                />
                TREINADOR(A)
              </label>
              <label className="flex items-center text-white">
                <input
                  type="radio"
                  name="role"
                  value="player"
                  checked={selectedRole === 'player'}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="mr-2"
                />
                ALUNA
              </label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 text-lg rounded-lg"
            >
              {isLoading ? 'CRIANDO CONTA...' : 'REGISTRAR'}
            </Button>
          </form>

          {/* Botão Visitante */}
          <Button
            onClick={handleVisitorAccess}
            className="w-full mt-4 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 text-lg rounded-lg"
          >
            ENTRAR COMO VISITANTE
          </Button>

          <div className="text-center mt-6">
            <Link to="/login" className="text-white text-sm underline">
              Já tem uma conta? Faça login aqui
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
