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
    <section className="fixed inset-0 z-50 overflow-y-auto bg-yellow-50/95 px-4 py-5 text-slate-900 backdrop-blur-sm">
      <div className="mx-auto flex min-h-full w-full max-w-xl flex-col">
        <header className="mb-5 flex items-center gap-3">
          <button
            aria-label={"\u8fd4\u56de\u4eca\u65e5\u4efb\u52a1"}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/80 bg-white text-slate-700 shadow-sm transition hover:-translate-x-0.5 hover:border-slate-200 hover:text-slate-950"
            onClick={onClose}
            type="button"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">
              DoneTown
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
              {"\u6dfb\u52a0\u4efb\u52a1"}
            </h1>
          </div>
        </header>

        <div className="rounded-lg border border-white/80 bg-white/70 p-2 shadow-xl shadow-amber-900/10">
          <TaskAddInput onTaskCreated={onTaskCreated} />
        </div>
      </div>
    </section>
  );
}
