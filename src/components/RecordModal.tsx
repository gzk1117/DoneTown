import { useEffect, useState } from "react";
import { Gem, Sparkles, X, Zap } from "lucide-react";
import type { Task } from "../store/useDoneTownStore";
import { getCategoryMeta } from "./taskMeta";

interface RecordModalProps {
  task: Task | null;
  onClose: () => void;
  onQuickCheckIn: (task: Task) => void;
  onDeepRecord: (task: Task, content: string) => void;
}

export function RecordModal({
  task,
  onClose,
  onQuickCheckIn,
  onDeepRecord,
}: RecordModalProps) {
  if (!task) {
    return null;
  }

  return (
    <RecordModalContent
      key={task.id}
      onClose={onClose}
      onDeepRecord={onDeepRecord}
      onQuickCheckIn={onQuickCheckIn}
      task={task}
    />
  );
}

function RecordModalContent({
  task,
  onClose,
  onQuickCheckIn,
  onDeepRecord,
}: RecordModalContentProps) {
  const [content, setContent] = useState("");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, task]);

  const category = getCategoryMeta(task.category);
  const CategoryIcon = category.icon;
  const trimmedContent = content.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-lg border border-white/80 bg-white p-5 text-left shadow-2xl shadow-slate-900/20">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <div
              className={[
                "mb-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
                category.badgeClassName,
              ].join(" ")}
            >
              <CategoryIcon className="h-3.5 w-3.5" />
              {category.label}
            </div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              {"\u56de\u54cd\u6253\u5361"}
            </p>
            <h2 className="mt-1 break-words text-xl font-semibold leading-7 text-slate-950">
              {task.title}
            </h2>
          </div>

          <button
            aria-label={"\u5173\u95ed\u5f39\u7a97"}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-100"
            onClick={onClose}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-2">
          <textarea
            className="min-h-36 w-full resize-none rounded-md border border-transparent bg-white px-3 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
            maxLength={280}
            onChange={(event) => setContent(event.target.value)}
            placeholder={
              "\u5199\u4e0b\u6b64\u523b\u7684\u611f\u53d7\uff0c\u6216\u76f4\u63a5\u5feb\u6377\u6253\u5361..."
            }
            value={content}
          />
          <div className="flex justify-end px-1 py-1 text-xs text-slate-400">
            {content.length}/280
          </div>
        </div>

        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
            onClick={() => onQuickCheckIn(task)}
            type="button"
          >
            <Zap className="h-4 w-4" />
            {"\u5feb\u6377\u6253\u5361"}
          </button>
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-300"
            disabled={!trimmedContent}
            onClick={() => onDeepRecord(task, trimmedContent)}
            type="button"
          >
            <Gem className="h-4 w-4" />
            {"\u6df1\u5ea6\u8bb0\u5f55"}
          </button>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800">
          <Sparkles className="h-4 w-4 shrink-0" />
          {"\u6df1\u5ea6\u8bb0\u5f55\u5c06\u4fdd\u5b58\u5230\u65f6\u5149\u753b\u518c\uff0c\u5e76\u83b7\u5f97\u53cc\u500d\u661f\u5e01\u5956\u52b1\u3002"}
        </div>
      </div>
    </div>
  );
}

interface RecordModalContentProps {
  task: Task;
  onClose: () => void;
  onQuickCheckIn: (task: Task) => void;
  onDeepRecord: (task: Task, content: string) => void;
}
