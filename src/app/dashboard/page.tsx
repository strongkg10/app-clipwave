'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Navbar } from '@/components/custom/navbar';
import { 
  Plus, 
  Video, 
  Clock, 
  CheckCircle2, 
  Trash2,
  Play,
  Download,
  Filter,
  Search,
  BarChart3,
  TrendingUp,
  Zap,
  Calendar,
  FileVideo,
  Sparkles,
  Eye,
  Share2,
  Edit3
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { useAuthStore } from '@/lib/auth-store';
import { formatFileSize } from '@/lib/video-utils';

export default function DashboardPage() {
  const { projects, deleteProject } = useStore();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'processing' | 'pending'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
      deleteProject(id);
    }
  };

  // Filtrar projetos
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    
    const isCompleted = project.processedVideo?.status === 'completed';
    const isProcessing = project.steps.some(s => s.status === 'processing');
    
    if (filterStatus === 'completed') return matchesSearch && isCompleted;
    if (filterStatus === 'processing') return matchesSearch && isProcessing;
    if (filterStatus === 'pending') return matchesSearch && !isCompleted && !isProcessing;
    
    return matchesSearch;
  });

  // Estatísticas
  const stats = {
    total: projects.length,
    completed: projects.filter(p => p.processedVideo?.status === 'completed').length,
    processing: projects.filter(p => p.steps.some(s => s.status === 'processing')).length,
    pending: projects.filter(p => !p.processedVideo && !p.steps.some(s => s.status === 'processing')).length
  };

  // Calcular total de tamanho de arquivos
  const totalSize = projects.reduce((acc, p) => acc + p.originalVideo.size, 0);

  // Projetos recentes (últimos 3)
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black">
        <Navbar />

        <div className="pt-24 pb-20 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header com boas-vindas */}
            <div className="mb-8">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
                Olá, {user?.name || 'Criador'}! 👋
              </h1>
              <p className="text-gray-400 text-lg">
                Bem-vindo ao seu painel de controle do ClipWave
              </p>
            </div>

            {/* Cards de Estatísticas */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-[#6A00FF]/20 to-[#C77DFF]/10 border border-[#6A00FF]/30 rounded-2xl p-6 hover:scale-105 transition-transform">
                <div className="flex items-center justify-between mb-2">
                  <Video className="w-8 h-8 text-[#C77DFF]" />
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stats.total}</div>
                <div className="text-sm text-gray-400">Total de Projetos</div>
              </div>

              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30 rounded-2xl p-6 hover:scale-105 transition-transform">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle2 className="w-8 h-8 text-green-400" />
                  <BarChart3 className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stats.completed}</div>
                <div className="text-sm text-gray-400">Concluídos</div>
              </div>

              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/30 rounded-2xl p-6 hover:scale-105 transition-transform">
                <div className="flex items-center justify-between mb-2">
                  <Zap className="w-8 h-8 text-blue-400" />
                  <Clock className="w-5 h-5 text-blue-400 animate-spin" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stats.processing}</div>
                <div className="text-sm text-gray-400">Processando</div>
              </div>

              <div className="bg-gradient-to-br from-orange-500/20 to-yellow-500/10 border border-orange-500/30 rounded-2xl p-6 hover:scale-105 transition-transform">
                <div className="flex items-center justify-between mb-2">
                  <FileVideo className="w-8 h-8 text-orange-400" />
                  <Filter className="w-5 h-5 text-orange-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{formatFileSize(totalSize)}</div>
                <div className="text-sm text-gray-400">Armazenamento</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <Link
                href="/upload"
                className="group p-6 bg-gradient-to-br from-[#6A00FF]/20 to-[#C77DFF]/10 border border-[#6A00FF]/30 rounded-2xl hover:border-[#6A00FF]/50 transition-all hover:scale-105"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#6A00FF] to-[#C77DFF] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Novo Projeto</h3>
                    <p className="text-gray-400 text-sm">Criar vídeo com IA</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/videos"
                className="group p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30 rounded-2xl hover:border-green-500/50 transition-all hover:scale-105"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Video className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Meus Vídeos</h3>
                    <p className="text-gray-400 text-sm">Ver todos prontos</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/pricing"
                className="group p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/30 rounded-2xl hover:border-purple-500/50 transition-all hover:scale-105"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Upgrade</h3>
                    <p className="text-gray-400 text-sm">Ver planos premium</p>
                  </div>
                </div>
              </Link>

              <div className="p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/30 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Plano {user?.plan === 'free' ? 'Free' : user?.plan === 'pro' ? 'Pro' : 'Creator'}</h3>
                    <p className="text-gray-400 text-sm">
                      {user?.plan === 'free' ? '20 min/mês' : 'Ilimitado'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Projetos Recentes */}
            {recentProjects.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Projetos Recentes</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {recentProjects.map((project) => {
                    const isCompleted = project.processedVideo?.status === 'completed';
                    return (
                      <Link
                        key={project.id}
                        href={isCompleted ? '/result' : '/processing'}
                        className="group p-4 bg-white/5 border border-white/10 rounded-xl hover:border-[#6A00FF]/50 transition-all hover:scale-105"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#6A00FF]/20 to-[#C77DFF]/10 rounded-lg flex items-center justify-center">
                            <Video className="w-6 h-6 text-[#C77DFF]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-medium truncate">{project.name}</h3>
                            <p className="text-gray-400 text-sm">
                              {new Date(project.createdAt).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                          ) : (
                            <Clock className="w-5 h-5 text-blue-400 animate-spin flex-shrink-0" />
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Barra de ações */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar projetos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#6A00FF]/50 transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#6A00FF]/50 transition-colors cursor-pointer"
                >
                  <option value="all">Todos</option>
                  <option value="completed">Concluídos</option>
                  <option value="processing">Processando</option>
                  <option value="pending">Pendentes</option>
                </select>

                <Link
                  href="/upload"
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#6A00FF] to-[#C77DFF] text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-[#6A00FF]/50 transition-all duration-300 hover:scale-105 whitespace-nowrap"
                >
                  <Plus className="w-5 h-5" />
                  Novo Projeto
                </Link>
              </div>
            </div>

            {/* Projects Grid */}
            {filteredProjects.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Video className="w-10 h-10 text-gray-500" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'Nenhum projeto encontrado' 
                    : 'Nenhum projeto ainda'}
                </h3>
                <p className="text-gray-400 mb-8">
                  {searchTerm || filterStatus !== 'all'
                    ? 'Tente ajustar os filtros de busca'
                    : 'Comece criando seu primeiro vídeo com IA'}
                </p>
                {!searchTerm && filterStatus === 'all' && (
                  <Link
                    href="/upload"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#6A00FF] to-[#C77DFF] text-white rounded-full font-semibold hover:shadow-2xl hover:shadow-[#6A00FF]/50 transition-all duration-300 hover:scale-105"
                  >
                    <Plus className="w-5 h-5" />
                    Criar Primeiro Projeto
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => {
                  const isCompleted = project.processedVideo?.status === 'completed';
                  const isProcessing = project.steps.some(s => s.status === 'processing');

                  return (
                    <div
                      key={project.id}
                      className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-[#6A00FF]/50 transition-all duration-300 hover:scale-[1.02]"
                    >
                      {/* Thumbnail */}
                      <div className="relative aspect-video bg-gradient-to-br from-[#6A00FF]/20 to-[#C77DFF]/10 flex items-center justify-center">
                        <Video className="w-16 h-16 text-white/30" />
                        
                        {/* Status badge */}
                        <div className="absolute top-3 right-3">
                          {isCompleted ? (
                            <div className="flex items-center gap-1 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-xs font-medium">
                              <CheckCircle2 className="w-3 h-3" />
                              Concluído
                            </div>
                          ) : isProcessing ? (
                            <div className="flex items-center gap-1 px-3 py-1 bg-[#6A00FF]/20 border border-[#6A00FF]/30 rounded-full text-[#C77DFF] text-xs font-medium">
                              <Clock className="w-3 h-3 animate-spin" />
                              Processando
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 px-3 py-1 bg-gray-500/20 border border-gray-500/30 rounded-full text-gray-400 text-xs font-medium">
                              <Clock className="w-3 h-3" />
                              Pendente
                            </div>
                          )}
                        </div>

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          {isCompleted && (
                            <>
                              <Link
                                href="/result"
                                className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                              >
                                <Eye className="w-5 h-5 text-white" />
                              </Link>
                              <button className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                                <Share2 className="w-5 h-5 text-white" />
                              </button>
                              <button className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                                <Download className="w-5 h-5 text-white" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="text-lg font-semibold text-white mb-2 truncate">
                          {project.name}
                        </h3>
                        
                        <div className="space-y-2 text-sm text-gray-400 mb-4">
                          <div className="flex items-center justify-between">
                            <span>Resolução</span>
                            <span className="text-white font-medium">
                              {project.settings.resolution.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Proporção</span>
                            <span className="text-white font-medium">
                              {project.settings.aspectRatio}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Tamanho</span>
                            <span className="text-white font-medium">
                              {formatFileSize(project.originalVideo.size)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Criado em</span>
                            <span className="text-white font-medium">
                              {new Date(project.createdAt).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {isCompleted ? (
                            <>
                              <Link
                                href="/result"
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#6A00FF] to-[#C77DFF] text-white rounded-lg font-medium hover:shadow-lg transition-all"
                              >
                                <Play className="w-4 h-4" />
                                Ver
                              </Link>
                              <button
                                onClick={() => handleDelete(project.id)}
                                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          ) : isProcessing ? (
                            <Link
                              href="/processing"
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors"
                            >
                              <Clock className="w-4 h-4" />
                              Ver Progresso
                            </Link>
                          ) : (
                            <button
                              onClick={() => handleDelete(project.id)}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg font-medium transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              Excluir
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
