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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(86,58,37,0.28)] px-4 py-6 backdrop-blur-sm">
      <div className="dt-page-sheet dt-paper-panel dt-drawn-border flex max-h-[86vh] w-full max-w-2xl flex-col p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#4f9b62]">
              Gallery
            </p>
            <h2 className="mt-1 text-2xl font-black text-[var(--dt-ink)]">
              {"\u65f6\u5149\u753b\u518c"}
            </h2>
          </div>
          <button
            aria-label={"\u5173\u95ed\u65f6\u5149\u753b\u518c"}
            className="dt-icon-button dt-focus flex h-11 w-11 items-center justify-center text-[var(--dt-muted)]"
            onClick={onClose}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="min-h-0 overflow-y-auto">
          <EchoGallery className="border-0 bg-transparent p-0 shadow-none outline-none" />
        </div>
      </div>
    </div>
  );
}
