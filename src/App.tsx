import { useEffect, useRef, useState } from "react";
import { Check, Plus } from "lucide-react";
import { GalleryModal } from "./components/GalleryModal";
import { GameStage } from "./components/GameStage";
import { RecordModal } from "./components/RecordModal";
import { ShopModal } from "./components/ShopModal";
import { SideNav } from "./components/SideNav";
import { TaskCreatePage } from "./components/TaskCreatePage";
import { TaskPanel } from "./components/TaskPanel";
import { TopBar } from "./components/TopBar";
import { PetAvatar } from "./components/StoryIllustrations";
import type { Task } from "./store/useDoneTownStore";
import { useDoneTownStore } from "./store/useDoneTownStore";

function App() {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [mobileView, setMobileView] = useState<"tasks" | "island">("tasks");
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isTaskCreatorOpen, setIsTaskCreatorOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const noticeTimerRef = useRef<number | null>(null);
  const mobilePagerRef = useRef<HTMLDivElement | null>(null);
  const completeTask = useDoneTownStore((state) => state.completeTask);
  const addRecord = useDoneTownStore((state) => state.addRecord);
  const addMemoryFragments = useDoneTownStore(
    (state) => state.addMemoryFragments,
  );
  const petLevel = useDoneTownStore((state) => state.pet.level);

  useEffect(() => {
    const resetPagerForDesktop = () => {
      if (window.innerWidth >= 1024 && mobilePagerRef.current) {
        mobilePagerRef.current.scrollTo({ left: 0 });
        setMobileView("tasks");
      }
    };

    resetPagerForDesktop();
    window.addEventListener("resize", resetPagerForDesktop);

    return () => {
      window.removeEventListener("resize", resetPagerForDesktop);

      if (noticeTimerRef.current) {
        window.clearTimeout(noticeTimerRef.current);
      }
    };
  }, []);

  const showNotice = (message: string) => {
    setNotice(message);

    if (noticeTimerRef.current) {
      window.clearTimeout(noticeTimerRef.current);
    }

    noticeTimerRef.current = window.setTimeout(() => {
      setNotice("");
    }, 2400);
  };

  const handleQuickCheckIn = (task: Task) => {
    completeTask(task.id);
    setActiveTask(null);
    showNotice(
      `${"\u5feb\u6377\u6253\u5361\u5b8c\u6210\uff0c\u83b7\u5f97"} ${task.reward.coins} ${"\u661f\u5e01"}`,
    );
  };

  const handleDeepRecord = (task: Task, content: string) => {
    addRecord({
      taskTitle: task.title,
      category: task.category,
      content,
    });
    addMemoryFragments(1);
    completeTask(task.id, { coinMultiplier: 2 });
    setActiveTask(null);
    showNotice(
      `${"\u83b7\u5f97\u8bb0\u5fc6\u788e\u7247\uff0c\u5e76\u83b7\u5f97\u53cc\u500d\u91d1\u5e01\u5956\u52b1"} +${
        task.reward.coins * 2
      }`,
    );
  };

  const scrollToMobileView = (view: "tasks" | "island") => {
    setMobileView(view);

    const pager = mobilePagerRef.current;

    if (!pager) {
      return;
    }

    pager.scrollTo({
      left: view === "tasks" ? 0 : pager.clientWidth,
      behavior: "smooth",
    });
  };

  const handleMobileScroll = () => {
    const pager = mobilePagerRef.current;

    if (!pager || pager.clientWidth === 0) {
      return;
    }

    const nextView =
      Math.round(pager.scrollLeft / pager.clientWidth) === 0
        ? "tasks"
        : "island";

    setMobileView((currentView) =>
      currentView === nextView ? currentView : nextView,
    );
  };

  const handleTaskCreated = () => {
    setIsTaskCreatorOpen(false);
    showNotice("\u4efb\u52a1\u5df2\u6dfb\u52a0");
  };

  return (
    <main className="dt-app-shell flex h-dvh w-screen flex-col overflow-hidden text-[var(--dt-ink)]">
      <TopBar
        onOpenGallery={() => setIsGalleryOpen(true)}
        onOpenShop={() => setIsShopOpen(true)}
      />

      <div
        className="scrollbar-none flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-smooth lg:snap-none lg:overflow-hidden"
        onScroll={handleMobileScroll}
        ref={mobilePagerRef}
      >
        <SideNav
          className="hidden lg:flex"
          onOpenGallery={() => setIsGalleryOpen(true)}
          onOpenShop={() => setIsShopOpen(true)}
        />
        <TaskPanel
          className="w-full shrink-0 snap-start border-r-0 lg:w-80 lg:flex-none lg:border-r-2 lg:border-white/50 xl:w-96"
          onRequestComplete={setActiveTask}
        />
        <GameStage
          className="w-full shrink-0 snap-start lg:w-auto lg:min-w-0 lg:flex-1 lg:shrink"
          onNotify={showNotice}
        />
      </div>

      <div className="fixed bottom-3 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full border-2 border-white/70 bg-[rgba(255,253,247,0.74)] p-1 shadow-[0_14px_30px_rgba(111,70,33,0.16)] backdrop-blur lg:hidden">
        <button
          aria-label={"\u5207\u6362\u5230\u4eca\u65e5\u4efb\u52a1"}
          className={[
            "dt-squish flex h-11 w-11 items-center justify-center rounded-full border-2 transition",
            mobileView === "tasks"
              ? "border-[#8a5137] bg-[#ffb17f] text-[#4b2719] shadow-[0_6px_0_rgba(182,90,48,0.25)]"
              : "border-white/80 bg-white/75 text-[var(--dt-muted)]",
          ].join(" ")}
          onClick={() => scrollToMobileView("tasks")}
          type="button"
        >
          <Check className="h-4.5 w-4.5" />
        </button>
        <button
          aria-label={"\u5207\u6362\u5230 DoneTown"}
          className={[
            "dt-squish flex h-11 w-11 items-center justify-center rounded-full border-2 transition",
            mobileView === "island"
              ? "border-[#3f7a4a] bg-[#9bdc86] text-[#24442a] shadow-[0_6px_0_rgba(79,155,98,0.25)]"
              : "border-white/80 bg-white/75 text-[var(--dt-muted)]",
          ].join(" ")}
          onClick={() => scrollToMobileView("island")}
          type="button"
        >
          <PetAvatar animated={false} className="h-8 w-8" level={petLevel} />
        </button>
      </div>

      {!isTaskCreatorOpen && (
        <button
          aria-label={"\u6253\u5f00\u4efb\u52a1\u6dfb\u52a0\u9875\u9762"}
          className="dt-primary-button dt-focus fixed bottom-20 right-5 z-40 flex h-14 w-14 items-center justify-center p-0 lg:bottom-8"
          onClick={() => setIsTaskCreatorOpen(true)}
          type="button"
        >
          <Plus className="h-7 w-7" />
        </button>
      )}

      {notice && (
        <div className="pointer-events-none fixed left-1/2 top-24 z-[60] -translate-x-1/2 rounded-full border-2 border-white/75 bg-[#fffbeb] px-4 py-2 text-sm font-extrabold text-[var(--dt-ink)] shadow-[0_14px_30px_rgba(111,70,33,0.16)] dt-pop-in">
          {notice}
        </div>
      )}

      <RecordModal
        onClose={() => setActiveTask(null)}
        onDeepRecord={handleDeepRecord}
        onQuickCheckIn={handleQuickCheckIn}
        task={activeTask}
      />
      <ShopModal
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        onNotify={showNotice}
      />
      <GalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
      />
      <TaskCreatePage
        isOpen={isTaskCreatorOpen}
        onClose={() => setIsTaskCreatorOpen(false)}
        onTaskCreated={handleTaskCreated}
      />
    </main>
  );
}

export default App;
