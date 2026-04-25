import { Hammer, Sparkles } from "lucide-react";
import {
  getHomeBuildCost,
  selectPetExpToNextLevel,
  useDoneTownStore,
} from "../store/useDoneTownStore";

interface GameStageProps {
  onNotify: (message: string) => void;
  className?: string;
}

export function GameStage({ onNotify, className = "" }: GameStageProps) {
  const tasks = useDoneTownStore((state) => state.tasks);
  const resources = useDoneTownStore((state) => state.resources);
  const pet = useDoneTownStore((state) => state.pet);
  const home = useDoneTownStore((state) => state.home);
  const spendCoins = useDoneTownStore((state) => state.spendCoins);
  const addPetExp = useDoneTownStore((state) => state.addPetExp);
  const buildHome = useDoneTownStore((state) => state.buildHome);
  const expToNextLevel = useDoneTownStore(selectPetExpToNextLevel);

  const completedToday = tasks.filter((task) => {
    if (task.status !== "Done" || !task.completedAt) {
      return false;
    }

    return new Date(task.completedAt).toDateString() === new Date().toDateString();
  }).length;
  const activeText =
    completedToday >= 3
      ? "\u5e72\u52b2\u6ee1\u6ee1"
      : completedToday > 0
        ? "\u7a33\u6b65\u63a8\u8fdb"
        : "\u6b63\u5728\u4f11\u606f";
  const petEmoji = getPetEmoji(pet.level);
  const homeEmoji = getHomeEmoji(home.level);
  const petUpgradeCost = pet.level * 25;
  const homeCost = getHomeBuildCost(home.level);

  const handleUpgradePet = () => {
    if (!spendCoins(petUpgradeCost)) {
      onNotify("\u91d1\u5e01\u4e0d\u8db3\uff0c\u5148\u5b8c\u6210\u4e00\u4e2a\u4efb\u52a1\u5427");
      return;
    }

    addPetExp(Math.max(1, expToNextLevel - pet.exp));
    onNotify("\u5ba0\u7269\u5347\u7ea7\u6210\u529f");
  };

  const handleBuildHome = () => {
    if (!buildHome()) {
      onNotify("\u8d44\u6e90\u4e0d\u8db3\uff0c\u8fd8\u9700\u8981\u91d1\u5e01\u6216\u5efa\u6750");
      return;
    }

    onNotify("\u5bb6\u56ed\u642d\u5efa\u5b8c\u6210");
  };

  return (
    <section
      className={[
        "relative min-h-0 overflow-y-auto overflow-x-hidden bg-gradient-to-br from-emerald-50 via-lime-50 to-sky-100",
        className,
      ].join(" ")}
    >
      <div className="relative min-h-full px-4 py-5 sm:px-8 sm:py-6">
        <div className="absolute inset-x-8 top-24 h-72 rounded-[50%] bg-emerald-200/25 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-emerald-200/50 to-transparent" />

        <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700/70">
              Done Town
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-emerald-950 sm:text-3xl">
              {"\u4eca\u65e5\u5c0f\u5c9b"}
            </h2>
          </div>

          <div className="w-fit rounded-lg border border-white/70 bg-white/60 px-4 py-3 text-sm text-emerald-900 shadow-sm backdrop-blur">
            <p className="text-xs font-medium text-emerald-700/70">
              {"\u4eca\u65e5\u72b6\u6001"}
            </p>
            <p className="mt-1 font-semibold">{activeText}</p>
          </div>
        </div>

        <div className="relative z-10 mx-auto mt-6 flex min-h-[340px] w-full max-w-3xl items-center justify-center rounded-[2rem] border border-white/60 bg-white/20 p-4 shadow-inner shadow-white/40 sm:min-h-[400px]">
          <div className="absolute left-[8%] top-[30%] text-4xl sm:text-5xl">
            {"\ud83c\udf33"}
          </div>
          <div className="absolute right-[10%] top-[22%] text-3xl sm:text-4xl">
            {"\ud83c\udf3c"}
          </div>
          <div className="absolute bottom-[18%] left-[14%] text-4xl sm:text-5xl">
            {homeEmoji}
          </div>
          <div className="absolute bottom-[18%] right-[14%] text-4xl sm:text-5xl">
            {"\ud83c\udf32"}
          </div>

          <div className="relative flex flex-col items-center">
            <div className="mb-4 rounded-full border border-white/80 bg-white/65 px-4 py-2 text-sm font-medium text-emerald-900 shadow-sm backdrop-blur">
              {activeText}
            </div>
            <div className="flex h-32 w-32 items-center justify-center rounded-full border border-white/80 bg-white/75 text-6xl shadow-xl shadow-emerald-900/10 backdrop-blur sm:h-40 sm:w-40 sm:text-7xl">
              {petEmoji}
            </div>
            <p className="mt-4 text-sm font-semibold text-emerald-950">
              Lv.{pet.level} · {pet.exp}/{expToNextLevel} EXP
            </p>
          </div>
        </div>

        <div className="relative z-10 mx-auto mt-4 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            className="rounded-lg border border-white/80 bg-white/75 px-4 py-3 text-left shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-100"
            onClick={handleUpgradePet}
            type="button"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-950">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              {"\u5347\u7ea7\u5ba0\u7269"}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {petUpgradeCost} {"\u91d1\u5e01"} · {"\u5f62\u6001\u968f\u7b49\u7ea7\u53d8\u5316"}
            </p>
          </button>

          <button
            className="rounded-lg border border-white/80 bg-white/75 px-4 py-3 text-left shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-100"
            onClick={handleBuildHome}
            type="button"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-950">
              <Hammer className="h-4 w-4 text-amber-600" />
              {"\u642d\u5efa\u5bb6\u56ed"} Lv.{home.level}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {homeCost.coins} {"\u91d1\u5e01"} · {"\u6728"} {homeCost.materials.wood} ·{" "}
              {"\u77f3"} {homeCost.materials.stone} · {"\u7816"}{" "}
              {homeCost.materials.brick}
            </p>
          </button>
        </div>

        <div className="relative z-10 mx-auto mt-4 w-fit rounded-full bg-white/55 px-3 py-1 text-xs text-emerald-900/70 backdrop-blur">
          {"\u5bb6\u56ed\u7b49\u7ea7"} {home.level} · {"\u5efa\u6750"}{" "}
          {resources.materials.wood +
            resources.materials.stone +
            resources.materials.brick}
        </div>
      </div>
    </section>
  );
}

const getPetEmoji = (level: number) => {
  if (level >= 4) {
    return "\ud83e\udd85";
  }

  if (level >= 2) {
    return "\ud83d\udc25";
  }

  return "\ud83e\udd5a";
};

const getHomeEmoji = (level: number) => {
  if (level >= 5) {
    return "\ud83c\udff0";
  }

  if (level >= 3) {
    return "\ud83c\udfe1";
  }

  if (level >= 1) {
    return "\ud83e\udeb5";
  }

  return "\u26fa";
};
