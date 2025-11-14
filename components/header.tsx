import { ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

const Header = ({ message }: { message?: string }) => {
  const navigate = useNavigate();
  const go = (path: string) => navigate(path, { replace: true });
  const { t } = useTranslation();
  if (!message) message = t("back");
  return (
    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => go("/home")}
        className="text-neutral-300 hover:text-white"
      >
        <ChevronLeft className="size-5" />
      </Button>

      <h1 className="text-lg font-semibold">{message}</h1>
    </div>
  );
};

export default Header;
