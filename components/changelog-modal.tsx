import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { changelogHistory, BugLevel } from "@/lib/changelog";
import packageJson from "../package.json";
import { Bug, Sparkles, Zap } from "lucide-react";
import { useChangelogStore } from "@/store/changelogStore";

const getBugLevelColor = (level: BugLevel) => {
  switch (level) {
    case "Critical": return "bg-red-500/20 text-red-400 border-red-500/30";
    case "High": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    case "Medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "Low": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    default: return "bg-neutral-500/20 text-neutral-400 border-neutral-500/30";
  }
};

export const ChangelogModal = () => {
  const { isOpen, openChangelog, closeChangelog } = useChangelogStore();
  const currentVersion = packageJson.version;
  const latestRelease = changelogHistory[0]; // Assuming array is ordered latest first

  useEffect(() => {
    const lastSeenVersion = localStorage.getItem("vex_last_seen_version");
    if (lastSeenVersion !== currentVersion) {
      openChangelog();
    }
  }, [currentVersion, openChangelog]);

  const handleClose = () => {
    localStorage.setItem("vex_last_seen_version", currentVersion);
    closeChangelog();
  };

  if (!latestRelease) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-xl bg-[#121212] border-white/10 text-white rounded-3xl p-0 overflow-hidden shadow-2xl">
        <div className="bg-[#0a0a0a] border-b border-white/5 p-6 pb-4">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <span className="bg-indigo-500 text-white text-xs px-2.5 py-1 rounded-full uppercase tracking-wider font-bold">
                New Update
              </span>
              v{latestRelease.version}
            </DialogTitle>
            <DialogDescription className="text-neutral-400 mt-1">
              {latestRelease.date} — Check out what's new in this version.
            </DialogDescription>
          </DialogHeader>
        </div>

        <ScrollArea className="max-h-[60vh] px-6">
          <div className="space-y-8 pb-6">
            {/* FEATURES */}
            {latestRelease.features.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold flex items-center gap-2 text-indigo-400 mb-3">
                  <Sparkles className="w-5 h-5" />
                  New Features
                </h3>
                <ul className="space-y-3">
                  {latestRelease.features.map((feat, i) => (
                    <li key={i} className="text-sm text-neutral-300 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
                      {feat}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* IMPROVEMENTS */}
            {latestRelease.improvements.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold flex items-center gap-2 text-emerald-400 mb-3">
                  <Zap className="w-5 h-5" />
                  Improvements
                </h3>
                <ul className="space-y-3">
                  {latestRelease.improvements.map((imp, i) => (
                    <li key={i} className="text-sm text-neutral-300 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
                      {imp}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* BUG FIXES */}
            {latestRelease.fixes.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold flex items-center gap-2 text-rose-400 mb-3">
                  <Bug className="w-5 h-5" />
                  Bug Fixes
                </h3>
                <ul className="space-y-3">
                  {latestRelease.fixes.map((fix, i) => (
                    <li key={i} className="text-sm text-neutral-300 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-start gap-2">
                      <span className={`shrink-0 inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getBugLevelColor(fix.level)}`}>
                        {fix.level}
                      </span>
                      <span className="flex-1">{fix.description}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 pt-2 border-t border-white/5 bg-black/20">
          <Button 
            className="w-full sm:w-auto rounded-xl bg-white text-black hover:bg-neutral-200 font-semibold"
            onClick={handleClose}
          >
            Awesome, let's go!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
