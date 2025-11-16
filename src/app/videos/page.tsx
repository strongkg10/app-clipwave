'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Navbar } from '@/components/custom/navbar';
import { 
  Video, 
  Play, 
  Download, 
  Share2, 
  Trash2,
  Search,
  Filter,
  Calendar,
  Clock,
  Eye,
  Grid3x3,
  List,
  CheckCircle2,
  FileVideo,
  TrendingUp,
  Sparkles,
  Zap
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { formatFileSize } from '@/lib/video-utils';
import { useLocale } from '@/lib/locale-context';

export default function VideosPage() {
  const { projects, deleteProject } = useStore();
  const { t } = useLocale();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'name'>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filtrar apenas vídeos completos
  const completedVideos = projects.filter(
    project => project.processedVideo?.status === 'completed'
  );

  // Aplicar busca
  const filteredVideos = completedVideos.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Aplicar ordenação
  const sortedVideos = [...filteredVideos].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const handleDelete = (id: string) => {
    if (confirm(t('videos.confirmDelete'))) {
      deleteProject(id);
    }
  };

  const handleDownload = (project: any) => {
    if (project.processedVideo?.url) {
      const link = document.createElement('a');
      link.href = project.processedVideo.url;
      link.download = `${project.name}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShare = async (project: any) => {
    if (navigator.share && project.processedVideo?.url) {
      try {
        await navigator.share({
          title: project.name,
          text: t('videos.shareText'),
          url: project.processedVideo.url,
        });
      } catch (err) {
        console.log('Erro ao compartilhar:', err);
      }
    } else {
      if (project.processedVideo?.url) {
        navigator.clipboard.writeText(project.processedVideo.url);
        alert(t('videos.linkCopied'));
      }
    }
  };

  // Estatísticas
  const totalVideos = completedVideos.length;
  const totalSize = completedVideos.reduce((acc, p) => acc + p.originalVideo.size, 0);
  const totalDuration = completedVideos.reduce((acc, p) => acc + (p.originalVideo.duration || 0), 0);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
        <Navbar />

        <div className="pt-24 pb-20 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header com gradiente moderno */}
            <div className="mb-8 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 blur-3xl -z-10" />
              <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-2">
                {t('videos.title')} 🎬
              </h1>
              <p className="text-gray-400 text-lg">
                {t('videos.subtitle')}
              </p>
            </div>

            {/* Stats Cards com glassmorphism */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="group relative bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent backdrop-blur-xl border border-purple-500/20 rounded-3xl p-6 hover:border-purple-500/40 transition-all duration-500 hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-purple-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg shadow-purple-500/50">
                      <Video className="w-6 h-6 text-white" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="text-4xl font-bold text-white mb-1">{totalVideos}</div>
                  <div className="text-sm text-gray-400">{t('videos.stats.ready')}</div>
                </div>
              </div>

              <div className="group relative bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent backdrop-blur-xl border border-blue-500/20 rounded-3xl p-6 hover:border-blue-500/40 transition-all duration-500 hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-blue-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg shadow-blue-500/50">
                      <FileVideo className="w-6 h-6 text-white" />
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="text-4xl font-bold text-white mb-1">{formatFileSize(totalSize)}</div>
                  <div className="text-sm text-gray-400">{t('videos.stats.storage')}</div>
                </div>
              </div>

              <div className="group relative bg-gradient-to-br from-pink-500/10 via-pink-500/5 to-transparent backdrop-blur-xl border border-pink-500/20 rounded-3xl p-6 hover:border-pink-500/40 transition-all duration-500 hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-600/0 to-pink-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-3 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl shadow-lg shadow-pink-500/50">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <Calendar className="w-5 h-5 text-pink-400" />
                  </div>
                  <div className="text-4xl font-bold text-white mb-1">
                    {Math.floor(totalDuration / 60)}min
                  </div>
                  <div className="text-sm text-gray-400">{t('videos.stats.duration')}</div>
                </div>
              </div>
            </div>

            {/* Filters and Search com design moderno */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                  <input
                    type="text"
                    placeholder={t('videos.search')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white focus:outline-none focus:border-purple-500/50 transition-all cursor-pointer hover:bg-white/10"
                >
                  <option value="recent">{t('videos.sort.recent')}</option>
                  <option value="oldest">{t('videos.sort.oldest')}</option>
                  <option value="name">{t('videos.sort.name')}</option>
                </select>

                {/* View Mode */}
                <div className="flex items-center gap-2 p-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-xl transition-all duration-300 ${
                      viewMode === 'grid'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Grid3x3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-xl transition-all duration-300 ${
                      viewMode === 'list'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Videos Grid/List */}
            {sortedVideos.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-6 border border-purple-500/20">
                  <Video className="w-12 h-12 text-purple-400" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">
                  {searchTerm ? t('videos.noResults') : t('videos.noVideos')}
                </h3>
                <p className="text-gray-400 mb-8 text-lg">
                  {searchTerm
                    ? t('videos.adjustSearch')
                    : t('videos.noVideosDesc')}
                </p>
                {!searchTerm && (
                  <Link
                    href="/upload"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white rounded-2xl font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
                  >
                    <Sparkles className="w-5 h-5" />
                    {t('videos.createFirst')}
                  </Link>
                )}
              </div>
            ) : viewMode === 'grid' ? (
              // Grid View com cards modernos
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedVideos.map((project) => (
                  <div
                    key={project.id}
                    className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-purple-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-blue-600/20 flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                      <Video className="w-16 h-16 text-white/30 relative z-10" />
                      
                      {/* Status badge */}
                      <div className="absolute top-3 right-3 z-20">
                        <div className="flex items-center gap-1 px-3 py-1.5 bg-green-500/20 backdrop-blur-xl border border-green-500/30 rounded-full text-green-400 text-xs font-medium shadow-lg">
                          <CheckCircle2 className="w-3 h-3" />
                          {t('videos.ready')}
                        </div>
                      </div>

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 z-10">
                        <Link
                          href="/result"
                          onClick={() => {
                            useStore.setState({ 
                              projects: useStore.getState().projects.map(p => 
                                p.id === project.id ? { ...p, isCurrent: true } : { ...p, isCurrent: false }
                              )
                            });
                          }}
                          className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-2xl transition-all duration-300 hover:scale-110"
                        >
                          <Eye className="w-5 h-5 text-white" />
                        </Link>
                        <button
                          onClick={() => handleShare(project)}
                          className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-2xl transition-all duration-300 hover:scale-110"
                        >
                          <Share2 className="w-5 h-5 text-white" />
                        </button>
                        <button
                          onClick={() => handleDownload(project)}
                          className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-2xl transition-all duration-300 hover:scale-110"
                        >
                          <Download className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-white mb-3 truncate">
                        {project.name}
                      </h3>
                      
                      <div className="space-y-2 text-sm text-gray-400 mb-4">
                        <div className="flex items-center justify-between">
                          <span>{t('videos.resolution')}</span>
                          <span className="text-white font-medium">
                            {project.settings.resolution.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>{t('videos.aspectRatio')}</span>
                          <span className="text-white font-medium">
                            {project.settings.aspectRatio}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>{t('videos.size')}</span>
                          <span className="text-white font-medium">
                            {formatFileSize(project.originalVideo.size)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>{t('videos.created')}</span>
                          <span className="text-white font-medium">
                            {new Date(project.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Link
                          href="/result"
                          onClick={() => {
                            useStore.setState({ 
                              projects: useStore.getState().projects.map(p => 
                                p.id === project.id ? { ...p, isCurrent: true } : { ...p, isCurrent: false }
                              )
                            });
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
                        >
                          <Play className="w-4 h-4" />
                          {t('videos.view')}
                        </Link>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all duration-300 hover:scale-105"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // List View moderno
              <div className="space-y-4">
                {sortedVideos.map((project) => (
                  <div
                    key={project.id}
                    className="group bg-gradient-to-r from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-purple-500/50 transition-all duration-500 hover:shadow-xl hover:shadow-purple-500/10"
                  >
                    <div className="flex items-center gap-6">
                      {/* Thumbnail */}
                      <div className="w-32 h-20 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-blue-600/20 rounded-2xl flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                        <Video className="w-8 h-8 text-white/30 relative z-10" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-white mb-1 truncate">
                          {project.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>{project.settings.resolution.toUpperCase()}</span>
                          <span>•</span>
                          <span>{project.settings.aspectRatio}</span>
                          <span>•</span>
                          <span>{formatFileSize(project.originalVideo.size)}</span>
                          <span>•</span>
                          <span>{new Date(project.createdAt).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Link
                          href="/result"
                          onClick={() => {
                            useStore.setState({ 
                              projects: useStore.getState().projects.map(p => 
                                p.id === project.id ? { ...p, isCurrent: true } : { ...p, isCurrent: false }
                              )
                            });
                          }}
                          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
                        >
                          <Play className="w-4 h-4" />
                          {t('videos.view')}
                        </Link>
                        <button
                          onClick={() => handleShare(project)}
                          className="p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white rounded-xl transition-all duration-300 hover:scale-110"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownload(project)}
                          className="p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white rounded-xl transition-all duration-300 hover:scale-110"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all duration-300 hover:scale-110"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
