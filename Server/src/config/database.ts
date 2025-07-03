import { config } from './config';

export interface DatabaseUser {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  name: string;
  prn: string;
  email: string;
  password_hash: string;
  role: number;
  school: string;
}

export class DatabaseService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = config.WORQHAT_API_KEY;
    this.baseUrl = 'https://api.worqhat.com/api/db';
  }

  private async executeQuery(query: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/run-query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({ query })
      });

      if (!response.ok) {
        throw new Error(`Database query failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  async createUser(userData: {
    stytch_user_id: string;
    name: string;
    prn: string;
    email: string;
    role?: number;
    school?: string;
  }): Promise<DatabaseUser> {
    const now = new Date().toISOString();
    const docId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const query = `
      INSERT INTO users VALUES (
        '${docId}',
        '${now}',
        '${now}',
        '${userData.stytch_user_id}',
        '${userData.name}',
        '${userData.prn}',
        '${userData.email}',
        '',
        ${userData.role || 1},
        '${userData.school || ''}'
      )
    `;

    await this.executeQuery(query);
    
    return {
      id: docId,
      created_at: now,
      updated_at: now,
      user_id: userData.stytch_user_id,
      name: userData.name,
      prn: userData.prn,
      email: userData.email,
      password_hash: '',
      role: userData.role || 1,
      school: userData.school || ''
    };
  }

  async getUserByEmail(email: string): Promise<DatabaseUser | null> {
    const query = `SELECT * FROM users WHERE email = '${email}' LIMIT 1`;
    
    try {
      const result = await this.executeQuery(query);
      
      if (result.data && result.data.length > 0) {
        const user = result.data[0];
        return {
          id: user.id,
          created_at: user.created_at,
          updated_at: user.updated_at,
          user_id: user.user_id,
          name: user.name,
          prn: user.prn,
          email: user.email,
          password_hash: user.password_hash,
          role: user.role,
          school: user.school
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      return null;
    }
  }

  async getUserByStytchId(stytchUserId: string): Promise<DatabaseUser | null> {
    const query = `SELECT * FROM users WHERE user_id = '${stytchUserId}' LIMIT 1`;
    
    try {
      const result = await this.executeQuery(query);
      
      if (result.data && result.data.length > 0) {
        const user = result.data[0];
        return {
          id: user.id,
          created_at: user.created_at,
          updated_at: user.updated_at,
          user_id: user.user_id,
          name: user.name,
          prn: user.prn,
          email: user.email,
          password_hash: user.password_hash,
          role: user.role,
          school: user.school
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching user by Stytch ID:', error);
      return null;
    }
  }

  async updateUser(stytchUserId: string, updates: Partial<DatabaseUser>): Promise<DatabaseUser | null> {
    const now = new Date().toISOString();
    
    const setClause = Object.entries(updates)
      .filter(([key]) => key !== 'id' && key !== 'created_at' && key !== 'user_id')
      .map(([key, value]) => `${key} = '${value}'`)
      .join(', ');

    if (!setClause) {
      throw new Error('No valid fields to update');
    }

    const query = `
      UPDATE users 
      SET ${setClause}, updated_at = '${now}'
      WHERE user_id = '${stytchUserId}'
    `;

    await this.executeQuery(query);
    return await this.getUserByStytchId(stytchUserId);
  }
}

export const dbService = new DatabaseService();
