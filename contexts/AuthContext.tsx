"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { updateLastLogin } from "@/lib/profile";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

export type UserRole = "teacher" | "staff" | "student";

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

      if (error && error.code !== "PGRST116") {
        // PGRST116 is "not found" - we'll create profile on first login
        console.error("Error loading profile:", error);
      }

      const userData: User = {
        id: supabaseUser.id,
        email: supabaseUser.email || "",
        name: profile?.name || supabaseUser.user_metadata?.name || supabaseUser.email?.split("@")[0],
        role: (profile?.role as UserRole) || (supabaseUser.user_metadata?.role as UserRole) || "student",
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
        role: (supabaseUser.user_metadata?.role as UserRole) || "student",
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone,
            company,
            role: "student", // Default role
          },
        },
      });

      if (error) {
        return { error: error as Error };
      }

      // Create profile in database if user was created
      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          email: data.user.email,
          name,
          phone,
          company,
          role: "student",
        });

        if (profileError) {
          console.error("Error creating profile:", profileError);
        }
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const isAdmin = user?.role === "teacher";

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin,
        login,
        signUp,
        logout,
        isLoading,
      }}
    >
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

