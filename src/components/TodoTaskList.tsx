import { Check, Coins, Hammer, Inbox } from "lucide-react";
import {
  getTaskProgress,
  useDoneTownStore,
} from "../store/useDoneTownStore";
import type { Task, TaskCategory } from "../store/useDoneTownStore";
import type { CategoryFilterValue } from "./taskMeta";
import {
  getCategoryMeta,
  getDifficultyMeta,
  getTaskKindMeta,
} from "./taskMeta";

interface TodoTaskListProps {
  selectedCategory: CategoryFilterValue;
  onRequestComplete: (task: Task) => void;
}

export function TodoTaskList({
  selectedCategory,
  onRequestComplete,
}: TodoTaskListProps) {
  const tasks = useDoneTownStore((state) => state.tasks);
  const abandonTask = useDoneTownStore((state) => state.abandonTask);

  const todoTasks = tasks.filter(
    (task) =>
      task.status === "ToDo" &&
      (selectedCategory === "All" || task.category === selectedCategory),
  );

  if (todoTasks.length === 0) {
    return (
      <div className="dt-story-card dt-drawn-border flex min-h-56 flex-col items-center justify-center px-6 text-center">
        <div className="dt-float-soft mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#fff0cb] text-[#c97832]">
          <Inbox className="h-8 w-8" />
        </div>
        <p className="text-base font-black text-[var(--dt-ink)]">
          {"\u5f53\u524d\u6ca1\u6709\u5f85\u529e\u4efb\u52a1"}
        </p>
        <p className="mt-1 text-sm font-semibold text-[var(--dt-muted)]">
          {"\u6dfb\u52a0\u4e00\u4e2a\u4efb\u52a1\uff0c\u8ba9\u5c0f\u9547\u5f00\u59cb\u8fd0\u8f6c\u3002"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {todoTasks.map((task) => (
        <TaskCard
          key={task.id}
          onAbandon={() => abandonTask(task.id)}
          onComplete={() => onRequestComplete(task)}
          task={task}
        />
      ))}
    </div>
  );
}

interface TaskCardProps {
  task: Task;
  onComplete: () => void;
  onAbandon: () => void;
}

function TaskCard({ task, onComplete, onAbandon }: TaskCardProps) {
  const toggleSubTask = useDoneTownStore((state) => state.toggleSubTask);
  const updateCountProgress = useDoneTownStore(
    (state) => state.updateCountProgress,
  );
  const category = getCategoryMeta(task.category);
  const difficulty = getDifficultyMeta(task.difficulty);
  const kind = getTaskKindMeta(task.kind);
  const CategoryIcon = category.icon;
  const KindIcon = kind.icon;
  const progress = getTaskProgress(task);
  const progressTone = progressTones[task.category];
  const countGoal = Math.max(1, task.countGoal ?? 1);
  const countCurrent = Math.min(Math.max(task.countCurrent ?? 0, 0), countGoal);
  const finishedSubTasks = task.subTasks.filter(
    (subTask) => subTask.isDone,
  ).length;
  const materialReward = Object.entries(task.reward.materials)
    .filter(([, amount]) => Boolean(amount))
    .map(([name, amount]) => `${materialLabels[name] ?? name}+${amount}`)
    .join(" ");

  return (
    <article
      className={[
        "dt-story-card dt-pop-in relative overflow-hidden text-left transition hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(111,70,33,0.14)]",
        progressTone.borderClassName,
      ].join(" ")}
    >
      <div
        className={["absolute inset-0 opacity-75", progressTone.trackClassName].join(" ")}
      />
      <div
        className={[
          "absolute inset-y-0 left-0 rounded-r-[2rem] transition-all duration-500",
          progressTone.fillClassName,
        ].join(" ")}
        style={{ width: `${progress}%` }}
      />

      <div className="relative p-4">
        <div className="flex gap-3">
          <button
            aria-label={`${"\u5b8c\u6210\u4efb\u52a1"}: ${task.title}`}
            className="dt-icon-button dt-focus mt-1 flex h-11 w-11 shrink-0 items-center justify-center bg-white/90 text-[#4f9b62]"
            onClick={onComplete}
            type="button"
          >
            <Check className="h-5 w-5" />
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={[
                  "dt-sticker inline-flex items-center gap-1.5 px-2 py-1 text-xs font-extrabold ring-1 ring-inset",
                  category.badgeClassName,
                ].join(" ")}
              >
                <CategoryIcon className="h-3.5 w-3.5" />
                {category.label}
              </span>
              <span
                className={[
                  "dt-sticker inline-flex items-center gap-1.5 px-2 py-1 text-xs font-extrabold ring-1 ring-inset",
                  kind.className,
                ].join(" ")}
              >
                <KindIcon className="h-3.5 w-3.5" />
                {kind.shortLabel}
              </span>
              <span
                className={[
                  "dt-sticker inline-flex px-2 py-1 text-xs font-extrabold ring-1 ring-inset",
                  difficulty.className,
                ].join(" ")}
              >
                {difficulty.label}
              </span>
            </div>

            <div className="mt-3 flex items-start justify-between gap-3">
              <h2 className="break-words text-lg font-black leading-6 text-[var(--dt-ink)]">
                {task.title}
              </h2>
              <span className="dt-sticker shrink-0 px-2.5 py-1 text-base font-black tabular-nums text-[var(--dt-ink)]">
                {progress}%
              </span>
            </div>

            <p className="mt-1 text-xs font-bold text-[var(--dt-muted)]">
              {getTaskScheduleText(task)}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-bold text-[var(--dt-muted)]">
              <span className="dt-sticker inline-flex items-center gap-1 px-2 py-1">
                <Coins className="h-3.5 w-3.5 text-[#c97832]" />
                {"\u661f\u5e01"} +{task.reward.coins}
              </span>
              {materialReward && (
                <span className="dt-sticker inline-flex items-center gap-1 px-2 py-1">
                  <Hammer className="h-3.5 w-3.5 text-[#8a5527]" />
                  {materialReward}
                </span>
              )}
              {task.subTasks.length > 0 && (
                <span className="dt-sticker px-2 py-1">
                  {"\u5b50\u4efb\u52a1"} {finishedSubTasks}/{task.subTasks.length}
                </span>
              )}
            </div>
          </div>

          <button
            className="dt-soft-button dt-focus h-11 shrink-0 px-3 text-xs font-extrabold text-[var(--dt-muted)]"
            onClick={onAbandon}
            type="button"
          >
            {"\u653e\u5f03"}
          </button>
        </div>

        {task.kind === "Count" && (
          <div className="mt-3 rounded-[1.25rem] border-2 border-white/70 bg-white/70 p-3 shadow-[0_8px_18px_rgba(111,70,33,0.08)]">
            <div className="mb-2 flex items-center justify-between gap-3 text-xs font-extrabold text-[var(--dt-muted)]">
              <span>{"\u5b9e\u65f6\u8fdb\u5ea6"}</span>
              <span className="tabular-nums">
                {countCurrent}/{countGoal}
              </span>
            </div>
            <div className="grid grid-cols-[1fr_4.5rem] items-center gap-3">
              <input
                aria-label={"\u8c03\u6574\u8ba1\u6570\u4efb\u52a1\u8fdb\u5ea6"}
                className="w-full accent-[#ff8a65]"
                max={countGoal}
                min={0}
                onChange={(event) =>
                  updateCountProgress(task.id, Number(event.target.value) || 0)
                }
                type="range"
                value={countCurrent}
              />
              <input
                aria-label={"\u8f93\u5165\u5df2\u8fbe\u6807\u6570\u91cf"}
                className="dt-input h-10 px-2 text-right text-sm tabular-nums"
                inputMode="numeric"
                max={countGoal}
                min={0}
                onChange={(event) =>
                  updateCountProgress(task.id, Number(event.target.value) || 0)
                }
                type="number"
                value={countCurrent}
              />
            </div>
          </div>
        )}

        {task.kind !== "Count" && task.subTasks.length > 0 && (
          <div className="mt-3 rounded-[1.25rem] border-2 border-white/70 bg-white/70 p-2 shadow-[0_8px_18px_rgba(111,70,33,0.08)]">
            <div className="mb-2 flex items-center justify-between px-1 text-xs font-extrabold text-[var(--dt-muted)]">
              <span>{"\u5b50\u4efb\u52a1\u8fdb\u5ea6"}</span>
              <span>
                {finishedSubTasks}/{task.subTasks.length}
              </span>
            </div>
            <div className="space-y-1.5">
              {task.subTasks.map((subTask) => (
                <button
                  className="dt-squish flex min-h-11 w-full items-center gap-2 rounded-2xl px-2 py-2 text-left text-sm font-bold text-[var(--dt-ink)] transition hover:bg-[#fff8e7]"
                  key={subTask.id}
                  onClick={() => toggleSubTask(task.id, subTask.id)}
                  type="button"
                >
                  <span
                    className={[
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                      subTask.isDone
                        ? "border-[#4f9b62] bg-[#9bdc86] text-[#24442a]"
                        : "border-[rgba(128,83,42,0.22)] bg-white text-transparent",
                    ].join(" ")}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span
                    className={[
                      "min-w-0 flex-1 break-words",
                      subTask.isDone ? "text-[var(--dt-muted)] line-through" : "",
                    ].join(" ")}
                  >
                    {subTask.title}
                  </span>
                  <span className="shrink-0 text-xs tabular-nums text-[var(--dt-muted)]">
                    {subTask.weight}%
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

const materialLabels: Record<string, string> = {
  wood: "\u6728\u6750",
  stone: "\u77f3\u6750",
  brick: "\u7816\u5757",
};

const progressTones: Record<
  TaskCategory,
  {
    borderClassName: string;
    trackClassName: string;
    fillClassName: string;
  }
> = {
  Study: {
    borderClassName: "border-[#bde9ff]/70 hover:border-[#7cc9ec]",
    trackClassName: "bg-[#e4f6ff]",
    fillClassName: "bg-[#bde9ff]/90",
  },
  Work: {
    borderClassName: "border-[#d9ccff]/70 hover:border-[#b7a5f3]",
    trackClassName: "bg-[#f0eaff]",
    fillClassName: "bg-[#d9ccff]/90",
  },
  Health: {
    borderClassName: "border-[#c4edb6]/70 hover:border-[#9bdc86]",
    trackClassName: "bg-[#e8f8df]",
    fillClassName: "bg-[#9bdc86]/85",
  },
  Life: {
    borderClassName: "border-[#ffd56b]/70 hover:border-[#f2b94d]",
    trackClassName: "bg-[#fff0cb]",
    fillClassName: "bg-[#ffd56b]/90",
  },
};

const dateTimeFormatter = new Intl.DateTimeFormat("zh-CN", {
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

const formatDateTime = (timestamp?: number) =>
  timestamp ? dateTimeFormatter.format(new Date(timestamp)) : "\u672a\u8bbe\u7f6e";

const getTaskScheduleText = (task: Task) => {
  if (task.kind === "ShortTimed") {
    return `${"\u9650\u65f6"} ${formatDateTime(task.startAt)} - ${formatDateTime(task.endAt)}`;
  }

  if (task.kind === "LongTerm") {
    return `${"\u622a\u6b62"} ${formatDateTime(task.deadlineAt)}`;
  }

  if (task.kind === "Count") {
    const targetText = `${"\u76ee\u6807\u6570\u91cf"} ${Math.max(1, task.countGoal ?? 1)}`;

    return task.deadlineAt
      ? `${targetText} · ${"\u622a\u6b62"} ${formatDateTime(task.deadlineAt)}`
      : targetText;
  }

  return task.deadlineAt
    ? `${"\u622a\u6b62"} ${formatDateTime(task.deadlineAt)}`
    : "\u65e0\u9700\u9650\u65f6\uff0c\u4e13\u6ce8\u8fbe\u6807";
};
