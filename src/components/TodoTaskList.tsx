import { Check, Coins, Hammer, Inbox } from "lucide-react";
import { useDoneTownStore } from "../store/useDoneTownStore";
import type { Task } from "../store/useDoneTownStore";
import type { CategoryFilterValue } from "./taskMeta";
import { getCategoryMeta, getDifficultyMeta } from "./taskMeta";

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
  const category = getCategoryMeta(task.category);
  const difficulty = getDifficultyMeta(task.difficulty);
  const CategoryIcon = category.icon;
  const finishedSubTasks = task.subTasks.filter(
    (subTask) => subTask.isDone,
  ).length;
  const materialReward = Object.entries(task.reward.materials)
    .filter(([, amount]) => Boolean(amount))
    .map(([name, amount]) => `${materialLabels[name] ?? name}+${amount}`)
    .join(" ");

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      <div className="flex gap-3">
        <button
          aria-label={`${"\u5b8c\u6210\u4efb\u52a1"}: ${task.title}`}
          className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-100"
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
                "inline-flex rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset",
                difficulty.className,
              ].join(" ")}
            >
              {difficulty.label}
            </span>
          </div>

          <h2 className="mt-3 break-words text-base font-semibold leading-6 text-slate-950">
            {task.title}
          </h2>

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
          className="h-8 shrink-0 rounded-md px-2 text-xs font-medium text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
          onClick={onAbandon}
          type="button"
        >
          {"\u653e\u5f03"}
        </button>
      </div>
    </article>
  );
}

const materialLabels: Record<string, string> = {
  wood: "\u6728\u6750",
  stone: "\u77f3\u6750",
  brick: "\u7816\u5757",
};
