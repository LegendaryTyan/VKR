import { Hono } from 'hono';
import { getUserByUsername, createUser } from '../db';


const authRoutes = new Hono();


authRoutes.post('/login', async (c) => {
  try {
    const { username, password } = await c.req.json();
    

    return c.json({
      success: true,
      user: {
        id: '1',
        username,
        displayName: 'Test User',
      },
      token: 'mock-jwt-token',
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ success: false, message: 'Authentication failed' }, 401);
  }
});

authRoutes.post('/register', async (c) => {
  try {
    const { username, password, displayName } = await c.req.json();
    

    return c.json({
      success: true,
      user: {
        id: '2',
        username,
        displayName,
      },
      token: 'mock-jwt-token',
    });
  } catch (error) {
    console.error('Registration error:', error);
    return c.json({ success: false, message: 'Registration failed' }, 400);
  }
});


authRoutes.post('/logout', (c) => {
  return c.json({ success: true, message: 'Logged out successfully' });
});


authRoutes.post('/refresh-token', (c) => {
  return c.json({
    success: true,
    token: 'new-mock-jwt-token',
  });
});

export default authRoutes;