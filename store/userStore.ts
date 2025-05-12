import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { levels, achievements } from '@/constants/gameData';

interface UserState {
  userId: string | null;
  name: string;
  xp: number;
  level: number;
  levelTitle: string;
  completedGames: string[];
  earnedAchievements: string[];
  lastLoginDate: string | null;
  loginStreak: number;
  
  // Actions
  initUserData: (userId: string, name: string) => void;
  setName: (name: string) => void;
  addXP: (amount: number) => void;
  completeGame: (gameId: string) => void;
  earnAchievement: (achievementId: string) => void;
  checkLoginStreak: () => void;
  resetProgress: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      userId: null,
      name: '',
      xp: 0,
      level: 1,
      levelTitle: 'Новичок',
      completedGames: [],
      earnedAchievements: [],
      lastLoginDate: null,
      loginStreak: 0,
      
      initUserData: (userId, name) => {
        // Проверяем, есть ли уже данные для этого пользователя
        if (get().userId !== userId) {
          // Если это новый пользователь, инициализируем его данные
          set({
            userId,
            name,
            xp: 0,
            level: 1,
            levelTitle: 'Новичок',
            completedGames: [],
            earnedAchievements: [],
            lastLoginDate: null,
            loginStreak: 0
          });
        }
        
        // В любом случае проверяем серию входов
        get().checkLoginStreak();
      },
      
      setName: (name) => set({ name }),
      
      addXP: (amount) => {
        const currentXP = get().xp + amount;
        const newLevel = calculateLevel(currentXP);
        const levelInfo = levels.find(l => l.level === newLevel) || levels[0];
        
        set({ 
          xp: currentXP,
          level: newLevel,
          levelTitle: levelInfo.title
        });
        
        // Check for level-up achievements
        if (newLevel > get().level) {
          // Could add level-specific achievements here
        }
      },
      
      completeGame: (gameId) => {
        const completedGames = [...get().completedGames];
        if (!completedGames.includes(gameId)) {
          completedGames.push(gameId);
          set({ completedGames });
          
          // Check for first game achievement
          if (completedGames.length === 1) {
            get().earnAchievement('first-game');
          }
        }
      },
      
      earnAchievement: (achievementId) => {
        const earnedAchievements = [...get().earnedAchievements];
        if (!earnedAchievements.includes(achievementId)) {
          earnedAchievements.push(achievementId);
          
          // Find achievement to get XP reward
          const achievement = achievements.find(a => a.id === achievementId);
          if (achievement) {
            get().addXP(achievement.xp);
          }
          
          set({ earnedAchievements });
        }
      },
      
      checkLoginStreak: () => {
        const today = new Date().toISOString().split('T')[0];
        const lastLogin = get().lastLoginDate;
        
        if (!lastLogin) {
          // First login
          set({ lastLoginDate: today, loginStreak: 1 });
          return;
        }
        
        const lastLoginDate = new Date(lastLogin);
        const currentDate = new Date(today);
        
        // Calculate the difference in days
        const timeDiff = currentDate.getTime() - lastLoginDate.getTime();
        const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
        
        if (dayDiff === 1) {
          // Consecutive day
          const newStreak = get().loginStreak + 1;
          set({ lastLoginDate: today, loginStreak: newStreak });
          
          // Check for streak achievements
          if (newStreak === 7) {
            get().earnAchievement('daily-streak-7');
          } else if (newStreak === 30) {
            get().earnAchievement('daily-streak-30');
          }
        } else if (dayDiff > 1) {
          // Streak broken
          set({ lastLoginDate: today, loginStreak: 1 });
        } else if (dayDiff === 0) {
          // Same day login, do nothing
        }
      },
      
      resetProgress: () => set({
        xp: 0,
        level: 1,
        levelTitle: 'Новичок',
        completedGames: [],
        earnedAchievements: [],
        loginStreak: 0
      })
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);

// Helper function to calculate level based on XP
function calculateLevel(xp: number): number {
  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i].xpRequired) {
      return levels[i].level;
    }
  }
  return 1;
}