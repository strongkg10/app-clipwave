// ClipWave - Types

export type PlanType = 'free' | 'pro' | 'creator';

export interface Plan {
  id: PlanType;
  name: string;
  price: number;
  currency: string;
  features: string[];
  limitations?: string[];
  highlighted?: boolean;
}

export interface VideoFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  createdAt: Date;
}

export interface ProcessingStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
}

export interface VideoProject {
  id: string;
  name: string;
  originalVideo: VideoFile;
  processedVideo?: VideoFile;
  steps: ProcessingStep[];
  settings: VideoSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface VideoSettings {
  resolution: '720p' | '1080p' | '4k';
  aspectRatio: '9:16' | '16:9' | '1:1';
  autoSubtitles: boolean;
  autoHighlights: boolean;
  autoBroll: boolean;
  dubbing?: {
    enabled: boolean;
    language: 'pt' | 'en' | 'es';
  };
  voiceCloning?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  plan: PlanType;
  minutesUsed: number;
  minutesLimit: number;
  username?: string;
  bio?: string;
  avatar?: string;
}
