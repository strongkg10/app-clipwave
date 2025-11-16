// ClipWave - Global State Management
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { VideoProject, VideoFile, ProcessingStep, VideoSettings } from './types';

interface StoreState {
  // Current project
  currentProject: VideoProject | null;
  setCurrentProject: (project: VideoProject | null) => void;
  
  // All projects
  projects: VideoProject[];
  addProject: (project: VideoProject) => void;
  updateProject: (id: string, updates: Partial<VideoProject>) => void;
  deleteProject: (id: string) => void;
  
  // Video file and URL
  currentVideoFile: File | null;
  currentVideoUrl: string | null;
  setCurrentVideoFile: (file: File | null) => void;
  setCurrentVideoUrl: (url: string | null) => void;
  
  // Processing
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  
  // Settings
  videoSettings: VideoSettings;
  updateVideoSettings: (settings: Partial<VideoSettings>) => void;
}

export const useStore = create<StoreState>()((set, get) => ({
  // Current project
  currentProject: null,
  setCurrentProject: (project) => set({ currentProject: project }),
  
  // Projects
  projects: [],
  addProject: (project) => set((state) => ({ 
    projects: [...state.projects, project],
    currentProject: project 
  })),
  updateProject: (id, updates) => set((state) => ({
    projects: state.projects.map((p) => 
      p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
    ),
    currentProject: state.currentProject?.id === id 
      ? { ...state.currentProject, ...updates, updatedAt: new Date() }
      : state.currentProject
  })),
  deleteProject: (id) => set((state) => ({
    projects: state.projects.filter((p) => p.id !== id),
    currentProject: state.currentProject?.id === id ? null : state.currentProject
  })),
  
  // Video file and URL
  currentVideoFile: null,
  currentVideoUrl: null,
  setCurrentVideoFile: (file) => {
    if (!file) {
      // Clear video file and URL
      const currentUrl = get().currentVideoUrl;
      if (currentUrl && currentUrl.startsWith('blob:')) {
        URL.revokeObjectURL(currentUrl);
      }
      set({ 
        currentVideoFile: null,
        currentVideoUrl: null
      });
      return;
    }
    
    // Create new URL from file
    const newUrl = URL.createObjectURL(file);
    
    set({ 
      currentVideoFile: file,
      currentVideoUrl: newUrl
    });
  },
  setCurrentVideoUrl: (url) => {
    // Allow manual setting of video URL (for processed videos)
    set({ currentVideoUrl: url });
  },
  
  // Processing
  isProcessing: false,
  setIsProcessing: (processing) => set({ isProcessing: processing }),
  
  // Settings
  videoSettings: {
    resolution: '1080p',
    aspectRatio: '9:16',
    autoSubtitles: true,
    autoHighlights: true,
    autoBroll: false,
    dubbing: {
      enabled: false,
      language: 'pt'
    },
    voiceCloning: false
  },
  updateVideoSettings: (settings) => set((state) => ({
    videoSettings: { ...state.videoSettings, ...settings }
  }))
}));
