import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useUserStore } from './userStore';

const USERS = [
  {
    id: '1',
    username: 'OrlovDV',
    password: '12qwaszx',
    displayName: 'Орлов Д.В.',
  },
  {
    id: '2',
    username: 'admin',
    password: 'admin',
    displayName: 'Администратор',
  }
];

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  userId: string | null;
  username: string | null;
  displayName: string | null;
  rememberMe: boolean;
  
  login: (username: string, password: string, rememberMe: boolean) => void;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isLoading: false,
      error: null,
      userId: null,
      username: null,
      displayName: null,
      rememberMe: false,
      
      login: (username, password, rememberMe) => {
        set({ isLoading: true, error: null });

        setTimeout(() => {
          const user = USERS.find(
            u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
          );
          
          if (user) {
            set({
              isAuthenticated: true,
              isLoading: false,
              userId: user.id,
              username: user.username,
              displayName: user.displayName,
              rememberMe
            });
            
            useUserStore.getState().initUserData(user.id, user.displayName);
          } else {
            set({
              isAuthenticated: false,
              isLoading: false,
              error: 'Неверное имя пользователя или пароль',
              userId: null,
              username: null,
              displayName: null
            });
          }
        }, 1000);
      },
      
      logout: () => {
        set({
          isAuthenticated: false,
          userId: null,
          username: null,
          displayName: null,
          rememberMe: false
        });
      },
      
      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => 
        state.rememberMe 
          ? { 
              isAuthenticated: state.isAuthenticated,
              userId: state.userId,
              username: state.username,
              displayName: state.displayName,
              rememberMe: state.rememberMe
            } 
          : {}
    }
  )
);