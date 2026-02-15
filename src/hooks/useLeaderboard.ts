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

export function useLeaderboard(limit: number = 10): UseLeaderboardResult {
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

export interface MyLeaderboardRankResult {
  rank: number | null;
  entry: LeaderboardEntry | null;
  loading: boolean;
  error: string | null;
}

export function useMyLeaderboardRank(userId: string | undefined): MyLeaderboardRankResult {
  const [rank, setRank] = useState<number | null>(null);
  const [entry, setEntry] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setRank(null);
      setEntry(null);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: rpcError } = await supabase.rpc("get_my_leaderboard_rank", {
          p_user_id: userId,
        });

        if (cancelled) return;

        if (rpcError) {
          console.error("Error loading my leaderboard rank:", rpcError);
          setError("Unable to load your rank.");
          setRank(null);
          setEntry(null);
        } else {
          const row = Array.isArray(data) ? data[0] : data;
          if (row && typeof row.rank === "number") {
            setRank(row.rank as number);
            setEntry({
              id: row.id,
              display_name: row.display_name ?? "Traveler",
              current_maqam: row.current_maqam ?? null,
              current_level: row.current_level ?? 1,
              total_bp: row.total_bp ?? 0,
              current_streak: row.current_streak ?? 0,
              longest_streak: row.longest_streak ?? 0,
            });
          } else {
            setRank(null);
            setEntry(null);
          }
        }
      } catch (e) {
        console.error("Unexpected my rank load error:", e);
        if (!cancelled) {
          setError("Unable to load your rank.");
          setRank(null);
          setEntry(null);
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
  }, [userId]);

  return { rank, entry, loading, error };
}

