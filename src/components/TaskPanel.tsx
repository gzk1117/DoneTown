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
        "flex min-h-0 flex-col bg-[rgba(255,247,232,0.62)] p-4 shadow-[10px_0_30px_rgba(111,70,33,0.08)] backdrop-blur sm:p-6",
        className,
      ].join(" ")}
    >
      <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col">
        <div className="dt-paper-panel dt-drawn-border mb-4 px-4 py-4">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#df7a32]">
            DoneTown
          </p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-[var(--dt-ink)]">
            {"\u4eca\u65e5\u4efb\u52a1"}
          </h1>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pb-24 pr-1 lg:pb-2">
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
      </div>
    </section>
  );
}
