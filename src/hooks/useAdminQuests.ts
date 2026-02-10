import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export interface AdminQuest {
  id: string;
  category: "spiritual" | "mental" | "physical";
  title: string;
  reward_bp: number;
  ramadan_day: number | null;
  is_active: boolean;
}

interface UseAdminQuestsResult {
  quests: AdminQuest[];
  loading: boolean;
  error: string | null;
  addQuest: (values: {
    title: string;
    category: "spiritual" | "mental" | "physical";
    reward_bp: number;
    ramadan_day: number | null;
  }) => Promise<void>;
  updateQuest: (
    id: string,
    patch: Partial<Pick<AdminQuest, "title" | "category" | "reward_bp" | "ramadan_day">>
  ) => Promise<void>;
  toggleQuestActive: (id: string, isActive: boolean) => Promise<void>;
}

export function useAdminQuests(): UseAdminQuestsResult {
  const [quests, setQuests] = useState<AdminQuest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("quests")
        .select("id, category, title, reward_bp, ramadan_day, is_active")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Admin: error loading quests", error);
        setError("Unable to load quests.");
        setQuests([]);
      } else {
        setQuests((data ?? []) as AdminQuest[]);
      }
    } catch (e) {
      console.error("Admin: unexpected quests load error", e);
      setError("Unable to load quests.");
      setQuests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addQuest: UseAdminQuestsResult["addQuest"] = async (values) => {
    const { error } = await supabase.from("quests").insert({
      category: values.category,
      title: values.title,
      reward_bp: values.reward_bp,
      ramadan_day: values.ramadan_day,
      is_active: true,
    });
    if (error) {
      console.error("Admin: error adding quest", error);
      throw new Error("Failed to add quest");
    }
    await load();
  };

  const updateQuest: UseAdminQuestsResult["updateQuest"] = async (id, patch) => {
    const { error } = await supabase
      .from("quests")
      .update(patch)
      .eq("id", id);
    if (error) {
      console.error("Admin: error updating quest", error);
      throw new Error("Failed to update quest");
    }
    await load();
  };

  const toggleQuestActive: UseAdminQuestsResult["toggleQuestActive"] = async (
    id,
    isActive
  ) => {
    const { error } = await supabase
      .from("quests")
      .update({ is_active: isActive })
      .eq("id", id);
    if (error) {
      console.error("Admin: error toggling quest active", error);
      throw new Error("Failed to update quest state");
    }
    setQuests((prev) =>
      prev.map((q) => (q.id === id ? { ...q, is_active: isActive } : q))
    );
  };

  return {
    quests,
    loading,
    error,
    addQuest,
    updateQuest,
    toggleQuestActive,
  };
}

