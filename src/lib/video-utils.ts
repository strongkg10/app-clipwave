// ClipWave - Video Processing Utilities
import { VideoProject, VideoFile, ProcessingStep, VideoSettings } from './types';
import { PROCESSING_STEPS } from './constants';

export function createVideoProject(
  file: File,
  settings: VideoSettings
): VideoProject {
  // Create blob URL for the video file
  const videoUrl = URL.createObjectURL(file);
  
  const videoFile: VideoFile = {
    id: generateId(),
    name: file.name,
    size: file.size,
    type: file.type,
    url: videoUrl, // Set the blob URL
    status: 'uploading',
    progress: 0,
    createdAt: new Date()
  };

  const steps: ProcessingStep[] = PROCESSING_STEPS.map((step) => ({
    id: step.id,
    name: step.name,
    description: step.description,
    status: 'pending',
    progress: 0
  }));

  return {
    id: generateId(),
    name: file.name.replace(/\.[^/.]+$/, ''),
    originalVideo: videoFile,
    steps,
    settings,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export async function simulateVideoProcessing(
  projectId: string,
  onProgress: (stepIndex: number, progress: number) => void,
  onComplete: () => void
): Promise<void> {
  const stepDuration = 3000; // 3 seconds per step
  const progressInterval = 50; // Update every 50ms
  const totalSteps = PROCESSING_STEPS.length;

  for (let stepIndex = 0; stepIndex < totalSteps; stepIndex++) {
    let progress = 0;
    
    while (progress < 100) {
      await new Promise(resolve => setTimeout(resolve, progressInterval));
      progress = Math.min(100, progress + (100 / (stepDuration / progressInterval)));
      onProgress(stepIndex, progress);
    }
  }

  onComplete();
}

export function validateVideoFile(file: File): { valid: boolean; error?: string } {
  const supportedFormats = ['video/mp4', 'video/quicktime', 'video/webm'];
  const maxSize = 2 * 1024 * 1024 * 1024; // 2GB

  if (!supportedFormats.includes(file.type)) {
    return {
      valid: false,
      error: 'Formato não suportado. Use MP4, MOV ou WebM.'
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Arquivo muito grande. Máximo 2GB.'
    };
  }

  return { valid: true };
}

// Simulate video thumbnail generation
export function generateVideoThumbnail(file: File): Promise<string> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    video.preload = 'metadata';
    video.src = URL.createObjectURL(file);
    
    video.onloadedmetadata = () => {
      video.currentTime = 1; // Capture at 1 second
    };

    video.onseeked = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
      URL.revokeObjectURL(video.src);
      resolve(thumbnail);
    };

    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      resolve(''); // Return empty string on error
    };
  });
}
