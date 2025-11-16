'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/custom/navbar';
import { AIAssistant } from '@/components/custom/ai-assistant';
import { Sparkles, Shield, CreditCard, Mail, Phone, User, Lock, CheckCircle2, Zap, Clock, Trophy, Star } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';

export default function TrialPage() {
  const router = useRouter();
  const { signup, isAuthenticated } = useAuthStore();
  const [step, setStep] = React.useState(1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    // Dados pessoais
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    
    // Dados de pagamento (para segurança)
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    
    // Endereço
    zipCode: '',
    address: '',
    city: '',
    state: '',
    country: '',
    
    // Termos
    acceptTerms: false,
    acceptMarketing: false,
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nome completo é obrigatório';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (!/^\\+?[\\d\\s()-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Telefone inválido';
    }
    
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Senha deve ter no mínimo 8 caracteres';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = 'Número do cartão é obrigatório';
    } else if (!/^\\d{16}$/.test(formData.cardNumber.replace(/\\s/g, ''))) {
      newErrors.cardNumber = 'Número do cartão inválido';
    }
    
    if (!formData.cardName.trim()) {
      newErrors.cardName = 'Nome no cartão é obrigatório';
    }
    
    if (!formData.expiryDate.trim()) {
      newErrors.expiryDate = 'Data de validade é obrigatória';
    } else if (!/^\\d{2}\\/\\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Formato inválido (MM/AA)';
    }
    
    if (!formData.cvv.trim()) {
      newErrors.cvv = 'CVV é obrigatório';
    } else if (!/^\\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = 'CVV inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'CEP é obrigatório';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Endereço é obrigatório';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'Cidade é obrigatória';
    }
    
    if (!formData.state.trim()) {
      newErrors.state = 'Estado é obrigatório';
    }
    
    if (!formData.country.trim()) {
      newErrors.country = 'País é obrigatório';
    }
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Você deve aceitar os termos';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep3()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Calcular data de expiração do trial (3 dias)
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 3);
      
      // Criar usuário com trial
      await signup(
        formData.email,
        formData.password,
        formData.fullName,
        {
          phone: formData.phone,
          cardNumber: formData.cardNumber.slice(-4), // Armazenar apenas últimos 4 dígitos
          address: {
            zipCode: formData.zipCode,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            country: formData.country,
          },
          trialEndsAt: trialEndsAt.toISOString(),
          acceptMarketing: formData.acceptMarketing,
        }
      );
      
      // Redirecionar para dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      setErrors({ submit: 'Erro ao criar conta. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando usuário digitar
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      <Navbar />
      <AIAssistant />

      <div className="pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF0080]/20 via-[#7928CA]/20 to-[#00F5FF]/20 blur-3xl -z-10 animate-pulse" />
            
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF0080] to-[#7928CA] rounded-full text-white font-black mb-6 shadow-2xl shadow-[#FF0080]/50 animate-bounce">
              <Trophy className="w-5 h-5" />
              🎉 TESTE GRÁTIS POR 3 DIAS!
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-black text-white mb-4">
              Comece Seu
              <span className="block bg-gradient-to-r from-[#FF0080] via-[#7928CA] to-[#00F5FF] bg-clip-text text-transparent">
                TESTE GRATUITO
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 font-semibold">
              ✨ Acesso completo por 3 dias • Sem cobranças • Cancele quando quiser
            </p>
          </div>

          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 bg-gradient-to-br from-[#FF0080]/10 to-[#7928CA]/10 backdrop-blur-xl border border-[#FF0080]/30 rounded-3xl text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF0080] to-[#7928CA] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#FF0080]/50">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-black text-white mb-2">3 Dias Grátis</h3>
              <p className="text-gray-400 font-medium">Teste todos os recursos premium sem pagar nada</p>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-[#7928CA]/10 to-[#00F5FF]/10 backdrop-blur-xl border border-[#7928CA]/30 rounded-3xl text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#7928CA] to-[#00F5FF] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#7928CA]/50">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-black text-white mb-2">100% Seguro</h3>
              <p className="text-gray-400 font-medium">Seus dados protegidos com criptografia de ponta</p>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-[#00F5FF]/10 to-[#FF0080]/10 backdrop-blur-xl border border-[#00F5FF]/30 rounded-3xl text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#00F5FF] to-[#FF0080] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#00F5FF]/50">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-black text-white mb-2">Cancele Fácil</h3>
              <p className="text-gray-400 font-medium">Cancele a qualquer momento sem complicações</p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-12">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg transition-all ${
                  s === step 
                    ? 'bg-gradient-to-br from-[#FF0080] to-[#7928CA] text-white shadow-lg shadow-[#FF0080]/50 scale-110' 
                    : s < step
                    ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white'
                    : 'bg-white/10 text-gray-500'
                }`}>
                  {s < step ? <CheckCircle2 className="w-6 h-6" /> : s}
                </div>
                {s < 3 && (
                  <div className={`w-16 h-1 rounded-full transition-all ${
                    s < step ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-white/10'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Dados Pessoais */}
            {step === 1 && (
              <div className="p-8 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-[#FF0080] to-[#7928CA] rounded-2xl shadow-lg shadow-[#FF0080]/50">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-black text-white">Dados Pessoais</h2>
                </div>

                <div>
                  <label className="block text-white font-bold mb-2">Nome Completo *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:border-[#FF0080] focus:outline-none transition-all"
                    placeholder="Seu nome completo"
                  />
                  {errors.fullName && <p className="text-red-400 text-sm mt-2">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-white font-bold mb-2">E-mail *</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:border-[#FF0080] focus:outline-none transition-all"
                      placeholder="seu@email.com"
                    />
                  </div>
                  {errors.email && <p className="text-red-400 text-sm mt-2">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-white font-bold mb-2">Telefone *</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:border-[#FF0080] focus:outline-none transition-all"
                      placeholder="+55 (11) 99999-9999"
                    />
                  </div>
                  {errors.phone && <p className="text-red-400 text-sm mt-2">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-white font-bold mb-2">Senha *</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:border-[#FF0080] focus:outline-none transition-all"
                      placeholder="Mínimo 8 caracteres"
                    />
                  </div>
                  {errors.password && <p className="text-red-400 text-sm mt-2">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-white font-bold mb-2">Confirmar Senha *</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:border-[#FF0080] focus:outline-none transition-all"
                      placeholder="Digite a senha novamente"
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-red-400 text-sm mt-2">{errors.confirmPassword}</p>}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-[#FF0080] to-[#7928CA] text-white rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-[#FF0080]/70 transition-all duration-300 hover:scale-105"
                >
                  Continuar
                  <Sparkles className="w-6 h-6" />
                </button>
              </div>
            )}

            {/* Step 2: Dados de Pagamento */}
            {step === 2 && (
              <div className="p-8 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-[#7928CA] to-[#00F5FF] rounded-2xl shadow-lg shadow-[#7928CA]/50">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-black text-white">Dados de Pagamento</h2>
                </div>

                <div className="p-4 bg-[#00F5FF]/10 border border-[#00F5FF]/30 rounded-2xl">
                  <p className="text-[#00F5FF] font-bold flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Não se preocupe! Você não será cobrado durante o período de teste.
                  </p>
                </div>

                <div>
                  <label className="block text-white font-bold mb-2">Número do Cartão *</label>
                  <input
                    type="text"
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', e.target.value.replace(/\\s/g, ''))}
                    maxLength={16}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:border-[#7928CA] focus:outline-none transition-all"
                    placeholder="1234 5678 9012 3456"
                  />
                  {errors.cardNumber && <p className="text-red-400 text-sm mt-2">{errors.cardNumber}</p>}
                </div>

                <div>
                  <label className="block text-white font-bold mb-2">Nome no Cartão *</label>
                  <input
                    type="text"
                    value={formData.cardName}
                    onChange={(e) => handleInputChange('cardName', e.target.value)}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:border-[#7928CA] focus:outline-none transition-all"
                    placeholder="Nome como está no cartão"
                  />
                  {errors.cardName && <p className="text-red-400 text-sm mt-2">{errors.cardName}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-bold mb-2">Validade *</label>
                    <input
                      type="text"
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                      maxLength={5}
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:border-[#7928CA] focus:outline-none transition-all"
                      placeholder="MM/AA"
                    />
                    {errors.expiryDate && <p className="text-red-400 text-sm mt-2">{errors.expiryDate}</p>}
                  </div>

                  <div>
                    <label className="block text-white font-bold mb-2">CVV *</label>
                    <input
                      type="text"
                      value={formData.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value)}
                      maxLength={4}
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:border-[#7928CA] focus:outline-none transition-all"
                      placeholder="123"
                    />
                    {errors.cvv && <p className="text-red-400 text-sm mt-2">{errors.cvv}</p>}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 px-8 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-[#7928CA] to-[#00F5FF] text-white rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-[#7928CA]/70 transition-all duration-300 hover:scale-105"
                  >
                    Continuar
                    <Sparkles className="w-6 h-6" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Endereço e Confirmação */}
            {step === 3 && (
              <div className="p-8 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-[#00F5FF] to-[#FF0080] rounded-2xl shadow-lg shadow-[#00F5FF]/50">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-black text-white">Endereço e Confirmação</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-bold mb-2">CEP *</label>
                    <input
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:border-[#00F5FF] focus:outline-none transition-all"
                      placeholder="00000-000"
                    />
                    {errors.zipCode && <p className="text-red-400 text-sm mt-2">{errors.zipCode}</p>}
                  </div>

                  <div>
                    <label className="block text-white font-bold mb-2">País *</label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:border-[#00F5FF] focus:outline-none transition-all"
                      placeholder="Brasil"
                    />
                    {errors.country && <p className="text-red-400 text-sm mt-2">{errors.country}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-white font-bold mb-2">Endereço Completo *</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:border-[#00F5FF] focus:outline-none transition-all"
                    placeholder="Rua, número, complemento"
                  />
                  {errors.address && <p className="text-red-400 text-sm mt-2">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-bold mb-2">Cidade *</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:border-[#00F5FF] focus:outline-none transition-all"
                      placeholder="Sua cidade"
                    />
                    {errors.city && <p className="text-red-400 text-sm mt-2">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-white font-bold mb-2">Estado *</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:border-[#00F5FF] focus:outline-none transition-all"
                      placeholder="SP"
                    />
                    {errors.state && <p className="text-red-400 text-sm mt-2">{errors.state}</p>}
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.acceptTerms}
                      onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-white/20 bg-white/5 text-[#FF0080] focus:ring-[#FF0080]"
                    />
                    <span className="text-white font-medium">
                      Eu aceito os <a href="/terms" className="text-[#FF0080] hover:underline">Termos de Uso</a> e a <a href="/privacy" className="text-[#FF0080] hover:underline">Política de Privacidade</a> *
                    </span>
                  </label>
                  {errors.acceptTerms && <p className="text-red-400 text-sm">{errors.acceptTerms}</p>}

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.acceptMarketing}
                      onChange={(e) => handleInputChange('acceptMarketing', e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-white/20 bg-white/5 text-[#FF0080] focus:ring-[#FF0080]"
                    />
                    <span className="text-gray-400 font-medium">
                      Quero receber novidades e ofertas especiais por e-mail
                    </span>
                  </label>
                </div>

                {errors.submit && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl">
                    <p className="text-red-400 font-bold">{errors.submit}</p>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 px-8 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all"
                    disabled={isSubmitting}
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-[#00F5FF] to-[#FF0080] text-white rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-[#00F5FF]/70 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <Star className="w-6 h-6" />
                        INICIAR TESTE GRÁTIS
                        <Sparkles className="w-6 h-6" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Security Badge */}
          <div className="mt-8 p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-3xl text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Shield className="w-6 h-6 text-green-400" />
              <p className="text-green-400 font-black text-lg">
                🔒 Seus dados estão 100% seguros e criptografados
              </p>
            </div>
            <p className="text-gray-400 font-medium">
              Utilizamos os mais altos padrões de segurança para proteger suas informações
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
