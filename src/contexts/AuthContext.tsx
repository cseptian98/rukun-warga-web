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
      'water:manage',
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
const USER_STORAGE_KEY = 'ksm_active_user';

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
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (savedUser) {
        return JSON.parse(savedUser) as UserProfile;
      }
      const savedRole = localStorage.getItem(ROLE_STORAGE_KEY) as RoleName | null;
      if (savedRole && DEMO_PERSONAS[savedRole]) {
        return DEMO_PERSONAS[savedRole];
      }
    } catch {
      // Fallback
    }
    return null;
  });

  const [token, setToken] = useState<string | null>(() => {
    try {
      const savedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (savedToken) return savedToken;
    } catch {
      // Fallback
    }
    return null;
  });

  const login = async (credentialsOrRole: any): Promise<boolean> => {
    if (typeof credentialsOrRole === 'string') {
      const persona = DEMO_PERSONAS[credentialsOrRole as RoleName];
      if (!persona) return false;
      const newToken = generateMockJwt(persona);
      setUser(persona);
      setToken(newToken);
      try {
        localStorage.setItem(ROLE_STORAGE_KEY, credentialsOrRole);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(persona));
        localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
      } catch {
        // Ignore
      }
      return true;
    }

    if (credentialsOrRole && typeof credentialsOrRole === 'object') {
      if (credentialsOrRole.role && DEMO_PERSONAS[credentialsOrRole.role as RoleName]) {
        return login(credentialsOrRole.role);
      }

      const rawId = (credentialsOrRole.username || credentialsOrRole.email || '').trim().toLowerCase();
      const password = credentialsOrRole.password || '';

      if (!rawId) {
        throw new Error('Email atau Username wajib diisi.');
      }

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: credentialsOrRole.username || credentialsOrRole.email,
            email: credentialsOrRole.email || credentialsOrRole.username,
            password: credentialsOrRole.password,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const jwtToken = data.token || data.access_token || generateMockJwt(DEMO_PERSONAS.admin);
          const backendUser = data.user || {};
          const role = ((backendUser.roles && backendUser.roles[0]) as RoleName) || 'resident';
          const profile: UserProfile = {
            id: backendUser.id || `user-${Date.now()}`,
            name: backendUser.full_name || backendUser.username || DEMO_PERSONAS[role]?.name || rawId,
            email: backendUser.email || DEMO_PERSONAS[role]?.email,
            username: backendUser.username || rawId,
            role: role,
            permissions: (backendUser.permissions as any) || DEMO_PERSONAS[role]?.permissions || [],
            avatar: DEMO_PERSONAS[role]?.avatar || '👤',
            unitNumber: DEMO_PERSONAS[role]?.unitNumber || 'RW 05',
            phone: DEMO_PERSONAS[role]?.phone,
          };
          setUser(profile);
          setToken(jwtToken);
          try {
            localStorage.setItem(ROLE_STORAGE_KEY, profile.role);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
            localStorage.setItem(TOKEN_STORAGE_KEY, jwtToken);
          } catch {
            // Ignore
          }
          return true;
        }
      } catch {
        // Network / offline fallback
      }

      let matchedRole: RoleName | null = null;
      if (
        rawId === 'admin' ||
        rawId === 'admin@kampungmelati.id' ||
        rawId === 'rw05.hartono@kampungmelati.id'
      ) {
        if (password === 'admin123' || password === '') {
          matchedRole = 'admin';
        }
      } else if (
        rawId === 'treasurer' ||
        rawId === 'treasurer@kampungmelati.id' ||
        rawId === 'bendahara.ratna@kampungmelati.id'
      ) {
        if (password === 'bendahara123' || password === '') {
          matchedRole = 'treasurer';
        }
      } else if (
        rawId === 'resident' ||
        rawId === 'resident@kampungmelati.id' ||
        rawId === 'budi.santoso@gmail.com'
      ) {
        if (password === 'warga123' || password === '') {
          matchedRole = 'resident';
        }
      }

      if (matchedRole && DEMO_PERSONAS[matchedRole]) {
        return login(matchedRole);
      }

      throw new Error('Kredensial tidak valid. Silakan periksa email/username dan password.');
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem(ROLE_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  const switchPersona = (role: RoleName) => {
    login(role);
  };

  const hasPermission = (permission: any): boolean => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return user.permissions?.includes(permission) ?? false;
  };

  const hasRole = (role: RoleName | RoleName[]): boolean => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  };

  useEffect(() => {
    if (user && !token) {
      const newToken = generateMockJwt(user);
      setToken(newToken);
      try {
        localStorage.setItem(ROLE_STORAGE_KEY, user.role);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
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
    login: login as any,
    logout,
    switchPersona,
    hasPermission,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
