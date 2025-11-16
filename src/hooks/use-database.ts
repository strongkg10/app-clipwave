'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/auth-store';

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications_enabled: boolean;
  auto_save: boolean;
}

export function useUserPreferences() {
  const { user } = useAuthStore();
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'dark',
    language: 'en',
    notifications_enabled: true,
    auto_save: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadPreferences();
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  const loadPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setPreferences({
          theme: data.theme,
          language: data.language,
          notifications_enabled: data.notifications_enabled,
          auto_save: data.auto_save,
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    if (!user?.id) return;

    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);

    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          ...newPreferences,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  return { preferences, updatePreferences, loading };
}

// Analytics Hook
export function useAnalytics() {
  const { user } = useAuthStore();

  const trackEvent = async (eventType: string, eventData?: any) => {
    // Se não houver usuário, apenas loga no console (modo desenvolvimento)
    if (!user?.id) {
      console.log('Analytics Event:', eventType, eventData);
      return;
    }

    try {
      await supabase.from('user_analytics').insert({
        user_id: user.id,
        event_type: eventType,
        event_data: eventData || {},
        page: typeof window !== 'undefined' ? window.location.pathname : '/',
      });
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  };

  return { trackEvent };
}

// Video Projects Hook
export function useVideoProjects() {
  const { user } = useAuthStore();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadProjects();
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('video_projects')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData: any) => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase
        .from('video_projects')
        .insert({
          user_id: user.id,
          ...projectData,
        })
        .select()
        .single();

      if (error) throw error;
      setProjects([data, ...projects]);
      return data;
    } catch (error) {
      console.error('Error creating project:', error);
      return null;
    }
  };

  const updateProject = async (id: string, updates: any) => {
    try {
      const { error } = await supabase
        .from('video_projects')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      await loadProjects();
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('video_projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setProjects(projects.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  return { projects, loading, createProject, updateProject, deleteProject, refreshProjects: loadProjects };
}
