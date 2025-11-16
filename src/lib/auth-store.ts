// ClipWave - Authentication Store
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from './types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  registeredUsers: { email: string; password: string; user: User }[];
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      registeredUsers: [],
      
      login: async (email: string, password: string) => {
        // Simular delay de rede
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const { registeredUsers } = get();
        const userRecord = registeredUsers.find(
          u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        
        if (!userRecord) {
          return { 
            success: false, 
            error: 'E-mail ou senha incorretos' 
          };
        }
        
        set({ 
          user: userRecord.user, 
          isAuthenticated: true 
        });
        
        return { success: true };
      },
      
      signup: async (name: string, email: string, password: string) => {
        // Simular delay de rede
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const { registeredUsers } = get();
        
        // Verificar se email já existe
        const emailExists = registeredUsers.some(
          u => u.email.toLowerCase() === email.toLowerCase()
        );
        
        if (emailExists) {
          return { 
            success: false, 
            error: 'Este e-mail já está cadastrado' 
          };
        }
        
        // Criar novo usuário
        const newUser: User = {
          id: Date.now().toString(),
          name,
          email,
          plan: 'free',
          minutesUsed: 0,
          minutesLimit: 20
        };
        
        // Salvar usuário
        set((state) => ({
          registeredUsers: [
            ...state.registeredUsers,
            { email, password, user: newUser }
          ],
          user: newUser,
          isAuthenticated: true
        }));
        
        return { success: true };
      },
      
      loginWithGoogle: async () => {
        // Simular login com Google
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const googleUser: User = {
          id: 'google_' + Date.now(),
          name: 'Usuário Google',
          email: 'usuario@gmail.com',
          plan: 'free',
          minutesUsed: 0,
          minutesLimit: 20
        };
        
        set({ 
          user: googleUser, 
          isAuthenticated: true 
        });
        
        return { success: true };
      },
      
      logout: () => set({ 
        user: null, 
        isAuthenticated: false 
      }),
      
      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      }))
    }),
    {
      name: 'clipwave-auth',
    }
  )
);
