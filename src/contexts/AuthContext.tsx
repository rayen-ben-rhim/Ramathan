import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  current_maqam: string | null;
  current_level: number;
  total_bp: number;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  created_at: string;
}

interface AuthContextValue {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      setProfile(null);
      return;
    }
    setProfile(data as Profile);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let initialSessionHandled = false;

    // Set up the auth state change listener - this is the primary source of truth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled) return;

      // Track when we've received the initial session
      if (event === "INITIAL_SESSION" || event === "SIGNED_IN") {
        initialSessionHandled = true;
      }

      // Update user state synchronously
      setUser(session?.user ?? null);
      
      // Defer profile fetch to avoid blocking the auth callback
      // Using setTimeout breaks out of Supabase's internal promise chain
      if (session?.user) {
        const userId = session.user.id;
        setTimeout(() => {
          if (!cancelled) {
            fetchProfile(userId)
              .finally(() => setLoading(false));
          }
        }, 0);
      } else {
        setProfile(null);
        if (event === "INITIAL_SESSION" || event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "TOKEN_REFRESHED") {
          setLoading(false);
        }
      }
    });

    // Fallback: if no auth event fires (e.g., no stored session)
    const fallbackTimeout = window.setTimeout(async () => {
      if (cancelled || initialSessionHandled) return;

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (cancelled || initialSessionHandled) return;

        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      } catch {
        if (!cancelled && !initialSessionHandled) {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      }
    }, 100);

    // Safety timeout
    const safetyTimeout = window.setTimeout(() => {
      if (!cancelled) setLoading(false);
    }, 8000);

    return () => {
      cancelled = true;
      clearTimeout(fallbackTimeout);
      clearTimeout(safetyTimeout);
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
    setLoading(false);
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) await fetchProfile(session.user.id);
  }, [fetchProfile]);

  const value: AuthContextValue = {
    user,
    profile,
    loading,
    signInWithGoogle,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
