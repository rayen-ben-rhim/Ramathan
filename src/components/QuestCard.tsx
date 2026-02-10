import { Check } from "lucide-react";

export interface QuestItem {
  id: string;
  title: string;
  reward: number;
}

interface QuestCardProps {
  category: "spiritual" | "mental" | "physical";
  title: string;
  icon: string;
  quests: QuestItem[];
  completedIds: Set<string>;
  onToggle: (questId: string, reward: number, isNowCompleted: boolean) => void;
  delay?: number;
}

const categoryStyles = {
  spiritual: {
    border: "border-primary/20",
    bg: "bg-sage-light/30",
    badge: "bg-primary/10 text-primary",
    check: "bg-primary text-primary-foreground",
  },
  mental: {
    border: "border-accent/30",
    bg: "bg-gold-light/30",
    badge: "bg-accent/10 text-accent-foreground",
    check: "bg-accent text-accent-foreground",
  },
  physical: {
    border: "border-muted-foreground/15",
    bg: "bg-muted/50",
    badge: "bg-muted text-muted-foreground",
    check: "bg-muted-foreground text-card",
  },
};

const QuestCard = ({
  category,
  title,
  icon,
  quests,
  completedIds,
  onToggle,
  delay = 0,
}: QuestCardProps) => {
  const styles = categoryStyles[category];

  const handleClick = (quest: QuestItem) => {
    const done = completedIds.has(quest.id);
    onToggle(quest.id, quest.reward, !done);
  };

  return (
    <div
      className={`rounded-2xl border ${styles.border} ${styles.bg} p-6 shadow-sm backdrop-blur-sm animate-fade-in-up`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-3 mb-5">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-xl font-display font-semibold text-foreground">{title}</h3>
      </div>

      {quests.length === 0 ? (
        <p className="text-sm font-body text-muted-foreground">
          No more quests for today in this path.
        </p>
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
          {quests.map((quest) => {
            const done = completedIds.has(quest.id);
            return (
              <button
                key={quest.id}
                onClick={() => handleClick(quest)}
                className={`w-full flex items-center gap-3 rounded-xl p-3 transition-all duration-300 text-left ${
                  done ? "bg-card/80 shadow-sm animate-soft-glow" : "hover:bg-card/50"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    done ? `${styles.check} border-transparent scale-110` : "border-muted-foreground/30"
                  }`}
                >
                  {done && <Check className="w-3.5 h-3.5" />}
                </div>
                <span
                  className={`flex-1 text-sm font-body transition-all duration-300 ${
                    done ? "text-muted-foreground line-through" : "text-foreground"
                  }`}
                >
                  {quest.title}
                </span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${styles.badge}`}>
                  +{quest.reward} BP
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default QuestCard;
