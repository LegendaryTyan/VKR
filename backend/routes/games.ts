import { Hono } from 'hono';
import { updateUserProgress } from '../db';

const gamesRoutes = new Hono();


gamesRoutes.get('/', (c) => {

  const games = [
    {
      id: 'business-quiz',
      title: 'Бизнес-викторина',
      description: 'Проверьте свои знания в области бизнеса и экономики',
      icon: 'brain',
      color: '#3366FF',
      xp: 100,
    },
    {
      id: 'negotiation-scenarios',
      title: 'Сценарии переговоров',
      description: 'Отработайте навыки ведения переговоров в различных ситуациях',
      icon: 'message-circle',
      color: '#FF6B6B',
      xp: 150,
    },
    {
      id: 'market-simulator',
      title: 'Симулятор рынка',
      description: 'Управляйте виртуальной компанией и реагируйте на изменения рынка',
      icon: 'trending-up',
      color: '#00E096',
      xp: 200,
    },
    {
      id: 'resource-allocation',
      title: 'Распределение ресурсов',
      description: 'Оптимально распределите ограниченные ресурсы для максимальной прибыли',
      icon: 'pie-chart',
      color: '#FFAA00',
      xp: 180,
    },
  ];
  
  return c.json({ success: true, games });
});


gamesRoutes.get('/:id', (c) => {
  const id = c.req.param('id');
  

  const game = {
    id,
    title: 'Бизнес-викторина',
    description: 'Проверьте свои знания в области бизнеса и экономики',
    icon: 'brain',
    color: '#3366FF',
    xp: 100,

  };
  
  return c.json({ success: true, game });
});


gamesRoutes.post('/:id/start', async (c) => {
  const id = c.req.param('id');
  const { userId } = await c.req.json();
  
  return c.json({
    success: true,
    message: 'Game started',
    gameSession: {
      id: 'session-123',
      gameId: id,
      userId,
      startTime: new Date().toISOString(),
    },
  });
});


gamesRoutes.post('/:id/progress', async (c) => {
  const id = c.req.param('id');
  const { userId, progress } = await c.req.json();
  
  return c.json({
    success: true,
    message: 'Progress saved',
  });
});


gamesRoutes.post('/:id/complete', async (c) => {
  const id = c.req.param('id');
  const { userId, score } = await c.req.json();

  return c.json({
    success: true,
    message: 'Game completed',
    xpEarned: Math.round(score),
    achievements: [],
  });
});

export default gamesRoutes;