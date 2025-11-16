'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/custom/navbar';
import { Upload, FileVideo, CheckCircle2, AlertCircle, Settings2, Sparkles, Loader2, Play } from 'lucide-react';
import { useStore } from '@/lib/store';
import { createVideoProject, validateVideoFile, formatFileSize } from '@/lib/video-utils';

export default function UploadPage() {
  const router = useRouter();
  const [isDragging, setIsDragging] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [error, setError] = React.useState<string>('');
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [videoPreview, setVideoPreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { videoSettings, updateVideoSettings, addProject, setCurrentVideoFile } = useStore();

  const handleFileValidation = (selectedFile: File): boolean => {
    setError('');
    const validation = validateVideoFile(selectedFile);
    
    if (!validation.valid) {
      setError(validation.error || 'Erro ao validar arquivo');
      return false;
    }

    return true;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && handleFileValidation(droppedFile)) {
      processFile(droppedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && handleFileValidation(selectedFile)) {
      processFile(selectedFile);
    }
  };

  const processFile = (selectedFile: File) => {
    setFile(selectedFile);
    
    // Create video preview
    const previewUrl = URL.createObjectURL(selectedFile);
    setVideoPreview(previewUrl);
    
    // Simulate upload progress
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const handleUpload = async () => {
    if (!file || isUploading) return;

    try {
      console.log('🚀 Iniciando processamento do vídeo:', file.name);

      // Create project with video settings
      const project = createVideoProject(file, videoSettings);
      console.log('✅ Projeto criado:', project.id);
      
      // Set the video file in store (this will create the blob URL)
      setCurrentVideoFile(file);
      console.log('✅ Arquivo de vídeo definido no store');

      // Save project to store
      addProject(project);
      console.log('✅ Projeto adicionado ao store');

      // Small delay to ensure state is updated
      await new Promise(resolve => setTimeout(resolve, 100));

      // Navigate to processing
      console.log('✅ Navegando para página de processamento');
      router.push('/processing');
    } catch (err) {
      console.error('❌ Erro ao processar upload:', err);
      setError('Erro ao processar o vídeo. Tente novamente.');
    }
  };

  const removeFile = () => {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    setFile(null);
    setVideoPreview(null);
    setError('');
    setUploadProgress(0);
    setIsUploading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      <Navbar />

      <div className="pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header com gradiente moderno */}
          <div className="text-center mb-12 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 blur-3xl -z-10 animate-pulse" />
            <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
              Envie seu vídeo ✨
            </h1>
            <p className="text-gray-400 text-lg">
              Arraste e solte ou clique para selecionar
            </p>
          </div>

          {/* Upload Area moderna */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !file && fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-3xl p-12 transition-all duration-500 cursor-pointer backdrop-blur-xl ${
              isDragging
                ? 'border-purple-500 bg-purple-500/10 scale-[1.02] shadow-2xl shadow-purple-500/20'
                : file
                ? 'border-green-500/50 bg-green-500/5 shadow-xl shadow-green-500/10'
                : 'border-white/20 bg-white/5 hover:border-purple-500/50 hover:bg-purple-500/5 hover:scale-[1.01]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/quicktime,video/webm"
              onChange={handleFileSelect}
              className="hidden"
            />

            {!file ? (
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-purple-500/50 animate-pulse">
                  <Upload className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-3">
                  Arraste seu vídeo aqui
                </h3>
                <p className="text-gray-400 text-lg mb-8">
                  ou clique para selecionar do seu computador
                </p>
                <div className="flex items-center justify-center gap-6 text-sm">
                  <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-gray-300">MP4, MOV, WebM</span>
                  </div>
                  <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-gray-300">Máx. 2GB</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                {isUploading ? (
                  <div className="space-y-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-purple-500/50">
                      <Loader2 className="w-12 h-12 text-white animate-spin" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        Carregando vídeo...
                      </h3>
                      <p className="text-gray-400 mb-4">{file.name}</p>
                      <div className="max-w-md mx-auto">
                        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 transition-all duration-300 rounded-full"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <p className="text-sm text-gray-400 mt-2">{uploadProgress}%</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-green-500/50">
                      <CheckCircle2 className="w-12 h-12 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-3 mb-3">
                        <FileVideo className="w-6 h-6 text-white" />
                        <h3 className="text-2xl font-bold text-white">
                          {file.name}
                        </h3>
                      </div>
                      <p className="text-gray-400 text-lg mb-4">
                        {formatFileSize(file.size)}
                      </p>
                      
                      {/* Video Preview */}
                      {videoPreview && (
                        <div className="max-w-md mx-auto mb-6 rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl">
                          <video 
                            src={videoPreview} 
                            controls 
                            className="w-full"
                            preload="metadata"
                          />
                        </div>
                      )}
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile();
                        }}
                        className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2 bg-white/5 rounded-xl hover:bg-white/10"
                      >
                        Remover arquivo
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-2xl flex items-start gap-3 animate-pulse">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Settings modernos */}
          {file && !error && !isUploading && (
            <div className="mt-8 p-8 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl hover:border-purple-500/30 transition-all duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg shadow-purple-500/50">
                  <Settings2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Configurações de processamento
                </h3>
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
                  <div>
                    <div className="text-white font-semibold text-lg">Legendas automáticas</div>
                    <div className="text-sm text-gray-400">Gerar legendas com IA</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={videoSettings.autoSubtitles}
                    onChange={(e) => updateVideoSettings({ autoSubtitles: e.target.checked })}
                    className="w-6 h-6 rounded accent-purple-500 cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
                  <div>
                    <div className="text-white font-semibold text-lg">Highlights automáticos</div>
                    <div className="text-sm text-gray-400">Extrair melhores momentos</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={videoSettings.autoHighlights}
                    onChange={(e) => updateVideoSettings({ autoHighlights: e.target.checked })}
                    className="w-6 h-6 rounded accent-purple-500 cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
                  <div>
                    <div className="text-white font-semibold text-lg">B-roll automático</div>
                    <div className="text-sm text-gray-400">Inserir imagens relevantes</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={videoSettings.autoBroll}
                    onChange={(e) => updateVideoSettings({ autoBroll: e.target.checked })}
                    className="w-6 h-6 rounded accent-purple-500 cursor-pointer"
                  />
                </div>
                
                {/* Resolution selector */}
                <div className="pt-6 border-t border-white/10">
                  <label className="text-white font-bold text-lg block mb-4">Resolução de saída</label>
                  <div className="grid grid-cols-3 gap-4">
                    {(['720p', '1080p', '4k'] as const).map((res) => (
                      <button
                        key={res}
                        onClick={() => updateVideoSettings({ resolution: res })}
                        className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                          videoSettings.resolution === res
                            ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white shadow-xl shadow-purple-500/50 scale-105'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:scale-105'
                        }`}
                      >
                        {res.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Aspect ratio selector */}
                <div className="pt-6 border-t border-white/10">
                  <label className="text-white font-bold text-lg block mb-4">Proporção</label>
                  <div className="grid grid-cols-3 gap-4">
                    {(['9:16', '16:9', '1:1'] as const).map((ratio) => (
                      <button
                        key={ratio}
                        onClick={() => updateVideoSettings({ aspectRatio: ratio })}
                        className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                          videoSettings.aspectRatio === ratio
                            ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white shadow-xl shadow-purple-500/50 scale-105'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:scale-105'
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Upload Button moderno */}
          {file && !error && !isUploading && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleUpload}
                className="group relative px-12 py-5 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white rounded-2xl font-bold text-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex items-center gap-3">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                  Processar Vídeo
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
