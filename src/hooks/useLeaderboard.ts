import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export interface LeaderboardEntry {
  id: string;
  display_name: string;
  current_maqam: string | null;
  current_level: number;
  total_bp: number;
  current_streak: number;
  longest_streak: number;
}

interface UseLeaderboardResult {
  entries: LeaderboardEntry[];
  loading: boolean;
  error: string | null;
}

export function useLeaderboard(limit: number = 50): UseLeaderboardResult {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase.rpc("get_leaderboard_profiles", {
          limit_count: limit,
        });

        if (cancelled) return;

        if (error) {
          console.error("Error loading leaderboard:", error);
          setError("Unable to load leaderboard right now.");
          setEntries([]);
        } else {
          setEntries((data ?? []) as LeaderboardEntry[]);
        }
      } catch (e) {
        console.error("Unexpected leaderboard load error:", e);
        if (!cancelled) {
          setError("Unable to load leaderboard right now.");
          setEntries([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [limit]);

  return { entries, loading, error };
}

