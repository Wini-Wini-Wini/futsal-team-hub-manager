import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { Eye, EyeOff, Edit, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

const ProfilePage: React.FC = () => {
  const { user, profile, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState({
    name: false,
    email: false,
    phone: false,
    password: false
  });
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  
  const isCoach = profile?.role === 'coach';
  
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        password: '************' // Placeholder for password
      });
    }
  }, [profile]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const toggleEdit = (field: keyof typeof isEditing) => {
    setIsEditing(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
    
    // If closing edit mode, reset the field value to original
    if (isEditing[field] && profile) {
      setFormData(prev => ({
        ...prev,
        [field]: field === 'password' ? '************' : (profile[field as keyof typeof profile] || '')
      }));
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !user) return;
    
    const file = e.target.files[0];
    setIsUploadingAvatar(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `avatar-${uuidv4()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      const { error: uploadError } = await supabase
        .storage
        .from('profiles')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;

      // Get public URL for the file
      const { data: publicUrlData } = supabase
        .storage
        .from('profiles')
        .getPublicUrl(filePath);
        
      const avatarUrl = publicUrlData.publicUrl;
      
      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', user.id);
      
      if (updateError) throw updateError;
      
      // Update local profile state - fix the type issue by extending the profile
      await updateProfile({ 
        ...profile,
        avatar_url: avatarUrl 
      });
      
      toast({
        title: "Foto atualizada",
        description: "Sua foto de perfil foi atualizada com sucesso",
      });
      
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a foto de perfil",
        variant: "destructive"
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };
  
  const handleSave = () => {
    if (!user || !profile) return;
    
    // Validate email
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast({
        title: "Erro de validação",
        description: "Por favor, insira um email válido",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, we would send password update to backend separately
    // For this demo, we'll just update the user info
    updateProfile({
      name: formData.name,
      email: formData.email,
      phone: formData.phone
    });
    
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram atualizadas com sucesso",
    });
    
    navigate('/menu');
  };
  
  // Only coaches can edit their profile
  if (!isCoach) {
    return (
      <div className="flex-1 pb-20">
        <Header title={profile?.name || 'Perfil'} showBackButton={true} />
        
        <div className="p-4">
          {/* Profile Picture */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-futsal-primary flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                {(profile as any)?.avatar_url ? (
                  <img 
                    src={(profile as any).avatar_url} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  profile?.name?.charAt(0) || '?'
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <h3 className="text-sm text-gray-500 mb-1">Nome:</h3>
            <p className="font-medium">{profile?.name}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <h3 className="text-sm text-gray-500 mb-1">Email:</h3>
            <p className="font-medium">{profile?.email}</p>
          </div>
          
          {profile?.phone && (
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <h3 className="text-sm text-gray-500 mb-1">Telefone:</h3>
              <p className="font-medium">{profile?.phone}</p>
            </div>
          )}
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Apenas treinadores podem editar informações.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 pb-20">
      <Header title="Treinador(a)" showBackButton={true} />
      
      <div className="p-4">
        {/* Profile Picture Section */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-futsal-primary flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
              {(profile as any)?.avatar_url ? (
                <img 
                  src={(profile as any).avatar_url} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                profile?.name?.charAt(0) || '?'
              )}
            </div>
            <label 
              htmlFor="avatarUpload" 
              className="absolute bottom-0 right-0 bg-futsal-primary text-white rounded-full p-2 cursor-pointer hover:bg-futsal-primary/80"
            >
              <Camera size={16} />
            </label>
            <input
              type="file"
              id="avatarUpload"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
              disabled={isUploadingAvatar}
            />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow mb-4">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Informações pessoais</h2>
          </div>
          
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Nome:</label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  readOnly={!isEditing.name}
                  className={`w-full border rounded-md px-3 py-2 ${
                    !isEditing.name ? 'bg-gray-50' : 'bg-white'
                  }`}
                />
                <button 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-futsal-primary"
                  onClick={() => toggleEdit('name')}
                >
                  <Edit size={18} />
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email:</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  readOnly={!isEditing.email}
                  className={`w-full border rounded-md px-3 py-2 ${
                    !isEditing.email ? 'bg-gray-50' : 'bg-white'
                  }`}
                />
                <button 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-futsal-primary"
                  onClick={() => toggleEdit('email')}
                >
                  <Edit size={18} />
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Número:</label>
              <div className="relative flex">
                <div className="bg-gray-100 border px-3 py-2 rounded-l-md flex items-center">
                  <span>+55</span>
                </div>
                <div className="flex-1 relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    readOnly={!isEditing.phone}
                    className={`w-full border border-l-0 rounded-r-md px-3 py-2 ${
                      !isEditing.phone ? 'bg-gray-50' : 'bg-white'
                    }`}
                    placeholder="99-99999-9999"
                  />
                  <button 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-futsal-primary"
                    onClick={() => toggleEdit('phone')}
                  >
                    <Edit size={18} />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Senha:</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  readOnly={!isEditing.password}
                  className={`w-full border rounded-md px-3 py-2 ${
                    !isEditing.password ? 'bg-gray-50' : 'bg-white'
                  }`}
                />
                <button 
                  className="absolute right-9 top-1/2 transform -translate-y-1/2"
                  onClick={() => isEditing.password && setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <button 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-futsal-primary"
                  onClick={() => toggleEdit('password')}
                >
                  <Edit size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleSave}
          className="w-full py-3 bg-futsal-accent text-black font-semibold rounded-lg"
        >
          Salvar
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
