export type UserRole = 'admin' | 'client';
export type QuoteStatus = 'draft' | 'submitted' | 'approved' | 'rejected';

export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  company_name: string | null;
  company_logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Quote {
  id: string;
  user_id: string;
  status: QuoteStatus;
  client_name: string;
  project_start_date: string;
  project_end_date: string;
  production_company_name: string;
  num_deliverables?: number | null;
  avg_length_per_deliverable?: number | null;
  filming_days?: number | null;
  hours_per_day?: number | null;
  num_locations?: number | null;
  miles_from_service_rep?: number | null;
  crew_per_setup?: number | null;
  weight_production_to_profit?: number | null;
  discount?: number | null;
  total_amount: number;
  created_at: string;
  updated_at: string;
}

interface StoredUser extends User {
  password: string;
}

const USERS_KEY = 'vidquo_users';
const PROFILES_KEY = 'vidquo_profiles';
const QUOTES_KEY = 'vidquo_quotes';
const CURRENT_USER_KEY = 'vidquo_current_user';

function getFromStorage<T>(key: string): T[] {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveToStorage<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export const authService = {
  signUp: async (email: string, password: string, fullName: string): Promise<{ user: User | null; error: Error | null }> => {
    try {
      const users = getFromStorage<StoredUser>(USERS_KEY);

      if (users.find(u => u.email === email)) {
        return { user: null, error: new Error('User already exists') };
      }

      const user: StoredUser = {
        id: crypto.randomUUID(),
        email,
        password,
        createdAt: new Date().toISOString(),
      };

      users.push(user);
      saveToStorage(USERS_KEY, users);

      const profile: Profile = {
        id: user.id,
        email,
        full_name: fullName,
        role: 'client',
        company_name: null,
        company_logo_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const profiles = getFromStorage<Profile>(PROFILES_KEY);
      profiles.push(profile);
      saveToStorage(PROFILES_KEY, profiles);

      const { password: _, ...userWithoutPassword } = user;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));

      return { user: userWithoutPassword, error: null };
    } catch (error) {
      return { user: null, error: error as Error };
    }
  },

  signIn: async (email: string, password: string): Promise<{ user: User | null; error: Error | null }> => {
    try {
      const users = getFromStorage<StoredUser>(USERS_KEY);
      const user = users.find(u => u.email === email && u.password === password);

      if (!user) {
        return { user: null, error: new Error('Invalid email or password') };
      }

      const { password: _, ...userWithoutPassword } = user;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));

      return { user: userWithoutPassword, error: null };
    } catch (error) {
      return { user: null, error: error as Error };
    }
  },

  signOut: async (): Promise<void> => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser: (): User | null => {
    try {
      const data = localStorage.getItem(CURRENT_USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
};

export const profileService = {
  getProfile: async (userId: string): Promise<Profile | null> => {
    const profiles = getFromStorage<Profile>(PROFILES_KEY);
    return profiles.find(p => p.id === userId) || null;
  },

  updateProfile: async (userId: string, updates: Partial<Profile>): Promise<{ profile: Profile | null; error: Error | null }> => {
    try {
      const profiles = getFromStorage<Profile>(PROFILES_KEY);
      const index = profiles.findIndex(p => p.id === userId);

      if (index === -1) {
        return { profile: null, error: new Error('Profile not found') };
      }

      profiles[index] = {
        ...profiles[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };

      saveToStorage(PROFILES_KEY, profiles);
      return { profile: profiles[index], error: null };
    } catch (error) {
      return { profile: null, error: error as Error };
    }
  },
};

export const quoteService = {
  getQuotes: async (userId: string): Promise<Quote[]> => {
    const quotes = getFromStorage<Quote>(QUOTES_KEY);
    return quotes.filter(q => q.user_id === userId);
  },

  getAllQuotes: async (): Promise<Quote[]> => {
    return getFromStorage<Quote>(QUOTES_KEY);
  },

  createQuote: async (quote: Omit<Quote, 'id' | 'created_at' | 'updated_at'>): Promise<{ quote: Quote | null; error: Error | null }> => {
    try {
      const quotes = getFromStorage<Quote>(QUOTES_KEY);

      const newQuote: Quote = {
        ...quote,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      quotes.push(newQuote);
      saveToStorage(QUOTES_KEY, quotes);

      return { quote: newQuote, error: null };
    } catch (error) {
      return { quote: null, error: error as Error };
    }
  },

  updateQuote: async (quoteId: string, updates: Partial<Quote>): Promise<{ quote: Quote | null; error: Error | null }> => {
    try {
      const quotes = getFromStorage<Quote>(QUOTES_KEY);
      const index = quotes.findIndex(q => q.id === quoteId);

      if (index === -1) {
        return { quote: null, error: new Error('Quote not found') };
      }

      quotes[index] = {
        ...quotes[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };

      saveToStorage(QUOTES_KEY, quotes);
      return { quote: quotes[index], error: null };
    } catch (error) {
      return { quote: null, error: error as Error };
    }
  },

  deleteQuote: async (quoteId: string): Promise<{ error: Error | null }> => {
    try {
      const quotes = getFromStorage<Quote>(QUOTES_KEY);
      const filtered = quotes.filter(q => q.id !== quoteId);
      saveToStorage(QUOTES_KEY, filtered);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },
};
