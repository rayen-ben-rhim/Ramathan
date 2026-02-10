import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAdminQuests } from "@/hooks/useAdminQuests";
import { useAdminVideos } from "@/hooks/useAdminVideos";

const ADMIN_EMAIL = "admin@ramathani.app";
const ADMIN_PASSWORD = "ramathani-admin-2025";

const Admin = () => {
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("ramathani_admin");
    if (stored === "1") {
      setIsAdmin(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      localStorage.setItem("ramathani_admin", "1");
      setError(null);
      toast({
        title: "Welcome back",
        description: "Admin mode enabled.",
      });
    } else {
      setError("Invalid admin credentials.");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem("ramathani_admin");
  };

  const {
    quests,
    loading: questsLoading,
    error: questsError,
    addQuest,
    updateQuest,
    toggleQuestActive,
  } = useAdminQuests();

  const {
    videos,
    loading: videosLoading,
    error: videosError,
    addVideo,
    updateVideo,
    toggleVideoActive,
  } = useAdminVideos();

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h1 className="text-xl font-display font-semibold mb-4 text-foreground">
            Admin Login
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Email</label>
              <input
                type="email"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Password</label>
              <input
                type="password"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button
              type="submit"
              className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-display font-semibold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
        >
          Logout
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        {/* Quests Manager */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-display font-semibold">Quests</h2>
            <span className="text-xs text-muted-foreground">
              Total: {quests.length}
            </span>
          </div>
          {questsLoading ? (
            <p className="text-sm text-muted-foreground">Loading quests...</p>
          ) : questsError ? (
            <p className="text-sm text-destructive">{questsError}</p>
          ) : (
            <div className="space-y-2 mb-6">
              {quests.map((q) => (
                <div
                  key={q.id}
                  className="flex flex-wrap items-center gap-3 rounded-xl border border-border px-4 py-3 bg-card"
                >
                  <div className="flex-1 min-w-[180px]">
                    <p className="text-sm font-display font-semibold truncate">
                      {q.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {q.category} · {q.reward_bp} BP
                      {q.ramadan_day != null && ` · Day ${q.ramadan_day}`}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      toggleQuestActive(q.id, !q.is_active)
                    }
                    className={`text-xs font-medium px-2 py-1 rounded-full border ${
                      q.is_active
                        ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                        : "bg-muted border-border text-muted-foreground"
                    }`}
                  >
                    {q.is_active ? "Active" : "Inactive"}
                  </button>
                </div>
              ))}
              {quests.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No quests found.
                </p>
              )}
            </div>
          )}

          {/* Add Quest Form */}
          <div className="rounded-xl border border-dashed border-border p-4 bg-card/40">
            <h3 className="text-sm font-display font-semibold mb-3">
              Add Quest
            </h3>
            <QuestForm onSubmit={addQuest} />
          </div>
        </section>

        {/* Videos Manager */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-display font-semibold">Videos</h2>
            <span className="text-xs text-muted-foreground">
              Total: {videos.length}
            </span>
          </div>
          {videosLoading ? (
            <p className="text-sm text-muted-foreground">Loading videos...</p>
          ) : videosError ? (
            <p className="text-sm text-destructive">{videosError}</p>
          ) : (
            <div className="space-y-2 mb-6">
              {videos.map((v) => (
                <div
                  key={v.id}
                  className="flex flex-wrap items-center gap-3 rounded-xl border border-border px-4 py-3 bg-card"
                >
                  <div className="flex-1 min-w-[180px]">
                    <p className="text-sm font-display font-semibold truncate">
                      {v.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      YouTube: {v.youtube_id} · {v.reward_bp} BP
                      {v.duration && ` · ${v.duration}`}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      toggleVideoActive(v.id, !v.is_active)
                    }
                    className={`text-xs font-medium px-2 py-1 rounded-full border ${
                      v.is_active
                        ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                        : "bg-muted border-border text-muted-foreground"
                    }`}
                  >
                    {v.is_active ? "Active" : "Inactive"}
                  </button>
                </div>
              ))}
              {videos.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No videos found.
                </p>
              )}
            </div>
          )}

          {/* Add Video Form */}
          <div className="rounded-xl border border-dashed border-border p-4 bg-card/40">
            <h3 className="text-sm font-display font-semibold mb-3">
              Add Video
            </h3>
            <VideoForm onSubmit={addVideo} />
          </div>
        </section>
      </main>
    </div>
  );
};

interface QuestFormValues {
  title: string;
  category: "spiritual" | "mental" | "physical";
  reward_bp: number;
  ramadan_day: number | null;
}

const QuestForm = ({ onSubmit }: { onSubmit: (values: QuestFormValues) => Promise<void> }) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<"spiritual" | "mental" | "physical">("spiritual");
  const [reward, setReward] = useState(10);
  const [day, setDay] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit({
        title,
        category,
        reward_bp: reward,
        ramadan_day: day ? Number(day) : null,
      });
      setTitle("");
      setReward(10);
      setDay("");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
      <div className="space-y-1 md:col-span-2">
        <label className="text-xs font-medium text-foreground">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary"
          placeholder="Quest title"
          required
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-foreground">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as QuestFormValues["category"])}
          className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="spiritual">Spiritual</option>
          <option value="mental">Mental</option>
          <option value="physical">Physical</option>
        </select>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-foreground">Reward BP</label>
        <input
          type="number"
          value={reward}
          onChange={(e) => setReward(Number(e.target.value))}
          className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary"
          min={1}
          required
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-foreground">Ramadan Day (optional)</label>
        <input
          type="number"
          value={day}
          onChange={(e) => setDay(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary"
          min={1}
          max={30}
        />
      </div>
      <button
        type="submit"
        className="md:col-span-4 inline-flex justify-center rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60"
        disabled={saving}
      >
        {saving ? "Saving..." : "Add Quest"}
      </button>
    </form>
  );
};

interface VideoFormValues {
  title: string;
  youtube_id: string;
  reward_bp: number;
  duration: string | null;
}

const VideoForm = ({ onSubmit }: { onSubmit: (values: VideoFormValues) => Promise<void> }) => {
  const [title, setTitle] = useState("");
  const [youtubeId, setYoutubeId] = useState("");
  const [reward, setReward] = useState(10);
  const [duration, setDuration] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit({
        title,
        youtube_id: youtubeId,
        reward_bp: reward,
        duration: duration || null,
      });
      setTitle("");
      setYoutubeId("");
      setReward(10);
      setDuration("");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
      <div className="space-y-1 md:col-span-2">
        <label className="text-xs font-medium text-foreground">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary"
          placeholder="Video title"
          required
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-foreground">YouTube ID</label>
        <input
          value={youtubeId}
          onChange={(e) => setYoutubeId(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary"
          placeholder="dQw4w9WgXcQ"
          required
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-foreground">Reward BP</label>
        <input
          type="number"
          value={reward}
          onChange={(e) => setReward(Number(e.target.value))}
          className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary"
          min={1}
          required
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-foreground">Duration (e.g. 7:30)</label>
        <input
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary"
          placeholder="7:30"
        />
      </div>
      <button
        type="submit"
        className="md:col-span-4 inline-flex justify-center rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60"
        disabled={saving}
      >
        {saving ? "Saving..." : "Add Video"}
      </button>
    </form>
  );
};

export default Admin;

