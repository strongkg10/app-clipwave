'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Navbar } from '@/components/custom/navbar';
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Video, 
  Palette,
  Globe,
  HardDrive,
  Zap,
  Youtube,
  Instagram,
  Share2,
  ChevronRight,
  Check,
  X,
  Camera,
  Mail,
  Lock,
  Smartphone,
  Download,
  Upload,
  Trash2,
  Settings as SettingsIcon,
  Moon,
  Sun,
  Monitor,
  Languages,
  Volume2,
  Sparkles,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';

type TabType = 'profile' | 'preferences' | 'notifications' | 'security' | 'billing' | 'integrations' | 'appearance' | 'storage';

export default function SettingsPage() {
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark');
  const [language, setLanguage] = useState('pt-BR');

  // Profile form states
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    username: '',
    bio: '',
    avatar: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Initialize profile data from user
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        username: user.username || '',
        bio: user.bio || '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  // Handle profile field changes
  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    setIsEditing(true);
  };

  // Validate profile data
  const validateProfile = () => {
    if (!profileData.name.trim()) {
      return { valid: false, error: 'Nome é obrigatório' };
    }
    if (!profileData.email.trim()) {
      return { valid: false, error: 'Email é obrigatório' };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      return { valid: false, error: 'Email inválido' };
    }
    return { valid: true };
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    const validation = validateProfile();
    if (!validation.valid) {
      setSaveMessage({ type: 'error', text: validation.error || 'Erro na validação' });
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }

    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update user in store
    updateUser({
      name: profileData.name,
      email: profileData.email,
      username: profileData.username,
      bio: profileData.bio,
      avatar: profileData.avatar
    });

    setIsSaving(false);
    setIsEditing(false);
    setSaveMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
    setTimeout(() => setSaveMessage(null), 3000);
  };

  // Cancel profile changes
  const handleCancelProfile = () => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        username: user.username || '',
        bio: user.bio || '',
        avatar: user.avatar || ''
      });
    }
    setIsEditing(false);
    setSaveMessage(null);
  };

  // Handle avatar upload (simulated)
  const handleAvatarUpload = () => {
    // Simulate file upload
    const randomAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`;
    setProfileData(prev => ({ ...prev, avatar: randomAvatar }));
    setIsEditing(true);
    setSaveMessage({ type: 'success', text: 'Foto atualizada! Clique em "Salvar alterações" para confirmar.' });
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const tabs = [
    { id: 'profile' as TabType, label: 'Perfil', icon: User },
    { id: 'preferences' as TabType, label: 'Preferências', icon: SettingsIcon },
    { id: 'notifications' as TabType, label: 'Notificações', icon: Bell },
    { id: 'security' as TabType, label: 'Segurança', icon: Shield },
    { id: 'billing' as TabType, label: 'Plano & Faturamento', icon: CreditCard },
    { id: 'integrations' as TabType, label: 'Integrações', icon: Share2 },
    { id: 'appearance' as TabType, label: 'Aparência', icon: Palette },
    { id: 'storage' as TabType, label: 'Armazenamento', icon: HardDrive },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black">
        <Navbar />

        <div className="pt-24 pb-20 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
                Configurações
              </h1>
              <p className="text-gray-400 text-lg">
                Gerencie sua conta e preferências do ClipWave
              </p>
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-2 sticky top-24">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-[#6A00FF] to-[#C77DFF] text-white'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium text-sm">{tab.label}</span>
                        {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Content */}
              <div className="lg:col-span-3">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8">
                  {/* Save Message Toast */}
                  {saveMessage && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                      saveMessage.type === 'success' 
                        ? 'bg-green-500/20 border border-green-500/30' 
                        : 'bg-red-500/20 border border-red-500/30'
                    }`}>
                      {saveMessage.type === 'success' ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-400" />
                      )}
                      <span className={saveMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}>
                        {saveMessage.text}
                      </span>
                    </div>
                  )}

                  {/* Profile Tab */}
                  {activeTab === 'profile' && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Perfil</h2>
                        <p className="text-gray-400">Gerencie suas informações pessoais</p>
                      </div>

                      {/* Avatar */}
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          {profileData.avatar ? (
                            <img 
                              src={profileData.avatar} 
                              alt="Avatar" 
                              className="w-24 h-24 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-24 h-24 bg-gradient-to-br from-[#6A00FF] to-[#C77DFF] rounded-full flex items-center justify-center text-white text-3xl font-bold">
                              {profileData.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                          )}
                          <button 
                            onClick={handleAvatarUpload}
                            className="absolute bottom-0 right-0 w-8 h-8 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center transition-colors"
                          >
                            <Camera className="w-4 h-4 text-white" />
                          </button>
                        </div>
                        <div>
                          <h3 className="text-white font-semibold mb-1">{profileData.name || 'Usuário'}</h3>
                          <p className="text-gray-400 text-sm mb-3">{profileData.email || 'email@exemplo.com'}</p>
                          <button 
                            onClick={handleAvatarUpload}
                            className="text-[#C77DFF] text-sm font-medium hover:text-[#6A00FF] transition-colors"
                          >
                            Alterar foto
                          </button>
                        </div>
                      </div>

                      {/* Form Fields */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-white font-medium mb-2">
                            Nome completo <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            value={profileData.name}
                            onChange={(e) => handleProfileChange('name', e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#6A00FF]/50 transition-colors"
                            placeholder="Seu nome completo"
                          />
                        </div>

                        <div>
                          <label className="block text-white font-medium mb-2">
                            Email <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="email"
                            value={profileData.email}
                            onChange={(e) => handleProfileChange('email', e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#6A00FF]/50 transition-colors"
                            placeholder="seu@email.com"
                          />
                        </div>

                        <div>
                          <label className="block text-white font-medium mb-2">Nome de usuário</label>
                          <input
                            type="text"
                            value={profileData.username}
                            onChange={(e) => handleProfileChange('username', e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#6A00FF]/50 transition-colors"
                            placeholder="@seuusuario"
                          />
                        </div>

                        <div>
                          <label className="block text-white font-medium mb-2">Bio</label>
                          <textarea
                            rows={4}
                            value={profileData.bio}
                            onChange={(e) => handleProfileChange('bio', e.target.value)}
                            placeholder="Conte um pouco sobre você..."
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#6A00FF]/50 transition-colors resize-none"
                          />
                          <p className="text-gray-500 text-sm mt-2">
                            {profileData.bio.length}/200 caracteres
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button 
                          onClick={handleSaveProfile}
                          disabled={!isEditing || isSaving}
                          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                            isEditing && !isSaving
                              ? 'bg-gradient-to-r from-[#6A00FF] to-[#C77DFF] text-white hover:shadow-lg'
                              : 'bg-white/10 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {isSaving ? 'Salvando...' : 'Salvar alterações'}
                        </button>
                        <button 
                          onClick={handleCancelProfile}
                          disabled={!isEditing || isSaving}
                          className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
                            isEditing && !isSaving
                              ? 'bg-white/5 hover:bg-white/10 text-white'
                              : 'bg-white/5 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Preferences Tab */}
                  {activeTab === 'preferences' && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Preferências de Vídeo</h2>
                        <p className="text-gray-400">Configure as opções padrão para seus projetos</p>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-white font-medium mb-3">Qualidade padrão</label>
                          <div className="grid grid-cols-3 gap-3">
                            {['720p', '1080p', '4k'].map((quality) => (
                              <button
                                key={quality}
                                className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#6A00FF]/50 rounded-xl text-white font-medium transition-all"
                              >
                                {quality}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-white font-medium mb-3">Proporção padrão</label>
                          <div className="grid grid-cols-3 gap-3">
                            {['9:16', '16:9', '1:1'].map((ratio) => (
                              <button
                                key={ratio}
                                className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#6A00FF]/50 rounded-xl text-white font-medium transition-all"
                              >
                                {ratio}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                          <div className="flex items-center gap-3">
                            <Volume2 className="w-5 h-5 text-[#C77DFF]" />
                            <div>
                              <div className="text-white font-medium">Remover silêncios automaticamente</div>
                              <div className="text-gray-400 text-sm">Corta pausas longas do vídeo</div>
                            </div>
                          </div>
                          <button className="w-12 h-6 bg-gradient-to-r from-[#6A00FF] to-[#C77DFF] rounded-full relative">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                          <div className="flex items-center gap-3">
                            <Sparkles className="w-5 h-5 text-[#C77DFF]" />
                            <div>
                              <div className="text-white font-medium">Adicionar legendas automaticamente</div>
                              <div className="text-gray-400 text-sm">Gera legendas com IA</div>
                            </div>
                          </div>
                          <button className="w-12 h-6 bg-gradient-to-r from-[#6A00FF] to-[#C77DFF] rounded-full relative">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                          <div className="flex items-center gap-3">
                            <Video className="w-5 h-5 text-[#C77DFF]" />
                            <div>
                              <div className="text-white font-medium">Aplicar B-roll automático</div>
                              <div className="text-gray-400 text-sm">Insere imagens relevantes</div>
                            </div>
                          </div>
                          <button className="w-12 h-6 bg-white/10 rounded-full relative">
                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notifications Tab */}
                  {activeTab === 'notifications' && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Notificações</h2>
                        <p className="text-gray-400">Gerencie como você recebe atualizações</p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                          <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-[#C77DFF]" />
                            <div>
                              <div className="text-white font-medium">Email de conclusão</div>
                              <div className="text-gray-400 text-sm">Quando vídeo estiver pronto</div>
                            </div>
                          </div>
                          <button className="w-12 h-6 bg-gradient-to-r from-[#6A00FF] to-[#C77DFF] rounded-full relative">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                          <div className="flex items-center gap-3">
                            <Bell className="w-5 h-5 text-[#C77DFF]" />
                            <div>
                              <div className="text-white font-medium">Notificações push</div>
                              <div className="text-gray-400 text-sm">Atualizações em tempo real</div>
                            </div>
                          </div>
                          <button className="w-12 h-6 bg-gradient-to-r from-[#6A00FF] to-[#C77DFF] rounded-full relative">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                          <div className="flex items-center gap-3">
                            <Zap className="w-5 h-5 text-[#C77DFF]" />
                            <div>
                              <div className="text-white font-medium">Novidades e atualizações</div>
                              <div className="text-gray-400 text-sm">Novas funcionalidades</div>
                            </div>
                          </div>
                          <button className="w-12 h-6 bg-white/10 rounded-full relative">
                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                          <div className="flex items-center gap-3">
                            <CreditCard className="w-5 h-5 text-[#C77DFF]" />
                            <div>
                              <div className="text-white font-medium">Faturamento e pagamentos</div>
                              <div className="text-gray-400 text-sm">Cobranças e recibos</div>
                            </div>
                          </div>
                          <button className="w-12 h-6 bg-gradient-to-r from-[#6A00FF] to-[#C77DFF] rounded-full relative">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Security Tab */}
                  {activeTab === 'security' && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Segurança</h2>
                        <p className="text-gray-400">Proteja sua conta e dados</p>
                      </div>

                      <div className="space-y-6">
                        <div className="p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30 rounded-xl">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                              <Check className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                              <div className="text-white font-semibold">Conta protegida</div>
                              <div className="text-green-400 text-sm">Todas as verificações ativas</div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-white font-semibold mb-4">Alterar senha</h3>
                          <div className="space-y-3">
                            <input
                              type="password"
                              placeholder="Senha atual"
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#6A00FF]/50 transition-colors"
                            />
                            <input
                              type="password"
                              placeholder="Nova senha"
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#6A00FF]/50 transition-colors"
                            />
                            <input
                              type="password"
                              placeholder="Confirmar nova senha"
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#6A00FF]/50 transition-colors"
                            />
                            <button className="px-6 py-3 bg-gradient-to-r from-[#6A00FF] to-[#C77DFF] text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                              Atualizar senha
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                          <div className="flex items-center gap-3">
                            <Smartphone className="w-5 h-5 text-[#C77DFF]" />
                            <div>
                              <div className="text-white font-medium">Autenticação de dois fatores</div>
                              <div className="text-gray-400 text-sm">Adicione uma camada extra de segurança</div>
                            </div>
                          </div>
                          <button className="px-4 py-2 bg-gradient-to-r from-[#6A00FF] to-[#C77DFF] text-white rounded-lg font-medium hover:shadow-lg transition-all">
                            Ativar
                          </button>
                        </div>

                        <div>
                          <h3 className="text-white font-semibold mb-4">Sessões ativas</h3>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                              <div className="flex items-center gap-3">
                                <Monitor className="w-5 h-5 text-[#C77DFF]" />
                                <div>
                                  <div className="text-white font-medium">Chrome - Windows</div>
                                  <div className="text-gray-400 text-sm">São Paulo, Brasil • Agora</div>
                                </div>
                              </div>
                              <span className="text-green-400 text-sm font-medium">Atual</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Billing Tab */}
                  {activeTab === 'billing' && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Plano & Faturamento</h2>
                        <p className="text-gray-400">Gerencie sua assinatura e pagamentos</p>
                      </div>

                      {/* Current Plan */}
                      <div className="p-6 bg-gradient-to-br from-[#6A00FF]/20 to-[#C77DFF]/10 border border-[#6A00FF]/30 rounded-xl">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-2xl font-bold text-white mb-1">
                              Plano {user?.plan === 'free' ? 'Free' : user?.plan === 'pro' ? 'Pro' : 'Creator'}
                            </h3>
                            <p className="text-gray-400">
                              {user?.plan === 'free' ? '20 minutos/mês' : 'Vídeos ilimitados'}
                            </p>
                          </div>
                          <Link
                            href="/pricing"
                            className="px-6 py-3 bg-gradient-to-r from-[#6A00FF] to-[#C77DFF] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                          >
                            Fazer upgrade
                          </Link>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white mb-1">15</div>
                            <div className="text-gray-400 text-sm">Vídeos criados</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white mb-1">5 min</div>
                            <div className="text-gray-400 text-sm">Restantes</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white mb-1">12 dias</div>
                            <div className="text-gray-400 text-sm">Até renovação</div>
                          </div>
                        </div>
                      </div>

                      {/* Payment Method */}
                      <div>
                        <h3 className="text-white font-semibold mb-4">Método de pagamento</h3>
                        <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded flex items-center justify-center">
                              <CreditCard className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="text-white font-medium">•••• •••• •••• 4242</div>
                              <div className="text-gray-400 text-sm">Expira em 12/2025</div>
                            </div>
                          </div>
                          <button className="text-[#C77DFF] font-medium hover:text-[#6A00FF] transition-colors">
                            Alterar
                          </button>
                        </div>
                      </div>

                      {/* Billing History */}
                      <div>
                        <h3 className="text-white font-semibold mb-4">Histórico de pagamentos</h3>
                        <div className="space-y-3">
                          {[
                            { date: '01 Jan 2024', amount: 'R$ 49,90', status: 'Pago' },
                            { date: '01 Dez 2023', amount: 'R$ 49,90', status: 'Pago' },
                            { date: '01 Nov 2023', amount: 'R$ 49,90', status: 'Pago' },
                          ].map((invoice, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                                  <Check className="w-5 h-5 text-green-400" />
                                </div>
                                <div>
                                  <div className="text-white font-medium">{invoice.amount}</div>
                                  <div className="text-gray-400 text-sm">{invoice.date}</div>
                                </div>
                              </div>
                              <button className="text-[#C77DFF] font-medium hover:text-[#6A00FF] transition-colors">
                                <Download className="w-5 h-5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Integrations Tab */}
                  {activeTab === 'integrations' && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Integrações</h2>
                        <p className="text-gray-400">Conecte suas redes sociais e ferramentas</p>
                      </div>

                      <div className="space-y-4">
                        <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                                <Youtube className="w-6 h-6 text-red-500" />
                              </div>
                              <div>
                                <h3 className="text-white font-semibold">YouTube</h3>
                                <p className="text-gray-400 text-sm">Publique diretamente no YouTube</p>
                              </div>
                            </div>
                            <button className="px-4 py-2 bg-gradient-to-r from-[#6A00FF] to-[#C77DFF] text-white rounded-lg font-medium hover:shadow-lg transition-all">
                              Conectar
                            </button>
                          </div>
                        </div>

                        <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                <Instagram className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h3 className="text-white font-semibold">Instagram</h3>
                                <p className="text-gray-400 text-sm">Compartilhe Reels automaticamente</p>
                              </div>
                            </div>
                            <button className="px-4 py-2 bg-gradient-to-r from-[#6A00FF] to-[#C77DFF] text-white rounded-lg font-medium hover:shadow-lg transition-all">
                              Conectar
                            </button>
                          </div>
                        </div>

                        <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center border border-white/20">
                                <span className="text-white font-bold text-xl">TT</span>
                              </div>
                              <div>
                                <h3 className="text-white font-semibold">TikTok</h3>
                                <p className="text-gray-400 text-sm">Publique vídeos no TikTok</p>
                              </div>
                            </div>
                            <button className="px-4 py-2 bg-gradient-to-r from-[#6A00FF] to-[#C77DFF] text-white rounded-lg font-medium hover:shadow-lg transition-all">
                              Conectar
                            </button>
                          </div>
                        </div>

                        <div className="p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30 rounded-xl">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                                <Check className="w-6 h-6 text-green-400" />
                              </div>
                              <div>
                                <h3 className="text-white font-semibold">Google Drive</h3>
                                <p className="text-green-400 text-sm">Conectado • backup@gmail.com</p>
                              </div>
                            </div>
                            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors">
                              Desconectar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Appearance Tab */}
                  {activeTab === 'appearance' && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Aparência</h2>
                        <p className="text-gray-400">Personalize a interface do ClipWave</p>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-white font-medium mb-4">Tema</label>
                          <div className="grid grid-cols-3 gap-4">
                            <button
                              onClick={() => setTheme('light')}
                              className={`p-4 border rounded-xl transition-all ${
                                theme === 'light'
                                  ? 'border-[#6A00FF] bg-[#6A00FF]/10'
                                  : 'border-white/10 bg-white/5 hover:border-white/20'
                              }`}
                            >
                              <Sun className="w-6 h-6 text-white mx-auto mb-2" />
                              <div className="text-white font-medium text-sm">Claro</div>
                            </button>

                            <button
                              onClick={() => setTheme('dark')}
                              className={`p-4 border rounded-xl transition-all ${
                                theme === 'dark'
                                  ? 'border-[#6A00FF] bg-[#6A00FF]/10'
                                  : 'border-white/10 bg-white/5 hover:border-white/20'
                              }`}
                            >
                              <Moon className="w-6 h-6 text-white mx-auto mb-2" />
                              <div className="text-white font-medium text-sm">Escuro</div>
                            </button>

                            <button
                              onClick={() => setTheme('system')}
                              className={`p-4 border rounded-xl transition-all ${
                                theme === 'system'
                                  ? 'border-[#6A00FF] bg-[#6A00FF]/10'
                                  : 'border-white/10 bg-white/5 hover:border-white/20'
                              }`}
                            >
                              <Monitor className="w-6 h-6 text-white mx-auto mb-2" />
                              <div className="text-white font-medium text-sm">Sistema</div>
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-white font-medium mb-4">Idioma</label>
                          <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#6A00FF]/50 transition-colors cursor-pointer"
                          >
                            <option value="pt-BR">Português (Brasil)</option>
                            <option value="en-US">English (US)</option>
                            <option value="es-ES">Español</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                          <div className="flex items-center gap-3">
                            <Zap className="w-5 h-5 text-[#C77DFF]" />
                            <div>
                              <div className="text-white font-medium">Animações</div>
                              <div className="text-gray-400 text-sm">Efeitos visuais e transições</div>
                            </div>
                          </div>
                          <button className="w-12 h-6 bg-gradient-to-r from-[#6A00FF] to-[#C77DFF] rounded-full relative">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Storage Tab */}
                  {activeTab === 'storage' && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Armazenamento</h2>
                        <p className="text-gray-400">Gerencie seus arquivos e espaço</p>
                      </div>

                      {/* Storage Usage */}
                      <div className="p-6 bg-gradient-to-br from-[#6A00FF]/20 to-[#C77DFF]/10 border border-[#6A00FF]/30 rounded-xl">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-white font-semibold">Uso de armazenamento</h3>
                          <span className="text-[#C77DFF] font-bold">2.4 GB / 10 GB</span>
                        </div>
                        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-4">
                          <div className="h-full bg-gradient-to-r from-[#6A00FF] to-[#C77DFF] rounded-full" style={{ width: '24%' }}></div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-white font-bold mb-1">1.8 GB</div>
                            <div className="text-gray-400 text-sm">Vídeos</div>
                          </div>
                          <div>
                            <div className="text-white font-bold mb-1">0.4 GB</div>
                            <div className="text-gray-400 text-sm">Projetos</div>
                          </div>
                          <div>
                            <div className="text-white font-bold mb-1">0.2 GB</div>
                            <div className="text-gray-400 text-sm">Cache</div>
                          </div>
                        </div>
                      </div>

                      {/* Storage Options */}
                      <div className="space-y-4">
                        <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors">
                          <div className="flex items-center gap-3">
                            <Upload className="w-5 h-5 text-[#C77DFF]" />
                            <div className="text-left">
                              <div className="text-white font-medium">Fazer backup dos projetos</div>
                              <div className="text-gray-400 text-sm">Salvar no Google Drive</div>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </button>

                        <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors">
                          <div className="flex items-center gap-3">
                            <Download className="w-5 h-5 text-[#C77DFF]" />
                            <div className="text-left">
                              <div className="text-white font-medium">Baixar todos os vídeos</div>
                              <div className="text-gray-400 text-sm">Exportar biblioteca completa</div>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </button>

                        <button className="w-full flex items-center justify-between p-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl transition-colors">
                          <div className="flex items-center gap-3">
                            <Trash2 className="w-5 h-5 text-red-400" />
                            <div className="text-left">
                              <div className="text-red-400 font-medium">Limpar cache</div>
                              <div className="text-gray-400 text-sm">Liberar 0.2 GB</div>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-red-400" />
                        </button>
                      </div>

                      {/* Upgrade Storage */}
                      <div className="p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/30 rounded-xl">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white font-semibold mb-1">Precisa de mais espaço?</h3>
                            <p className="text-gray-400 text-sm">Faça upgrade para 100 GB</p>
                          </div>
                        </div>
                        <Link
                          href="/pricing"
                          className="block w-full text-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                        >
                          Ver planos
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
