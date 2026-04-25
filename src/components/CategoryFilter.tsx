import { ListTodo } from "lucide-react";
import type { CategoryFilterValue } from "./taskMeta";
import { categoryOptions } from "./taskMeta";

interface CategoryFilterProps {
  selectedCategory: CategoryFilterValue;
  onChange: (category: CategoryFilterValue) => void;
}

export function CategoryFilter({
  selectedCategory,
  onChange,
}: CategoryFilterProps) {
  return (
    <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
      <button
        className={[
          "inline-flex min-h-10 shrink-0 items-center gap-2 rounded-md border px-3 text-sm font-medium transition",
          selectedCategory === "All"
            ? "border-slate-900 bg-slate-900 text-white"
            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50",
        ].join(" ")}
        onClick={() => onChange("All")}
        type="button"
      >
        <ListTodo className="h-4 w-4" />
        {"\u5168\u90e8"}
      </button>

      {categoryOptions.map((option) => {
        const Icon = option.icon;
        const isActive = selectedCategory === option.value;

        return (
          <button
            className={[
              "inline-flex min-h-10 shrink-0 items-center gap-2 rounded-md border px-3 text-sm font-medium transition",
              isActive
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50",
            ].join(" ")}
            key={option.value}
            onClick={() => onChange(option.value)}
            type="button"
          >
            <Icon
              className={[
                "h-4 w-4",
                isActive ? "" : option.iconClassName,
              ].join(" ")}
            />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
