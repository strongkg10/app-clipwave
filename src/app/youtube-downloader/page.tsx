'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/custom/navbar';
import { Download, Youtube, Loader2, CheckCircle, AlertCircle, Video, Music, ExternalLink, Copy } from 'lucide-react';

type Quality = 'highest' | '1080p' | '720p' | '480p' | '360p';
type Format = 'mp4' | 'mp3';

interface VideoInfo {
  title: string;
  author: string;
  thumbnail: string;
  videoId: string;
}

export default function YouTubeDownloaderPage() {
  const [url, setUrl] = useState('');
  const [quality, setQuality] = useState<Quality>('highest');
  const [format, setFormat] = useState<Format>('mp4');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [copied, setCopied] = useState(false);

  const validateYouTubeUrl = (url: string) => {
    const patterns = [
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
      /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[\w-]+/,
      /^(https?:\/\/)?(www\.)?youtu\.be\/[\w-]+/,
    ];
    return patterns.some(pattern => pattern.test(url));
  };

  const handleGetInfo = async () => {
    setError('');
    setSuccess(false);
    setVideoInfo(null);

    if (!url.trim()) {
      setError('Por favor, insira uma URL do YouTube');
      return;
    }

    if (!validateYouTubeUrl(url)) {
      setError('URL inválida. Por favor, insira uma URL válida do YouTube');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/youtube-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, quality, format }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao obter informações do vídeo');
      }

      setVideoInfo(data.videoInfo);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar o vídeo. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadServices = [
    {
      name: 'Y2Mate',
      url: `https://www.y2mate.com/youtube/${videoInfo?.videoId || ''}`,
      description: 'Suporta MP4 e MP3, várias qualidades',
    },
    {
      name: 'SaveFrom.net',
      url: `https://savefrom.net/#url=${encodeURIComponent(url)}`,
      description: 'Download rápido e fácil',
    },
    {
      name: 'YTmp3',
      url: `https://ytmp3.nu/youtube-to-mp3/${videoInfo?.videoId || ''}`,
      description: 'Especializado em conversão para MP3',
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full text-red-400 text-sm font-medium mb-6">
              <Youtube className="w-4 h-4" />
              Download de Vídeos do YouTube
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Baixe Vídeos do YouTube
            </h1>
            <p className="text-gray-400 text-lg">
              Cole a URL do vídeo e escolha um serviço de download confiável
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            {/* URL Input */}
            <div className="mb-6">
              <label className="block text-white font-medium mb-3">
                URL do Vídeo
              </label>
              <div className="relative">
                <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full pl-12 pr-4 py-4 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-colors"
                  onKeyDown={(e) => e.key === 'Enter' && handleGetInfo()}
                />
              </div>
            </div>

            {/* Format Selection */}
            <div className="mb-6">
              <label className="block text-white font-medium mb-3">
                Formato Desejado
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setFormat('mp4')}
                  className={`flex items-center justify-center gap-2 p-4 rounded-xl border transition-all ${
                    format === 'mp4'
                      ? 'bg-red-500/20 border-red-500/50 text-white'
                      : 'bg-black/30 border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <Video className="w-5 h-5" />
                  <span className="font-medium">Vídeo (MP4)</span>
                </button>
                <button
                  onClick={() => setFormat('mp3')}
                  className={`flex items-center justify-center gap-2 p-4 rounded-xl border transition-all ${
                    format === 'mp3'
                      ? 'bg-red-500/20 border-red-500/50 text-white'
                      : 'bg-black/30 border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <Music className="w-5 h-5" />
                  <span className="font-medium">Áudio (MP3)</span>
                </button>
              </div>
            </div>

            {/* Quality Selection (only for video) */}
            {format === 'mp4' && (
              <div className="mb-6">
                <label className="block text-white font-medium mb-3">
                  Qualidade Preferida
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {(['highest', '1080p', '720p', '480p', '360p'] as Quality[]).map((q) => (
                    <button
                      key={q}
                      onClick={() => setQuality(q)}
                      className={`p-3 rounded-lg border transition-all text-sm font-medium ${
                        quality === q
                          ? 'bg-red-500/20 border-red-500/50 text-white'
                          : 'bg-black/30 border-white/10 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      {q === 'highest' ? 'Máxima' : q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Success Message with Video Info */}
            {success && videoInfo && (
              <div className="mb-6">
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl mb-4">
                  <div className="flex items-start gap-3 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-green-400 font-medium mb-1">Vídeo encontrado!</p>
                      <p className="text-gray-400 text-sm">Escolha um serviço abaixo para fazer o download</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-black/30 rounded-lg">
                    <img
                      src={videoInfo.thumbnail}
                      alt={videoInfo.title}
                      className="w-24 h-14 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{videoInfo.title}</p>
                      <p className="text-gray-400 text-sm">{videoInfo.author}</p>
                    </div>
                    <button
                      onClick={copyToClipboard}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      title="Copiar URL"
                    >
                      {copied ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <Copy className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Download Services */}
                <div className="space-y-3">
                  <p className="text-white font-medium text-sm">Serviços de Download Recomendados:</p>
                  {downloadServices.map((service) => (
                    <a
                      key={service.name}
                      href={service.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-black/30 border border-white/10 rounded-xl hover:border-red-500/50 hover:bg-red-500/5 transition-all group"
                    >
                      <div className="flex-1">
                        <p className="text-white font-medium mb-1 group-hover:text-red-400 transition-colors">
                          {service.name}
                        </p>
                        <p className="text-gray-400 text-sm">{service.description}</p>
                      </div>
                      <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Get Info Button */}
            <button
              onClick={handleGetInfo}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Obter Informações do Vídeo
                </>
              )}
            </button>
          </div>

          {/* Info Cards */}
          <div className="grid sm:grid-cols-3 gap-4 mt-8">
            <div className="p-6 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl text-center">
              <Video className="w-8 h-8 text-red-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-1">Alta Qualidade</h3>
              <p className="text-gray-400 text-sm">Até 1080p disponível</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl text-center">
              <Download className="w-8 h-8 text-red-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-1">Serviços Confiáveis</h3>
              <p className="text-gray-400 text-sm">Parceiros verificados</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl text-center">
              <Music className="w-8 h-8 text-red-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-1">MP3 e MP4</h3>
              <p className="text-gray-400 text-sm">Vídeo ou apenas áudio</p>
            </div>
          </div>

          {/* How it Works */}
          <div className="mt-8 p-6 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-red-400" />
              Como Funciona
            </h3>
            <ol className="space-y-3 text-gray-400 text-sm">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <span>Cole a URL do vídeo do YouTube no campo acima</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <span>Escolha o formato desejado (MP4 para vídeo ou MP3 para áudio)</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <span>Clique em "Obter Informações do Vídeo" para verificar o conteúdo</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                <span>Selecione um dos serviços recomendados para fazer o download</span>
              </li>
            </ol>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <p className="text-yellow-400 text-sm text-center">
              ⚠️ Respeite os direitos autorais. Baixe apenas conteúdo que você tem permissão para usar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
