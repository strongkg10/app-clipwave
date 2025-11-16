'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/custom/navbar';
import { Download, Share2, Edit3, Sparkles, Play, AlertCircle, RefreshCw, Zap, CheckCircle2, Video as VideoIcon } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useLocale } from '@/lib/locale-context';

export default function ResultPage() {
  const router = useRouter();
  const { t } = useLocale();
  const { currentProject, currentVideoUrl, currentVideoFile, setCurrentVideoUrl } = useStore();
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = React.useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = React.useState(false);
  const [retryCount, setRetryCount] = React.useState(0);
  const [effectiveVideoUrl, setEffectiveVideoUrl] = React.useState<string>('');

  React.useEffect(() => {
    console.log('🎬 Result page mounted');
    console.log('📁 Current project:', currentProject?.id);
    console.log('🎥 Current video URL:', currentVideoUrl);
    console.log('📹 Current video file:', currentVideoFile?.name);

    if (!currentProject) {
      console.error('❌ No project found, redirecting to upload');
      router.push('/upload');
      return;
    }

    // Tentar obter URL do vídeo de várias fontes
    let videoUrl = currentVideoUrl;

    // Se não tem URL mas tem arquivo, criar URL
    if (!videoUrl && currentVideoFile) {
      console.log('🔄 Creating blob URL from file...');
      try {
        videoUrl = URL.createObjectURL(currentVideoFile);
        setCurrentVideoUrl(videoUrl);
        console.log('✅ Blob URL created:', videoUrl);
      } catch (error) {
        console.error('❌ Error creating blob URL:', error);
      }
    }

    // Verificar se o projeto tem vídeo processado
    if (!videoUrl && currentProject.processedVideo?.url) {
      console.log('🔄 Using processed video URL from project');
      videoUrl = currentProject.processedVideo.url;
      setCurrentVideoUrl(videoUrl);
    }

    // Verificar se o projeto tem vídeo original
    if (!videoUrl && currentProject.originalVideo?.url) {
      console.log('🔄 Using original video URL from project');
      videoUrl = currentProject.originalVideo.url;
      setCurrentVideoUrl(videoUrl);
    }

    if (videoUrl) {
      console.log('✅ Video URL set:', videoUrl);
      setEffectiveVideoUrl(videoUrl);
      setVideoError(false);
    } else {
      console.error('❌ No video URL available');
      setVideoError(true);
    }

    // Cleanup
    return () => {
      // Não revogar URL aqui pois ainda está sendo usado
    };
  }, [currentProject, currentVideoUrl, currentVideoFile, router, setCurrentVideoUrl]);

  if (!currentProject) {
    return null;
  }

  const handleVideoLoad = () => {
    console.log('✅ Video loaded successfully');
    setIsVideoLoaded(true);
    setVideoError(false);
    setRetryCount(0);
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('❌ Video error:', e);
    console.error('❌ Video URL that failed:', effectiveVideoUrl);
    setVideoError(true);
    setIsVideoLoaded(false);
  };

  const handleDownload = () => {
    if (!effectiveVideoUrl || videoError) {
      alert(t('result.downloadError'));
      return;
    }
    
    try {
      console.log('💾 Downloading video:', effectiveVideoUrl);
      const link = document.createElement('a');
      link.href = effectiveVideoUrl;
      link.download = `${currentProject.name}-processed.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log('✅ Download initiated');
    } catch (error) {
      console.error('❌ Download error:', error);
      alert(t('result.downloadError'));
    }
  };

  const handleShare = async () => {
    if (!effectiveVideoUrl || videoError) {
      alert(t('result.shareError'));
      return;
    }

    try {
      if (navigator.share) {
        await navigator.share({
          title: currentProject.name,
          text: t('result.shareText'),
          url: effectiveVideoUrl
        });
      } else {
        await navigator.clipboard.writeText(effectiveVideoUrl);
        alert(t('result.linkCopied'));
      }
    } catch (error) {
      console.error('❌ Share error:', error);
      alert(t('result.shareError'));
    }
  };

  const handleRetry = () => {
    console.log('🔄 Retrying video load...');
    setVideoError(false);
    setRetryCount(prev => prev + 1);
    
    if (currentVideoFile && retryCount < 3) {
      console.log('🔄 Creating new blob URL...');
      try {
        const newUrl = URL.createObjectURL(currentVideoFile);
        setCurrentVideoUrl(newUrl);
        setEffectiveVideoUrl(newUrl);
        console.log('✅ New URL created:', newUrl);
        
        if (videoRef.current) {
          videoRef.current.load();
        }
      } catch (error) {
        console.error('❌ Error creating new URL:', error);
      }
    } else if (videoRef.current) {
      videoRef.current.load();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      <Navbar />

      <div className="pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header com animação moderna */}
          <div className="text-center mb-12 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 via-emerald-600/20 to-teal-600/20 blur-3xl -z-10" />
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-500/30 rounded-full text-green-400 text-sm font-medium mb-6 shadow-lg shadow-green-500/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
              {t('result.completed')}
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-4">
              {t('result.title')}
            </h1>
            <p className="text-gray-400 text-lg">
              {t('result.subtitle')}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Video Preview com design moderno */}
            <div className="space-y-6">
              <div className="relative aspect-[9/16] bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                {videoError ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center backdrop-blur-xl">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-500/20 to-pink-500/20 backdrop-blur-xl rounded-full flex items-center justify-center mb-6 border border-red-500/30">
                      <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {t('result.videoError')}
                    </h3>
                    <p className="text-gray-400 mb-8">
                      {retryCount >= 3 
                        ? t('result.maxRetries')
                        : t('result.tryAgain')}
                    </p>
                    <div className="flex gap-3">
                      {retryCount < 3 && (
                        <button
                          onClick={handleRetry}
                          className="px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white rounded-2xl font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 flex items-center gap-2 hover:scale-105"
                        >
                          <RefreshCw className="w-5 h-5" />
                          {t('result.retry')}
                        </button>
                      )}
                      <button
                        onClick={() => router.push('/upload')}
                        className="px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/10 text-white rounded-2xl font-semibold hover:bg-white/10 transition-all duration-300 hover:scale-105"
                      >
                        {t('result.newVideo')}
                      </button>
                    </div>
                    {retryCount >= 3 && (
                      <p className="text-xs text-gray-500 mt-6">
                        {t('result.retryCount', { count: retryCount })}
                      </p>
                    )}
                  </div>
                ) : (
                  <>
                    {!isVideoLoaded && effectiveVideoUrl && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-xl z-10">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                          <p className="text-gray-400 font-medium">{t('result.loading')}</p>
                        </div>
                      </div>
                    )}
                    {effectiveVideoUrl ? (
                      <video
                        ref={videoRef}
                        src={effectiveVideoUrl}
                        controls
                        className="w-full h-full object-contain"
                        playsInline
                        preload="metadata"
                        onLoadedData={handleVideoLoad}
                        onError={handleVideoError}
                        onCanPlay={handleVideoLoad}
                      >
                        {t('result.browserNotSupported')}
                      </video>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <AlertCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                          <p className="text-gray-400">Carregando vídeo...</p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Action Buttons modernos */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleDownload}
                  disabled={videoError || !effectiveVideoUrl}
                  className={`group flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                    videoError || !effectiveVideoUrl
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                      : 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105'
                  }`}
                >
                  <Download className="w-5 h-5 group-hover:animate-bounce" />
                  {t('result.download')}
                </button>
                <button 
                  onClick={handleShare}
                  disabled={videoError || !effectiveVideoUrl}
                  className={`group flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                    videoError || !effectiveVideoUrl
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                      : 'bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10 hover:scale-105'
                  }`}
                >
                  <Share2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  {t('result.share')}
                </button>
              </div>
            </div>

            {/* Project Info com glassmorphism */}
            <div className="space-y-6">
              {/* Video Details */}
              <div className="p-6 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl hover:border-purple-500/30 transition-all duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg shadow-purple-500/50">
                    <VideoIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    {t('result.details')}
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                    <span className="text-gray-400">{t('result.name')}</span>
                    <span className="text-white font-semibold">{currentProject.name}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                    <span className="text-gray-400">{t('result.resolution')}</span>
                    <span className="text-white font-semibold">
                      {currentProject.settings.resolution.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                    <span className="text-gray-400">{t('result.aspectRatio')}</span>
                    <span className="text-white font-semibold">
                      {currentProject.settings.aspectRatio}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                    <span className="text-gray-400">{t('result.subtitles')}</span>
                    <span className={`font-semibold ${currentProject.settings.autoSubtitles ? 'text-green-400' : 'text-gray-400'}`}>
                      {currentProject.settings.autoSubtitles ? t('result.enabled') : t('result.disabled')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                    <span className="text-gray-400">{t('result.highlights')}</span>
                    <span className={`font-semibold ${currentProject.settings.autoHighlights ? 'text-green-400' : 'text-gray-400'}`}>
                      {currentProject.settings.autoHighlights ? t('result.enabled') : t('result.disabled')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                    <span className="text-gray-400">{t('result.status')}</span>
                    <span className={`font-semibold flex items-center gap-2 ${videoError ? 'text-red-500' : isVideoLoaded ? 'text-green-500' : 'text-yellow-500'}`}>
                      {videoError ? (
                        <><AlertCircle className="w-4 h-4" /> {t('result.error')}</>
                      ) : isVideoLoaded ? (
                        <><CheckCircle2 className="w-4 h-4" /> {t('result.ready')}</>
                      ) : (
                        <><RefreshCw className="w-4 h-4 animate-spin" /> {t('result.loading')}</>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Processing Steps */}
              <div className="p-6 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl hover:border-green-500/30 transition-all duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-lg shadow-green-500/50">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    {t('result.stepsCompleted')}
                  </h3>
                </div>
                <div className="space-y-3">
                  {currentProject.steps.map((step, index) => (
                    <div
                      key={step.id}
                      className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-2xl hover:border-green-500/40 transition-all duration-300"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-xl flex items-center justify-center flex-shrink-0 border border-green-500/30">
                        <Sparkles className="w-5 h-5 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-semibold">{step.name}</div>
                        <div className="text-sm text-gray-400">{step.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Steps */}
              <div className="p-6 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 backdrop-blur-xl border border-purple-500/30 rounded-3xl hover:border-purple-500/50 transition-all duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg shadow-purple-500/50">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    {t('result.nextSteps')}
                  </h3>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={() => router.push('/editor')}
                    className="w-full flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 rounded-2xl transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:scale-110 transition-transform">
                      <Edit3 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-white font-semibold text-lg">{t('result.editVideo')}</div>
                      <div className="text-sm text-gray-400">
                        {t('result.editDesc')}
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => router.push('/upload')}
                    className="w-full flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/50 rounded-2xl transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50 group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-white font-semibold text-lg">{t('result.processAnother')}</div>
                      <div className="text-sm text-gray-400">
                        {t('result.processDesc')}
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
