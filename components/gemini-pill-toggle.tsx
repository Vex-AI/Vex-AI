import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const GeminiPillToggle = () => {
  const navigate = useNavigate();
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("geminiEnabled");
    setIsEnabled(saved === "true");

    const handleStorageChange = () => {
      setIsEnabled(localStorage.getItem("geminiEnabled") === "true");
    };
    
    window.addEventListener("storage", handleStorageChange);
    const observer = setInterval(handleStorageChange, 1000);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(observer);
    };
  }, []);

  const handleToggle = () => {
    const newState = !isEnabled;
    if (newState) {
      const key = localStorage.getItem("geminiApiKey");
      if (!key) {
        toast.error("API Key not found", {
          description: "Please configure your Gemini API Key in Settings first.",
          action: {
            label: "Settings",
            onClick: () => navigate("/settings")
          }
        });
        return; // Prevent turning on
      }
    }
    
    setIsEnabled(newState);
    localStorage.setItem("geminiEnabled", newState.toString());
  };

  return (
    <Button 
      variant="ghost" 
      onClick={handleToggle}
      className={cn(
        "h-8 rounded-full text-xs px-3 gap-1.5 transition-all flex",
        isEnabled 
          ? "bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/30" 
          : "bg-transparent hover:bg-white/10 text-zinc-400 hover:text-zinc-300 border border-white/5"
      )}
    >
      <Sparkles className={cn("size-3", isEnabled ? "text-indigo-400" : "text-zinc-500")} />
      Gemini API
    </Button>
  );
};
