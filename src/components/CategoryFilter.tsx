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
          "dt-squish inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border-2 px-3 text-sm font-extrabold transition",
          selectedCategory === "All"
            ? "border-[#8a5137] bg-[#ffb17f] text-[#4b2719] shadow-[0_6px_0_rgba(182,90,48,0.22)]"
            : "border-[rgba(128,83,42,0.14)] bg-[rgba(255,253,247,0.86)] text-[var(--dt-muted)] shadow-[0_6px_14px_rgba(111,70,33,0.08)] hover:bg-white",
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
              "dt-squish inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border-2 px-3 text-sm font-extrabold transition",
              isActive
                ? "border-[#8a5137] bg-[#ffb17f] text-[#4b2719] shadow-[0_6px_0_rgba(182,90,48,0.22)]"
                : "border-[rgba(128,83,42,0.14)] bg-[rgba(255,253,247,0.86)] text-[var(--dt-muted)] shadow-[0_6px_14px_rgba(111,70,33,0.08)] hover:bg-white",
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
