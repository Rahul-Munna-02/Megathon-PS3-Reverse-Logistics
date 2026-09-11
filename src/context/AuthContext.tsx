import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Organization, Profile, UserRole } from '../types/medtrace';

interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  organization: Organization | null;
  role: UserRole;
  loading: boolean;
  setDemoRole: (role: UserRole) => void;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const DEMO_PROFILES: Record<UserRole, Profile> = {
  RETAILER: {
    id: '1b1ec2a6-bf5d-43b3-b822-43f09362819a',
    name: 'MedPlus Retail Manager',
    email: 'retailer@medtrace.demo',
    role: 'RETAILER',
    organization_id: '11111111-1111-1111-1111-111111111111',
    organization: {
      id: '11111111-1111-1111-1111-111111111111',
      name: 'MedPlus Pharmacy Store #104',
      type: 'RETAILER',
      location: 'Salem, Tamil Nadu'
    }
  },
  DISTRIBUTOR: {
    id: 'f953de2f-56da-4c48-9c72-ce8124e78d7a',
    name: 'SunRise Operations Lead',
    email: 'distributor@medtrace.demo',
    role: 'DISTRIBUTOR',
    organization_id: '33333333-3333-3333-3333-333333333333',
    organization: {
      id: '33333333-3333-3333-3333-333333333333',
      name: 'SunRise Logistics & Wholesale',
      type: 'DISTRIBUTOR',
      location: 'Chennai, Tamil Nadu'
    }
  },
  MANUFACTURER: {
    id: '00d2a0cf-a9cb-40db-97bf-e53bfb7081c7',
    name: 'CarePlus Compliance Director',
    email: 'manufacturer@medtrace.demo',
    role: 'MANUFACTURER',
    organization_id: '44444444-4444-4444-4444-444444444444',
    organization: {
      id: '44444444-4444-4444-4444-444444444444',
      name: 'CarePlus Pharma Ltd',
      type: 'MANUFACTURER',
      location: 'Hyderabad, Telangana'
    }
  },
  WASTE_FACILITY: {
    id: 'ca06a6a6-2506-4dac-aa1e-2191664b5215',
    name: 'GreenCycle Site Engineer',
    email: 'wastefacility@medtrace.demo',
    role: 'WASTE_FACILITY',
    organization_id: '55555555-5555-5555-5555-555555555555',
    organization: {
      id: '55555555-5555-5555-5555-555555555555',
      name: 'GreenCycle Bio-Waste Disposal Facility',
      type: 'WASTE_FACILITY',
      location: 'Hyderabad, Telangana'
    }
  }
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: DEMO_PROFILES.MANUFACTURER,
  organization: DEMO_PROFILES.MANUFACTURER.organization || null,
  role: 'MANUFACTURER',
  loading: false,
  setDemoRole: () => {},
  signOut: async () => {},
  refreshProfile: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('MANUFACTURER');
  const [profile, setProfile] = useState<Profile | null>(DEMO_PROFILES.MANUFACTURER);
  const [organization, setOrganization] = useState<Organization | null>(
    DEMO_PROFILES.MANUFACTURER.organization || null
  );
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: prof } = await supabase
        .from('profiles')
        .select('*, organization:organizations(*)')
        .eq('id', userId)
        .maybeSingle();

      if (prof) {
        setProfile(prof as Profile);
        setRole(prof.role as UserRole);
        setOrganization(prof.organization as Organization);
      }
    } catch (e) {
      console.warn('Could not fetch session profile:', e);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setProfile(DEMO_PROFILES[role]);
        setOrganization(DEMO_PROFILES[role].organization || null);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setProfile(DEMO_PROFILES[role]);
        setOrganization(DEMO_PROFILES[role].organization || null);
      }
    });

    return () => subscription.unsubscribe();
  }, [role]);

  const setDemoRole = (newRole: UserRole) => {
    setRole(newRole);
    setProfile(DEMO_PROFILES[newRole]);
    setOrganization(DEMO_PROFILES[newRole].organization || null);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setDemoRole('MANUFACTURER');
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchUserProfile(user.id);
    } else {
      setProfile(DEMO_PROFILES[role]);
      setOrganization(DEMO_PROFILES[role].organization || null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        organization,
        role,
        loading,
        setDemoRole,
        signOut,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
