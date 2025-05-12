import { Pool } from 'pg';


const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'business_portal',
  password: '12345678',
  port: 5432,
});

async function getUserById(id: string) {
  try {
    const res = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return res.rows[0];
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

async function getUserByUsername(username: string) {
  try {
    const res = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return res.rows[0];
  } catch (error) {
    console.error('Error fetching user by username:', error);
    return null;
  }
}

async function createUser(userData: { username: string; password: string; displayName: string }) {
  try {
    const res = await pool.query(
      'INSERT INTO users(username, password, display_name) VALUES($1, $2, $3) RETURNING *',
      [userData.username, userData.password, userData.displayName]
    );
    return res.rows[0];
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

async function updateUserProgress(userId: string, gameId: string, progress: any) {
  try {
    const res = await pool.query(
      'UPDATE user_progress SET progress = $1 WHERE user_id = $2 AND game_id = $3 RETURNING *',
      [progress, userId, gameId]
    );
    return res.rows[0];
  } catch (error) {
    console.error('Error updating user progress:', error);
    return null;
  }
}


async function getUserAchievements(userId: string) {
  try {
    const res = await pool.query(
      'SELECT * FROM user_achievements WHERE user_id = $1',
      [userId]
    );
    return res.rows;
  } catch (error) {
    console.error('Error fetching user achievements:', error);
    return [];
  }
}

export {
  pool,
  getUserById,
  getUserByUsername,
  createUser,
  updateUserProgress,
  getUserAchievements
};