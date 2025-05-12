import { Hono } from 'hono';
import { getUserAchievements } from '../db';


const achievementsRoutes = new Hono();

achievementsRoutes.get('/', (c) => {
  const achievements = [
    {
      id: 'first-game',
      title: 'Первые шаги',
      description: 'Завершите первую игру',
      icon: 'award',
      xp: 50,
    },
    {
      id: 'quiz-master',
      title: 'Мастер викторин',
      description: 'Ответьте правильно на 10 вопросов подряд',
      icon: 'award',
      xp: 100,
    },
    {
      id: 'negotiator',
      title: 'Переговорщик',
      description: 'Успешно завершите 5 сценариев переговоров',
      icon: 'award',
      xp: 150,
    },
    {
      id: 'market-guru',
      title: 'Гуру рынка',
      description: 'Достигните прибыли в 1 000 000 в симуляторе рынка',
      icon: 'award',
      xp: 200,
    },
    {
      id: 'resource-master',
      title: 'Мастер ресурсов',
      description: 'Достигните оптимального распределения ресурсов 3 раза подряд',
      icon: 'award',
      xp: 180,
    },
    {
      id: 'daily-streak-7',
      title: 'Недельная серия',
      description: 'Заходите на платформу 7 дней подряд',
      icon: 'award',
      xp: 70,
    },
    {
      id: 'daily-streak-30',
      title: 'Месячная серия',
      description: 'Заходите на платформу 30 дней подряд',
      icon: 'award',
      xp: 300,
    },
  ];
  
  return c.json({ success: true, achievements });
});


achievementsRoutes.get('/user/:userId', (c) => {
  const userId = c.req.param('userId');
  
  const userAchievements = [
    {
      id: 'first-game',
      earnedAt: '2023-01-15T12:30:45Z',
    },
    {
      id: 'daily-streak-7',
      earnedAt: '2023-02-01T09:15:22Z',
    },
  ];
  
  return c.json({ success: true, achievements: userAchievements });
});

achievementsRoutes.post('/award', async (c) => {
  const { userId, achievementId } = await c.req.json();
  
  return c.json({
    success: true,
    message: 'Achievement awarded',
    achievement: {
      id: achievementId,
      earnedAt: new Date().toISOString(),
    },
    xpEarned: 50,
  });
});

export default achievementsRoutes;