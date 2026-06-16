import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

interface HeaderProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

const Header = ({ title, description, children }: HeaderProps) => {
  const navigate = useNavigate();
  const go = (path: string) => navigate(path, { replace: true });
  const { t } = useTranslation();
  
  const displayTitle = title || t("back");

  return (
    <header className="flex items-center gap-4 px-4 py-5 border-b border-white/5 sticky top-0 bg-[#0d0d0d]/80 backdrop-blur-md z-30">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => go("/home")}
        className="md:hidden text-neutral-300 hover:text-white"
      >
        <ArrowLeft className="w-5 h-5" />
      </Button>

      <div className="flex-1 min-w-0">
        <h1 className="text-xl font-bold tracking-tight truncate">{displayTitle}</h1>
        {description && (
          <p className="text-xs text-neutral-400 mt-0.5 truncate">{description}</p>
        )}
      </div>

      {children && (
        <div className="flex items-center gap-2 shrink-0">
          {children}
        </div>
      )}
    </header>
  );
};

export default Header;
