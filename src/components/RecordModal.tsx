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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(86,58,37,0.28)] px-4 py-6 backdrop-blur-sm">
      <div className="dt-page-sheet dt-paper-panel dt-drawn-border w-full max-w-lg p-5 text-left">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <div
              className={[
                "dt-sticker mb-3 inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-extrabold ring-1 ring-inset",
                category.badgeClassName,
              ].join(" ")}
            >
              <CategoryIcon className="h-3.5 w-3.5" />
              {category.label}
            </div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#df7a32]">
              {"\u56de\u54cd\u6253\u5361"}
            </p>
            <h2 className="mt-1 break-words text-2xl font-black leading-8 text-[var(--dt-ink)]">
              {task.title}
            </h2>
          </div>

          <button
            aria-label={"\u5173\u95ed\u5f39\u7a97"}
            className="dt-icon-button dt-focus flex h-11 w-11 shrink-0 items-center justify-center text-[var(--dt-muted)]"
            onClick={onClose}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="rounded-[1.5rem] border-2 border-[rgba(128,83,42,0.14)] bg-[#fff8e7]/80 p-2">
          <textarea
            className="dt-input min-h-36 w-full resize-none px-3 py-3 text-sm font-bold leading-6 placeholder:text-[rgba(86,58,37,0.42)]"
            maxLength={280}
            onChange={(event) => setContent(event.target.value)}
            placeholder={
              "\u5199\u4e0b\u6b64\u523b\u7684\u611f\u53d7\uff0c\u6216\u76f4\u63a5\u5feb\u6377\u6253\u5361..."
            }
            value={content}
          />
          <div className="flex justify-end px-1 py-1 text-xs font-bold text-[var(--dt-muted)]">
            {content.length}/280
          </div>
        </div>

        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            className="dt-soft-button dt-focus inline-flex items-center justify-center gap-2 px-4 text-sm font-extrabold"
            onClick={() => onQuickCheckIn(task)}
            type="button"
          >
            <Zap className="h-4 w-4" />
            {"\u5feb\u6377\u6253\u5361"}
          </button>
          <button
            className="dt-primary-button dt-focus inline-flex items-center justify-center gap-2 px-4 text-sm"
            disabled={!trimmedContent}
            onClick={() => onDeepRecord(task, trimmedContent)}
            type="button"
          >
            <Gem className="h-4 w-4" />
            {"\u6df1\u5ea6\u8bb0\u5f55"}
          </button>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-[1rem] border-2 border-[#ffd56b]/40 bg-[#fff0cb]/75 px-3 py-2 text-xs font-bold text-[#8a5527]">
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
