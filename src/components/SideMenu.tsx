import { X, LogOut, Home, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

interface SideMenuProps {
  open: boolean;
  onClose: () => void;
}

const SideMenu = ({ open, onClose }: SideMenuProps) => {
  const { t } = useTranslation();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { icon: Home, label: t("common.home"), to: "/" as const },
    { icon: Users, label: t("pathOfConsistency.title"), to: "/path-of-consistency" as const },
  ];

  const handleLogout = async () => {
    onClose();
    await signOut();
    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-foreground/10 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-80 max-w-[85vw] bg-card border-l border-border shadow-xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-border/50">
          <span className="font-display text-lg font-semibold text-foreground">{t("common.menu")}</span>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-1">
          {menuItems.map((item) =>
            "to" in item ? (
              <Link
                key={item.label}
                to={item.to}
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-muted transition-colors"
              >
                <item.icon className="w-5 h-5 text-muted-foreground" />
                <span className="font-body text-sm font-medium">{item.label}</span>
              </Link>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-muted transition-colors"
              >
                <item.icon className="w-5 h-5 text-muted-foreground" />
                <span className="font-body text-sm font-medium">{item.label}</span>
              </a>
            )
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-body text-sm font-medium">{t("common.logout")}</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default SideMenu;
