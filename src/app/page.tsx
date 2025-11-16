'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Zap, Video, Wand2, Globe, Mic, Film, TrendingUp, Rocket, Star, Trophy, Target } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: <Zap className="w-6 h-6 text-white" />,
      title: "Cortes Automáticos",
      description: "IA identifica os melhores momentos e cria cortes perfeitos automaticamente",
    },
    {
      icon: <Video className="w-6 h-6 text-white" />,
      title: "Legendas Estilizadas",
      description: "Legendas automáticas com animações e estilos que prendem a atenção",
    },
    {
      icon: <Wand2 className="w-6 h-6 text-white" />,
      title: "Detecção de Highlights",
      description: "Encontra automaticamente os momentos mais virais do seu vídeo",
    },
    {
      icon: <Globe className="w-6 h-6 text-white" />,
      title: "Dublagem Automática",
      description: "Traduza e duble seus vídeos em múltiplos idiomas com IA",
    },
    {
      icon: <Mic className="w-6 h-6 text-white" />,
      title: "Clonagem de Voz",
      description: "Clone sua voz e crie narrações em qualquer idioma",
    },
    {
      icon: <Film className="w-6 h-6 text-white" />,
      title: "B-Roll Inteligente",
      description: "Adiciona automaticamente vídeos de apoio relevantes ao conteúdo",
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      title: "Templates Virais",
      description: "Use templates comprovados que geram milhões de visualizações",
    },
    {
      icon: <Sparkles className="w-6 h-6 text-white" />,
      title: "Exportação Otimizada",
      description: "Formatos perfeitos para TikTok, Instagram Reels e YouTube Shorts",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      {/* Hero Section - Ultra Chamativo */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background effects - Mais vibrante */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF0080]/30 via-[#7928CA]/20 to-[#00F5FF]/30" />
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#FF0080]/40 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#00F5FF]/40 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-[#7928CA]/30 rounded-full blur-[120px] animate-pulse" />

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          {/* Badge chamativo */}
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF0080] to-[#7928CA] rounded-full text-white text-sm font-bold mb-8 shadow-2xl shadow-[#FF0080]/50 animate-bounce">
            <Rocket className="w-5 h-5" />
            🔥 TRANSFORME SEUS VÍDEOS EM VIRAIS AGORA!
          </div>

          {/* Título impactante */}
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight">
            <span className="block">Crie Vídeos</span>
            <span className="block bg-gradient-to-r from-[#FF0080] via-[#7928CA] to-[#00F5FF] bg-clip-text text-transparent animate-pulse">
              QUE VIRALIZAM
            </span>
            <span className="block text-5xl sm:text-6xl lg:text-7xl mt-2">em Segundos! 🚀</span>
          </h1>

          <p className="text-2xl text-gray-300 max-w-4xl mx-auto mb-12 font-semibold">
            ✨ IA Poderosa + Edição Automática = <span className="text-[#FF0080] font-black">MILHÕES DE VIEWS</span>
          </p>

          {/* CTAs super chamativos */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <Link
              href="/upload"
              className="group relative flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-[#FF0080] to-[#7928CA] text-white rounded-full font-black text-xl hover:shadow-2xl hover:shadow-[#FF0080]/70 transition-all duration-300 hover:scale-110 animate-pulse"
            >
              <Sparkles className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
              CRIAR MEU VÍDEO VIRAL AGORA
              <Rocket className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link
              href="/pricing"
              className="flex items-center gap-2 px-10 py-6 bg-white/10 backdrop-blur-xl border-2 border-[#00F5FF] text-white rounded-full font-bold text-xl hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              <Trophy className="w-6 h-6 text-[#00F5FF]" />
              Ver Planos Premium
            </Link>
          </div>

          {/* Stats impressionantes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto mt-20">
            <div className="p-6 bg-gradient-to-br from-[#FF0080]/20 to-[#7928CA]/20 backdrop-blur-xl border border-[#FF0080]/30 rounded-3xl hover:scale-105 transition-transform">
              <div className="text-5xl font-black bg-gradient-to-r from-[#FF0080] to-[#00F5FF] bg-clip-text text-transparent mb-2">50x</div>
              <div className="text-lg font-bold text-white">🚀 Mais Rápido</div>
              <div className="text-sm text-gray-400 mt-1">Que edição manual</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-[#7928CA]/20 to-[#00F5FF]/20 backdrop-blur-xl border border-[#7928CA]/30 rounded-3xl hover:scale-105 transition-transform">
              <div className="text-5xl font-black bg-gradient-to-r from-[#7928CA] to-[#00F5FF] bg-clip-text text-transparent mb-2">98%</div>
              <div className="text-lg font-bold text-white">⚡ Automático</div>
              <div className="text-sm text-gray-400 mt-1">IA faz tudo por você</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-[#00F5FF]/20 to-[#FF0080]/20 backdrop-blur-xl border border-[#00F5FF]/30 rounded-3xl hover:scale-105 transition-transform">
              <div className="text-5xl font-black bg-gradient-to-r from-[#00F5FF] to-[#FF0080] bg-clip-text text-transparent mb-2">10M+</div>
              <div className="text-lg font-bold text-white">🔥 Views Geradas</div>
              <div className="text-sm text-gray-400 mt-1">Por nossos usuários</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid - Mais vibrante */}
      <section className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#FF0080]/20 to-[#7928CA]/20 border border-[#FF0080]/30 rounded-full text-[#FF0080] font-bold mb-6">
              <Star className="w-5 h-5" />
              RECURSOS PODEROSOS
            </div>
            <h2 className="text-5xl font-black text-white mb-4">
              Tudo Que Você Precisa Para
              <span className="block bg-gradient-to-r from-[#FF0080] to-[#00F5FF] bg-clip-text text-transparent">
                DOMINAR AS REDES SOCIAIS
              </span>
            </h2>
            <p className="text-gray-400 text-xl font-semibold">
              🎯 Ferramentas profissionais de IA ao seu alcance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-2 border-white/20 rounded-3xl hover:border-[#FF0080]/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#FF0080]/30"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#FF0080] to-[#7928CA] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg shadow-[#FF0080]/50">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-base font-medium">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-white mb-4">
              Criadores Estão
              <span className="block bg-gradient-to-r from-[#FF0080] to-[#00F5FF] bg-clip-text text-transparent">
                EXPLODINDO NAS REDES
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Maria Silva", views: "2.5M", platform: "TikTok", emoji: "🔥" },
              { name: "João Pedro", views: "1.8M", platform: "Instagram", emoji: "⚡" },
              { name: "Ana Costa", views: "3.2M", platform: "YouTube", emoji: "🚀" },
            ].map((creator, index) => (
              <div
                key={index}
                className="p-8 bg-gradient-to-br from-[#FF0080]/10 to-[#7928CA]/10 backdrop-blur-xl border border-[#FF0080]/30 rounded-3xl hover:scale-105 transition-transform"
              >
                <div className="text-6xl mb-4">{creator.emoji}</div>
                <h3 className="text-2xl font-black text-white mb-2">{creator.name}</h3>
                <p className="text-[#FF0080] font-bold text-xl mb-2">{creator.views} views</p>
                <p className="text-gray-400 font-medium">em {creator.platform}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final - Super Impactante */}
      <section className="py-20 px-4 relative">
        <div className="max-w-5xl mx-auto text-center">
          <div className="relative p-16 bg-gradient-to-br from-[#FF0080]/30 via-[#7928CA]/30 to-[#00F5FF]/30 backdrop-blur-xl border-2 border-[#FF0080]/50 rounded-[3rem] overflow-hidden">
            {/* Efeitos de fundo */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF0080]/20 to-[#00F5FF]/20 animate-pulse" />
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-10" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF0080] to-[#7928CA] rounded-full text-white font-black mb-6 animate-bounce">
                <Target className="w-5 h-5" />
                OFERTA ESPECIAL
              </div>
              
              <h2 className="text-6xl font-black text-white mb-6">
                Pronto Para Seus Vídeos
                <span className="block bg-gradient-to-r from-[#FF0080] via-[#7928CA] to-[#00F5FF] bg-clip-text text-transparent">
                  VIRALIZAREM?
                </span>
              </h2>
              
              <p className="text-2xl text-gray-300 mb-10 font-bold">
                🎬 Junte-se a milhares de criadores que já estão fazendo sucesso!
              </p>
              
              <Link
                href="/upload"
                className="inline-flex items-center gap-3 px-16 py-8 bg-gradient-to-r from-[#FF0080] to-[#7928CA] text-white rounded-full font-black text-2xl hover:shadow-2xl hover:shadow-[#FF0080]/70 transition-all duration-300 hover:scale-110 animate-pulse"
              >
                <Rocket className="w-8 h-8" />
                COMEÇAR AGORA - É GRÁTIS!
                <Sparkles className="w-8 h-8" />
              </Link>
              
              <p className="text-gray-400 mt-6 font-semibold">
                ✅ Sem cartão de crédito • ✅ Resultados em minutos • ✅ Cancele quando quiser
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          <p className="font-semibold">© 2024 ClipWave. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
