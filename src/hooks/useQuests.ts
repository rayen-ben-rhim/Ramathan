import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export interface Quest {
  id: string;
  category: "spiritual" | "mental" | "physical";
  title: string;
  reward_bp: number;
  ramadan_day: number | null;
  is_active: boolean;
}

const CATEGORY_ORDER: ("spiritual" | "mental" | "physical")[] = [
  "spiritual",
  "mental",
  "physical",
];

export function useQuests() {
  const { user, refreshProfile } = useAuth();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  useEffect(() => {
    if (!user) {
      setQuests([]);
      setCompletedIds(new Set());
      setLoading(false);
      return;
    }

    let cancelled = false;

    const timeoutId = window.setTimeout(() => {
      if (!cancelled) setLoading(false);
    }, 6000);

    const load = async () => {
      // Small delay to ensure auth state has fully settled
      await new Promise(resolve => setTimeout(resolve, 50));
      if (cancelled) return;

      setLoading(true);
      
      try {
        const [questsRes, completionsRes] = await Promise.all([
          supabase
            .from("quests")
            .select("id, category, title, reward_bp, ramadan_day, is_active")
            .eq("is_active", true),
          supabase
            .from("quest_completions")
            .select("quest_id")
            .eq("user_id", user.id)
            .eq("completed_date", today),
        ]);

        if (cancelled) return;

        if (questsRes.error) {
          console.error("Error fetching quests:", questsRes.error);
          setQuests([]);
        } else {
          setQuests((questsRes.data ?? []) as Quest[]);
        }

        if (completionsRes.error) {
          console.error("Error fetching completions:", completionsRes.error);
          setCompletedIds(new Set());
        } else {
          setCompletedIds(new Set((completionsRes.data ?? []).map((r) => r.quest_id)));
        }
      } catch (e) {
        console.error("Quests load error:", e);
        if (!cancelled) {
          setQuests([]);
          setCompletedIds(new Set());
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [user?.id, today]);

  const toggleQuest = useCallback(
    async (questId: string, rewardBp: number, isNowCompleted: boolean) => {
      if (!user) return;

      if (isNowCompleted) {
        const { error } = await supabase.from("quest_completions").insert({
          user_id: user.id,
          quest_id: questId,
          completed_date: today,
        });
        if (error) {
          console.error("Error completing quest:", error);
          return;
        }
        const { data: profile } = await supabase
          .from("profiles")
          .select("total_bp")
          .eq("id", user.id)
          .single();
        if (profile) {
          await supabase
            .from("profiles")
            .update({
              total_bp: (profile.total_bp ?? 0) + rewardBp,
              last_activity_date: today,
            })
            .eq("id", user.id);
        }
        setCompletedIds((prev) => new Set(prev).add(questId));
      } else {
        const { error } = await supabase
          .from("quest_completions")
          .delete()
          .eq("user_id", user.id)
          .eq("quest_id", questId)
          .eq("completed_date", today);
        if (error) {
          console.error("Error uncompleting quest:", error);
          return;
        }
        const { data: profile } = await supabase
          .from("profiles")
          .select("total_bp")
          .eq("id", user.id)
          .single();
        if (profile) {
          await supabase
            .from("profiles")
            .update({
              total_bp: Math.max(0, (profile.total_bp ?? 0) - rewardBp),
              last_activity_date: today,
            })
            .eq("id", user.id);
        }
        setCompletedIds((prev) => {
          const next = new Set(prev);
          next.delete(questId);
          return next;
        });
      }
      await refreshProfile();
    },
    [user?.id, today, refreshProfile]
  );

  // Only show quests that are not yet completed for today.
  const byCategory = CATEGORY_ORDER.reduce(
    (acc, cat) => {
      acc[cat] = quests
        .filter((q) => q.category === cat)
        .filter((q) => !completedIds.has(q.id));
      return acc;
    },
    {} as Record<"spiritual" | "mental" | "physical", Quest[]>
  );

  return {
    questsByCategory: byCategory,
    completedIds,
    loading,
    toggleQuest,
  };
}
