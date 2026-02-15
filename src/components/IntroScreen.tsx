import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Check, Flame, ListChecks, PlayCircle, Trophy } from "lucide-react";

const SLIDE_COUNT = 5;

const IntroScreen = ({ onComplete }: { onComplete: () => void }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < SLIDE_COUNT - 1) {
      setStep((s) => s + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const isLast = step === SLIDE_COUNT - 1;

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center px-4 py-8 overflow-auto">
      <div className="absolute top-4 end-4">
        <button
          type="button"
          onClick={handleSkip}
          className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
        >
          {t("intro.skip")}
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md">
        {step === 0 && (
          <div className="text-center animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/15 border border-primary/20 mb-6">
              <span className="text-4xl">🌙</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
              {t("intro.welcome")}
            </h1>
            <p className="text-muted-foreground font-body text-base mt-3">
              {t("intro.welcomeSubtitle")}
            </p>
          </div>
        )}

        {step === 1 && (
          <div className="text-center animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800 mb-6">
              <ListChecks className="w-8 h-8 text-violet-600 dark:text-violet-400" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground">
              {t("intro.slide1Title")}
            </h2>
            <p className="text-muted-foreground font-body text-sm sm:text-base mt-3 leading-relaxed">
              {t("intro.slide1Description")}
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="text-center animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/15 border border-primary/20 mb-6">
              <Flame className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground">
              {t("intro.slide2Title")}
            </h2>
            <p className="text-muted-foreground font-body text-sm sm:text-base mt-3 leading-relaxed">
              {t("intro.slide2Description")}
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="text-center animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gold/20 border border-gold/30 mb-6">
              <PlayCircle className="w-8 h-8 text-gold" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground">
              {t("intro.slide3Title")}
            </h2>
            <p className="text-muted-foreground font-body text-sm sm:text-base mt-3 leading-relaxed">
              {t("intro.slide3Description")}
            </p>
          </div>
        )}

        {step === 4 && (
          <div className="text-center animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/20 border border-accent/30 mb-6">
              <Trophy className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground">
              {t("intro.slide4Title")}
            </h2>
            <p className="text-muted-foreground font-body text-sm sm:text-base mt-3 leading-relaxed">
              {t("intro.slide4Description")}
            </p>
          </div>
        )}
      </div>

      <div className="w-full max-w-md mt-8 space-y-4">
        <div className="flex justify-center gap-2">
          {Array.from({ length: SLIDE_COUNT }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === step
                  ? "w-6 bg-primary"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              onClick={() => setStep(i)}
            />
          ))}
        </div>
        <Button
          size="lg"
          onClick={handleNext}
          className="w-full rounded-xl gap-2"
        >
          {isLast ? (
            <>
              <Check className="w-4 h-4" />
              {t("intro.getStarted")}
            </>
          ) : (
            t("intro.next")
          )}
        </Button>
      </div>
    </div>
  );
};

export default IntroScreen;
