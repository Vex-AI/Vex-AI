import { Skeleton } from "@/components/ui/skeleton";

const ChatLoading = () => {
  return (
    <div className="flex h-screen max-w-screen flex-col bg-background text-foreground">
      {/* Header Skeleton */}
      <header className="fixed top-0 z-50 flex w-full items-center gap-3 border-b border-white/5 bg-background/80 px-4 py-3 backdrop-blur-xl transition-all">
        <Skeleton className="h-10 w-10 rounded-full" /> {/* Avatar */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32" /> {/* Nome */}
          <Skeleton className="h-3 w-20" /> {/* Status */}
        </div>
      </header>

      {/* Messages Skeleton Area */}
      <main className="flex-1 space-y-6 px-3 py-4 pb-20 pt-24">
        {/* Simula algumas mensagens trocadas */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-start">
            <Skeleton className="h-12 w-2/3 rounded-2xl rounded-tl-none" />
          </div>
          <div className="flex justify-end">
            <Skeleton className="h-10 w-1/2 rounded-2xl rounded-tr-none" />
          </div>
          <div className="flex justify-start">
            <Skeleton className="h-16 w-3/4 rounded-2xl rounded-tl-none" />
          </div>
          <div className="flex justify-end">
            <Skeleton className="h-10 w-1/3 rounded-2xl rounded-tr-none" />
          </div>
        </div>
      </main>

      {/* Footer Skeleton */}
      <footer className="fixed bottom-0 left-0 w-full bg-black/20 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-2 p-3">
          <Skeleton className="h-10 flex-1 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </footer>
    </div>
  );
};


export default ChatLoading 