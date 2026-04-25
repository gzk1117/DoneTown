import { useState } from "react";
import { CategoryFilter } from "./CategoryFilter";
import { TodoTaskList } from "./TodoTaskList";
import type { CategoryFilterValue } from "./taskMeta";
import type { Task } from "../store/useDoneTownStore";

interface TaskPanelProps {
  onRequestComplete: (task: Task) => void;
  className?: string;
}

export function TaskPanel({
  onRequestComplete,
  className = "w-80 xl:w-96",
}: TaskPanelProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilterValue>("All");

  return (
    <section
      className={[
        "flex min-h-0 flex-col bg-yellow-50/70 p-4 shadow-[10px_0_30px_rgba(148,163,184,0.12)]",
        className,
      ].join(" ")}
    >
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">
          DoneTown
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
          {"\u4eca\u65e5\u4efb\u52a1"}
        </h1>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pb-12 pr-1 lg:pb-0">
        <div className="space-y-4">
          <CategoryFilter
            onChange={setSelectedCategory}
            selectedCategory={selectedCategory}
          />
          <TodoTaskList
            onRequestComplete={onRequestComplete}
            selectedCategory={selectedCategory}
          />
        </div>
      </div>
    </section>
  );
}
