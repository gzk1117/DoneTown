import { CalendarDays, ScrollText, Trash2 } from "lucide-react";
import { useDoneTownStore } from "../store/useDoneTownStore";
import type { EchoRecord } from "../store/useDoneTownStore";
import { getCategoryMeta } from "./taskMeta";

const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

interface EchoGalleryProps {
  className?: string;
}

export function EchoGallery({ className = "" }: EchoGalleryProps) {
  const records = useDoneTownStore((state) => state.records);
  const deleteRecord = useDoneTownStore((state) => state.deleteRecord);
  const sortedRecords = [...records].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <section
      className={[
        "dt-story-card p-4",
        className,
      ].join(" ")}
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-base font-black text-[var(--dt-ink)]">
            {"\u65f6\u5149\u753b\u518c"}
          </p>
          <p className="mt-1 text-xs font-bold text-[var(--dt-muted)]">
            {"\u4fdd\u5b58\u6bcf\u4e00\u6b21\u56de\u54cd\u6253\u5361\u7684\u5fc3\u60c5\u7247\u6bb5"}
          </p>
        </div>
        <div className="dt-sticker inline-flex items-center gap-1 px-2 py-1 text-xs font-black text-[var(--dt-muted)]">
          <ScrollText className="h-3.5 w-3.5" />
          {records.length}
        </div>
      </div>

      {sortedRecords.length === 0 ? (
        <div className="flex min-h-32 flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-[rgba(128,83,42,0.2)] bg-[#fff8e7]/75 px-6 text-center">
          <ScrollText className="mb-2 h-7 w-7 text-[#c97832]" />
          <p className="text-sm font-black text-[var(--dt-ink)]">
            {"\u8fd8\u6ca1\u6709\u624b\u8d26\u8bb0\u5f55"}
          </p>
          <p className="mt-1 text-xs font-bold text-[var(--dt-muted)]">
            {"\u5b8c\u6210\u4efb\u52a1\u65f6\u9009\u62e9\u6df1\u5ea6\u8bb0\u5f55\uff0c\u8fd9\u91cc\u4f1a\u6162\u6162\u4eae\u8d77\u6765\u3002"}
          </p>
        </div>
      ) : (
        <div className="relative pl-5">
          <div className="absolute bottom-2 left-2 top-2 w-1 rounded-full bg-[#ffd56b]/65" />
          <div className="space-y-4">
            {sortedRecords.map((record) => (
              <TimelineRecord
                key={record.id}
                onDelete={() => deleteRecord(record.id)}
                record={record}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

interface TimelineRecordProps {
  record: EchoRecord;
  onDelete: () => void;
}

function TimelineRecord({ record, onDelete }: TimelineRecordProps) {
  const category = getCategoryMeta(record.category);
  const CategoryIcon = category.icon;

  return (
    <article className="relative">
      <div className="absolute -left-[1.15rem] top-4 h-4 w-4 rounded-full border-2 border-white bg-[#ff8a65] shadow-sm" />
      <div className="dt-story-card bg-[#fff8e7]/80 p-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={[
                "dt-sticker inline-flex items-center gap-1.5 px-2 py-1 text-xs font-extrabold ring-1 ring-inset",
                category.badgeClassName,
              ].join(" ")}
            >
              <CategoryIcon className="h-3.5 w-3.5" />
              {category.label}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-[var(--dt-muted)]">
              <CalendarDays className="h-3.5 w-3.5" />
              {dateFormatter.format(record.timestamp)}
            </span>
          </div>

          <button
            aria-label={"\u5220\u9664\u8fd9\u6761\u6253\u5361\u8bb0\u5f55"}
            className="dt-icon-button dt-focus flex h-10 w-10 shrink-0 items-center justify-center text-[#9d5064]"
            onClick={onDelete}
            title={"\u5220\u9664\u8bb0\u5f55"}
            type="button"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <h3 className="break-words text-sm font-black text-[var(--dt-ink)]">
          {record.taskTitle}
        </h3>
        <p className="mt-2 whitespace-pre-wrap break-words text-sm font-semibold leading-6 text-[var(--dt-muted)]">
          {record.content}
        </p>
      </div>
    </article>
  );
}
