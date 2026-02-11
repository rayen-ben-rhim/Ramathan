import { useLanguage } from "@/contexts/LanguageContext";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div 
      className="relative flex items-center h-9 p-1 rounded-xl bg-muted/50 border border-border/50 overflow-hidden"
      role="radiogroup"
      aria-label="Select language"
    >
      {/* Sliding background indicator with spring animation */}
      <div
        className={`absolute h-7 w-10 rounded-lg bg-card shadow-md border border-border/30 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          language === "en" ? "left-1" : "left-[calc(50%)]"
        }`}
      />
      
      {/* English option */}
      <button
        onClick={() => setLanguage("en")}
        className="relative z-10 flex items-center justify-center w-10 h-7 rounded-lg"
        role="radio"
        aria-checked={language === "en"}
        aria-label="English"
      >
        <span 
          className={`text-xs font-semibold transition-all duration-300 ${
            language === "en"
              ? "text-foreground scale-110"
              : "text-muted-foreground scale-100 hover:text-foreground/70"
          }`}
        >
          EN
        </span>
      </button>
      
      {/* Arabic option */}
      <button
        onClick={() => setLanguage("ar")}
        className="relative z-10 flex items-center justify-center w-10 h-7 rounded-lg"
        role="radio"
        aria-checked={language === "ar"}
        aria-label="العربية"
      >
        <span 
          className={`text-sm font-semibold transition-all duration-300 ${
            language === "ar"
              ? "text-foreground scale-110"
              : "text-muted-foreground scale-100 hover:text-foreground/70"
          }`}
        >
          ع
        </span>
      </button>
    </div>
  );
}
