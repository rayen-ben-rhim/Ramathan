import { CheckCircle2, Play } from "lucide-react";
import { useTranslation } from "react-i18next";

interface VideoCardProps {
  id: string;
  title: string;
  duration: string | null;
  reward: number;
  youtubeId: string;
  completed: boolean;
  onToggle: (id: string, reward: number, isNowCompleted: boolean) => void;
  thumbnail?: string;
  delay?: number;
}

const VideoCard = ({
  id,
  title,
  duration,
  reward,
  youtubeId,
  completed,
  onToggle,
  thumbnail,
  delay = 0,
}: VideoCardProps) => {
  const { t } = useTranslation();
  const handleClick = () => {
    const isNowCompleted = !completed;
    onToggle(id, reward, isNowCompleted);
    // Open YouTube in a new tab so the user can actually watch the reminder
    window.open(`https://www.youtube.com/watch?v=${youtubeId}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      onClick={handleClick}
      className={`rounded-2xl border bg-card shadow-sm overflow-hidden transition-shadow duration-300 animate-fade-in-up cursor-pointer group ${
        completed ? "border-primary/60 shadow-md" : "border-border/50 hover:shadow-md"
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className="relative aspect-video bg-muted bg-cover bg-center flex items-center justify-center"
        style={thumbnail ? { backgroundImage: `url(${thumbnail})` } : undefined}
      >
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
        <div className="relative z-10 w-12 h-12 rounded-full bg-card/90 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
          {completed ? (
            <CheckCircle2 className="w-5 h-5 text-primary" />
          ) : (
            <Play className="w-5 h-5 text-primary ml-0.5" />
          )}
        </div>
        <span className="absolute bottom-2 right-2 z-10 text-xs bg-foreground/80 text-primary-foreground px-2 py-0.5 rounded-md font-body">
          {duration ?? ""}
        </span>
      </div>
      <div className="p-4">
        <h4 className="font-display text-sm font-semibold text-foreground leading-snug">{title}</h4>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-xs text-primary font-medium inline-block">+{reward} {t("videoCard.barakah")}</span>
          {completed && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
              {t("videoCard.watched")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
