import { useEffect, useRef } from "react";
import { Menu, Flame } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";

interface NavbarProps {
  onMenuToggle: () => void;
}

const Navbar = ({ onMenuToggle }: NavbarProps) => {
  const { profile, user } = useAuth();
  const { toast } = useToast();
  const prevLongestRef = useRef<number | null>(null);

  const displayName =
    profile?.display_name ??
    user?.user_metadata?.full_name ??
    user?.user_metadata?.name ??
    user?.email?.split("@")[0] ??
    "User";
  const initial = displayName.charAt(0).toUpperCase();
  const avatarUrl = profile?.avatar_url ?? user?.user_metadata?.avatar_url ?? null;
  const maqam = profile?.current_maqam ?? "Ṣābir";
  const level = profile?.current_level ?? 9;
  const streak = profile?.current_streak ?? 0;

  // Toast when the user reaches a new longest streak record
  useEffect(() => {
    const longest = profile?.longest_streak ?? 0;
    const prevLongest = prevLongestRef.current;

    if (prevLongest !== null && longest > prevLongest) {
      toast({
        title: "New streak record!",
        description: `You have reached a ${longest}-day streak. Keep it up!`,
      });
    }

    if (prevLongest !== longest) {
      prevLongestRef.current = longest;
    }
  }, [profile?.longest_streak, toast]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border/50 bg-card/80 backdrop-blur-md">
      <div className="h-full max-w-6xl mx-auto px-4 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <span className="text-xl">🌙</span>
          <span className="text-xl font-display font-semibold text-foreground tracking-wide">
            Ramathani
          </span>
        </div>

        {/* Center: User Status */}
        <div className="hidden sm:flex items-center gap-4">
          <Avatar className="w-9 h-9 border-2 border-primary/30">
            <AvatarImage src={avatarUrl ?? undefined} alt={displayName} />
            <AvatarFallback className="bg-primary/15 text-primary text-sm font-display font-semibold">
              {initial}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center">
            <span className="text-sm font-display font-medium text-foreground">{maqam}</span>
            <span className="text-xs text-muted-foreground">Maqām {level}</span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20">
            <Flame className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs font-medium text-accent-foreground">{streak}</span>
          </div>
        </div>

        {/* Right: Menu */}
        <button
          onClick={onMenuToggle}
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-muted transition-colors"
        >
          <Menu className="w-5 h-5 text-foreground" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
