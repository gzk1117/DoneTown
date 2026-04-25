import { BookOpen, ShoppingBag } from "lucide-react";

interface SideNavProps {
  onOpenGallery: () => void;
  onOpenShop: () => void;
  className?: string;
}

export function SideNav({
  onOpenGallery,
  onOpenShop,
  className = "",
}: SideNavProps) {
  return (
    <aside
      className={[
        "w-20 flex-none flex-col items-center gap-4 border-r border-white/70 bg-white/70 px-3 py-5 backdrop-blur",
        className,
      ].join(" ")}
    >
      <button
        aria-label={"\u6253\u5f00\u65f6\u5149\u753b\u518c"}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-100"
        onClick={onOpenGallery}
        title={"\u65f6\u5149\u753b\u518c"}
        type="button"
      >
        <BookOpen className="h-5 w-5" />
      </button>

      <button
        aria-label={"\u6253\u5f00\u5546\u5e97"}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700 focus:outline-none focus:ring-4 focus:ring-amber-100"
        onClick={onOpenShop}
        title={"\u5546\u5e97"}
        type="button"
      >
        <ShoppingBag className="h-5 w-5" />
      </button>
    </aside>
  );
}
