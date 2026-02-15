import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import IntroScreen from "@/components/IntroScreen";

interface IntroGateProps {
  children: React.ReactNode;
}

const IntroGate = ({ children }: IntroGateProps) => {
  const { user, profile, loading, refreshProfile } = useAuth();
  const [completing, setCompleting] = useState(false);

  const handleIntroComplete = async () => {
    if (!user?.id || completing) return;
    setCompleting(true);
    try {
      await supabase
        .from("profiles")
        .update({ has_completed_intro: true })
        .eq("id", user.id);
      await refreshProfile();
    } catch (e) {
      console.error("Failed to set has_completed_intro:", e);
    } finally {
      setCompleting(false);
    }
  };

  if (loading || !user) {
    return <>{children}</>;
  }

  if (profile && profile.has_completed_intro === false) {
    // First-time user: show intro until they complete or skip
    return (
      <IntroScreen
        onComplete={handleIntroComplete}
      />
    );
  }

  return <>{children}</>;
};

export default IntroGate;
