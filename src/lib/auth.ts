
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthData {
  users: Record<string, { email: string; password: string; name: string; createdAt: string }>;
  currentUser: string | null;
}

const AUTH_STORAGE_KEY = 'ai_code_reviewer_auth';

function getAuthData(): AuthData {
  if (typeof window === 'undefined') return { users: {}, currentUser: null };
  
  const data = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!data) {
    return { users: {}, currentUser: null };
  }
  
  try {
    return JSON.parse(data);
  } catch {
    return { users: {}, currentUser: null };
  }
}

function saveAuthData(data: AuthData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
}

export function signUp(email: string, password: string, name: string): { success: boolean; error?: string; user?: User } {
  const authData = getAuthData();
  
  // Check if user already exists
  const existingUser = Object.values(authData.users).find(u => u.email === email);
  if (existingUser) {
    return { success: false, error: 'Email already registered' };
  }
  
  // Create new user
  const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const createdAt = new Date().toISOString();
  
  authData.users[userId] = {
    email,
    password, // In production, this should be hashed
    name,
    createdAt,
  };
  
  authData.currentUser = userId;
  saveAuthData(authData);
  
  return {
    success: true,
    user: { id: userId, email, name, createdAt },
  };
}

export function signIn(email: string, password: string): { success: boolean; error?: string; user?: User } {
  const authData = getAuthData();
  
  // Find user by email
  const userEntry = Object.entries(authData.users).find(([_, u]) => u.email === email);
  
  if (!userEntry) {
    return { success: false, error: 'Invalid email or password' };
  }
  
  const [userId, userData] = userEntry;
  
  // Check password
  if (userData.password !== password) {
    return { success: false, error: 'Invalid email or password' };
  }
  
  // Set current user
  authData.currentUser = userId;
  saveAuthData(authData);
  
  return {
    success: true,
    user: {
      id: userId,
      email: userData.email,
      name: userData.name,
      createdAt: userData.createdAt,
    },
  };
}

export function signOut(): void {
  const authData = getAuthData();
  authData.currentUser = null;
  saveAuthData(authData);
}

export function getCurrentUser(): User | null {
  const authData = getAuthData();
  
  if (!authData.currentUser) return null;
  
  const userData = authData.users[authData.currentUser];
  if (!userData) return null;
  
  return {
    id: authData.currentUser,
    email: userData.email,
    name: userData.name,
    createdAt: userData.createdAt,
  };
}

export function updateUserProfile(name: string): { success: boolean; error?: string } {
  const authData = getAuthData();
  
  if (!authData.currentUser) {
    return { success: false, error: 'Not authenticated' };
  }
  
  const userData = authData.users[authData.currentUser];
  if (!userData) {
    return { success: false, error: 'User not found' };
  }
  
  userData.name = name;
  saveAuthData(authData);
  
  return { success: true };
}

export function changePassword(currentPassword: string, newPassword: string): { success: boolean; error?: string } {
  const authData = getAuthData();
  
  if (!authData.currentUser) {
    return { success: false, error: 'Not authenticated' };
  }
  
  const userData = authData.users[authData.currentUser];
  if (!userData) {
    return { success: false, error: 'User not found' };
  }
  
  if (userData.password !== currentPassword) {
    return { success: false, error: 'Current password is incorrect' };
  }
  
  userData.password = newPassword;
  saveAuthData(authData);
  
  return { success: true };
}
