import { User } from '../types';

const STORAGE_KEY = 'dg_studio_user';

// Mock database simulation
const MOCK_DB_USERS: User[] = [
  {
    id: '1',
    name: 'Julian Casablancas',
    email: 'julian@example.com',
    role: 'Senior Product Designer',
    avatar: 'https://picsum.photos/seed/user1/100/100'
  }
];

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulating backend check
        if (!email || !password) {
          reject(new Error('Email and password are required'));
          return;
        }

        // For demo purposes, any password works if email is valid format
        // In a real app, we would check the password hash
        const user = MOCK_DB_USERS.find(u => u.email === email) || {
          id: Math.random().toString(36).substr(2, 9),
          name: email.split('@')[0],
          email: email,
          role: 'Designer',
          avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=6366f1&color=fff`
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        resolve(user);
      }, 800);
    });
  },

  register: async (name: string, email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!name || !email || !password) {
          reject(new Error('All fields are required'));
          return;
        }

        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          name,
          email,
          role: 'Designer',
          avatar: `https://ui-avatars.com/api/?name=${name}&background=6366f1&color=fff`
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
        resolve(newUser);
      }, 800);
    });
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  }
};