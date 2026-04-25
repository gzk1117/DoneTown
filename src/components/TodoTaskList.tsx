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
      <div className="flex min-h-56 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-white px-6 text-center">
        <Inbox className="mb-3 h-8 w-8 text-slate-300" />
        <p className="text-sm font-medium text-slate-700">
          {"\u5f53\u524d\u6ca1\u6709\u5f85\u529e\u4efb\u52a1"}
        </p>
        <p className="mt-1 text-xs text-slate-400">
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
        "relative overflow-hidden rounded-lg border bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
        progressTone.borderClassName,
      ].join(" ")}
    >
      <div className={["absolute inset-0", progressTone.trackClassName].join(" ")} />
      <div
        className={[
          "absolute inset-y-0 left-0 transition-all duration-500",
          progressTone.fillClassName,
        ].join(" ")}
        style={{ width: `${progress}%` }}
      />

      <div className="relative p-4">
        <div className="flex gap-3">
        <button
          aria-label={`${"\u5b8c\u6210\u4efb\u52a1"}: ${task.title}`}
          className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/80 bg-white/85 text-slate-500 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-100"
          onClick={onComplete}
          type="button"
        >
          <Check className="h-4 w-4" />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={[
                "inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset",
                category.badgeClassName,
              ].join(" ")}
            >
              <CategoryIcon className="h-3.5 w-3.5" />
              {category.label}
            </span>
            <span
              className={[
                "inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset",
                kind.className,
              ].join(" ")}
            >
              <KindIcon className="h-3.5 w-3.5" />
              {kind.shortLabel}
            </span>
            <span
              className={[
                "inline-flex rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset",
                difficulty.className,
              ].join(" ")}
            >
            {difficulty.label}
            </span>
          </div>

            <div className="mt-3 flex items-start justify-between gap-3">
              <h2 className="break-words text-base font-semibold leading-6 text-slate-950">
                {task.title}
              </h2>
              <span className="shrink-0 text-lg font-semibold tabular-nums text-slate-950">
                {progress}%
              </span>
            </div>

            <p className="mt-1 text-xs font-medium text-slate-500">
              {getTaskScheduleText(task)}
            </p>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-1">
              <Coins className="h-3.5 w-3.5 text-amber-500" />
              {"\u661f\u5e01"} +{task.reward.coins}
            </span>
            {materialReward && (
              <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-1">
                <Hammer className="h-3.5 w-3.5 text-slate-500" />
                {materialReward}
              </span>
            )}
            {task.subTasks.length > 0 && (
              <span className="rounded-md bg-slate-50 px-2 py-1">
                {"\u5b50\u4efb\u52a1"} {finishedSubTasks}/{task.subTasks.length}
              </span>
            )}
          </div>
        </div>

        <button
          className="h-8 shrink-0 rounded-md bg-white/60 px-2 text-xs font-medium text-slate-500 transition hover:bg-white hover:text-slate-700"
          onClick={onAbandon}
          type="button"
        >
          {"\u653e\u5f03"}
        </button>
      </div>

        {task.kind === "Count" && (
          <div className="mt-3 rounded-md border border-white/70 bg-white/75 p-3 shadow-sm">
            <div className="mb-2 flex items-center justify-between gap-3 text-xs font-medium text-slate-600">
              <span>{"\u5b9e\u65f6\u8fdb\u5ea6"}</span>
              <span className="tabular-nums">
                {countCurrent}/{countGoal}
              </span>
            </div>
            <div className="grid grid-cols-[1fr_4.5rem] items-center gap-3">
              <input
                aria-label={"\u8c03\u6574\u8ba1\u6570\u4efb\u52a1\u8fdb\u5ea6"}
                className="w-full accent-cyan-500"
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
                className="h-9 rounded-md border border-slate-200 bg-white px-2 text-right text-sm tabular-nums text-slate-700 outline-none focus:border-cyan-300 focus:ring-4 focus:ring-cyan-100"
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
          <div className="mt-3 rounded-md border border-white/70 bg-white/75 p-2 shadow-sm">
            <div className="mb-2 flex items-center justify-between px-1 text-xs font-medium text-slate-500">
              <span>{"\u5b50\u4efb\u52a1\u8fdb\u5ea6"}</span>
              <span>
                {finishedSubTasks}/{task.subTasks.length}
              </span>
            </div>
            <div className="space-y-1.5">
              {task.subTasks.map((subTask) => (
                <button
                  className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                  key={subTask.id}
                  onClick={() => toggleSubTask(task.id, subTask.id)}
                  type="button"
                >
                  <span
                    className={[
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                      subTask.isDone
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-slate-300 bg-white text-transparent",
                    ].join(" ")}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span
                    className={[
                      "min-w-0 flex-1 break-words",
                      subTask.isDone ? "text-slate-400 line-through" : "",
                    ].join(" ")}
                  >
                    {subTask.title}
                  </span>
                  <span className="shrink-0 text-xs tabular-nums text-slate-400">
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
    borderClassName: "border-sky-100 hover:border-sky-200",
    trackClassName: "bg-sky-100/80",
    fillClassName: "bg-cyan-300/80",
  },
  Work: {
    borderClassName: "border-violet-100 hover:border-violet-200",
    trackClassName: "bg-violet-100/75",
    fillClassName: "bg-fuchsia-200/90",
  },
  Health: {
    borderClassName: "border-emerald-100 hover:border-emerald-200",
    trackClassName: "bg-emerald-100/75",
    fillClassName: "bg-teal-300/80",
  },
  Life: {
    borderClassName: "border-amber-100 hover:border-amber-200",
    trackClassName: "bg-amber-100/75",
    fillClassName: "bg-orange-200/90",
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
    return `${"\u76ee\u6807\u6570\u91cf"} ${Math.max(1, task.countGoal ?? 1)}`;
  }

  return "\u65e0\u9700\u9650\u65f6\uff0c\u4e13\u6ce8\u8fbe\u6807";
};
