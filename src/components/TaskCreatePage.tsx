import { ArrowLeft } from "lucide-react";
import { TaskAddInput } from "./TaskAddInput";

interface TaskCreatePageProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: () => void;
}

export function TaskCreatePage({
  isOpen,
  onClose,
  onTaskCreated,
}: TaskCreatePageProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <section className="dt-page-sheet fixed inset-0 z-50 overflow-y-auto bg-[rgba(255,247,232,0.96)] px-4 py-5 text-[var(--dt-ink)] backdrop-blur-sm">
      <div className="mx-auto flex min-h-full w-full max-w-xl flex-col">
        <header className="mb-5 flex items-center gap-3">
          <button
            aria-label={"\u8fd4\u56de\u4eca\u65e5\u4efb\u52a1"}
            className="dt-icon-button dt-focus flex h-11 w-11 shrink-0 items-center justify-center text-[var(--dt-ink)]"
            onClick={onClose}
            type="button"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#df7a32]">
              DoneTown
            </p>
            <h1 className="text-3xl font-black tracking-tight text-[var(--dt-ink)]">
              {"\u6dfb\u52a0\u4efb\u52a1"}
            </h1>
          </div>
        </header>

        <div className="dt-paper-panel dt-drawn-border p-2">
          <TaskAddInput onTaskCreated={onTaskCreated} />
        </div>
      </div>
    </section>
  );
}
