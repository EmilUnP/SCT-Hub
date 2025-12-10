"use client";

import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { updateLastLogin } from "@/lib/profile";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

export type UserRole = "teacher" | "staff" | "student" | "guest";

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: UserRole;
  phone?: string;
  company?: string;
  // Extended profile fields
  address?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  bio?: string;
  avatar_url?: string;
  position?: string;
  department?: string;
  specialization?: string;
  business_name?: string;
  business_type?: string;
  business_registration?: string;
  tax_id?: string;
  website?: string;
  linkedin?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  last_login?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, name?: string, phone?: string, company?: string) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await loadUserProfile(session.user);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      // Try to get user profile from database
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", supabaseUser.id)
        .single();

      // If profile doesn't exist, try to create it
      if (error && error.code === "PGRST116") {
        // Profile not found - create it with data from user_metadata
        const profileData: Record<string, any> = {
          id: supabaseUser.id,
          email: supabaseUser.email,
          role: (supabaseUser.user_metadata?.role as UserRole) || "guest",
        };

        if (supabaseUser.user_metadata?.name) {
          profileData.name = supabaseUser.user_metadata.name;
        }
        if (supabaseUser.user_metadata?.phone) {
          profileData.phone = supabaseUser.user_metadata.phone;
        }
        if (supabaseUser.user_metadata?.company) {
          profileData.company = supabaseUser.user_metadata.company;
        }

        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert(profileData)
          .select()
          .single();

        if (createError) {
          console.error("Error creating profile on first login:", createError);
          // Continue with user_metadata if profile creation fails
        } else {
          // Use the newly created profile
          const userData: User = {
            id: supabaseUser.id,
            email: supabaseUser.email || "",
            name: newProfile?.name || supabaseUser.user_metadata?.name || supabaseUser.email?.split("@")[0],
            role: (newProfile?.role as UserRole) || (supabaseUser.user_metadata?.role as UserRole) || "guest",
            phone: newProfile?.phone || supabaseUser.user_metadata?.phone,
            company: newProfile?.company || supabaseUser.user_metadata?.company,
            // Extended fields from profile
            address: newProfile?.address,
            city: newProfile?.city,
            country: newProfile?.country,
            postal_code: newProfile?.postal_code,
            bio: newProfile?.bio,
            avatar_url: newProfile?.avatar_url,
            position: newProfile?.position,
            department: newProfile?.department,
            specialization: newProfile?.specialization,
            business_name: newProfile?.business_name,
            business_type: newProfile?.business_type,
            business_registration: newProfile?.business_registration,
            tax_id: newProfile?.tax_id,
            website: newProfile?.website,
            linkedin: newProfile?.linkedin,
            status: newProfile?.status,
            created_at: newProfile?.created_at,
            updated_at: newProfile?.updated_at,
            last_login: newProfile?.last_login,
          };

          setUser(userData);
          setIsLoading(false);
          return;
        }
      } else if (error) {
        // Other error loading profile
        console.error("Error loading profile:", error);
      }

      const userData: User = {
        id: supabaseUser.id,
        email: supabaseUser.email || "",
        name: profile?.name || supabaseUser.user_metadata?.name || supabaseUser.email?.split("@")[0],
        role: (profile?.role as UserRole) || (supabaseUser.user_metadata?.role as UserRole) || "guest",
        phone: profile?.phone || supabaseUser.user_metadata?.phone,
        company: profile?.company || supabaseUser.user_metadata?.company,
        // Extended fields
        address: profile?.address,
        city: profile?.city,
        country: profile?.country,
        postal_code: profile?.postal_code,
        bio: profile?.bio,
        avatar_url: profile?.avatar_url,
        position: profile?.position,
        department: profile?.department,
        specialization: profile?.specialization,
        business_name: profile?.business_name,
        business_type: profile?.business_type,
        business_registration: profile?.business_registration,
        tax_id: profile?.tax_id,
        website: profile?.website,
        linkedin: profile?.linkedin,
        status: profile?.status,
        created_at: profile?.created_at,
        updated_at: profile?.updated_at,
        last_login: profile?.last_login,
      };

      setUser(userData);
    } catch (error) {
      console.error("Error loading user profile:", error);
      // Fallback to basic user data
      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email || "",
        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split("@")[0],
        role: (supabaseUser.user_metadata?.role as UserRole) || "guest",
        phone: supabaseUser.user_metadata?.phone,
        company: supabaseUser.user_metadata?.company,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error as Error };
      }

      if (data.user) {
        await loadUserProfile(data.user);
        // Update last login
        await updateLastLogin(data.user.id);
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    name?: string,
    phone?: string,
    company?: string
  ) => {
    try {
      // Validate email format
      if (!email || !email.includes("@")) {
        return { error: new Error("Please enter a valid email address") };
      }

      // Validate password
      if (!password || password.length < 6) {
        return { error: new Error("Password must be at least 6 characters long") };
      }

      // Only include non-empty values in metadata
      const userMetadata: Record<string, string> = {
        role: "guest",
      };
      
      if (name && name.trim()) {
        userMetadata.name = name.trim();
      }
      if (phone && phone.trim()) {
        userMetadata.phone = phone.trim();
      }
      if (company && company.trim()) {
        userMetadata.company = company.trim();
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: userMetadata,
        },
      });

      if (error) {
        console.error("Supabase signup error:", error);
        return { error: error as Error };
      }

      // Profile will be created automatically via database trigger or on first login
      // We don't create it here to avoid RLS policy issues during signup
      // The profile will be created when the user first logs in (see loadUserProfile)

      return { error: null };
    } catch (error) {
      console.error("Unexpected signup error:", error);
      return { error: error as Error };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const isAdmin = user?.role === "teacher";

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isAdmin,
      login,
      signUp,
      logout,
      isLoading,
    }),
    [user, isAdmin, isLoading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

