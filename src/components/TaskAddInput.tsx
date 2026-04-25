import { type FormEvent, type ReactNode, useMemo, useState } from "react";
import { Plus, Split, Trash2 } from "lucide-react";
import { useDoneTownStore } from "../store/useDoneTownStore";
import type {
  TaskCategory,
  TaskDifficulty,
  TaskKind,
} from "../store/useDoneTownStore";
import { categoryOptions, difficultyOptions, taskKindOptions } from "./taskMeta";

interface DraftSubTask {
  id: string;
  title: string;
  weight: number;
}

const createDraftSubTask = (): DraftSubTask => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  title: "",
  weight: 25,
});

const toTimestamp = (value: string) => {
  if (!value) {
    return undefined;
  }

  const timestamp = new Date(value).getTime();

  return Number.isNaN(timestamp) ? undefined : timestamp;
};

export function TaskAddInput() {
  const addTask = useDoneTownStore((state) => state.addTask);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<TaskCategory>("Study");
  const [difficulty, setDifficulty] = useState<TaskDifficulty>("Medium");
  const [kind, setKind] = useState<TaskKind>("ShortTarget");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [deadlineAt, setDeadlineAt] = useState("");
  const [countGoal, setCountGoal] = useState(100);
  const [useSubTasks, setUseSubTasks] = useState(false);
  const [subTasks, setSubTasks] = useState<DraftSubTask[]>([
    createDraftSubTask(),
  ]);

  const allowSubTasks = kind !== "Count";
  const subTaskWeightTotal = useMemo(
    () => subTasks.reduce((sum, subTask) => sum + Number(subTask.weight || 0), 0),
    [subTasks],
  );

  const resetForm = () => {
    setTitle("");
    setStartAt("");
    setEndAt("");
    setDeadlineAt("");
    setCountGoal(100);
    setUseSubTasks(false);
    setSubTasks([createDraftSubTask()]);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    addTask({
      title: trimmedTitle,
      category,
      difficulty,
      kind,
      startAt: toTimestamp(startAt),
      endAt: toTimestamp(endAt),
      deadlineAt: toTimestamp(deadlineAt),
      countGoal,
      subTasks:
        allowSubTasks && useSubTasks
          ? subTasks
              .filter((subTask) => subTask.title.trim())
              .map((subTask) => ({
                title: subTask.title.trim(),
                weight: subTask.weight,
              }))
          : [],
    });
    resetForm();
  };

  const updateSubTask = (
    subTaskId: string,
    patch: Partial<Pick<DraftSubTask, "title" | "weight">>,
  ) => {
    setSubTasks((currentSubTasks) =>
      currentSubTasks.map((subTask) =>
        subTask.id === subTaskId ? { ...subTask, ...patch } : subTask,
      ),
    );
  };

  const removeSubTask = (subTaskId: string) => {
    setSubTasks((currentSubTasks) =>
      currentSubTasks.length > 1
        ? currentSubTasks.filter((subTask) => subTask.id !== subTaskId)
        : currentSubTasks,
    );
  };

  return (
    <form
      className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-3">
        <label className="sr-only" htmlFor="task-title">
          {"\u4efb\u52a1\u6807\u9898"}
        </label>
        <input
          id="task-title"
          className="min-h-11 rounded-md border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
          maxLength={50}
          onChange={(event) => setTitle(event.target.value)}
          placeholder={"\u6dfb\u52a0\u4e00\u4e2a\u4efb\u52a1\uff0c\u6700\u591a 50 \u5b57"}
          type="text"
          value={title}
        />

        <div className="grid grid-cols-2 gap-3">
          <SelectField
            id="task-category"
            label={"\u4efb\u52a1\u5206\u7c7b"}
            onChange={(value) => setCategory(value as TaskCategory)}
            value={category}
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectField>

          <SelectField
            id="task-difficulty"
            label={"\u4efb\u52a1\u96be\u5ea6"}
            onChange={(value) => setDifficulty(value as TaskDifficulty)}
            value={difficulty}
          >
            {difficultyOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectField>
        </div>

        <SelectField
          id="task-kind"
          label={"\u4efb\u52a1\u7c7b\u578b"}
          onChange={(value) => {
            const nextKind = value as TaskKind;
            setKind(nextKind);

            if (nextKind === "Count") {
              setUseSubTasks(false);
            }
          }}
          value={kind}
        >
          {taskKindOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </SelectField>

        {kind === "ShortTimed" && (
          <div className="grid grid-cols-2 gap-3">
            <DateTimeInput
              id="task-start-at"
              label={"\u5f00\u59cb\u65f6\u95f4"}
              onChange={setStartAt}
              value={startAt}
            />
            <DateTimeInput
              id="task-end-at"
              label={"\u7ed3\u675f\u65f6\u95f4"}
              onChange={setEndAt}
              value={endAt}
            />
          </div>
        )}

        {kind === "LongTerm" && (
          <DateTimeInput
            id="task-deadline-at"
            label={"\u622a\u6b62\u65f6\u95f4"}
            onChange={setDeadlineAt}
            value={deadlineAt}
          />
        )}

        {kind === "Count" && (
          <label className="grid gap-1 text-xs font-medium text-slate-500">
            {"\u603b\u6570\u91cf"}
            <input
              className="min-h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              min={1}
              onChange={(event) =>
                setCountGoal(Math.max(1, Number(event.target.value) || 1))
              }
              type="number"
              value={countGoal}
            />
          </label>
        )}

        {allowSubTasks && (
          <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
            <label className="flex items-center justify-between gap-3 text-sm font-medium text-slate-700">
              <span className="inline-flex items-center gap-2">
                <Split className="h-4 w-4 text-sky-500" />
                {"\u62c6\u89e3\u4e3a\u5b50\u4efb\u52a1"}
              </span>
              <input
                checked={useSubTasks}
                className="h-4 w-4 rounded border-slate-300 text-slate-950"
                onChange={(event) => setUseSubTasks(event.target.checked)}
                type="checkbox"
              />
            </label>

            {useSubTasks && (
              <div className="mt-3 space-y-2">
                {subTasks.map((subTask) => (
                  <div
                    className="grid grid-cols-[1fr_4.5rem_2rem] gap-2"
                    key={subTask.id}
                  >
                    <input
                      className="min-h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                      onChange={(event) =>
                        updateSubTask(subTask.id, { title: event.target.value })
                      }
                      placeholder={"\u5b50\u4efb\u52a1"}
                      value={subTask.title}
                    />
                    <input
                      aria-label={"\u5b50\u4efb\u52a1\u5360\u6bd4"}
                      className="min-h-9 rounded-md border border-slate-200 bg-white px-2 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                      max={100}
                      min={0}
                      onChange={(event) =>
                        updateSubTask(subTask.id, {
                          weight: Math.max(0, Number(event.target.value) || 0),
                        })
                      }
                      type="number"
                      value={subTask.weight}
                    />
                    <button
                      aria-label={"\u5220\u9664\u5b50\u4efb\u52a1"}
                      className="flex h-9 w-9 items-center justify-center rounded-md text-slate-400 transition hover:bg-rose-50 hover:text-rose-500"
                      onClick={() => removeSubTask(subTask.id)}
                      type="button"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
                  <span>
                    {"\u5f53\u524d\u5360\u6bd4\u5408\u8ba1"} {subTaskWeightTotal}%
                  </span>
                  <button
                    className="font-medium text-slate-600 hover:text-slate-950"
                    onClick={() =>
                      setSubTasks((currentSubTasks) => [
                        ...currentSubTasks,
                        createDraftSubTask(),
                      ])
                    }
                    type="button"
                  >
                    + {"\u6dfb\u52a0\u5b50\u4efb\u52a1"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <button
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-300"
          disabled={!title.trim()}
          type="submit"
        >
          <Plus className="h-4 w-4" />
          {"\u6dfb\u52a0"}
        </button>
      </div>
    </form>
  );
}

interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}

function SelectField({
  id,
  label,
  value,
  onChange,
  children,
}: SelectFieldProps) {
  return (
    <label className="grid gap-1 text-xs font-medium text-slate-500" htmlFor={id}>
      {label}
      <select
        className="min-h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
        id={id}
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {children}
      </select>
    </label>
  );
}

interface DateTimeInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function DateTimeInput({ id, label, value, onChange }: DateTimeInputProps) {
  return (
    <label className="grid gap-1 text-xs font-medium text-slate-500" htmlFor={id}>
      {label}
      <input
        className="min-h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
        id={id}
        onChange={(event) => onChange(event.target.value)}
        type="datetime-local"
        value={value}
      />
    </label>
  );
}
