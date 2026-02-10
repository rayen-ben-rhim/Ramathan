import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export interface Video {
  id: string;
  title: string;
  youtube_id: string;
  reward_bp: number;
  duration: string | null;
  is_active: boolean;
}

export function useVideos() {
  const { user, refreshProfile } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  useEffect(() => {
    if (!user) {
      setVideos([]);
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
      await new Promise((resolve) => setTimeout(resolve, 50));
      if (cancelled) return;

      setLoading(true);

      try {
        const [videosRes, completionsRes] = await Promise.all([
          supabase
            .from("videos")
            .select("id, title, youtube_id, reward_bp, duration, is_active")
            .eq("is_active", true),
          supabase
            .from("video_completions")
            .select("video_id")
            .eq("user_id", user.id)
            .eq("completed_date", today),
        ]);

        if (cancelled) return;

        if (videosRes.error) {
          console.error("Error fetching videos:", videosRes.error);
          setVideos([]);
        } else {
          setVideos((videosRes.data ?? []) as Video[]);
        }

        if (completionsRes.error) {
          console.error("Error fetching video completions:", completionsRes.error);
          setCompletedIds(new Set());
        } else {
          setCompletedIds(
            new Set((completionsRes.data ?? []).map((r: { video_id: string }) => r.video_id))
          );
        }
      } catch (e) {
        console.error("Videos load error:", e);
        if (!cancelled) {
          setVideos([]);
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

  const toggleVideo = useCallback(
    async (videoId: string, rewardBp: number, isNowCompleted: boolean) => {
      if (!user) return;

      if (isNowCompleted) {
        const { error } = await supabase.from("video_completions").insert({
          user_id: user.id,
          video_id: videoId,
          completed_date: today,
        });
        if (error) {
          console.error("Error marking video as watched:", error);
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
        setCompletedIds((prev) => new Set(prev).add(videoId));
      } else {
        const { error } = await supabase
          .from("video_completions")
          .delete()
          .eq("user_id", user.id)
          .eq("video_id", videoId)
          .eq("completed_date", today);
        if (error) {
          console.error("Error undoing watched video:", error);
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
          next.delete(videoId);
          return next;
        });
      }
      await refreshProfile();
    },
    [user?.id, today, refreshProfile]
  );

  return {
    videos,
    completedIds,
    loading,
    toggleVideo,
  };
}

