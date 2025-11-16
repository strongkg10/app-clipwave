'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/custom/navbar';
import { CheckCircle2, Loader2, Sparkles, Zap, Video, FileVideo, Clock } from 'lucide-react';
import { useStore } from '@/lib/store';
import { simulateVideoProcessing } from '@/lib/video-utils';
import { useLocale } from '@/lib/locale-context';

export default function ProcessingPage() {
  const router = useRouter();
  const { t } = useLocale();
  const { currentProject, currentVideoUrl, currentVideoFile, updateProject, setIsProcessing, setCurrentVideoUrl } = useStore();
  const [currentStep, setCurrentStep] = React.useState(0);
  const [progress, setProgress] = React.useState(0);
  const [isComplete, setIsComplete] = React.useState(false);
  const [hasStarted, setHasStarted] = React.useState(false);

  React.useEffect(() => {
    // Verificar se temos projeto e vídeo
    if (!currentProject) {
      console.error('❌ No current project found');
      router.push('/upload');
      return;
    }

    // Verificar se temos arquivo ou URL
    if (!currentVideoUrl && !currentVideoFile) {
      console.error('❌ No video file or URL found');
      router.push('/upload');
      return;
    }

    // Evitar múltiplas execuções
    if (hasStarted) return;
    setHasStarted(true);

    console.log('🎬 Iniciando processamento...');
    console.log('📁 Projeto:', currentProject.id);
    console.log('🎥 Video URL:', currentVideoUrl);
    console.log('📹 Video File:', currentVideoFile?.name);

    // Criar URL do vídeo se necessário
    let videoUrl = currentVideoUrl;
    if (!videoUrl && currentVideoFile) {
      try {
        videoUrl = URL.createObjectURL(currentVideoFile);
        setCurrentVideoUrl(videoUrl);
        console.log('✅ Created video URL:', videoUrl);
      } catch (error) {
        console.error('❌ Error creating video URL:', error);
        router.push('/upload');
        return;
      }
    }

    // Garantir que temos uma URL válida
    if (!videoUrl) {
      console.error('❌ No valid video URL available');
      router.push('/upload');
      return;
    }

    // Iniciar processamento
    setIsProcessing(true);
    console.log('🚀 Starting video processing for project:', currentProject.id);

    // Executar simulação de processamento
    simulateVideoProcessing(
      currentProject.id,
      (stepIndex, stepProgress) => {
        console.log(`📊 Step ${stepIndex + 1}/${currentProject.steps.length}: ${stepProgress}%`);
        setCurrentStep(stepIndex);
        setProgress(stepProgress);

        // Atualizar steps do projeto
        const updatedSteps = currentProject.steps.map((step, index) => {
          if (index < stepIndex) {
            return { ...step, status: 'completed' as const, progress: 100 };
          } else if (index === stepIndex) {
            return { ...step, status: 'processing' as const, progress: stepProgress };
          }
          return step;
        });

        updateProject(currentProject.id, { steps: updatedSteps });
      },
      () => {
        console.log('✅ Processing completed!');
        setIsComplete(true);
        setIsProcessing(false);

        // Marcar todos os steps como completos
        const completedSteps = currentProject.steps.map((step) => ({
          ...step,
          status: 'completed' as const,
          progress: 100
        }));

        // Criar vídeo processado com URL válida
        const processedVideo = {
          id: `processed-${currentProject.originalVideo.id}`,
          name: currentProject.originalVideo.name,
          size: currentProject.originalVideo.size,
          type: currentProject.originalVideo.type,
          url: videoUrl || '',
          status: 'completed' as const,
          progress: 100,
          createdAt: new Date()
        };

        console.log('✅ Processed video created:', processedVideo);
        console.log('🎥 Video URL para resultado:', videoUrl);

        // Atualizar projeto com vídeo processado
        updateProject(currentProject.id, {
          steps: completedSteps,
          processedVideo
        });

        // Garantir que a URL está no store antes de redirecionar
        if (videoUrl) {
          setCurrentVideoUrl(videoUrl);
        }

        console.log('🔄 Redirecionando para página de resultado em 2 segundos...');

        // Redirecionar para resultado após 2 segundos
        setTimeout(() => {
          console.log('➡️ Navegando para /result');
          router.push('/result');
        }, 2000);
      }
    );

    // Cleanup function
    return () => {
      setIsProcessing(false);
    };
  }, [currentProject, currentVideoUrl, currentVideoFile, hasStarted]);

  // Loading state
  if (!currentProject) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
      </div>
    );
  }

  const steps = currentProject.steps;
  const overallProgress = Math.round((currentStep / steps.length) * 100 + (progress / steps.length));

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      <Navbar />

      <div className="pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header com animação */}
          <div className="text-center mb-12 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 blur-3xl -z-10 animate-pulse" />
            <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
              {isComplete ? t('processing.completed') : t('processing.title')}
            </h1>
            <p className="text-gray-400 text-lg">
              {isComplete
                ? t('processing.completedDesc')
                : t('processing.subtitle')}
            </p>
          </div>

          {/* Processing Animation moderna */}
          <div className="mb-16 flex justify-center">
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute inset-0 w-48 h-48 rounded-full bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 blur-2xl animate-pulse" />
              
              {/* Base ring */}
              <div className="relative w-48 h-48 rounded-full border-4 border-white/5 backdrop-blur-xl" />
              
              {/* Progress ring */}
              <svg className="absolute inset-0 w-48 h-48 -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${overallProgress * 5.53} 553`}
                  className="transition-all duration-500"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#A855F7" />
                    <stop offset="50%" stopColor="#EC4899" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Animated ring */}
              {!isComplete && (
                <div
                  className="absolute inset-0 w-48 h-48 rounded-full border-4 border-transparent border-t-purple-500 border-r-pink-500 animate-spin"
                  style={{ animationDuration: '3s' }}
                />
              )}
              
              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  {isComplete ? (
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/50 animate-bounce">
                      <CheckCircle2 className="w-10 h-10 text-white" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50">
                      <Zap className="w-10 h-10 text-white animate-pulse" />
                    </div>
                  )}
                </div>
              </div>

              {/* Progress percentage */}
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  {overallProgress}%
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  {isComplete ? t('processing.done') : t('processing.inProgress')}
                </div>
              </div>
            </div>
          </div>

          {/* Progress Steps modernos */}
          <div className="space-y-4 mb-8 mt-20">
            {steps.map((step, index) => {
              const isActive = index === currentStep && !isComplete;
              const isDone = index < currentStep || isComplete;
              const stepProgress = isActive ? progress : isDone ? 100 : 0;

              return (
                <div
                  key={step.id}
                  className={`relative p-6 rounded-3xl border transition-all duration-500 ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 border-purple-500/50 scale-[1.02] shadow-xl shadow-purple-500/20'
                      : isDone
                      ? 'bg-gradient-to-r from-green-500/5 to-emerald-500/5 border-green-500/30'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  {/* Animated background */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10 rounded-3xl animate-pulse" />
                  )}

                  <div className="relative flex items-start gap-4">
                    {/* Step icon */}
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 shadow-lg ${
                        isDone
                          ? 'bg-gradient-to-br from-green-500 to-emerald-500 shadow-green-500/50'
                          : isActive
                          ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 shadow-purple-500/50 animate-pulse'
                          : 'bg-white/5 shadow-none'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-7 h-7 text-white" />
                      ) : isActive ? (
                        <Loader2 className="w-7 h-7 text-white animate-spin" />
                      ) : (
                        <span className="text-white font-bold text-lg">{index + 1}</span>
                      )}
                    </div>

                    {/* Step content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold text-white">
                          {step.name}
                        </h3>
                        {isActive && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                              {Math.round(stepProgress)}%
                            </span>
                            <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
                          </div>
                        )}
                      </div>
                      <p className="text-gray-400 mb-4">
                        {step.description}
                      </p>

                      {/* Progress bar */}
                      {(isActive || isDone) && (
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-xl">
                          <div
                            className={`h-full transition-all duration-500 ${
                              isDone
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                : 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500'
                            }`}
                            style={{ width: `${stepProgress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Completion message */}
          {isComplete && (
            <div className="text-center p-8 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 border border-green-500/30 rounded-3xl animate-pulse backdrop-blur-xl">
              <div className="flex items-center justify-center gap-3 mb-3">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
                <p className="text-2xl font-bold text-green-400">
                  {t('processing.redirecting')}
                </p>
              </div>
              <p className="text-gray-400">{t('processing.redirectingDesc')}</p>
            </div>
          )}

          {/* Video info card moderna */}
          <div className="mt-8 p-6 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl hover:border-purple-500/30 transition-all duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg shadow-purple-500/50">
                <Video className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">{t('processing.videoInfo')}</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-2xl">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <FileVideo className="w-4 h-4" />
                  <span className="text-sm">{t('processing.name')}</span>
                </div>
                <div className="text-white font-semibold">{currentProject.name}</div>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <Video className="w-4 h-4" />
                  <span className="text-sm">{t('processing.resolution')}</span>
                </div>
                <div className="text-white font-semibold">{currentProject.settings.resolution.toUpperCase()}</div>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm">{t('processing.aspectRatio')}</span>
                </div>
                <div className="text-white font-semibold">{currentProject.settings.aspectRatio}</div>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-sm">{t('processing.subtitles')}</span>
                </div>
                <div className={`font-semibold ${currentProject.settings.autoSubtitles ? 'text-green-400' : 'text-gray-400'}`}>
                  {currentProject.settings.autoSubtitles ? t('processing.enabled') : t('processing.disabled')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
