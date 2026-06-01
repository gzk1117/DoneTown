import { BookOpen, ShoppingBag } from "lucide-react";
import type { ReactNode } from "react";
import { useDoneTownStore } from "../store/useDoneTownStore";
import { ResourceIcon } from "./StoryIllustrations";

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
    <header className="z-20 flex h-[4.75rem] flex-none items-center justify-center gap-2 border-b-2 border-white/60 bg-[rgba(255,247,232,0.78)] px-2 shadow-[0_10px_28px_rgba(111,70,33,0.08)] backdrop-blur sm:px-4">
      <TopIconButton
        ariaLabel={"\u6253\u5f00\u65f6\u5149\u753b\u518c"}
        icon={<BookOpen className="h-4.5 w-4.5" />}
        onClick={onOpenGallery}
        title={"\u65f6\u5149\u753b\u518c"}
      />

      <div className="scrollbar-none flex min-w-0 max-w-[calc(100vw-6rem)] items-center gap-2 overflow-x-auto rounded-full border-2 border-[rgba(128,83,42,0.14)] bg-[rgba(255,253,247,0.92)] px-3 py-2 shadow-[0_10px_24px_rgba(111,70,33,0.1)] sm:gap-3 sm:px-4 lg:max-w-full">
        <ResourcePill
          label={"\u91d1\u5e01"}
          icon={<ResourceIcon className="h-8 w-8" type="coins" />}
          value={resources.coins}
        />
        <div className="h-8 w-px bg-[rgba(128,83,42,0.16)]" />
        <ResourcePill
          detail={`\u6728 ${resources.materials.wood} / \u77f3 ${resources.materials.stone} / \u7816 ${resources.materials.brick}`}
          label={"\u5efa\u6750"}
          icon={<ResourceIcon className="h-8 w-8" type="materials" />}
          value={totalMaterials}
        />
        <div className="h-8 w-px bg-[rgba(128,83,42,0.16)]" />
        <ResourcePill
          label={"\u8bb0\u5fc6\u788e\u7247"}
          icon={<ResourceIcon className="h-8 w-8" type="memory" />}
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
      className="dt-icon-button dt-focus flex h-11 w-11 shrink-0 items-center justify-center text-[var(--dt-muted)] lg:hidden"
      onClick={onClick}
      title={title}
      type="button"
    >
      {icon}
    </button>
  );
}

interface ResourcePillProps {
  icon: ReactNode;
  label: string;
  value: number;
  detail?: string;
}

function ResourcePill({ icon, label, value, detail }: ResourcePillProps) {
  return (
    <div
      className="flex min-w-fit items-center gap-1.5 sm:gap-2"
      title={detail ? `${label}: ${detail}` : label}
    >
      <span className="shrink-0">{icon}</span>
      <div className="leading-tight">
        <p className="text-[11px] font-bold text-[var(--dt-muted)]">{label}</p>
        <p className="text-base font-black tabular-nums text-[var(--dt-ink)]">
          {value}
        </p>
      </div>
    </div>
  );
}
