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
        "w-20 flex-none flex-col items-center gap-4 border-r-2 border-white/60 bg-[rgba(255,247,232,0.74)] px-3 py-5 shadow-[10px_0_30px_rgba(111,70,33,0.08)] backdrop-blur",
        className,
      ].join(" ")}
    >
      <button
        aria-label={"\u6253\u5f00\u65f6\u5149\u753b\u518c"}
        className="dt-icon-button dt-focus flex h-12 w-12 items-center justify-center text-[#4f9b62]"
        onClick={onOpenGallery}
        title={"\u65f6\u5149\u753b\u518c"}
        type="button"
      >
        <BookOpen className="h-5 w-5" />
      </button>

      <button
        aria-label={"\u6253\u5f00\u5546\u5e97"}
        className="dt-icon-button dt-focus flex h-12 w-12 items-center justify-center text-[#df7a32]"
        onClick={onOpenShop}
        title={"\u5546\u5e97"}
        type="button"
      >
        <ShoppingBag className="h-5 w-5" />
      </button>
    </aside>
  );
}
