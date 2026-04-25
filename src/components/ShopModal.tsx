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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-lg border border-white/80 bg-white p-5 text-left shadow-2xl shadow-slate-900/20">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-500">
              Shop
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-950">
              {"\u5c0f\u9547\u5546\u5e97"}
            </h2>
          </div>
          <button
            aria-label={"\u5173\u95ed\u5546\u5e97"}
            className="flex h-9 w-9 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-100"
            onClick={onClose}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-3">
          <ShopItem
            cost={`${resources.memoryFragments}/1 \ud83d\udc8e`}
            description={"\u6d88\u8017 1 \u4e2a\u8bb0\u5fc6\u788e\u7247\u62bd\u53d6\u76f2\u76d2"}
            icon={<Gift className="h-5 w-5 text-violet-600" />}
            onBuy={handleBlindBox}
            title={"\u8bb0\u5fc6\u76f2\u76d2"}
          />
          <ShopItem
            cost={`${resources.coins}/60 \ud83e\ude99`}
            description={"\u6d88\u8017\u91d1\u5e01\u8d2d\u4e70\u65b0\u80cc\u666f"}
            icon={<Image className="h-5 w-5 text-emerald-600" />}
            onBuy={handleBackground}
            title={"\u5c0f\u5c9b\u80cc\u666f"}
          />
        </div>

        <div className="mt-4 flex items-center gap-4 rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Coins className="h-3.5 w-3.5 text-amber-500" />
            {resources.coins}
          </span>
          <span className="inline-flex items-center gap-1">
            <Gem className="h-3.5 w-3.5 text-violet-500" />
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
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/70 p-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white shadow-sm">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-950">{title}</p>
        <p className="mt-1 text-xs text-slate-500">{description}</p>
      </div>
      <button
        className="rounded-md bg-slate-950 px-3 py-2 text-xs font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200"
        onClick={onBuy}
        type="button"
      >
        {cost}
      </button>
    </div>
  );
}
