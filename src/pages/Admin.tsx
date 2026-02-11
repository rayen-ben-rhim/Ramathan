import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "@/components/ui/use-toast";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useAdminQuests } from "@/hooks/useAdminQuests";
import { useAdminVideos } from "@/hooks/useAdminVideos";

const ADMIN_EMAIL = "admin@ramathani.app";
const ADMIN_PASSWORD = "ramathani-admin-2025";

// Icons as components
const ShieldIcon = () => (
  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const QuestsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const VideosIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const Admin = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"quests" | "videos">("quests");
  const [showQuestForm, setShowQuestForm] = useState(false);
  const [showVideoForm, setShowVideoForm] = useState(false);

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
        title: t("admin.welcomeBack"),
        description: t("admin.adminEnabled"),
      });
    } else {
      setError(t("admin.invalidCredentials"));
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

  // Calculate stats
  const activeQuests = quests.filter((q) => q.is_active).length;
  const activeVideos = videos.filter((v) => v.is_active).length;
  const totalBP = quests.reduce((sum, q) => sum + q.reward_bp, 0) + videos.reduce((sum, v) => sum + v.reward_bp, 0);

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-sage-light/30 p-4">
        <div className="absolute inset-0 grid-texture opacity-30" />
        <div className="relative w-full max-w-md">
          {/* Decorative elements */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gold/10 rounded-full blur-3xl" />
          
          <div className="relative rounded-3xl border border-border/50 bg-card/80 backdrop-blur-sm p-8 shadow-xl">
            {/* Header */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-4 shadow-lg">
                <ShieldIcon />
              </div>
              <h1 className="text-2xl font-display font-semibold text-foreground">
                {t("admin.login")}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Ramathani Admin Portal
              </p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {t("admin.email")}
                </label>
                <input
                  type="email"
                  className="w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-muted-foreground/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  {t("admin.password")}
                </label>
                <input
                  type="password"
                  className="w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-muted-foreground/50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              
              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-xl">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-primary to-primary/90 px-4 py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-all duration-200 shadow-lg shadow-primary/20"
              >
                {t("admin.signIn")}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-sage-light/20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-card/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-display font-semibold text-foreground">{t("admin.dashboard")}</h1>
                <p className="text-xs text-muted-foreground">Ramathani Admin</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl border border-border/50 bg-background/50 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
              >
                <LogoutIcon />
                <span className="hidden sm:inline">{t("common.logout")}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-5">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full -mr-10 -mt-10" />
            <div className="relative">
              <div className="flex items-center gap-2 text-primary mb-2">
                <QuestsIcon />
                <span className="text-xs font-medium uppercase tracking-wide">{t("admin.quests")}</span>
              </div>
              <p className="text-3xl font-display font-bold text-foreground">{quests.length}</p>
              <p className="text-xs text-muted-foreground mt-1">{activeQuests} {t("common.active")}</p>
            </div>
          </div>
          
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/20 p-5">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gold/10 rounded-full -mr-10 -mt-10" />
            <div className="relative">
              <div className="flex items-center gap-2 text-gold mb-2">
                <VideosIcon />
                <span className="text-xs font-medium uppercase tracking-wide">{t("admin.videos")}</span>
              </div>
              <p className="text-3xl font-display font-bold text-foreground">{videos.length}</p>
              <p className="text-xs text-muted-foreground mt-1">{activeVideos} {t("common.active")}</p>
            </div>
          </div>
          
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 p-5">
            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full -mr-10 -mt-10" />
            <div className="relative">
              <div className="flex items-center gap-2 text-emerald-600 mb-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs font-medium uppercase tracking-wide">{t("common.active")}</span>
              </div>
              <p className="text-3xl font-display font-bold text-foreground">{activeQuests + activeVideos}</p>
              <p className="text-xs text-muted-foreground mt-1">{t("common.total")} {t("common.active")}</p>
            </div>
          </div>
          
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20 p-5">
            <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full -mr-10 -mt-10" />
            <div className="relative">
              <div className="flex items-center gap-2 text-amber-600 mb-2">
                <StarIcon />
                <span className="text-xs font-medium uppercase tracking-wide">{t("common.bp")}</span>
              </div>
              <p className="text-3xl font-display font-bold text-foreground">{totalBP}</p>
              <p className="text-xs text-muted-foreground mt-1">{t("common.total")} {t("common.bp")}</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mb-6 p-1 bg-muted/50 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab("quests")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === "quests"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <QuestsIcon />
            {t("admin.quests")}
            <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
              activeTab === "quests" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            }`}>
              {quests.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("videos")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === "videos"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <VideosIcon />
            {t("admin.videos")}
            <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
              activeTab === "videos" ? "bg-gold/10 text-gold" : "bg-muted text-muted-foreground"
            }`}>
              {videos.length}
            </span>
          </button>
        </div>

        {/* Quests Section */}
        {activeTab === "quests" && (
          <section className="animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-display font-semibold text-foreground">{t("admin.quests")}</h2>
                <p className="text-sm text-muted-foreground mt-1">Manage your daily quests and challenges</p>
              </div>
              <button
                onClick={() => setShowQuestForm(!showQuestForm)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  showQuestForm
                    ? "bg-muted text-muted-foreground"
                    : "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-90"
                }`}
              >
                <PlusIcon />
                {showQuestForm ? "Cancel" : t("admin.addQuest")}
              </button>
            </div>

            {/* Add Quest Form */}
            {showQuestForm && (
              <div className="mb-6 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-6 animate-fade-in-up">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <PlusIcon />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground">{t("admin.addQuest")}</h3>
                    <p className="text-xs text-muted-foreground">Create a new quest for users</p>
                  </div>
                </div>
                <QuestForm onSubmit={async (values) => {
                  await addQuest(values);
                  setShowQuestForm(false);
                }} />
              </div>
            )}

            {questsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
              </div>
            ) : questsError ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="text-sm text-destructive">{questsError}</p>
              </div>
            ) : quests.length === 0 ? (
              <div className="text-center py-12 rounded-2xl border-2 border-dashed border-border bg-card/30">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                  <QuestsIcon />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-1">{t("admin.noQuests")}</h3>
                <p className="text-sm text-muted-foreground mb-4">Get started by adding your first quest</p>
                <button
                  onClick={() => setShowQuestForm(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
                >
                  <PlusIcon />
                  {t("admin.addQuest")}
                </button>
              </div>
            ) : (
              <div className="grid gap-3">
                {quests.map((q, index) => (
                  <div
                    key={q.id}
                    className="group relative flex flex-wrap items-center gap-4 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm px-5 py-4 hover:bg-card hover:shadow-lg hover:border-border transition-all duration-200"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Category indicator */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      q.category === "spiritual" ? "bg-violet-100 text-violet-600" :
                      q.category === "mental" ? "bg-blue-100 text-blue-600" :
                      "bg-orange-100 text-orange-600"
                    }`}>
                      {q.category === "spiritual" ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      ) : q.category === "mental" ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-[200px]">
                      <p className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                        {q.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                          q.category === "spiritual" ? "bg-violet-100 text-violet-700" :
                          q.category === "mental" ? "bg-blue-100 text-blue-700" :
                          "bg-orange-100 text-orange-700"
                        }`}>
                          {t(`common.${q.category}`)}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                          <StarIcon />
                          {q.reward_bp} {t("common.bp")}
                        </span>
                        {q.ramadan_day != null && (
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            {t("common.day")} {q.ramadan_day}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => toggleQuestActive(q.id, !q.is_active)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                        q.is_active
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {q.is_active ? t("common.active") : t("common.inactive")}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Videos Section */}
        {activeTab === "videos" && (
          <section className="animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-display font-semibold text-foreground">{t("admin.videos")}</h2>
                <p className="text-sm text-muted-foreground mt-1">Manage educational and spiritual videos</p>
              </div>
              <button
                onClick={() => setShowVideoForm(!showVideoForm)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  showVideoForm
                    ? "bg-muted text-muted-foreground"
                    : "bg-gold text-accent-foreground shadow-lg shadow-gold/20 hover:opacity-90"
                }`}
              >
                <PlusIcon />
                {showVideoForm ? "Cancel" : t("admin.addVideo")}
              </button>
            </div>

            {/* Add Video Form */}
            {showVideoForm && (
              <div className="mb-6 rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/5 to-transparent p-6 animate-fade-in-up">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                    <PlusIcon />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground">{t("admin.addVideo")}</h3>
                    <p className="text-xs text-muted-foreground">Add a new YouTube video</p>
                  </div>
                </div>
                <VideoForm onSubmit={async (values) => {
                  await addVideo(values);
                  setShowVideoForm(false);
                }} />
              </div>
            )}

            {videosLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
              </div>
            ) : videosError ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="text-sm text-destructive">{videosError}</p>
              </div>
            ) : videos.length === 0 ? (
              <div className="text-center py-12 rounded-2xl border-2 border-dashed border-border bg-card/30">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                  <VideosIcon />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-1">{t("admin.noVideos")}</h3>
                <p className="text-sm text-muted-foreground mb-4">Get started by adding your first video</p>
                <button
                  onClick={() => setShowVideoForm(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gold text-accent-foreground text-sm font-medium"
                >
                  <PlusIcon />
                  {t("admin.addVideo")}
                </button>
              </div>
            ) : (
              <div className="grid gap-3">
                {videos.map((v, index) => (
                  <div
                    key={v.id}
                    className="group relative flex flex-wrap items-center gap-4 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm px-5 py-4 hover:bg-card hover:shadow-lg hover:border-border transition-all duration-200"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Video thumbnail placeholder */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                      </svg>
                    </div>
                    
                    <div className="flex-1 min-w-[200px]">
                      <p className="font-display font-semibold text-foreground group-hover:text-gold transition-colors">
                        {v.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-mono">
                          {v.youtube_id}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                          <StarIcon />
                          {v.reward_bp} {t("common.bp")}
                        </span>
                        {v.duration && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {v.duration}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => toggleVideoActive(v.id, !v.is_active)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                        v.is_active
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {v.is_active ? t("common.active") : t("common.inactive")}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
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
  const { t } = useTranslation();
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {t("common.title")}
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-muted-foreground/50"
            placeholder={t("admin.questTitle")}
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            {t("common.category")}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["spiritual", "mental", "physical"] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                  category === cat
                    ? cat === "spiritual" ? "bg-violet-100 text-violet-700 border-2 border-violet-300" :
                      cat === "mental" ? "bg-blue-100 text-blue-700 border-2 border-blue-300" :
                      "bg-orange-100 text-orange-700 border-2 border-orange-300"
                    : "bg-muted text-muted-foreground border-2 border-transparent hover:bg-muted/80"
                }`}
              >
                {t(`common.${cat}`)}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <StarIcon />
              {t("common.rewardBp")}
            </label>
            <input
              type="number"
              value={reward}
              onChange={(e) => setReward(Number(e.target.value))}
              className="w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-primary focus:border-primary"
              min={1}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {t("admin.ramadanDayOptional")}
            </label>
            <input
              type="number"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-primary focus:border-primary"
              min={1}
              max={30}
              placeholder="1-30"
            />
          </div>
        </div>
      </div>
      
      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/90 px-4 py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-all duration-200 shadow-lg shadow-primary/20 disabled:opacity-60"
        disabled={saving}
      >
        {saving ? (
          <>
            <div className="w-4 h-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin" />
            {t("common.saving")}
          </>
        ) : (
          <>
            <PlusIcon />
            {t("admin.addQuest")}
          </>
        )}
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
  const { t } = useTranslation();
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {t("common.title")}
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-gold focus:border-gold placeholder:text-muted-foreground/50"
            placeholder={t("admin.videoTitle")}
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
            </svg>
            {t("admin.youtubeId")}
          </label>
          <input
            value={youtubeId}
            onChange={(e) => setYoutubeId(e.target.value)}
            className="w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm font-mono outline-none transition-all duration-200 focus:ring-2 focus:ring-gold focus:border-gold placeholder:text-muted-foreground/50"
            placeholder="dQw4w9WgXcQ"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <StarIcon />
            {t("common.rewardBp")}
          </label>
          <input
            type="number"
            value={reward}
            onChange={(e) => setReward(Number(e.target.value))}
            className="w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-gold focus:border-gold"
            min={1}
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {t("admin.duration")}
          </label>
          <input
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-gold focus:border-gold placeholder:text-muted-foreground/50"
            placeholder={t("admin.durationPlaceholder")}
          />
        </div>
      </div>
      
      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold to-gold/90 px-4 py-3.5 text-sm font-semibold text-accent-foreground hover:opacity-90 transition-all duration-200 shadow-lg shadow-gold/20 disabled:opacity-60"
        disabled={saving}
      >
        {saving ? (
          <>
            <div className="w-4 h-4 border-2 border-accent-foreground/20 border-t-accent-foreground rounded-full animate-spin" />
            {t("common.saving")}
          </>
        ) : (
          <>
            <PlusIcon />
            {t("admin.addVideo")}
          </>
        )}
      </button>
    </form>
  );
};

export default Admin;

