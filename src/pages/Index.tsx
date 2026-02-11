import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import SideMenu from "@/components/SideMenu";
import QuestCard from "@/components/QuestCard";
import ProgressRing from "@/components/ProgressRing";
import VideoCard from "@/components/VideoCard";
import heroPattern from "@/assets/hero-pattern.jpg";
import { useAuth } from "@/contexts/AuthContext";
import { useQuests } from "@/hooks/useQuests";
import type { QuestItem } from "@/components/QuestCard";
import { useToast } from "@/components/ui/use-toast";
import { useVideos } from "@/hooks/useVideos";

const BP_PER_LEVEL = 500;

const Index = () => {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { profile } = useAuth();
  const { questsByCategory, completedIds, loading: questsLoading, toggleQuest } = useQuests();
  const { videos, completedIds: completedVideoIds, loading: videosLoading, toggleVideo } = useVideos();
  const { toast } = useToast();
  const previousMaqamRef = useRef<string | null>(null);

  const totalBP = profile?.total_bp ?? 0;
  const currentLevel = profile?.current_level ?? 1;
  const maqam = profile?.current_maqam ?? "Ṣābir";

  // Map the current level to the maqām band and next maqām threshold,
  // using the same level bands as the database trigger.
  const getMaqamBand = (level: number) => {
    if (level <= 3) return { startLevel: 1, nextMaqamStartLevel: 4 }; // Ṣābir -> Shākir
    if (level <= 6) return { startLevel: 4, nextMaqamStartLevel: 7 }; // Shākir -> Dhākir
    if (level <= 9) return { startLevel: 7, nextMaqamStartLevel: 10 }; // Dhākir -> Ṣādiq
    if (level <= 12) return { startLevel: 10, nextMaqamStartLevel: 13 }; // Ṣādiq -> Muḥsin
    if (level <= 15) return { startLevel: 13, nextMaqamStartLevel: 16 }; // Muḥsin -> Muqarrab
    return { startLevel: 16, nextMaqamStartLevel: null }; // Highest maqām
  };

  const { startLevel, nextMaqamStartLevel } = getMaqamBand(currentLevel);
  const bandStartBp = (startLevel - 1) * BP_PER_LEVEL;
  const bandEndBp = nextMaqamStartLevel ? (nextMaqamStartLevel - 1) * BP_PER_LEVEL : null;

  const progress =
    bandEndBp !== null && bandEndBp > bandStartBp
      ? Math.min(
          100,
          Math.max(
            0,
            Math.round(((totalBP - bandStartBp) / (bandEndBp - bandStartBp)) * 100)
          )
        )
      : 100;

  const bpToNextMaqam =
    bandEndBp !== null ? Math.max(0, bandEndBp - totalBP) : null;

  // Congratulation toast when the user reaches a new maqām
  useEffect(() => {
    const currentMaqam = profile?.current_maqam ?? null;
    const previousMaqam = previousMaqamRef.current;

    if (currentMaqam && previousMaqam && currentMaqam !== previousMaqam) {
      toast({
        title: t("toast.mabrook"),
        description: t("toast.maqamReached", { maqam: currentMaqam }),
      });
    }

    if (currentMaqam !== previousMaqam) {
      previousMaqamRef.current = currentMaqam;
    }
  }, [profile?.current_maqam, toast, t]);

  const toQuestItems = (q: { id: string; title: string; reward_bp: number }[]): QuestItem[] =>
    q.map(({ id, title, reward_bp }) => ({ id, title, reward: reward_bp }));

  return (
    <div className="min-h-screen bg-background grid-texture">
      <Navbar onMenuToggle={() => setMenuOpen(true)} />
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Hero */}
      <div className="relative pt-16">
        <div
          className="h-48 sm:h-56 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${heroPattern})` }}
        />
        <div className="absolute inset-0 pt-16 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-2 animate-fade-in-up">
            {t("index.todaysQuest")}
          </h1>
          <p className="text-muted-foreground font-body text-sm sm:text-base animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            {t("index.dayOfRamadan", { day: 12 })}
          </p>
        </div>
      </div>

      {/* Progress Summary */}
      <div className="max-w-6xl mx-auto px-4 -mt-6 relative z-10">
        <div
          className="flex flex-col sm:flex-row rtl:sm:flex-row-reverse items-center gap-6 bg-card rounded-2xl border border-border/50 p-6 shadow-sm animate-fade-in-up"
          style={{ animationDelay: "200ms" }}
        >
          <ProgressRing progress={progress} label={`${totalBP}`} sublabel={t("index.barakahPoints")} />
          <div className="flex-1 text-center sm:text-start w-full min-w-0">
            <p className="font-display text-lg font-semibold text-foreground">
              {t("index.maqamOf", { maqam })}
            </p>
            <p className="text-sm text-muted-foreground font-body mt-1">
              {bpToNextMaqam !== null
                ? t("index.bpToNextMaqam", { count: bpToNextMaqam })
                : t("index.highestMaqam")}
            </p>
            <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden max-w-xs mx-auto sm:ms-0 flex rtl:flex-row-reverse">
              <div
                className="h-full rounded-full bg-primary transition-all duration-1000 flex-shrink-0"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quest Grid */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        {questsLoading ? (
          <p className="font-body text-muted-foreground text-center py-8">{t("index.loadingQuests")}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <QuestCard
              category="spiritual"
              title={t("index.spiritualQuest")}
              icon="🕌"
              quests={toQuestItems(questsByCategory.spiritual)}
              completedIds={completedIds}
              onToggle={toggleQuest}
              delay={300}
            />
            <QuestCard
              category="mental"
              title={t("index.mentalQuest")}
              icon="📖"
              quests={toQuestItems(questsByCategory.mental)}
              completedIds={completedIds}
              onToggle={toggleQuest}
              delay={400}
            />
            <QuestCard
              category="physical"
              title={t("index.physicalQuest")}
              icon="🚶"
              quests={toQuestItems(questsByCategory.physical)}
              completedIds={completedIds}
              onToggle={toggleQuest}
              delay={500}
            />
          </div>
        )}
      </div>

      {/* Videos Section */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-display font-semibold text-foreground mb-6 animate-fade-in-up" style={{ animationDelay: "600ms" }}>
          {t("index.todaysReminders")}
        </h2>
        {videosLoading ? (
          <p className="font-body text-muted-foreground text-center py-8">{t("index.loadingReminders")}</p>
        ) : videos.length === 0 ? (
          <p className="font-body text-muted-foreground text-center py-8">
            {t("index.noReminders")}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video, i) => (
              <VideoCard
                key={video.id}
                id={video.id}
                title={video.title}
                duration={video.duration}
                reward={video.reward_bp}
                youtubeId={video.youtube_id}
                thumbnail={`https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`}
                completed={completedVideoIds.has(video.id)}
                onToggle={toggleVideo}
                delay={700 + i * 100}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 text-center">
        <p className="text-sm text-muted-foreground font-body">
          🌙 {t("app.name")} — {t("app.tagline")}
        </p>
      </footer>
    </div>
  );
};

export default Index;
