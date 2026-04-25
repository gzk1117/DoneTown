import { BookOpen, ShoppingBag } from "lucide-react";
import type { ReactNode } from "react";
import { useDoneTownStore } from "../store/useDoneTownStore";

interface TopBarProps {
  onOpenGallery: () => void;
  onOpenShop: () => void;
}

export function TopBar({ onOpenGallery, onOpenShop }: TopBarProps) {
  const resources = useDoneTownStore((state) => state.resources);
  const totalMaterials =
    resources.materials.wood +
    resources.materials.stone +
    resources.materials.brick;

  return (
    <header className="z-20 flex h-16 flex-none items-center justify-center gap-2 border-b border-white/70 bg-white/80 px-2 shadow-sm backdrop-blur sm:px-4">
      <TopIconButton
        ariaLabel={"\u6253\u5f00\u65f6\u5149\u753b\u518c"}
        icon={<BookOpen className="h-4.5 w-4.5" />}
        onClick={onOpenGallery}
        title={"\u65f6\u5149\u753b\u518c"}
      />

      <div className="scrollbar-none flex min-w-0 max-w-[calc(100vw-6rem)] items-center gap-2 overflow-x-auto rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm sm:gap-3 sm:px-4 lg:max-w-full">
        <ResourcePill
          label={"\u91d1\u5e01"}
          symbol={"\ud83e\ude99"}
          value={resources.coins}
        />
        <div className="h-5 w-px bg-slate-200" />
        <ResourcePill
          detail={`\u6728 ${resources.materials.wood} / \u77f3 ${resources.materials.stone} / \u7816 ${resources.materials.brick}`}
          label={"\u5efa\u6750"}
          symbol={"\ud83e\udeb5"}
          value={totalMaterials}
        />
        <div className="h-5 w-px bg-slate-200" />
        <ResourcePill
          label={"\u8bb0\u5fc6\u788e\u7247"}
          symbol={"\ud83d\udc8e"}
          value={resources.memoryFragments}
        />
      </div>

      <TopIconButton
        ariaLabel={"\u6253\u5f00\u5546\u5e97"}
        icon={<ShoppingBag className="h-4.5 w-4.5" />}
        onClick={onOpenShop}
        title={"\u5546\u5e97"}
      />
    </header>
  );
}

interface TopIconButtonProps {
  ariaLabel: string;
  title: string;
  icon: ReactNode;
  onClick: () => void;
}

function TopIconButton({
  ariaLabel,
  title,
  icon,
  onClick,
}: TopIconButtonProps) {
  return (
    <button
      aria-label={ariaLabel}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100 lg:hidden"
      onClick={onClick}
      title={title}
      type="button"
    >
      {icon}
    </button>
  );
}

interface ResourcePillProps {
  symbol: string;
  label: string;
  value: number;
  detail?: string;
}

function ResourcePill({ symbol, label, value, detail }: ResourcePillProps) {
  return (
    <div
      className="flex min-w-fit items-center gap-1.5 sm:gap-2"
      title={detail ? `${label}: ${detail}` : label}
    >
      <span className="text-lg leading-none">{symbol}</span>
      <div className="leading-tight">
        <p className="text-[11px] font-medium text-slate-400">{label}</p>
        <p className="text-sm font-semibold text-slate-950">{value}</p>
      </div>
    </div>
  );
}
