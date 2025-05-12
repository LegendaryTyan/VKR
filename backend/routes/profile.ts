import { Hono } from 'hono';
import { getUserById } from '../db';

const profileRoutes = new Hono();

profileRoutes.get('/:userId', (c) => {
  const userId = c.req.param('userId');

  const profile = {
    id: userId,
    username: 'user123',
    displayName: 'Иван Петров',
    xp: 750,
    level: 5,
    levelTitle: 'Эксперт',
    registeredAt: '2023-01-01T00:00:00Z',
    lastLoginAt: '2023-06-15T14:30:22Z',
    loginStreak: 7,
    completedGames: ['business-quiz', 'negotiation-scenarios'],
    earnedAchievements: ['first-game', 'daily-streak-7'],
  };
  
  return c.json({ success: true, profile });
});


profileRoutes.put('/:userId', async (c) => {
  const userId = c.req.param('userId');
  const updates = await c.req.json();
  
  return c.json({
    success: true,
    message: 'Profile updated',
    profile: {
      id: userId,
      ...updates,
    },
  });
});


profileRoutes.get('/:userId/stats', (c) => {
  const userId = c.req.param('userId');
  
  const stats = {
    totalGamesPlayed: 15,
    totalGamesCompleted: 12,
    totalXpEarned: 750,
    averageScore: 85,
    highestScore: 98,
    totalPlayTime: 320, 
    achievementsEarned: 5,
    achievementsTotal: 15,
  };
  
  return c.json({ success: true, stats });
});


profileRoutes.post('/:userId/reset-progress', (c) => {
  const userId = c.req.param('userId');
  
  return c.json({
    success: true,
    message: 'Progress reset successfully',
  });
});

export default profileRoutes;