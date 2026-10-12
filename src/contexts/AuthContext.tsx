import React, { createContext, useState, useEffect } from 'react';
import { AuthContextType, RoleName, UserProfile } from '@/types';

export const DEMO_PERSONAS: Record<RoleName, UserProfile> = {
  admin: {
    id: 'user-admin-01',
    name: 'Bapak Hartono (Ketua RW 05)',
    email: 'rw05.hartono@kampungmelati.id',
    role: 'admin',
    permissions: [
      'treasury:read',
      'treasury:write',
      'water:read',
      'water:manage',
      'announcements:publish',
    ],
    avatar: '👨‍💼',
    unitNumber: 'Blok A1 No. 01',
    phone: '+62 812-3456-7890',
  },
  treasurer: {
    id: 'user-treasurer-01',
    name: 'Ibu Ratna (Bendahara RW)',
    email: 'bendahara.ratna@kampungmelati.id',
    role: 'treasurer',
    permissions: [
      'treasury:read',
      'treasury:write',
      'water:read',
    ],
    avatar: '👩‍💼',
    unitNumber: 'Blok B3 No. 12',
    phone: '+62 813-9876-5432',
  },
  resident: {
    id: 'user-resident-01',
    name: 'Mas Budi Santoso (Warga RT 02)',
    email: 'budi.santoso@gmail.com',
    role: 'resident',
    permissions: [
      'treasury:read',
      'water:read',
    ],
    avatar: '🏡',
    unitNumber: 'Blok C2 No. 08',
    phone: '+62 856-1122-3344',
  },
};

const TOKEN_STORAGE_KEY = 'ksm_auth_token';
const ROLE_STORAGE_KEY = 'ksm_active_role';

function generateMockJwt(user: UserProfile): string {
  try {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(
      JSON.stringify({
        sub: user.id,
        name: user.name,
        role: user.role,
        permissions: user.permissions,
        unit: user.unitNumber,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400 * 7,
      })
    );
    const signature = btoa('ksm_superapp_hmac_secret_key');
    return `${header}.${payload}.${signature}`;
  } catch {
    return `mock.jwt.token.${user.role}.${Date.now()}`;
  }
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const savedRole = localStorage.getItem(ROLE_STORAGE_KEY) as RoleName | null;
      if (savedRole && DEMO_PERSONAS[savedRole]) {
        return DEMO_PERSONAS[savedRole];
      }
    } catch {
      // Fallback
    }
    return DEMO_PERSONAS.admin;
  });

  const [token, setToken] = useState<string | null>(() => {
    try {
      const savedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (savedToken) return savedToken;
      const initialUser = DEMO_PERSONAS.admin;
      const newToken = generateMockJwt(initialUser);
      localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
      localStorage.setItem(ROLE_STORAGE_KEY, initialUser.role);
      return newToken;
    } catch {
      return null;
    }
  });

  const login = (role: RoleName) => {
    const persona = DEMO_PERSONAS[role];
    if (!persona) return;
    const newToken = generateMockJwt(persona);
    setUser(persona);
    setToken(newToken);
    try {
      localStorage.setItem(ROLE_STORAGE_KEY, role);
      localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
    } catch {
      // Ignore
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem(ROLE_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  const switchPersona = (role: RoleName) => {
    login(role);
  };

  useEffect(() => {
    if (user && !token) {
      const newToken = generateMockJwt(user);
      setToken(newToken);
      try {
        localStorage.setItem(ROLE_STORAGE_KEY, user.role);
        localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
      } catch {
        // Ignore
      }
    }
  }, [user, token]);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    login,
    logout,
    switchPersona,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
