import { useEffect, useMemo, useState } from "react";
import { Hammer, Sparkles } from "lucide-react";
import {
  getHomeBuildCost,
  selectPetExpToNextLevel,
  type Task,
  useDoneTownStore,
} from "../store/useDoneTownStore";
import { ResourceIcon } from "./StoryIllustrations";
import { TownScene, type TownWeather } from "./TownScene";
import { getNestImageForLevel } from "./townAssets";

interface GameStageProps {
  onNotify: (message: string) => void;
  className?: string;
}

export function GameStage({ onNotify, className = "" }: GameStageProps) {
  const [now, setNow] = useState(() => Date.now());
  const tasks = useDoneTownStore((state) => state.tasks);
  const resources = useDoneTownStore((state) => state.resources);
  const pet = useDoneTownStore((state) => state.pet);
  const home = useDoneTownStore((state) => state.home);
  const spendCoins = useDoneTownStore((state) => state.spendCoins);
  const addPetExp = useDoneTownStore((state) => state.addPetExp);
  const buildHome = useDoneTownStore((state) => state.buildHome);
  const expToNextLevel = useDoneTownStore(selectPetExpToNextLevel);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 60_000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

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
  const townWeather = useMemo(() => getTownWeather(tasks, now), [tasks, now]);
  const petUpgradeCost = pet.level * 25;
  const isNestMaxed = home.level >= 3;
  const homeCost = getHomeBuildCost(home.level);
  const nestPreviewLevel = isNestMaxed ? 3 : home.level + 1;
  const nestPreviewSrc = getNestImageForLevel(nestPreviewLevel);

  const handleUpgradePet = () => {
    if (!spendCoins(petUpgradeCost)) {
      onNotify("\u91d1\u5e01\u4e0d\u8db3\uff0c\u5148\u5b8c\u6210\u4e00\u4e2a\u4efb\u52a1\u5427");
      return;
    }

    addPetExp(Math.max(1, expToNextLevel - pet.exp));
    onNotify("\u5ba0\u7269\u5347\u7ea7\u6210\u529f");
  };

  const handleBuildHome = () => {
    if (isNestMaxed) {
      onNotify("\u5c0f\u9e21\u7684\u5de2\u5df2\u7ecf\u5f88\u8212\u670d\u4e86");
      return;
    }

    if (!buildHome()) {
      onNotify("\u8d44\u6e90\u4e0d\u8db3\uff0c\u8fd8\u9700\u8981\u91d1\u5e01\u6216\u5efa\u6750");
      return;
    }

    onNotify("\u5c0f\u9e21\u7684\u5de2\u53d8\u8212\u670d\u4e86");
  };

  return (
    <section
      className={[
        "relative min-h-0 overflow-y-auto overflow-x-hidden bg-gradient-to-b from-[#cdefff] via-[#e7f7dc] to-[#fff0cb]",
        className,
      ].join(" ")}
    >
      <div className="relative min-h-full px-4 py-5 sm:px-8 sm:py-6">
        <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-4xl font-black tracking-tight text-[#df7a32] drop-shadow-[0_3px_0_rgba(255,248,231,0.85)] sm:text-6xl">
              DoneTown
            </h2>
          </div>

          <div className="dt-story-card w-fit px-4 py-3 text-sm">
            <p className="text-xs font-black text-[#4f9b62]">
              {"\u4eca\u65e5\u72b6\u6001"}
            </p>
            <p className="mt-1 font-black text-[var(--dt-ink)]">{activeText}</p>
          </div>
        </div>

        <div className="relative z-10 mt-5">
          <TownScene
            homeLevel={home.level}
            petLevel={pet.level}
            weather={townWeather.weather}
          />
        </div>

        <div className="relative z-10 mx-auto mt-4 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            className="dt-story-card dt-focus dt-squish px-4 py-4 text-left"
            onClick={handleUpgradePet}
            type="button"
          >
            <div className="flex items-center gap-2 text-sm font-black text-[var(--dt-ink)]">
              <Sparkles className="h-4 w-4 text-[#df7a32]" />
              {"\u5347\u7ea7\u5ba0\u7269"}
            </div>
            <p className="mt-2 flex items-center gap-2 text-xs font-bold text-[var(--dt-muted)]">
              <ResourceIcon className="h-5 w-5" type="coins" />
              {petUpgradeCost} {"\u91d1\u5e01"} ·{" "}
              {"\u5f62\u6001\u968f\u7b49\u7ea7\u53d8\u5316"}
            </p>
            <p className="mt-2 text-xs font-bold text-[#4f9b62]">
              Lv.{pet.level} · {pet.exp}/{expToNextLevel} EXP
            </p>
          </button>

          <button
            className="dt-story-card dt-focus dt-squish flex gap-3 px-4 py-4 text-left disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isNestMaxed}
            onClick={handleBuildHome}
            type="button"
          >
            {nestPreviewSrc && (
              <img
                alt=""
                className="h-16 w-16 shrink-0 object-contain drop-shadow-[0_8px_10px_rgba(87,61,36,0.16)]"
                draggable={false}
                src={nestPreviewSrc}
              />
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-sm font-black text-[var(--dt-ink)]">
                <Hammer className="h-4 w-4 text-[#c97832]" />
                {isNestMaxed
                  ? "\u5de2\u7a74\u5df2\u6ee1\u7ea7"
                  : "\u7ed9\u5c0f\u9e21\u7b51\u5de2"}{" "}
                Lv.{Math.min(home.level, 3)}
              </div>
              <p className="mt-2 text-xs font-bold text-[var(--dt-muted)]">
                {isNestMaxed
                  ? "\u5c0f\u9e21\u5df2\u7ecf\u6709\u4e00\u4e2a\u8212\u670d\u7684\u5c0f\u7a9d"
                  : `${homeCost.coins} ${"\u91d1\u5e01"} · ${"\u6728"} ${
                      homeCost.materials.wood
                    } · ${"\u77f3"} ${homeCost.materials.stone} · ${"\u7816"} ${
                      homeCost.materials.brick
                    }`}
              </p>
            </div>
          </button>
        </div>

        <div className="dt-sticker relative z-10 mx-auto mt-4 w-fit px-3 py-1 text-xs font-bold text-[var(--dt-muted)]">
          {"\u5de2\u7a74\u7b49\u7ea7"} {Math.min(home.level, 3)} · {"\u5efa\u6750"}{" "}
          {resources.materials.wood +
            resources.materials.stone +
            resources.materials.brick}
        </div>
      </div>
    </section>
  );
}

const DAY_MS = 24 * 60 * 60 * 1000;

const getTownWeather = (
  tasks: Task[],
  now: number,
): { weather: TownWeather } => {
  const overdueTimedTasks = tasks
    .filter(
      (task) =>
        task.status === "ToDo" &&
        task.kind === "ShortTimed" &&
        typeof task.endAt === "number" &&
        now - task.endAt >= DAY_MS,
    )
    .map((task) => ({
      days: Math.floor((now - (task.endAt ?? now)) / DAY_MS),
    }))
    .sort((a, b) => b.days - a.days);

  const mostOverdueTask = overdueTimedTasks[0];

  if (!mostOverdueTask) {
    return { weather: "sunny" };
  }

  if (mostOverdueTask.days >= 2) {
    return { weather: "rainy" };
  }

  return { weather: "cloudy" };
};
