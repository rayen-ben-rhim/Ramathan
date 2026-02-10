import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export interface AdminVideo {
  id: string;
  title: string;
  youtube_id: string;
  reward_bp: number;
  duration: string | null;
  is_active: boolean;
}

interface UseAdminVideosResult {
  videos: AdminVideo[];
  loading: boolean;
  error: string | null;
  addVideo: (values: {
    title: string;
    youtube_id: string;
    reward_bp: number;
    duration: string | null;
  }) => Promise<void>;
  updateVideo: (
    id: string,
    patch: Partial<Pick<AdminVideo, "title" | "youtube_id" | "reward_bp" | "duration">>
  ) => Promise<void>;
  toggleVideoActive: (id: string, isActive: boolean) => Promise<void>;
}

export function useAdminVideos(): UseAdminVideosResult {
  const [videos, setVideos] = useState<AdminVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("videos")
        .select("id, title, youtube_id, reward_bp, duration, is_active")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Admin: error loading videos", error);
        setError("Unable to load videos.");
        setVideos([]);
      } else {
        setVideos((data ?? []) as AdminVideo[]);
      }
    } catch (e) {
      console.error("Admin: unexpected videos load error", e);
      setError("Unable to load videos.");
      setVideos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addVideo: UseAdminVideosResult["addVideo"] = async (values) => {
    const { error } = await supabase.from("videos").insert({
      title: values.title,
      youtube_id: values.youtube_id,
      reward_bp: values.reward_bp,
      duration: values.duration,
      is_active: true,
    });
    if (error) {
      console.error("Admin: error adding video", error);
      throw new Error("Failed to add video");
    }
    await load();
  };

  const updateVideo: UseAdminVideosResult["updateVideo"] = async (id, patch) => {
    const { error } = await supabase
      .from("videos")
      .update(patch)
      .eq("id", id);
    if (error) {
      console.error("Admin: error updating video", error);
      throw new Error("Failed to update video");
    }
    await load();
  };

  const toggleVideoActive: UseAdminVideosResult["toggleVideoActive"] = async (
    id,
    isActive
  ) => {
    const { error } = await supabase
      .from("videos")
      .update({ is_active: isActive })
      .eq("id", id);
    if (error) {
      console.error("Admin: error toggling video active", error);
      throw new Error("Failed to update video state");
    }
    setVideos((prev) =>
      prev.map((v) => (v.id === id ? { ...v, is_active: isActive } : v))
    );
  };

  return {
    videos,
    loading,
    error,
    addVideo,
    updateVideo,
    toggleVideoActive,
  };
}

