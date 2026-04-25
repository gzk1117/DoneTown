import { X } from "lucide-react";
import { EchoGallery } from "./EchoGallery";

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GalleryModal({ isOpen, onClose }: GalleryModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 px-4 py-6 backdrop-blur-sm">
      <div className="flex max-h-[86vh] w-full max-w-2xl flex-col rounded-lg border border-white/80 bg-white p-5 shadow-2xl shadow-slate-900/20">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
              Gallery
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-950">
              {"\u65f6\u5149\u753b\u518c"}
            </h2>
          </div>
          <button
            aria-label={"\u5173\u95ed\u65f6\u5149\u753b\u518c"}
            className="flex h-9 w-9 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-100"
            onClick={onClose}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="min-h-0 overflow-y-auto">
          <EchoGallery className="border-0 bg-transparent p-0 shadow-none" />
        </div>
      </div>
    </div>
  );
}
