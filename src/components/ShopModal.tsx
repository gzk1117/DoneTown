import { Coins, Gem, Gift, Image, X } from "lucide-react";
import type { ReactNode } from "react";
import { useDoneTownStore } from "../store/useDoneTownStore";

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotify: (message: string) => void;
}

export function ShopModal({ isOpen, onClose, onNotify }: ShopModalProps) {
  const resources = useDoneTownStore((state) => state.resources);
  const spendCoins = useDoneTownStore((state) => state.spendCoins);
  const spendMemoryFragments = useDoneTownStore(
    (state) => state.spendMemoryFragments,
  );

  if (!isOpen) {
    return null;
  }

  const handleBlindBox = () => {
    if (!spendMemoryFragments(1)) {
      onNotify("\u8bb0\u5fc6\u788e\u7247\u4e0d\u8db3");
      return;
    }

    onNotify("\u76f2\u76d2\u62bd\u53d6\u6210\u529f\uff0c\u5360\u4f4d\u5956\u52b1\u5df2\u89e3\u9501");
  };

  const handleBackground = () => {
    if (!spendCoins(60)) {
      onNotify("\u91d1\u5e01\u4e0d\u8db3");
      return;
    }

    onNotify("\u65b0\u80cc\u666f\u8d2d\u4e70\u6210\u529f\uff0c\u7d20\u6750\u5360\u4f4d\u4e2d");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(86,58,37,0.28)] px-4 py-6 backdrop-blur-sm">
      <div className="dt-page-sheet dt-paper-panel dt-drawn-border w-full max-w-lg p-5 text-left">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#df7a32]">
              Shop
            </p>
            <h2 className="mt-1 text-2xl font-black text-[var(--dt-ink)]">
              {"\u5c0f\u9547\u5546\u5e97"}
            </h2>
          </div>
          <button
            aria-label={"\u5173\u95ed\u5546\u5e97"}
            className="dt-icon-button dt-focus flex h-11 w-11 items-center justify-center text-[var(--dt-muted)]"
            onClick={onClose}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-3">
          <ShopItem
            cost={`${resources.memoryFragments}/1 ${"\u788e\u7247"}`}
            description={"\u6d88\u8017 1 \u4e2a\u8bb0\u5fc6\u788e\u7247\u62bd\u53d6\u76f2\u76d2"}
            icon={<Gift className="h-5 w-5 text-violet-600" />}
            onBuy={handleBlindBox}
            title={"\u8bb0\u5fc6\u76f2\u76d2"}
          />
          <ShopItem
            cost={`${resources.coins}/60 ${"\u91d1\u5e01"}`}
            description={"\u6d88\u8017\u91d1\u5e01\u8d2d\u4e70\u65b0\u80cc\u666f"}
            icon={<Image className="h-5 w-5 text-emerald-600" />}
            onBuy={handleBackground}
            title={"\u5c0f\u5c9b\u80cc\u666f"}
          />
        </div>

        <div className="mt-4 flex items-center gap-4 rounded-full border-2 border-[rgba(128,83,42,0.12)] bg-[#fff8e7]/75 px-3 py-2 text-xs font-bold text-[var(--dt-muted)]">
          <span className="inline-flex items-center gap-1.5">
            <Coins className="h-3.5 w-3.5 text-[#c97832]" />
            {resources.coins}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Gem className="h-3.5 w-3.5 text-[#7b62b8]" />
            {resources.memoryFragments}
          </span>
        </div>
      </div>
    </div>
  );
}

interface ShopItemProps {
  icon: ReactNode;
  title: string;
  description: string;
  cost: string;
  onBuy: () => void;
}

function ShopItem({ icon, title, description, cost, onBuy }: ShopItemProps) {
  return (
    <div className="dt-story-card flex items-center gap-3 p-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-white/70 bg-[#fff8e7] shadow-[0_8px_16px_rgba(111,70,33,0.08)]">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-black text-[var(--dt-ink)]">{title}</p>
        <p className="mt-1 text-xs font-bold text-[var(--dt-muted)]">
          {description}
        </p>
      </div>
      <button
        className="dt-primary-button dt-focus min-h-10 px-3 py-2 text-xs"
        onClick={onBuy}
        type="button"
      >
        {cost}
      </button>
    </div>
  );
}
