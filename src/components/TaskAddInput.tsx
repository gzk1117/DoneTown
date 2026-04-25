import { type FormEvent, useState } from "react";
import { Plus } from "lucide-react";
import { useDoneTownStore } from "../store/useDoneTownStore";
import type { TaskCategory, TaskDifficulty } from "../store/useDoneTownStore";
import { categoryOptions, difficultyOptions } from "./taskMeta";

export function TaskAddInput() {
  const addTask = useDoneTownStore((state) => state.addTask);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<TaskCategory>("Study");
  const [difficulty, setDifficulty] = useState<TaskDifficulty>("Medium");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    addTask({
      title: trimmedTitle,
      category,
      difficulty,
    });
    setTitle("");
  };

  return (
    <form
      className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-3">
        <label className="sr-only" htmlFor="task-title">
          {"\u4efb\u52a1\u6807\u9898"}
        </label>
        <input
          id="task-title"
          className="min-h-11 flex-1 rounded-md border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
          maxLength={50}
          onChange={(event) => setTitle(event.target.value)}
          placeholder={"\u6dfb\u52a0\u4e00\u4e2a\u4efb\u52a1\uff0c\u6700\u591a 50 \u5b57"}
          type="text"
          value={title}
        />

        <div className="grid grid-cols-2 gap-3">
          <label className="sr-only" htmlFor="task-category">
            {"\u4efb\u52a1\u5206\u7c7b"}
          </label>
          <select
            id="task-category"
            className="min-h-11 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            onChange={(event) =>
              setCategory(event.target.value as TaskCategory)
            }
            value={category}
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <label className="sr-only" htmlFor="task-difficulty">
            {"\u4efb\u52a1\u96be\u5ea6"}
          </label>
          <select
            id="task-difficulty"
            className="min-h-11 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            onChange={(event) =>
              setDifficulty(event.target.value as TaskDifficulty)
            }
            value={difficulty}
          >
            {difficultyOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <button
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-300"
          disabled={!title.trim()}
          type="submit"
        >
          <Plus className="h-4 w-4" />
          {"\u6dfb\u52a0"}
        </button>
      </div>
    </form>
  );
}
