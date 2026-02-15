import { useState } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import SideMenu from "@/components/SideMenu";
import { Flame, Crown, Medal, Award } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLeaderboard, useMyLeaderboardRank } from "@/hooks/useLeaderboard";

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Crown className="w-5 h-5 text-accent" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-muted-foreground" />;
  if (rank === 3) return <Award className="w-5 h-5 text-accent/70" />;
  return <span className="text-sm font-body text-muted-foreground w-5 text-center">{rank}</span>;
};

const PathOfConsistency = () => {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();
  const { entries, loading } = useLeaderboard(10);
  const { rank: myRank, entry: myEntry, loading: myRankLoading } = useMyLeaderboardRank(user?.id);

  const leaderboardData = entries.map((entry, index) => ({
    rank: index + 1,
    name: entry.display_name,
    title: entry.current_maqam ?? t("pathOfConsistency.traveler"),
    level: entry.current_level,
    streak: entry.current_streak,
    bp: entry.total_bp,
  }));

  const topThree = leaderboardData.slice(0, 3);
  const podiumOrder = [topThree[1], topThree[0], topThree[2]].filter(Boolean);

  return (
    <div className="min-h-screen bg-background grid-texture">
      <Navbar onMenuToggle={() => setMenuOpen(true)} />
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="pt-24 pb-16 max-w-3xl mx-auto px-4">
        <div className="text-center mb-10 animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-2">
            {t("pathOfConsistency.title")}
          </h1>
          <p className="text-muted-foreground font-body text-sm sm:text-base">
            {t("pathOfConsistency.subtitle")}
          </p>
        </div>

        {loading ? (
          <p className="text-center text-sm font-body text-muted-foreground animate-fade-in-up" style={{ animationDelay: "150ms" }}>
            {t("pathOfConsistency.loadingLeaderboard")}
          </p>
        ) : leaderboardData.length === 0 ? (
          <p className="text-center text-sm font-body text-muted-foreground animate-fade-in-up" style={{ animationDelay: "150ms" }}>
            {t("pathOfConsistency.noParticipants")}
          </p>
        ) : (
          <>
            {/* Top 3 Podium */}
            <div className="flex items-end justify-center gap-4 mb-10 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
              {podiumOrder.map((user, i) => {
                const heights = ["h-28", "h-36", "h-24"];
                const textSizes = ["text-lg", "text-xl", "text-lg"];
                return (
                  <div key={user.rank} className="flex flex-col items-center gap-2">
                    <div className={`${i === 1 ? "w-[72px] h-[72px]" : "w-14 h-14"} rounded-full bg-primary/15 border-2 border-primary/30 flex items-center justify-center`}>
                      <span className={`${textSizes[i]} font-display font-semibold text-primary`}>
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <span className="text-xs font-body font-medium text-foreground text-center max-w-[80px] truncate">
                      {user.name.split(" ")[0]}
                    </span>
                    <div className={`${heights[i]} w-20 sm:w-24 rounded-t-xl bg-card border border-border/50 flex flex-col items-center justify-center gap-1 shadow-sm`}>
                      {getRankIcon(user.rank)}
                      <span className="text-xs text-muted-foreground font-body">{user.title}</span>
                      <div className="flex items-center gap-1">
                        <Flame className="w-3 h-3 text-accent" />
                        <span className="text-xs font-medium text-accent-foreground">{user.streak}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Top 10 List */}
            <div className="space-y-2">
              {leaderboardData.map((listUser, i) => (
                <div
                  key={listUser.rank}
                  className="flex items-center gap-4 bg-card rounded-xl border border-border/50 px-4 py-3 shadow-sm animate-fade-in-up"
                  style={{ animationDelay: `${250 + i * 50}ms` }}
                >
                  <div className="w-8 flex justify-center">{getRankIcon(listUser.rank)}</div>

                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <span className="text-sm font-display font-semibold text-primary">
                      {listUser.name.charAt(0)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-display text-sm font-semibold text-foreground truncate">{listUser.name}</p>
                    <p className="text-xs text-muted-foreground font-body">
                      {listUser.title} · {t("navbar.maqam")} {listUser.level}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 border border-accent/20 shrink-0">
                    <Flame className="w-3 h-3 text-accent" />
                    <span className="text-xs font-medium text-accent-foreground">{listUser.streak}</span>
                  </div>

                  <div className="text-right shrink-0 hidden sm:block">
                    <span className="text-sm font-display font-semibold text-foreground">{listUser.bp}</span>
                    <span className="text-xs text-muted-foreground font-body ml-1">{t("common.bp")}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Your rank */}
            <div className="mt-10 pt-8 border-t border-border/50 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
              <h2 className="text-lg font-display font-semibold text-foreground mb-4">
                {t("pathOfConsistency.yourRank")}
              </h2>
              {!user ? (
                <p className="text-sm font-body text-muted-foreground">
                  {t("pathOfConsistency.signInToSeeRank")}
                </p>
              ) : myRankLoading ? (
                <p className="text-sm font-body text-muted-foreground">
                  {t("pathOfConsistency.loadingLeaderboard")}
                </p>
              ) : myRank !== null && myEntry ? (
                <>
                  <p className="text-sm font-body text-muted-foreground mb-3">
                    {myEntry.display_name} — {t("pathOfConsistency.rankNumber", { rank: myRank })}
                  </p>
                  <div className="flex items-center gap-4 bg-card rounded-xl border border-primary/30 px-4 py-3 shadow-sm">
                    <div className="w-8 flex justify-center">{getRankIcon(myRank)}</div>
                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <span className="text-sm font-display font-semibold text-primary">
                        {myEntry.display_name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-sm font-semibold text-foreground truncate">{myEntry.display_name}</p>
                      <p className="text-xs text-muted-foreground font-body">
                        {(myEntry.current_maqam ?? t("pathOfConsistency.traveler"))} · {t("navbar.maqam")} {myEntry.current_level}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 border border-accent/20 shrink-0">
                      <Flame className="w-3 h-3 text-accent" />
                      <span className="text-xs font-medium text-accent-foreground">{myEntry.current_streak}</span>
                    </div>
                    <div className="text-right shrink-0 hidden sm:block">
                      <span className="text-sm font-display font-semibold text-foreground">{myEntry.total_bp}</span>
                      <span className="text-xs text-muted-foreground font-body ml-1">{t("common.bp")}</span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm font-body text-muted-foreground">
                  {t("pathOfConsistency.completeQuestToAppear")}
                </p>
              )}
            </div>
          </>
        )}
      </div>

      <footer className="border-t border-border/50 py-8 text-center">
        <p className="text-sm text-muted-foreground font-body">
          🌙 {t("app.name")} — {t("app.tagline")}
        </p>
      </footer>
    </div>
  );
};

export default PathOfConsistency;
